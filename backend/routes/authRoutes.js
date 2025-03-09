// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpg, .jpeg, or .png files are allowed"));
    }
  },
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.userId) {
      return res.status(400).json({ message: "Invalid token: userId missing" });
    }
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Signup Route
router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, password, balance, pin } = req.body;
    const profileImage = req.file
      ? `https://imax-movie-reservation.onrender.com/uploads/${req.file.filename}`
      : null;

    if (!name || !email || !password || !pin) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      pin: hashedPin,
      profileImage,
      balance: balance || 0,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, name: newUser.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found, please register" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during signin", error: error.message });
  }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `https://imaxbooking.netlify.app/reset-password/${token}`;
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" });
    const ipAddress = req.ip || "Unknown";

    const mailOptions = {
      from: `"IMAX Booking Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🔑 Your Password Reset Request - IMAX Booking",
      text: `Hi ${user.name},\n\nYou requested a password reset on ${timestamp}. Click this link to reset your password: ${resetLink}\n\nThis link expires in 1 hour. If you didn’t request this, please ignore this email or contact support.\n\nBest,\nIMAX Booking Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(90deg, #f97316, #ea580c);
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              color: #333333;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 12px 25px;
              background: linear-gradient(90deg, #f97316, #ea580c);
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background: linear-gradient(90deg, #ea580c, #f97316);
            }
            .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #666666;
            }
            @media (max-width: 600px) {
              .container {
                margin: 10px;
                border-radius: 8px;
              }
              .header h1 {
                font-size: 20px;
              }
              .content {
                padding: 20px;
              }
              .button {
                padding: 10px 20px;
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${user.name || "User"},</p>
              <p>We received a request to reset your password for your IMAX Booking account on <strong>${timestamp} (UTC)</strong> from IP: <strong>${ipAddress}</strong>.</p>
              <p>Click the button below to reset your password. This link is valid for <strong>1 hour</strong>.</p>
              <a href="${resetLink}" class="button">Reset Your Password</a>
              <p>If you didn’t request this, please ignore this email or contact our support team at <a href="mailto:support@imaxbooking.com">support@imaxbooking.com</a>.</p>
              <p>Happy watching!</p>
              <p>The IMAX Booking Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} IMAX Booking. All rights reserved.</p>
              <p><a href="https://imaxbooking.netlify.app" style="color: #f97316;">Visit our site</a> | <a href="mailto:support@imaxbooking.com" style="color: #f97316;">Contact Us</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset email sent successfully!" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Get User Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

// Update User Profile
router.put("/profile", verifyToken, upload.single("profileImage"), async (req, res) => {
  try {
    const { nickname, age } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file && user.profileImage) {
      const oldImagePath = path.join(__dirname, "../uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    user.nickname = nickname || user.nickname;
    user.age = age || user.age;
    user.profileImage = req.file
      ? `https://imax-movie-reservation.onrender.com/uploads/${req.file.filename}`
      : user.profileImage;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// Change Password
router.put("/profile/password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
});

// Delete User Account
router.delete("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, "../uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account", error: err.message });
  }
});

// Add funds to user balance
router.put("/profile/balance", verifyToken, async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount;
    await user.save();

    res.json({ message: `Balance updated by ${amount}`, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Error updating balance", error: err.message });
  }
});

// Check Balance with PIN
router.post("/profile/balance", verifyToken, async (req, res) => {
  const { pin } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const isPinMatch = await bcrypt.compare(pin, user.pin);
    if (!isPinMatch) return res.status(400).json({ error: "Incorrect PIN!" });

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
