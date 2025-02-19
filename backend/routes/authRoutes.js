const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, pin, balance } = req.body;

  // Validate required fields
  if (!name || !email || !password || !pin) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash password and PIN
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create new user with default balance if not provided
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pin: hashedPin,
      balance: balance || 0, // Default to 0 if balance is not provided
    });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  // Compare entered password with stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage, // Add profile image URL if needed
    },
  });
});

module.exports = router;
