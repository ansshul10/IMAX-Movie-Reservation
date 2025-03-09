// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const { transporter } = require("../emailService"); // Update import
const QRCode = require("qrcode");

router.post("/book-ticket", async (req, res) => {
  try {
    const { user, name, email, age, seatType, numSeats, showtime, price, seats, movieTitle } = req.body;

    console.log("Received booking request:", req.body);

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

    userData.balance -= price;
    await userData.save();
    console.log("Updated user balance:", userData.balance);

    const newBooking = new Booking({ user, name, email, age, seatType, numSeats, showtime, price });
    await newBooking.save();
    console.log("Booking saved:", newBooking);

    const qrData = JSON.stringify({
      bookingId: newBooking._id,
      movieTitle: movieTitle || "N/A",
      showtime,
      seats: seats ? seats.join(", ") : `${numSeats} seats`,
      price: `₹${price}`,
    });
    const qrCodeImage = await QRCode.toDataURL(qrData);
    console.log("QR code generated successfully");

    const mailOptions = {
      from: `"IMAX Elite Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎬 Your Exclusive IMAX Ticket - Experience Awaits!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #1a1a1a; color: #ffffff; }
            .container { max-width: 600px; margin: 20px auto; background: linear-gradient(135deg, #2b2b2b, #1a1a1a); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
            .header { background: linear-gradient(90deg, #ff6f00, #ff8f00); padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; color: #ffffff; text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); }
            .content { padding: 30px; }
            .ticket { background: #333333; padding: 20px; border-radius: 10px; margin-top: 20px; }
            .ticket h2 { color: #ff8f00; font-size: 22px; margin: 0 0 15px; }
            .ticket p { margin: 10px 0; font-size: 16px; line-height: 1.5; }
            .qr-code { text-align: center; margin: 20px 0; }
            .qr-code img { max-width: 200px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
            .footer { text-align: center; padding: 20px; background: #222222; font-size: 14px; color: #aaaaaa; }
            .button { display: inline-block; padding: 12px 25px; background: linear-gradient(90deg, #ff6f00, #ff8f00); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; box-shadow: 0 5px 15px rgba(255, 111, 0, 0.4); }
            .button:hover { background: linear-gradient(90deg, #ff8f00, #ffa500); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>IMAX Elite Booking</h1>
            </div>
            <div class="content">
              <h2 style="color: #ff8f00;">Dear ${name},</h2>
              <p>Welcome to an unparalleled cinematic experience! Your ticket is confirmed, and we’re thrilled to have you join us.</p>
              <div class="ticket">
                <h2>Your Ticket Details</h2>
                <p><strong>Movie:</strong> ${movieTitle || "N/A"}</p>
                <p><strong>Showtime:</strong> ${showtime}</p>
                <p><strong>Seat Type:</strong> ${seatType}</p>
                <p><strong>Seats:</strong> ${seats ? seats.join(", ") : numSeats + " seats"}</p>
                <p><strong>Total Price:</strong> ₹${price}</p>
                <p><strong>Booking ID:</strong> ${newBooking._id}</p>
              </div>
              <div class="qr-code">
                <img src="${qrCodeImage}" alt="QR Code for Your Ticket" />
                <p>Scan this QR code at the theater for a seamless entry!</p>
              </div>
              <a href="https://imaxbooking.netlify.app/confirmation" class="button">View Confirmation</a>
            </div>
            <div class="footer">
              <p>Thank you for choosing IMAX Elite Booking | Crafted by a $500,000 Developer Team</p>
              <p>© 2025 IMAX Booking. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Premium ticket email sent successfully to:", email);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Proceed even if email fails—don’t block booking
    }

    res.status(201).json({
      message: "Booking successful! Premium ticket sent to your email.",
      balance: userData.balance,
      bookingId: newBooking._id,
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    res.status(500).json({ message: "Error processing booking", error: error.message });
  }
});

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

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
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
