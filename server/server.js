const express = require("express");
const app = express();
const cors = require("cors");


app.use(cors({ origin: ['http://localhost:3000', 'https://system-app-de6q.vercel.app'] }));
app.use(express.json());
let bookings = []; 

const allTimeSlots = [
     "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM", "05:00 PM", 
    "06:00 PM", "07:00 PM","08:00 PM" ,"09:00 PM","10:00 PM","11:00 PM","12:00 PM"
  ];

// API to create a booking
app.post('/api/book', (req, res) => {
    const { name, contact, date, time, guests } = req.body;

    if (!name || !contact || !date || !time || !guests) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
      if (isNaN(guests) || guests <= 0) {
        return res.status(400).json({ success: false, message: "Guests must be a positive number." });
      }

    const booking = {
      name,
      contact,
      date,
      time,
      guests
    };
  
    // Check if the booking time slot is already taken
    const isSlotTaken = bookings.some(b => 
      b.date === date && b.time.toLowerCase() === time.toLowerCase()
  );
    if (isSlotTaken) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked. Please choose another.' });
    }
  
    bookings.push(booking);
    res.status(200).json({ success:true, message: 'Booking successful!', booking });
    console.log(bookings)
  });



  // API to get all bookings
  app.get('/api/bookings', (req, res) => {
    res.json(bookings);
  });
  

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Listen on a dynamic port for Vercel
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});