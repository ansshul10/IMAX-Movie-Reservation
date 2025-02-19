import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BookingForm = ({ movieTitle }) => {
  const [userInfo, setUserInfo] = useState({ _id: "", name: "", email: "", age: "" });
  const [bookingEmail, setBookingEmail] = useState(""); // Separate email for booking
  const [seatType, setSeatType] = useState(""); 
  const [showtime, setShowtime] = useState(""); 
  const [numSeats, setNumSeats] = useState(1);
  const [pricePerSeat, setPricePerSeat] = useState(100);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if no token is found
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  // Fetch user info
  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("https://imax-movie-reservation.onrender.com/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserInfo({
            _id: response.data._id,
            name: response.data.name || "",
            email: response.data.email || "", // Store user's original email
            age: response.data.age || "",
          });

          setBookingEmail(response.data.email || ""); // Set booking email initially
          setBalance(response.data.balance || 0);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert("Failed to fetch user information.");
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  useEffect(() => {
    const seatPrices = { Recliner: 300, Balcony: 200, Normal: 100 };
    setPricePerSeat(seatPrices[seatType] || 100);
  }, [seatType]);

  const totalPrice = numSeats * pricePerSeat;

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.name || !bookingEmail || !userInfo.age) {
      alert("Please fill in your Name, Email, and Age.");
      return;
    }
    if (!seatType || !showtime) {
      alert("Please select a seat type and showtime.");
      return;
    }
    if (numSeats < 1) {
      alert("Please enter a valid number of seats.");
      return;
    }
    if (balance < totalPrice) {
      alert("Insufficient balance! Please add more funds.");
      return;
    }

    try {
      const response = await axios.post("https://imax-movie-reservation.onrender.com/api/book-ticket", {
        user: userInfo._id,
        name: userInfo.name,
        email: bookingEmail, // Save this email ONLY in the booking database
        age: userInfo.age,
        seatType,
        numSeats,
        showtime,
        price: totalPrice,
      });

      alert(response.data.message);
      setBalance(response.data.balance);
      navigate("/confirmation", { state: { bookingId: response.data.bookingId } });
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Error during booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-2xl animate-pulse">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-orange-400 flex justify-center items-center p-8">
      <motion.div
        className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-lg w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold text-center mb-6">Book Your Tickets</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <label className="block text-white mb-1">Full Name</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Email Input (Separate from user database) */}
          <div className="relative">
            <label className="block text-white mb-1">Booking Email</label>
            <input
              type="email"
              value={bookingEmail}
              onChange={(e) => setBookingEmail(e.target.value)} // This won't update user profile
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Age Input */}
          <div className="relative">
            <label className="block text-white mb-1">Age</label>
            <input
              type="number"
              value={userInfo.age}
              onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Seat Type Selection */}
          <div className="relative">
            <label className="block text-white mb-1">Select Seat Type</label>
            <select
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Choose a seat type</option>
              <option value="Recliner">Recliner - $300</option>
              <option value="Balcony">Balcony - $200</option>
              <option value="Normal">Normal - $100</option>
            </select>
          </div>

          {/* Showtime Selection */}
          <div className="relative">
            <label className="block text-white mb-1">Select Showtime</label>
            <select
              value={showtime}
              onChange={(e) => setShowtime(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Choose a showtime</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          {/* Number of Seats Input */}
          <div className="relative">
            <label className="block text-white mb-1">Number of Seats</label>
            <input
              type="number"
              value={numSeats}
              onChange={(e) => setNumSeats(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="1"
              required
            />
          </div>

          {/* Price and Balance */}
          <p className="text-lg font-semibold text-center mt-4">
            Total Price: <span className="text-green-400">${totalPrice}</span>
          </p>
          <p className="text-lg font-semibold text-center">
            Balance: <span className="text-yellow-400">${balance}</span>
          </p>

          {/* Book Button */}
          <motion.button
            type="submit"
            className="w-full py-3 mt-4 bg-orange-500 text-black font-bold rounded-lg shadow-md hover:bg-orange-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;
