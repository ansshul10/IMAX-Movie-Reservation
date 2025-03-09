// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCheckDouble, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const socket = io("https://imax-movie-reservation.onrender.com", {
  auth: { token: localStorage.getItem("token") },
});

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [editingMessage, setEditingMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !user.userId) {
      navigate("/signin");
      return;
    }

    socket.on("connect", () => {
      console.log("Connected to chat server with ID:", socket.id);
      socket.emit("join", user.userId);
      socket.emit("joinGlobal", user.userId); // Always join global chat
    });

    socket.on("receiveMessage", (data) => {
      if (!data.recipientId) { // Only global messages
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
        if (document.hidden && Notification.permission === "granted") {
          new Notification("New Message", { body: `${data.senderName}: ${data.message}` });
        }
      }
    });

    socket.on("userTyping", ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        isTyping ? newSet.add(userId) : newSet.delete(userId);
        return newSet;
      });
    });

    socket.on("messageRead", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.messageId === messageId ? { ...msg, read: true } : msg))
      );
    });

    socket.on("messageEdited", ({ messageId, newMessage }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.messageId === messageId ? { ...msg, message: newMessage, edited: true } : msg))
      );
    });

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      if (err.message === "Invalid token" || err.message === "Authentication required") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      }
    });

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("messageRead");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("error");
      socket.off("connect_error");
      socket.emit("leave", user.userId);
    };
  }, [navigate, user]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { userId: user.userId, isTyping: e.target.value.length > 0 });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user?.userId) {
      setError("User ID not found. Please sign in again.");
      navigate("/signin");
      return;
    }

    const messageData = {
      senderId: user.userId,
      senderName: user.name,
      message,
      timestamp: new Date(),
      messageId: Date.now().toString(),
      recipientId: null, // Global chat only
    };

    socket.emit("sendMessage", messageData);
    setMessage(""); // Clear input
    // Removed local setMessages to avoid duplication
    scrollToBottom();
  };

  const editMessage = (msg) => {
    setEditingMessage(msg);
    setMessage(msg.message);
  };

  const saveEditedMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !editingMessage) return;
    socket.emit("editMessage", { messageId: editingMessage.messageId, newMessage: message });
    setEditingMessage(null);
    setMessage("");
  };

  const deleteMessage = (messageId) => {
    socket.emit("deleteMessage", { messageId });
  };

  const handleLogout = () => {
    socket.emit("leave", user.userId);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-orange-950 flex flex-col overflow-hidden">
      <motion.div
        className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Global Chat
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl text-orange-400 border border-orange-500/20 overflow-hidden">
          {error && (
            <p className="text-red-400 text-sm mb-2">{error}</p>
          )}
          <div className="flex-1 overflow-y-auto mb-4 p-2 bg-black/30 rounded-xl border border-orange-500/40">
            {messages.length === 0 ? (
              <p className="text-orange-500/60 text-center text-sm sm:text-base py-4">No messages yet. Start chatting!</p>
            ) : (
              <div className="flex flex-col">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 text-sm sm:text-base flex ${
                      msg.senderId === user.userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-xl ${
                        msg.senderId === user.userId ? "bg-orange-600" : "bg-black/50"
                      }`}
                    >
                      <span className="font-semibold text-orange-300">
                        {msg.senderId === user.userId ? "You" : msg.senderName}:
                      </span>
                      <span className="ml-2 break-words">
                        {msg.message}
                        {msg.edited && <span className="text-xs text-orange-600 ml-1">(Edited)</span>}
                      </span>
                      <div className="text-orange-600 text-xs mt-1 flex items-center gap-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                        {msg.read && msg.senderId === user.userId && (
                          <FaCheckDouble className="text-orange-400" />
                        )}
                      </div>
                      {msg.senderId === user.userId && (
                        <div className="flex gap-2 mt-1">
                          <FaEdit
                            className="cursor-pointer hover:text-orange-300"
                            onClick={() => editMessage(msg)}
                          />
                          <FaTrash
                            className="cursor-pointer hover:text-red-400"
                            onClick={() => deleteMessage(msg.messageId)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {typingUsers.size > 0 && (
            <p className="text-orange-500/60 text-xs sm:text-sm mb-2 truncate">
              {[...typingUsers]
                .map((id) => messages.find((m) => m.senderId === id)?.senderName || "Someone")
                .join(", ")}{" "}
              {typingUsers.size === 1 ? "is" : "are"} typing...
            </p>
          )}
          <form onSubmit={editingMessage ? saveEditedMessage : sendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder={editingMessage ? "Edit your message..." : "Type a message to everyone..."}
              className="flex-1 p-2 sm:p-3 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm sm:text-base"
            />
            <motion.button
              type="submit"
              className="bg-orange-600 text-white p-2 sm:p-3 rounded-xl hover:bg-orange-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane className="text-sm sm:text-base" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
