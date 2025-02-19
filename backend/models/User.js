const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  nickname: { type: String, default: "" },  // Nickname field
  age: { type: Number, default: null },     // Age field
  profileImage: { type: String, default: "" }, // Profile Image URL
  balance: { type: Number, default: 0 },    // Balance field (default to 0)
  pin: { type: String, required: true }     // Pin field (hashed for security)
});

module.exports = mongoose.model("User", UserSchema);
