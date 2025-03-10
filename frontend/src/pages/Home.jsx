import React, { useEffect, useState, Suspense, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { FaPlay, FaUserCircle, FaArrowDown, FaBars, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import movies from "../data/PremiumMovies"; // Movie data from your data folder
import MovieList from "../components/MovieList"; // Assuming this is still a separate component
import ambientSound from "../assets/ambient-sound.mp3";

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center">
    <motion.div
      className="text-orange-500 text-3xl font-semibold"
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading Your Cinematic Journey...
    </motion.div>
  </div>
);

const Home = ({ isMuted, setIsMuted }) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const audioRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [user, setUser] = useState(null);

  const scrollProgress = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Sort movies by IMDb rating and take top 2 for banner (changed to 2)
  const topMovies = movies
    .sort((a, b) => (b.imdb || 0) - (a.imdb || 0))
    .slice(0, 2); // Change here to take top 2 movies

  // Cycle through top 2 movies every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % topMovies.length);
    }, 7000); // Delay set to 7 seconds
    return () => clearInterval(interval);
  }, [topMovies.length]);

  // Audio Control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch((err) => console.error("Audio error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  // User Check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const currentMovie = topMovies[currentMovieIndex];
  const bannerImage = currentMovie.image || "https://via.placeholder.com/1920x1080?text=Movie+Banner";

  // Navbar Functions
  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (label, path) => {
    setActiveSection(label);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Series", path: "/series" },
    { label: "Movies", path: "/movies" },
    { label: "Kids", path: "/kids" },
    { label: "Book Ticket", path: "/BookingPage" },
    { label: "Chat", path: "/chat" },
  ];

  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-black text-white min-h-screen flex flex-col relative overflow-hidden font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 z-50"
        style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
      />

      {/* Hero Section (Banner) */}
      <motion.section
        className="relative z-10 mt-[48px] m-0 p-0" // Adjusted for navbar height (~64px)
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="w-full bg-black">
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden m-0 p-0 z-10">
            <motion.img
              key={currentMovie.id}
              src={bannerImage}
              alt={currentMovie.title}
              className="w-full h-full object-cover opacity-70 shadow-2xl"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              whileHover={{
                rotateX: 10,
                rotateY: 10,
                boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
                transition: { duration: 0.3 },
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              key={currentMovie.id + "-content"}
              className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-6 sm:p-8 md:p-12 text-white z-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                {currentMovie.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-md sm:max-w-lg md:max-w-2xl text-gray-200 line-clamp-2 drop-shadow-md">
                {currentMovie.plot || "No description available."}
              </p>
              <div className="mt-6 flex space-x-4">
                <motion.button
                  onClick={() => navigate(`/movies/${currentMovie.id}`)}
                  className="bg-gray-800/80 text-orange-400 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  More Info
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Trending Now Section */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 py-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topMovies.map((trendingMovie) => (
            <motion.div
              key={trendingMovie.id}
              className="bg-gray-800/50 rounded-lg p-4 shadow-lg hover:bg-gray-700/50 transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)" }}
              onClick={() => navigate(`/movies/${trendingMovie.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && navigate(`/movies/${trendingMovie.id}`)}
              aria-label={`View details for ${trendingMovie.title}`}
            >
              <img
                src={trendingMovie.image || "https://via.placeholder.com/300x200?text=Poster"}
                alt={trendingMovie.title}
                className="w-full h-40 object-cover rounded-md mb-3"
                loading="lazy"
              />
              <h3 className="text-white text-lg font-semibold truncate">{trendingMovie.title}</h3>
              <p className="text-gray-400 text-sm truncate">{trendingMovie.genre}, {trendingMovie.year}</p>
              <div className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded mt-2 inline-block">
                IMDb {trendingMovie.imdb || "N/A"}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Movie List Section */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 py-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <MovieList />
        </Suspense>
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/movies"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg"
          >
            View All Movies
          </Link>
        </motion.div>
      </motion.section>

      {/* Audio */}
      <audio ref={audioRef} src={ambientSound} loop preload="auto" />

      {/* Footer */}
      <motion.footer
        className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black border-t border-orange-500/20 py-8 px-6 text-center text-gray-400 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="mb-4 flex justify-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-300" aria-label="Twitter">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-300" aria-label="Facebook">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3V12h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.5.2 2.5.2v2.8h-1.4c-1.4 0-1.7.7-1.7 1.7V12h3l-.5 3.6h-2.5v8.4A12 12 0 0024 12z" />
            </svg>
          </a>
        </motion.div>
        <p className="text-sm">© {new Date().getFullYear()} iMax Entertainment. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/about" className="hover:text-orange-300">About</Link>
          <Link to="/terms" className="hover:text-orange-300">Terms</Link>
          <Link to="/privacy" className="hover:text-orange-300">Privacy</Link>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;
