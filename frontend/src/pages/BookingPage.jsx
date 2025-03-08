import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTicketAlt, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredShow, setHoveredShow] = useState(null);
  const [particleEffect, setParticleEffect] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  const isLoggedIn = localStorage.getItem("token");
  const navigate = useNavigate();

  // Simulated particle effect toggle
  const toggleParticles = () => setParticleEffect((prev) => !prev);

  // Detect screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint is 640px
    };

    // Set initial value
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch showtimes with retry logic
  useEffect(() => {
    const fetchShowtimes = async (retryCount = 3) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("https://imax-movie-reservation.onrender.com/api/showtimes", {
          timeout: 10000,
        });
        setShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        if (retryCount > 0) {
          setTimeout(() => fetchShowtimes(retryCount - 1), 2000);
        } else {
          setError("Failed to load showtimes. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimes();
  }, []);

  // Handle book button click
  const handleBookClick = (show) => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      navigate("/BookingForm", {
        state: { movieTitle: show.movieTitle, showtime: show.time, showId: show._id },
      });
    }
  };

  // Back button handler
  const handleBackClick = () => navigate(-1);

  // Card hover handlers
  const handleCardHover = (show) => setHoveredShow(show);
  const handleCardLeave = () => setHoveredShow(null);

  // Particle animation variants
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 sm:p-10 overflow-hidden relative">
      {/* Back Button - Hidden on mobile */}

      {/* Header */}
      <motion.h2
        className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-12 text-center tracking-wide"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
       
      </motion.h2>

      {/* Simulated Particle Effects */}
      {particleEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-50"
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      )}

      {/* Showtimes Grid */}
      <div className="max-w-7xl mx-auto relative">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-72 bg-gray-800/40 rounded-3xl animate-pulse shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : error ? (
          <motion.div
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FaExclamationTriangle className="text-orange-500 text-6xl mb-4" />
            <p className="text-2xl text-orange-400 font-semibold">{error}</p>
            <motion.button
              onClick={() => fetchShowtimes()}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {showtimes.map((show, index) => (
              <motion.div
                key={show._id}
                className="bg-gray-900/95 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-orange-500/40 hover:shadow-[0_0_25px_rgba(251,146,60,0.7)] transition-all duration-700 inherit overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05, rotate: 2, zIndex: 10 }}
                onMouseEnter={() => handleCardHover(show)}
                onMouseLeave={handleCardLeave}
              >
                {/* Glowing Overlay on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredShow === show ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="flex items-start space-x-6 relative z-10">
                  {show.poster && (
                    <motion.img
                      src={show.poster}
                      alt={show.movieTitle}
                      className="w-24 h-36 object-cover rounded-xl shadow-md"
                      loading="lazy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-orange-400 tracking-tight">{show.movieTitle}</h3>
                    <p className="text-gray-200 text-sm mt-2 leading-relaxed">{show.description}</p>
                    <p className="text-gray-300 text-sm mt-3 font-medium">
                      {show.date} at <span className="text-orange-500">{show.time}</span> - {show.theater}
                    </p>
                    <p className="text-orange-500 font-semibold mt-2 text-lg">₹{show.price}</p>
                    <motion.button
                      onClick={() => handleBookClick(show)}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-400 flex items-center gap-3"
                      whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(251, 146, 60, 0.7)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTicketAlt size={18} /> Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && !isLoggedIn && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl border border-orange-500/50 max-w-md w-full relative overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotate: 5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-30"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-3xl font-bold text-orange-400 mb-6 text-center tracking-wide relative z-10">
                Authentication Required
              </h3>
              <p className="text-gray-200 mb-8 text-center text-lg relative z-10">
                Please log in to secure your cinematic experience.
              </p>
              <motion.button
                onClick={() => navigate("/signin")}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-400 relative z-10"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 146, 60, 0.7)" }}
                whileTap={{ scale: 0.95 }}
              >
                Proceed to Login
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
