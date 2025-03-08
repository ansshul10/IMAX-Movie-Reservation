import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import movies from "../data/PremiumMovies";

const Movies = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("rating");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  // Memoized filtered and sorted movies
  const filteredMovies = useMemo(() => {
    setIsLoading(true);
    const result = movies
      .filter((movie) => {
        const searchLower = search.toLowerCase();
        return (
          (movie.title.toLowerCase().includes(searchLower) ||
            movie.genre.toLowerCase().includes(searchLower)) &&
          (genre === "All" || movie.genre.includes(genre))
        );
      })
      .sort((a, b) => {
        if (sort === "rating") return b.imdb - a.imdb;
        if (sort === "year") return b.year - a.year;
        return 0;
      });
    setTimeout(() => setIsLoading(false), 200); // Simulate async
    return result;
  }, [search, genre, sort]);

  const genres = ["All", "Action", "Adventure", "Drama", "Crime", "Sci-Fi", "Thriller"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div
      className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-900 to-black text-orange-500"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-0.5xl md:text-4xl font-extrabold mb-8 flex items-center gap-2"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
      >
        <span role="img" aria-label="fire"></span>
      </motion.h2>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search movies..."
          className="w-full px-4 py-3 rounded-xl bg-gray-800 text-orange-500 outline-none focus:ring-2 focus:ring-orange-500 shadow-lg"
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search movies"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-orange-500 outline-none shadow-lg"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Filter by genre"
          >
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-orange-500 outline-none shadow-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort movies"
          >
            <option value="rating">Sort by IMDb Rating</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          layout
        >
          {filteredMovies.map((movie, index) => (
            <Link key={movie.id} to={`/movies/${movie.id}`} className="group cursor-pointer block">
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800/50 backdrop-blur-sm border border-orange-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && window.location.assign(`/movies/${movie.id}`)}
                aria-label={`View details for ${movie.title}`}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                  <p className="text-sm opacity-90">{movie.genre}</p>
                  <p className="text-sm text-yellow-400">IMDb: {movie.imdb?.toFixed(1)}</p>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredMovies.length === 0 && (
        <motion.p className="text-center text-lg mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          No movies found. Try adjusting your filters! 🍿
        </motion.p>
      )}
    </motion.div>
  );
};

export default Movies;
