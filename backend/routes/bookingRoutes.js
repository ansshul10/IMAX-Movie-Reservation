const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");

router.post("/book-ticket", async (req, res) => {
  try {
    const { user, name, email, age, seatType, numSeats, showtime, price } = req.body;

    console.log("Received booking request:", req.body); // ✅ Debugging Log

    if (!user || !name || !email || !age || !seatType || !numSeats || !showtime || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const userData = await User.findById(user);
    if (!userData) {
      console.log("User not found:", user);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", userData);

    if (userData.balance < price) {
      return res.status(400).json({ message: "Insufficient balance! Please add more funds." });
    }

    // 🟢 Deduct balance
    userData.balance -= price;
    await userData.save();
    console.log("Updated user balance:", userData.balance);

    // Save the booking
    const newBooking = new Booking({ user, name, email, age, seatType, numSeats, showtime, price });
    await newBooking.save();
    console.log("Booking saved:", newBooking);

    // ✅ Return bookingId in the response
    res.status(201).json({
      message: "Booking successful!",
      balance: userData.balance,
      bookingId: newBooking._id, // ✅ Send the booking ID back
    });

  } catch (error) {
    console.error("Error processing booking:", error);
    res.status(500).json({ message: "Error processing booking", error: error.message });
  }
});


// 🟢 Get Booking Details by ID (For Confirmation Page)
router.get("/get-booking/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking details" });
  }
});

// 🟢 Get Booking History for a Specific User
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find bookings by user ID
    const bookings = await Booking.find({ user: userId });

    if (!bookings.length) {
      return res.status(404).json({ message: "No booking history found." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
