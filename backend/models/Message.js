// backend/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  messageId: { type: String, required: true },
  recipientId: { type: String, default: null },
  read: { type: Boolean, default: false },
  fileUrl: { type: String, default: null },
  fileType: { type: String, default: null },
  edited: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", MessageSchema);
