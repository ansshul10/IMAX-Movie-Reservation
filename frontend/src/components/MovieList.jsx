import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import moviesData from "../data/PremiumMovies";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const observer = useRef();
  const moviesPerPage = 10;

  // Simulate async loading of movies
  const loadMovies = async () => {
    setLoading(true);
    const start = (page - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const newMovies = moviesData.slice(0, end);
    setTimeout(() => {
      setMovies(newMovies);
      setLoading(false);
    }, 500); // Simulated delay for realism
  };

  // Load movies when page changes
  useEffect(() => {
    loadMovies();
  }, [page]);

  // Infinite scroll observer
  const lastMovieElementRef = useRef();
  useEffect(() => {
    const callback = (entries) => {
      if (entries[0].isIntersecting && !loading && movies.length < moviesData.length) {
        setPage((prev) => prev + 1);
      }
    };
    observer.current = new IntersectionObserver(callback);
    if (lastMovieElementRef.current) observer.current.observe(lastMovieElementRef.current);
    return () => observer.current?.disconnect();
  }, [loading, movies]);

  // Handle movie click navigation
  const handleMovieClick = (movie) => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <motion.div
      className="relative p-6 md:p-10 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Removed the radial gradient background animation */}
      <div className="relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Popular Movies
        </motion.h2>

        <AnimatePresence>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            layout
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                ref={index === movies.length - 1 ? lastMovieElementRef : null}
                className="group cursor-pointer relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => handleMovieClick(movie)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && handleMovieClick(movie)}
                aria-label={`View details for ${movie.title}`}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800/50 backdrop-blur-sm border border-orange-500/10">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-orange-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                    <p className="text-sm flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {movie.imdb?.toFixed(1) || "N/A"}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {[...Array(moviesPerPage)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-lg h-60 bg-gray-700/50 animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-48 bg-gray-600/50 rounded-t-lg" />
                <div className="p-2 space-y-2">
                  <div className="h-4 bg-gray-600/50 rounded w-3/4" />
                  <div className="h-3 bg-gray-600/50 rounded w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* End of List Message */}
        {!loading && movies.length >= moviesData.length && (
          <motion.p
            className="text-center text-gray-400 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No more movies to load
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default MovieList;
