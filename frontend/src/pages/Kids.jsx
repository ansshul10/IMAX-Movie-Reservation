import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import kidsMovies from "../data/kidsMovies";
import KidsMovieCard from "../components/KidsMovieCard";
import debounce from "lodash/debounce";

const Kids = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const moviesPerPage = 10;

  // Debounced search handler
  const handleSearch = debounce((value) => setSearch(value), 300);

  // Filter movies
  const filteredMovies = kidsMovies.filter((movie) =>
    (movie.title.toLowerCase().includes(search.toLowerCase()) ||
     movie.genre.toLowerCase().includes(search.toLowerCase())) &&
    (genre === "All" || movie.genre.includes(genre))
  );

  // Paginate movies
  const paginatedMovies = filteredMovies.slice(0, page * moviesPerPage);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      paginatedMovies.length < filteredMovies.length
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, paginatedMovies.length, filteredMovies.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const genres = ["All", "Animation", "Adventure", "Comedy", "Family", "Fantasy", "Action", "Drama", "Musical"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 p-10 text-orange-500">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-8 flex items-center justify-center"
      >
        
      </motion.h2>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <input
          type="text"
          placeholder="🔍 Search Movies..."
          className="w-full px-5 py-3 rounded-full bg-gray-800 text-orange-500 focus:ring-4 focus:ring-orange-400 outline-none shadow-lg transition-all"
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search kids movies"
        />
      </motion.div>

      {/* Genre Chips */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              genre === g ? "bg-orange-500 text-white" : "bg-gray-800 text-orange-500 hover:bg-orange-600 hover:text-white"
            }`}
          >
            {g}
          </button>
        ))}
      </motion.div>

      {/* Movie Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {paginatedMovies.map((movie) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <KidsMovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6"
        >
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      )}
    </div>
  );
};

export default Kids;
