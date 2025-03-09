// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Showtime = require("./models/showtime");
const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const expressIp = require("express-ip");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://imaxbooking.netlify.app",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(helmet());
app.use(expressIp().getIpInfoMiddleware);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only images, PDFs, and Word docs allowed"));
  },
});

// Track online users with status
const users = new Map(); // { userId: { socketId, name, status, lastSeen } }

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.userId);

  socket.on("join", (userId) => {
    users.set(userId, {
      socketId: socket.id,
      name: socket.user.name,
      status: "online",
      lastSeen: null,
    });
    socket.join("globalChat");
    io.emit("onlineUsers", Array.from(users.values()));
  });

  socket.on("joinDirect", ({ userId, targetUserId }) => {
    const room = `room_${Math.min(userId, targetUserId)}_${Math.max(userId, targetUserId)}`;
    socket.join(room);
  });

  socket.on("joinGlobal", (userId) => {
    socket.join("globalChat");
  });

  socket.on("sendMessage", async (data) => {
    const senderId = data.senderId || socket.user.userId;
    if (!senderId) {
      console.error("No senderId provided and no authenticated user found");
      return socket.emit("error", { message: "Sender ID is required" });
    }

    const messageData = {
      senderId,
      senderName: data.senderName || socket.user.name,
      message: data.message,
      timestamp: data.timestamp || new Date(),
      messageId: data.messageId,
      recipientId: data.recipientId || null,
      read: false,
      fileUrl: data.fileUrl || null,
      fileType: data.fileType || null,
    };

    try {
      const savedMessage = new Message(messageData);
      await savedMessage.save();
      if (data.recipientId) {
        const room = `room_${Math.min(senderId, data.recipientId)}_${Math.max(senderId, data.recipientId)}`;
        io.to(room).emit("receiveMessage", messageData);
      } else {
        io.to("globalChat").emit("receiveMessage", messageData);
      }
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("typing", ({ userId, isTyping }) => {
    io.emit("userTyping", { userId, isTyping });
  });

  socket.on("markAsRead", async ({ messageId, recipientId }) => {
    try {
      await Message.updateOne({ messageId }, { read: true });
      const senderSocketId = users.get(recipientId)?.socketId;
      if (senderSocketId) io.to(senderSocketId).emit("messageRead", { messageId });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  });

  socket.on("editMessage", async ({ messageId, newMessage }) => {
    try {
      await Message.updateOne({ messageId }, { message: newMessage, edited: true });
      const msg = await Message.findOne({ messageId });
      if (msg.recipientId) {
        const room = `room_${Math.min(msg.senderId, msg.recipientId)}_${Math.max(msg.senderId, msg.recipientId)}`;
        io.to(room).emit("messageEdited", { messageId, newMessage });
      } else {
        io.to("globalChat").emit("messageEdited", { messageId, newMessage });
      }
    } catch (err) {
      console.error("Error editing message:", err);
    }
  });

  socket.on("deleteMessage", async ({ messageId }) => {
    try {
      const msg = await Message.findOne({ messageId });
      await Message.deleteOne({ messageId });
      if (msg.recipientId) {
        const room = `room_${Math.min(msg.senderId, msg.recipientId)}_${Math.max(msg.senderId, msg.recipientId)}`;
        io.to(room).emit("messageDeleted", { messageId });
      } else {
        io.to("globalChat").emit("messageDeleted", { messageId });
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  });

  socket.on("leave", (userId) => {
    if (users.has(userId)) {
      users.set(userId, { ...users.get(userId), status: "offline", lastSeen: new Date() });
      io.emit("onlineUsers", Array.from(users.values()));
    }
  });

  socket.on("disconnect", () => {
    if (users.has(socket.user.userId)) {
      users.set(socket.user.userId, {
        ...users.get(socket.user.userId),
        status: "offline",
        lastSeen: new Date(),
      });
      io.emit("onlineUsers", Array.from(users.values()));
    }
    console.log("User disconnected:", socket.user.userId);
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movieDB";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use(authRoutes);
app.use("/api", showtimeRoutes);
app.use("/api", bookingRoutes);

app.post("/upload", upload.single("file"), async (req, res) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }
  try {
    jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const fileUrl = `https://imax-movie-reservation.onrender.com/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl });
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
});

app.get("/showtimes", async (req, res) => {
  try {
    const showtimes = await Showtime.find();
    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching showtimes", error: err.message });
  }
});

app.get("/chat/history", async (req, res) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  let userId;
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    userId = verified.userId;
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
  try {
    const messages = await Message.find({
      $or: [{ recipientId: null }, { senderId: userId }, { recipientId: userId }],
    })
      .sort({ timestamp: -1 })
      .limit(50);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat history", error: err.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
