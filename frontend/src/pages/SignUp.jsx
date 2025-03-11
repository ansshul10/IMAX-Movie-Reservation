import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMoneyBillWave, FaKey, FaImage, FaArrowRight } from "react-icons/fa";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    pin: "",
    profileImage: null,
    balance: 0,
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profileImage: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (user.password !== user.confirmPassword) {
      setMessage("Passwords do not match! 😕");
      return;
    }
    if (user.balance < 0) {
      setMessage("Balance must be a positive number! 💰");
      return;
    }
    if (!user.pin) {
      setMessage("Security PIN is required! 🔐");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("password", user.password);
    formData.append("pin", user.pin);
    if (user.profileImage) formData.append("profileImage", user.profileImage); // Only append if exists
    formData.append("balance", user.balance);

    try {
      const res = await axios.post("https://imax-movie-reservation.onrender.com/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Signup successful! Welcome aboard! 🚀");
      setTimeout(() => {
        navigate("/"); // Redirect to home
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed. Try again! 😔");
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
            Join the movie magic! Sign up now! 🎬
          </span>
          <motion.span
            className="absolute inset-0 bg-orange-500 opacity-15 blur-xl rounded-lg"
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </p>
      </motion.div>

      {/* Right Side - Sign Up Form (Scrollable) */}
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-orange-400 m-4 border border-orange-500/15 relative z-10 max-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <h2 className="text-xl font-extrabold text-center mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative group">
            <FaUser className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div className="relative group">
            <FaPhone className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-14 pr-16 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors duration-200 text-sm font-semibold bg-black/50 px-2 py-1 rounded-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              required
            />
          </div>

          {/* Balance */}
          <div className="relative group">
            <FaMoneyBillWave className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="number"
              placeholder="Initial Balance"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, balance: parseFloat(e.target.value) || 0 })}
              required
              min="0"
            />
          </div>

          {/* Pin */}
          <div className="relative group">
            <FaKey className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Security PIN"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30"
              onChange={(e) => setUser({ ...user, pin: e.target.value })}
              required
            />
          </div>

          {/* Profile Image */}
          <div className="relative group">
            <FaImage className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="file"
              accept="image/*"
              className="w-full pl-14 pr-6 py-3 bg-black/20 border border-orange-500/30 rounded-xl text-orange-400 placeholder-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-400 hover:border-orange-500/50 hover:bg-black/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-800 hover:shadow-xl flex items-center justify-center gap-2"
            whileHover={{ scale: 1.04, boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)" }}
            whileTap={{ scale: 0.96 }}
          >
            Sign Up <FaArrowRight className="text-sm" />
          </motion.button>
        </form>

        {/* Feedback Message */}
        {message && (
          <motion.div
            className={`mt-4 text-center font-medium rounded-xl p-3 backdrop-blur-md shadow-md ${
              message.includes("failed") || message.includes("match") || message.includes("required")
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

        {/* Sign In Link */}
        <p className="text-center text-orange-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-orange-300 hover:text-orange-200 font-semibold transition-colors duration-300 relative"
          >
            Sign In
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

export default SignUp;
