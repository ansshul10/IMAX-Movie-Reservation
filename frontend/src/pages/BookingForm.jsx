import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChair, FaCheck, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const BookingForm = () => {
  const [userInfo, setUserInfo] = useState({ _id: "", name: "", email: "", age: "" });
  const [bookingEmail, setBookingEmail] = useState("");
  const [seatType, setSeatType] = useState("");
  const [showtime, setShowtime] = useState("");
  const [showtimes, setShowtimes] = useState([]); // Fetch from DB
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(100);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { movieTitle } = location.state || {};

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  // Fetch user info and showtimes
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch user info
          const userResponse = await axios.get("https://imax-movie-reservation.onrender.com/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserInfo({
            _id: userResponse.data._id,
            name: userResponse.data.name || "",
            email: userResponse.data.email || "",
            age: userResponse.data.age || "",
          });
          setBookingEmail(userResponse.data.email || "");
          setBalance(userResponse.data.balance || 0);

          // Fetch showtimes
          const showtimesResponse = await axios.get("https://imax-movie-reservation.onrender.com/api/showtimes");
          setShowtimes(showtimesResponse.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load booking data. Please try again.");
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  // Update price based on seat type
  useEffect(() => {
    const seatPrices = { Recliner: 300, Balcony: 200, Normal: 100 };
    setPricePerSeat(seatPrices[seatType] || 100);
  }, [seatType]);

  // Simulated 3D seat grid (6x10 layout)
  const seats = Array.from({ length: 60 }, (_, i) => `S${i + 1}`);
  const totalPrice = selectedSeats.length * pricePerSeat;

  // Handle seat selection with 3D effect
  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo.name || !bookingEmail || !userInfo.age) {
      setError("Please complete Name, Email, and Age fields.");
      return;
    }
    if (!seatType || !showtime || !selectedSeats.length) {
      setError("Please select a seat type, showtime, and at least one seat.");
      return;
    }
    if (balance < totalPrice) {
      setError("Insufficient balance! Please add funds.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://imax-movie-reservation.onrender.com/api/book-ticket",
        {
          user: userInfo._id,
          name: userInfo.name,
          email: bookingEmail,
          age: userInfo.age,
          seatType,
          numSeats: selectedSeats.length,
          showtime,
          price: totalPrice,
          seats: selectedSeats,
          movieTitle,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(response.data.balance);
      setConfirmation({
        bookingId: response.data.bookingId,
        movieTitle,
        showtime,
        seats: selectedSeats,
        totalPrice,
      });
      setError("");
    } catch (error) {
      console.error("Error during booking:", error);
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBackClick = () => navigate(-1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg text-orange-400 font-semibold animate-pulse">Crafting your premium booking...</p>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-orange-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4 py-6 sm:p-8 md:p-10 overflow-hidden relative">
      {/* Back Button */}
      <motion.button
        onClick={handleBackClick}
        className="fixed top-4 left-4 p-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full shadow-xl z-50 border border-orange-500/50"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(251, 146, 60, 0.7)" }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowLeft size={16} />
      </motion.button>

      {/* Header */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800 mb-6 sm:mb-8 text-center tracking-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {movieTitle ? `${movieTitle} - Elite Booking` : "Premium Booking Suite"}
      </motion.h2>

      {/* Form */}
      <motion.div
        className="w-full max-w-lg sm:max-w-xl md:max-w-3xl mx-auto bg-gray-900/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-orange-500/40 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Subtle Glow Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
          {/* Name */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full p-2 sm:p-3 bg-gray-800/80 border border-orange-500/50 rounded-lg text-sm text-white placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300 shadow-inner"
              placeholder="Enter your name"
              required
            />
          </motion.div>

          {/* Booking Email */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-1">Booking Email</label>
            <input
              type="email"
              value={bookingEmail}
              onChange={(e) => setBookingEmail(e.target.value)}
              className="w-full p-2 sm:p-3 bg-gray-800/80 border border-orange-500/50 rounded-lg text-sm text-white placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300 shadow-inner"
              placeholder="Enter email for booking"
              required
            />
          </motion.div>

          {/* Age */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-1">Age</label>
            <input
              type="number"
              value={userInfo.age}
              onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
              className="w-full p-2 sm:p-3 bg-gray-800/80 border border-orange-500/50 rounded-lg text-sm text-white placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300 shadow-inner"
              placeholder="Enter your age"
              min="1"
              required
            />
          </motion.div>

          {/* Seat Type */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-1">Seat Category</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="w-full p-2 sm:p-3 bg-gray-800/80 border border-orange-500/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300 shadow-inner"
              required
            >
              <option value="">Select Seat Type</option>
              <option value="Recliner">Recliner - ₹300</option>
              <option value="Balcony">Balcony - ₹200</option>
              <option value="Normal">Normal - ₹100</option>
            </select>
          </motion.div>

          {/* Showtime (Fetched from DB) */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-1">Showtime</label>
            <select
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
              className="w-full p-2 sm:p-3 bg-gray-800/80 border border-orange-500/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300 shadow-inner"
              required
            >
              <option value="">Select Showtime</option>
              {showtimes
                .filter((st) => st.movieTitle === movieTitle) // Filter by movieTitle if applicable
                .map((st) => (
                  <option key={st._id} value={st.time}>
                    {st.date} at {st.time} - {st.theater}
                  </option>
                ))}
            </select>
          </motion.div>

          {/* 3D Seat Selection */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <label className="block text-orange-400 text-sm font-semibold mb-2">Select Your Seats</label>
            <div className="relative perspective-1000">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2 transform rotate-x-15">
                {seats.map((seat, index) => (
                  <motion.button
                    key={seat}
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    className={`p-2 sm:p-3 rounded-lg text-xs font-medium transition-all duration-400 ${
                      selectedSeats.includes(seat)
                        ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg"
                        : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/90"
                    }`}
                    whileHover={{
                      scale: 1.25,
                      rotateX: 15,
                      rotateY: 15,
                      z: 30,
                      boxShadow: "0 0 20px rgba(251, 146, 60, 0.7)",
                    }}
                    whileTap={{ scale: 0.9, z: 0 }}
                    style={{ transformStyle: "preserve-3d" }}
                    disabled={loading}
                  >
                    <FaChair className="inline mr-1" size={12} /> {seat}
                  </motion.button>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-xs mt-2">Selected: {selectedSeats.join(", ") || "None"}</p>
          </motion.div>

          {/* Price and Balance */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm font-semibold">
              Total Price: <span className="text-green-400">₹{totalPrice}</span>
            </p>
            <p className="text-sm font-semibold">
              Balance: <span className="text-yellow-400">₹{balance}</span>
            </p>
            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold text-sm rounded-lg shadow-xl hover:from-orange-700 hover:to-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:opacity-50 transition-all duration-400"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 146, 60, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Securing Seats..." : "Confirm Reservation"}
          </motion.button>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/confirmation", { state: { bookingId: confirmation.bookingId } })}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-orange-500/50 w-11/12 max-w-md relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotate: 5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-30"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center gap-2 relative z-10">
                <FaCheck /> Reservation Secured
              </h3>
              <p className="text-gray-200 text-sm mb-2 relative z-10">
                <strong>{confirmation.movieTitle}</strong> at {confirmation.showtime}
              </p>
              <p className="text-gray-200 text-sm mb-2 relative z-10">Seats: {confirmation.seats.join(", ")}</p>
              <p className="text-gray-200 text-sm mb-4 relative z-10">Total: ₹{confirmation.totalPrice}</p>
              <motion.button
                onClick={() => navigate("/confirmation", { state: { bookingId: confirmation.bookingId } })}
                className="w-full py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold text-sm rounded-lg shadow-xl hover:from-orange-700 hover:to-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-400 relative z-10"
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 146, 60, 0.8)" }}
                whileTap={{ scale: 0.95 }}
              >
                View Confirmation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {error && !confirmation && (
          <motion.div
            className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 bg-red-900/90 backdrop-blur-md p-4 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-red-300 text-sm flex items-center gap-2">
              <FaExclamationTriangle /> {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
