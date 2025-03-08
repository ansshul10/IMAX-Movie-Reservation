import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa"; // Icons

const jokes = [
  "Ready to reserve your seat? Sign in now!",
];

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Randomly select a joke
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://imax-movie-reservation.onrender.com/signin", user);

      // Save token and user data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Great job! You’re in! 🔓");
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      setMessage("Oops! Wrong password or user not registered. Try again! 😜");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 flex flex-col lg:flex-row justify-between items-center p-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-orange-500 opacity-15 rounded-full blur-3xl top-0 left-0"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] bg-orange-700 opacity-10 rounded-full blur-3xl bottom-0 right-0"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Side - Welcome Message */}
      <motion.div
        className="w-full lg:w-1/2 text-center text-orange-400 font-bold text-3xl md:text-5xl p-10 space-y-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p className="relative max-w-2xl mx-auto">
          <span className="relative z-10 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-md">
            {randomJoke}
          </span>
          <motion.span
            className="absolute inset-0 bg-orange-500 opacity-15 blur-xl rounded-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </p>
      </motion.div>

      {/* Right Side - Sign In Form */}
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-orange-400 m-6 border border-orange-500/15 relative z-10"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Email Input */}
          <div className="relative group">
            <FaEnvelope className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-14 pr-6 py-4 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-6 py-4 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white p-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-800 hover:shadow-xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            Sign In <FaArrowRight className="text-sm" />
          </motion.button>
        </form>

        {/* Response Message */}
        {message && (
          <motion.div
            className={`mt-6 text-center font-medium rounded-xl p-4 backdrop-blur-md shadow-md ${
              message.includes("Oops") ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {message}
          </motion.div>
        )}

        {/* Sign Up Link */}
        <p className="text-center text-orange-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-300 hover:text-orange-200 font-semibold transition-colors duration-300 relative"
          >
            Sign Up
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-300"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
