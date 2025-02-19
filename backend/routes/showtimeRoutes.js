const express = require("express");
const router = express.Router();
const Showtime = require("../models/showtime");

// GET all showtimes
router.get("/showtimes", async (req, res) => {
  try {
    const showtimes = await Showtime.find();
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a new showtime
router.post("/add-showtime", async (req, res) => {
  const { movieTitle, poster, description, price, date, time, theater } = req.body;

  const newShowtime = new Showtime({
    movieTitle,
    poster,
    description,
    price,
    date,
    time,
    theater,
  });

  try {
    const showtime = await newShowtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a showtime by ID
router.delete("/delete-showtime/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.json({ message: "Showtime deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
