const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  nickname: { type: String, default: "" },
  age: { type: Number, default: null },
  profileImage: { type: String, default: "" },
  balance: { type: Number, default: 0 },
  pin: { type: String, required: true },
  resetPasswordToken: { type: String }, // Add reset token field
  resetPasswordExpires: { type: Date }, // Add expiration field
});

module.exports = mongoose.model("User", UserSchema);
