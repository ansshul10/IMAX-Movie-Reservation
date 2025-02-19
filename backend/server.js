const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const Showtime = require("./models/showtime");
const User = require("./models/User");
const bookingRoutes = require("./routes/bookingRoutes");
// Import the showtime routes after app initialization
const showtimeRoutes = require("./routes/showtimeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Routes
app.use("/api", showtimeRoutes); // Prefix routes with /api


// Rate Limiting and Security
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later"
}));

app.use(helmet()); // Set security-related headers

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movieDB";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Multer setup for image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpg, .jpeg, or .png files are allowed"));
    }
  }
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
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// 🟢 **User Authentication Routes**

app.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, password, balance, pin } = req.body; // Include pin in signup
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation for required fields
    if (!name || !email || !password || !pin) { // Pin must be provided
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10); // Hash pin for security
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      pin: hashedPin, // Save hashed pin
      profileImage,
      balance: balance || 0, // Include balance, default to 0 if not provided
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);  // Log the error
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
});



// Signin Route
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found, please register" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Signin successful",
      token,
      user: { name: user.name, email: user.email, profileImage: user.profileImage }
    });
  } catch (error) {
    res.status(500).json({ message: "Error during signin", error: error.message });
  }
});

// Route to get showtimes
app.get("/showtimes", async (req, res) => {
  try {
    const showtimes = await Showtime.find();
    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching showtimes", error: err.message });
  }
});

// 🟢 **User Profile Routes**

// Get User Profile
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

// Update User Profile
app.put("/profile", verifyToken, upload.single("profileImage"), async (req, res) => {
  try {
    const { nickname, age } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old profile image if updating
    if (req.file && user.profileImage) {
      const oldImagePath = path.join(__dirname, "uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    // Update user info
    user.nickname = nickname || user.nickname;
    user.age = age || user.age;
    user.profileImage = req.file ? `/uploads/${req.file.filename}` : user.profileImage;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

// Change Password
app.put("/profile/password", verifyToken, async (req, res) => {
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
app.delete("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, "uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting account", error: err.message });
  }
});

// Add funds to user balance
app.put("/profile/balance", verifyToken, async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amount; // Add the amount to the balance
    await user.save();

    res.json({ message: `Balance updated by ${amount}`, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Error updating balance", error: err.message });
  }
});

// Check Balance with PIN
app.post("/profile/balance", verifyToken, async (req, res) => {
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

app.use("/api", bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
