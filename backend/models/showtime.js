const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  theater: { type: String, required: true },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

module.exports = Showtime;
