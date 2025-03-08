import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // For animations
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMoneyBillWave, FaKey, FaImage, FaArrowRight } from "react-icons/fa"; // Icons

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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (user.balance < 0) {
      alert("Balance must be a positive number!");
      return;
    }
    if (!user.pin) {
      alert("Pin is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("password", user.password);
    formData.append("pin", user.pin);
    formData.append("profileImage", user.profileImage);
    formData.append("balance", user.balance);

    try {
      await axios.post("https://imax-movie-reservation.onrender.com/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try again!");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 flex flex-col lg:flex-row justify-center items-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] bg-orange-600 opacity-20 rounded-full blur-3xl -top-20 -left-20"
          animate={{ opacity: [0.2, 0.3, 0.2], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-orange-800 opacity-15 rounded-full blur-3xl -bottom-10 right-0"
          animate={{ opacity: [0.15, 0.25, 0.15], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Side - Welcome Message */}
      <motion.div
        className="w-full lg:w-1/2 text-center text-orange-400 font-extrabold text-2xl md:text-4xl p-6 space-y-2 relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
          Unlock Your Cinematic
        </h1>
        <p className="text-sm md:text-base text-orange-300 font-medium max-w-md mx-auto tracking-wide">
          Sign up for an exclusive movie experience!
        </p>
      </motion.div>

      {/* Right Side - Sign Up Form */}
      <motion.div
        className="w-full max-w-lg bg-gradient-to-br from-black/80 to-gray-900/80 bg-opacity-90 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl text-orange-400 m-2 border border-orange-500/20 relative z-10 h-full flex flex-col justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="text-xl font-extrabold text-center mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-md">
          Join Now
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2 flex-1 flex flex-col justify-center">
          <div className="relative group">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 transition-colors duration-200 text-xs font-semibold bg-black/50 px-2 py-0.5 rounded-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="number"
              placeholder="Initial Balance"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, balance: parseFloat(e.target.value) || 0 })}
              required
              min="0"
            />
          </div>
          <div className="relative group">
            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Security Pin"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm text-sm"
              onChange={(e) => setUser({ ...user, pin: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 group-focus-within:text-orange-300 transition-colors duration-300" />
            <input
              type="file"
              accept="image/*"
              className="w-full pl-12 pr-4 py-2 bg-black/30 border border-orange-500/40 rounded-xl text-orange-400 placeholder-orange-500/60 focus:outline-none focus:ring-4 focus:ring-orange-400/50 focus:border-transparent transition-all duration-500 hover:border-orange-500/70 hover:bg-black/40 shadow-sm file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 text-sm"
              onChange={handleImageChange}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white p-2 rounded-xl font-semibold shadow-lg transition-all duration-400 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 hover:shadow-2xl flex items-center justify-center gap-2 text-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account <FaArrowRight className="text-xs" />
          </motion.button>
        </form>
        <p className="text-center text-orange-400 mt-2 text-sm">
          Already a member?{" "}
          <span
            className="text-orange-300 hover:text-orange-200 font-semibold transition-colors duration-300 relative cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-400"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
