// frontend/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaPaperPlane, FaCheckDouble, FaEdit, FaTrash, FaFileUpload } from "react-icons/fa";
import axios from "axios";

const socket = io("https://imax-movie-reservation.onrender.com", {
  auth: { token: localStorage.getItem("token") },
});

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [chatType, setChatType] = useState("global");
  const [file, setFile] = useState(null);
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

    // Fetch initial chat history
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("https://imax-movie-reservation.onrender.com/chat/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history");
      }
    };
    fetchChatHistory();

    socket.on("connect", () => {
      console.log("Connected to chat server");
      socket.emit("join", user.userId);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((u) => u.userId !== user.userId));
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        const updated = [...prev, data];
        if (chatType === "direct" && data.senderId === selectedUser?.userId) {
          socket.emit("markAsRead", { messageId: data.messageId, recipientId: user.userId });
        }
        return updated;
      });
      scrollToBottom();
      if (document.hidden && Notification.permission === "granted") {
        new Notification("New Message", { body: `${data.senderName}: ${data.message}` });
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
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    socket.on("messageEdited", ({ messageId, newMessage }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, message: newMessage, edited: true } : msg
        )
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

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("connect");
      socket.off("onlineUsers");
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    if (!user?.userId) {
      setError("User ID not found. Please sign in again.");
      navigate("/signin");
      return;
    }

    const messageData = {
      senderId: user.userId,
      senderName: user.name,
      message: message || "",
      timestamp: new Date(),
      messageId: Date.now().toString(), // Replace with UUID in production
      recipientId: chatType === "direct" ? selectedUser?.userId : null,
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post(
          "https://imax-movie-reservation.onrender.com/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        messageData.fileUrl = res.data.fileUrl;
        messageData.fileType = file.type;
      } catch (err) {
        console.error("File upload error:", err);
        setError("Failed to upload file");
        return;
      }
    }

    socket.emit("sendMessage", messageData);
    setMessage("");
    setFile(null);
    setMessages((prev) => [...prev, { ...messageData, read: false }]);
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

  const startDirectChat = (targetUser) => {
    setSelectedUser(targetUser);
    setChatType("direct");
    setMessages([]);
    socket.emit("joinDirect", { userId: user.userId, targetUserId: targetUser.userId });
  };

  const switchToGlobal = () => {
    setSelectedUser(null);
    setChatType("global");
    setMessages([]);
    socket.emit("joinGlobal", user.userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 p-8 flex items-center justify-center">
      <motion.div
        className="w-full max-w-4xl bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl text-orange-400 border border-orange-500/20 flex"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Online Users Sidebar */}
        <div className="w-1/3 border-r border-orange-500/40 pr-4">
          <h3 className="text-xl font-bold mb-4">Online Users</h3>
          <button
            onClick={switchToGlobal}
            className={`w-full text-left py-2 px-3 mb-2 rounded-xl ${
              chatType === "global" ? "bg-orange-600" : "bg-black/30 hover:bg-orange-700/50"
            }`}
          >
            Global Chat
          </button>
          <div className="max-h-64 overflow-y-auto">
            {onlineUsers.map((u) => (
              <motion.div
                key={u.userId}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer ${
                  selectedUser?.userId === u.userId ? "bg-orange-600" : "hover:bg-orange-700/50"
                }`}
                onClick={() => startDirectChat(u)}
                whileHover={{ scale: 1.02 }}
              >
                <FaUser className={`text-${u.status === "online" ? "green" : "gray"}-400`} />
                <span>{u.name}</span>
                <span className="text-xs text-orange-600">
                  ({u.status}
                  {u.lastSeen ? ` - Last seen: ${new Date(u.lastSeen).toLocaleTimeString()}` : ""})
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 pl-4 flex flex-col">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {chatType === "global" ? "Global Chat" : `Chat with ${selectedUser?.name}`}
          </h2>
          {error && (
            <p className="text-red-400 text-sm mb-2">{error}</p>
          )}
          <div className="flex-1 h-96 overflow-y-auto bg-black/30 p-4 rounded-xl border border-orange-500/40 mb-4">
            {messages.length === 0 ? (
              <p className="text-orange-500/60 text-center">No messages yet. Start chatting!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 text-sm flex ${
                    msg.senderId === user.userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-xl ${
                      msg.senderId === user.userId ? "bg-orange-600" : "bg-black/50"
                    }`}
                  >
                    <span className="font-semibold text-orange-300">
                      {msg.senderId === user.userId ? "You" : msg.senderName}:
                    </span>
                    <span className="ml-2">
                      {msg.fileUrl ? (
                        msg.fileType.startsWith("image/") ? (
                          <img src={msg.fileUrl} alt="Attachment" className="max-w-full rounded" />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-orange-300 underline">
                            Download File
                          </a>
                        )
                      ) : (
                        msg.message
                      )}
                      {msg.edited && <span className="text-xs text-orange-600 ml-1">(Edited)</span>}
                    </span>
                    <div className="text-orange-600 text-xs mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                      {msg.read && msg.senderId === user.userId && (
                        <FaCheckDouble className="inline ml-1 text-orange-400" />
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          {typingUsers.size > 0 && (
            <p className="text-orange-500/60 text-sm mb-2">
              {[...typingUsers]
                .map((id) => onlineUsers.find((u) => u.userId === id)?.name || "Someone")
                .join(", ")}{" "}
              {typingUsers.size === 1 ? "is" : "are"} typing...
            </p>
          )}
          <form onSubmit={editingMessage ? saveEditedMessage : sendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder={
                editingMessage
                  ? "Edit your message..."
                  : chatType === "global"
                  ? "Type a message to everyone..."
                  : `Message ${selectedUser?.name}...`
              }
              className="flex-1 p-3 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
            <label className="bg-orange-600 p-3 rounded-xl hover:bg-orange-700 cursor-pointer">
              <FaFileUpload />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <motion.button
              type="submit"
              className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
