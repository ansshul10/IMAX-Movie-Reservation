import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaSignOutAlt, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [formData, setFormData] = useState({
    movieTitle: "",
    poster: "",
    description: "",
    price: "",
    date: "",
    time: "",
    theater: "",
  });
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Password validation
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "Anshul10") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  // Fetch showtimes
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://imax-movie-reservation.onrender.com/api/showtimes");
        setShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setError("Failed to load showtimes.");
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, [isAuthenticated]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Still use token if available, but no explicit login check
      await axios.post(
        "https://imax-movie-reservation.onrender.com/api/add-showtime",
        formData,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setFormData({ movieTitle: "", poster: "", description: "", price: "", date: "", time: "", theater: "" });
      setNotification({ type: "success", message: "Showtime added successfully!" });
      const response = await axios.get("https://imax-movie-reservation.onrender.com/api/showtimes");
      setShowtimes(response.data);
    } catch (error) {
      console.error("Error adding showtime:", error);
      setNotification({ type: "error", message: "Failed to add showtime." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000); // Clear notification after 3s
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Use token if available, no explicit check
      await axios.delete(
        `https://imax-movie-reservation.onrender.com/api/delete-showtime/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setShowtimes(showtimes.filter((show) => show._id !== id));
      setDeleteId(null);
      setNotification({ type: "success", message: "Showtime deleted successfully!" });
    } catch (error) {
      console.error("Error deleting showtime:", error);
      setNotification({ type: "error", message: "Failed to delete showtime." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.form
          onSubmit={handlePasswordSubmit}
          className="bg-gray-900/90 backdrop-blur-2xl p-10 rounded-2xl shadow-2xl border border-orange-500/30 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-center mb-8">
            Admin Gateway
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-800/70 border border-orange-500/50 rounded-xl text-white placeholder-orange-300/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter Admin Key"
            required
          />
          <motion.button
            type="submit"
            className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Unlock Dashboard
          </motion.button>
          {error && <p className="text-red-400 text-center mt-4 font-medium">{error}</p>}
        </motion.form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 sm:p-8 ${darkMode ? "bg-gradient-to-br from-gray-900 via-black to-gray-800" : "bg-gradient-to-br from-gray-100 to-white"} transition-colors duration-500 overflow-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <motion.h2
          className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text ${darkMode ? "bg-gradient-to-r from-orange-400 to-orange-600" : "bg-gradient-to-r from-orange-500 to-orange-700"}`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Admin Control
        </motion.h2>
        <div className="flex space-x-6">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full ${darkMode ? "bg-orange-500 text-black" : "bg-gray-700 text-white"} shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 10, boxShadow: "0 0 10px rgba(251, 146, 60, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="p-3 bg-red-600 text-white rounded-full shadow-lg"
            whileHover={{ scale: 1.1, rotate: -10, boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
          >
            <FaSignOutAlt size={22} />
          </motion.button>
        </div>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className={`max-w-2xl mx-auto bg-opacity-90 backdrop-blur-2xl p-8 rounded-2xl shadow-xl border ${darkMode ? "bg-gray-900/90 border-orange-500/30" : "bg-white/90 border-orange-600/30"}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 gap-6">
          {["movieTitle", "poster", "description", "price", "date", "time", "theater"].map((field, index) => (
            <motion.div
              key={field}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <input
                type={field === "date" ? "date" : field === "time" ? "time" : field === "price" ? "number" : field === "description" ? "textarea" : "text"}
                placeholder={field === "movieTitle" ? "Movie Title" : field === "poster" ? "Poster URL" : field === "description" ? "Description" : field === "price" ? "Price (₹)" : field === "date" ? "Date" : field === "time" ? "Time" : "Theater Name"}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                required
                className={`w-full p-4 ${darkMode ? "bg-gray-800/70 border-orange-500/50 text-white placeholder-orange-300/80" : "bg-gray-200/70 border-orange-600/50 text-gray-900 placeholder-orange-500/80"} border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${field === "description" ? "h-32 resize-none" : ""}`}
              />
              <span className="absolute -top-2 left-3 px-2 text-xs font-medium text-orange-400 bg-gray-900/80 rounded-full">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            </motion.div>
          ))}
        </div>
        <motion.button
          type="submit"
          className="w-full py-4 mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          <FaPlus /> {loading ? "Adding..." : "Add Showtime"}
        </motion.button>
        {error && <p className="text-red-400 text-center mt-4 font-medium">{error}</p>}
      </motion.form>

      {/* Showtimes List */}
      <motion.div
        className="max-w-7xl mx-auto mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <h3 className={`text-3xl sm:text-4xl font-bold mb-8 ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Active Showtimes</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showtimes.map((show) => (
              <motion.li
                key={show._id}
                className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-900/90 border-orange-500/30" : "bg-white/90 border-orange-600/30"} border hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <strong className="text-xl font-semibold text-orange-400">{show.movieTitle}</strong>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>{show.date} at {show.time}</p>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>₹{show.price} - {show.theater}</p>
                  </div>
                  <motion.button
                    onClick={() => setDeleteId(show._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete Showtime"
                  >
                    <FaTrash size={18} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg ${notification.type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white font-medium`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              className={`p-8 rounded-2xl shadow-2xl border ${darkMode ? "bg-gray-900/95 border-orange-500/30" : "bg-white/95 border-orange-600/30"}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Confirm Deletion</h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg`}>Are you sure you want to delete this showtime?</p>
              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 focus:outline-none transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(deleteId)}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
