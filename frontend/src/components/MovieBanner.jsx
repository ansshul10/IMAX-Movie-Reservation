import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import movies from "../data/PremiumMovies";
import { motion, AnimatePresence } from "framer-motion";

const MovieBanner = () => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  // Sort movies by IMDb rating and take top 3
  const topMovies = movies
    .sort((a, b) => (b.imdb || 0) - (a.imdb || 0))
    .slice(0, 3);

  // Cycle through top 3 movies every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % topMovies.length);
    }, 7000); // Change every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [topMovies.length]);

  const currentMovie = topMovies[currentMovieIndex];
  const trailerUrl = currentMovie.trailer
    ? `https://www.youtube.com/embed/${currentMovie.trailer}?autoplay=1`
    : null;

  return (
    <div className="w-full bg-black">
      {/* Banner Section */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden mt-[60px] z-10">
        {/* Banner Image */}
        <motion.img
          key={currentMovie.id}
          src={currentMovie.image}
          alt={currentMovie.title}
          className="w-full h-full object-cover opacity-50"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Banner Text and Button */}
        <motion.div
          key={currentMovie.id + "-content"}
          className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-4 sm:p-6 md:p-8 text-white z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            {currentMovie.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg md:max-w-xl text-gray-200 line-clamp-2">
            {currentMovie.plot || "No description available."}
          </p>
          <motion.button
            onClick={() => setShowTrailer(true)}
            className="mt-3 sm:mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 w-fit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!trailerUrl}
            aria-label={`Watch trailer for ${currentMovie.title}`}
          >
            <FaPlay /> Watch Trailer
          </motion.button>
        </motion.div>
      </div>

      {/* Trending Now Section (Moved Below Banner, Hidden on Mobile) */}
      <motion.div
        className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg border border-orange-500/20 mt-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-orange-500 mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topMovies.map((trendingMovie) => (
            <motion.div
              key={trendingMovie.id}
              className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.location.href = `/movies/${trendingMovie.id}`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && (window.location.href = `/movies/${trendingMovie.id}`)}
              aria-label={`View details for ${trendingMovie.title}`}
            >
              <img
                src={trendingMovie.image}
                alt={trendingMovie.title}
                className="w-12 h-12 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-semibold truncate">{trendingMovie.title}</h3>
                <p className="text-gray-400 text-xs truncate">{trendingMovie.genre}, {trendingMovie.year}</p>
              </div>
              <div className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded flex-shrink-0">
                IMDb {trendingMovie.imdb || "N/A"}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerUrl && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              className="relative w-full max-w-[90%] sm:max-w-3xl bg-gray-900/80 backdrop-blur-md rounded-lg shadow-2xl p-4 border border-orange-500/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 text-white text-xl sm:text-2xl hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Close trailer"
              >
                ✖
              </button>
              <iframe
                className="w-full h-40 sm:h-48 md:h-[400px] rounded-lg"
                src={trailerUrl}
                title={`Trailer for ${currentMovie.title}`}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieBanner;
