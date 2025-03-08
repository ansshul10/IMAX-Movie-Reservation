import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

// Import the audio file from src/assets
import ambientSound from "../assets/ambient-sound.mp3"; // Adjust path if needed

// Lazy-loaded components
const MovieBanner = lazy(() => import("../components/MovieBanner"));
const MovieList = lazy(() => import("../components/MovieList"));

// Custom loading skeleton with premium animation
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
    <motion.div
      className="text-orange-500 text-3xl font-semibold"
      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading Your Experience...
    </motion.div>
  </div>
);

const Home = ({ isMuted, setIsMuted }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const audioRef = useRef(null);

  // Smooth scroll progress bar using spring animation
  const scrollProgress = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Audio Control (Managed via Navbar props)
  useEffect(() => {
    if (audioRef.current) {
      console.log("Audio element:", audioRef.current);
      console.log("Audio source:", audioRef.current.src);
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current
          .play()
          .then(() => console.log("Audio playing successfully"))
          .catch((err) => console.error("Audio play failed:", err));
      } else {
        audioRef.current.pause();
        console.log("Audio paused");
      }
    } else {
      console.error("audioRef.current is null");
    }
  }, [isMuted]);

  // Preload critical assets (example for performance)
  useEffect(() => {
    const preloadImages = [
      // Add critical image URLs here if known (e.g., MovieList thumbnails)
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 z-50"
        style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
      />

      {/* Hero Section with Movie Banner (No Buttons or Hover) */}
      <motion.section
        className="relative z-10 min-h-[80vh] flex items-center justify-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <MovieBanner /> {/* Simplified: No hover, buttons, or banner image logic */}
        </Suspense>
      </motion.section>

      {/* Movie List Section */}
      <motion.section
        className="relative z-10 flex-1 px-6 pb-20"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <MovieList /> {/* Assuming this renders movie cards */}
        </Suspense>
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/movies"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            View All Movies
          </Link>
        </motion.div>
      </motion.section>

      {/* Ambient Audio */}
      <audio ref={audioRef} src={ambientSound} loop preload="auto" />

      {/* Enhanced Footer with Social Links and Animation */}
      <motion.footer
        className="relative z-10 bg-gray-900/80 backdrop-blur-md border-t border-orange-500/20 py-8 px-6 text-center text-gray-400"
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
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-300 transition-colors duration-300"
            aria-label="Twitter"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-300 transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3V12h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.5.2 2.5.2v2.8h-1.4c-1.4 0-1.7.7-1.7 1.7V12h3l-.5 3.6h-2.5v8.4A12 12 0 0024 12z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-300 transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.3.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.5 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.5-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.5 1.3-.1 1.7-.1 4.9-.1M12 0C8.7 0 8.2 0 7 .1c-1.3.1-2.2.3-3 .6-.8.3-1.5.7-2.2 1.4C1 3.8.7 4.5.4 5.3c-.3.8-.5 1.7-.6 3C0 8.8 0 9.3 0 12s0 3.2.1 4.3c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.2.7.7 1.4 1 2.2 1.4.8.3 1.7.5 3 .6 1.2.1 1.7.1 4.3.1s3.2 0 4.3-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.2-1.4.7-.7 1-1.4 1.4-2.2.3-.8.5-1.7.6-3 .1-1.2.1-1.7.1-4.3s0-3.2-.1-4.3c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.2-.7-.7-1.4-1-2.2-1.4-.8-.3-1.7-.5-3-.6C15.2 0 14.7 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.5-10.4a1.4 1.4 0 11-2.8 0 1.4 1.4 0 012.8 0z" />
            </svg>
          </a>
        </motion.div>
        <p className="text-sm">
          © {new Date().getFullYear()} iMax Entertainment. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/about" className="hover:text-orange-300 transition-colors duration-300">
            About
          </Link>
          <Link to="/terms" className="hover:text-orange-300 transition-colors duration-300">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-orange-300 transition-colors duration-300">
            Privacy
          </Link>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;
