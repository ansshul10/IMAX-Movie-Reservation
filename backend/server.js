const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const Showtime = require("./models/showtime");
const authRoutes = require("./routes/authRoutes"); // Import authRoutes
const bookingRoutes = require("./routes/bookingRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const expressIp = require("express-ip");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Rate Limiting and Security
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: "Too many requests, please try again later",
  })
);

app.use(helmet()); // Set security-related headers
app.use(expressIp().getIpInfoMiddleware);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movieDB";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use(authRoutes); // Mount authRoutes at root level for /signup, /signin, /forgot-password, etc.
app.use("/api", showtimeRoutes); // Prefix showtime routes with /api
app.use("/api", bookingRoutes); // Prefix booking routes with /api


// Route to get showtimes (consider moving to showtimeRoutes)
app.get("/showtimes", async (req, res) => {
  try {
    const showtimes = await Showtime.find();
    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching showtimes", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
