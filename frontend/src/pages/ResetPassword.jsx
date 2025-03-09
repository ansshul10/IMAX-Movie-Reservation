import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaArrowRight } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`https://imax-movie-reservation.onrender.com/reset-password/${token}`, { password });
      setMessage("Password reset successfully! Redirecting to sign-in...");
      setTimeout(() => navigate("/signin"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to reset password. Try again!");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 flex justify-center items-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-orange-500 opacity-15 rounded-full blur-3xl top-0 left-0"
          animate={{ opacity: [0.15, 0.25, 0.15], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] bg-orange-700 opacity-10 rounded-full blur-3xl bottom-0 right-0"
          animate={{ opacity: [0.1, 0.2, 0.1], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Reset Password Form */}
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-orange-400 m-4 border border-orange-500/15 relative z-10"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h2 className="text-xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-800 hover:shadow-xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            Reset Password <FaArrowRight className="text-sm" />
          </motion.button>
        </form>
        {message && (
          <motion.div
            className={`mt-4 text-center font-medium rounded-xl p-3 backdrop-blur-md shadow-md ${
              message.includes("Failed") || message.includes("match")
                ? "bg-red-500/20 text-red-300"
                : "bg-green-500/20 text-green-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
