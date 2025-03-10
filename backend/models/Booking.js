const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },  // Separate from User profile
  age: { type: Number, required: true },
  seatType: { type: String, enum: ["Recliner", "Balcony", "Normal"], required: true },
  showtime: { type: String, required: true }, 
  numSeats: { type: Number, required: true }, 
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "cancelled"], default: "active" }, // Add this line
});
