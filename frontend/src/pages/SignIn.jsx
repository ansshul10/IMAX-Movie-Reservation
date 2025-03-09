// frontend/src/pages/SignIn.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

const jokes = [
  "Ready to reserve your seat? Sign in now!",
];

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  // Sign-in submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://imax-movie-reservation.onrender.com/signin", user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Includes userId
      setMessage("Great job! You’re in! 🔓");
      setTimeout(() => {
        navigate("/"); // Redirect to chat
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Oops! Something went wrong. Try again! 😜");
    }
  };

  // Forgot password submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://imax-movie-reservation.onrender.com/forgot-password", { email: resetEmail });
      setMessage(res.data.message || "Reset email sent! Check your inbox. 📧");
      setForgotPassword(false);
      setResetEmail("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error sending reset email. Try again! 😕");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 flex flex-col lg:flex-row justify-center items-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
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

      {/* Left Side - Welcome Message */}
      <motion.div
        className="w-full lg:w-1/2 text-center text-orange-400 font-bold text-2xl md:text-4xl p-6 space-y-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p className="relative max-w-xl mx-auto">
          <span className="relative z-10 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-md">
            {randomJoke}
          </span>
          <motion.span
            className="absolute inset-0 bg-orange-500 opacity-15 blur-xl rounded-lg"
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </p>
      </motion.div>

      {/* Right Side - Sign In or Forgot Password Form */}
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-orange-400 m-4 border border-orange-500/15 relative z-10"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {!forgotPassword ? (
          <>
            <h2 className="text-xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
              Sign In
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className="relative group">
                <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-800 hover:shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.96 }}
              >
                Sign In <FaArrowRight className="text-sm" />
              </motion.button>
            </form>
            <p className="text-center text-orange-400 mt-4">
              <span
                onClick={() => setForgotPassword(true)}
                className="text-orange-300 hover:text-orange-200 font-semibold cursor-pointer transition-colors duration-300 relative"
              >
                Forgot Password?
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
              Reset Password
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group">
                <FaEnvelope className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-800 hover:shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.96 }}
              >
                Send Reset Email <FaArrowRight className="text-sm" />
              </motion.button>
            </form>
            <p className="text-center text-orange-400 mt-4">
              <span
                onClick={() => setForgotPassword(false)}
                className="text-orange-300 hover:text-orange-200 font-semibold cursor-pointer transition-colors duration-300 relative"
              >
                Back to Sign In
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            </p>
          </>
        )}

        {message && (
          <motion.div
            className={`mt-4 text-center font-medium rounded-xl p-3 backdrop-blur-md shadow-md ${
              message.includes("Oops") || message.includes("Error")
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
        {!forgotPassword && (
          <p className="text-center text-orange-400 mt-4">
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
        )}
      </motion.div>
    </div>
  );
};

export default SignIn;
