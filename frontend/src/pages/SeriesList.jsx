import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa"; // Added missing import
import seriesData from "../data/series";

const SeriesList = () => {
  // State for search and genre filtering
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Filtered series based on search and genre
  const filteredSeries = useMemo(() => {
    return seriesData.filter((series) => {
      const isTitleMatch = series.title.toLowerCase().includes(search.toLowerCase());
      const isGenreMatch = genre === "All" || series.genre.toLowerCase().includes(genre.toLowerCase());
      return isTitleMatch && isGenreMatch;
    });
  }, [search, genre]);

  return (
    <motion.div
      className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-900 to-black text-orange-500"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-extrabold mb-8 flex items-center gap-2"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span role="img" aria-label="TV"></span>
      </motion.h2>

      {/* Search Bar */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="🔍 Search Series..."
          className="w-full px-5 py-3 rounded-full bg-gray-800 text-orange-500 focus:ring-4 focus:ring-orange-400 outline-none shadow-lg transition-all"
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search series"
        />
      </motion.div>

      {/* Genre Filter */}
      <motion.div
        className="flex gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => setGenre("All")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${genre === "All" ? "bg-orange-500 text-white" : "bg-gray-800 text-orange-500 hover:bg-orange-600"}`}
        >
          All
        </button>
        <button
          onClick={() => setGenre("Drama")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${genre === "Drama" ? "bg-orange-500 text-white" : "bg-gray-800 text-orange-500 hover:bg-orange-600"}`}
        >
          Drama
        </button>
        <button
          onClick={() => setGenre("Comedy")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${genre === "Comedy" ? "bg-orange-500 text-white" : "bg-gray-800 text-orange-500 hover:bg-orange-600"}`}
        >
          Comedy
        </button>
        {/* Add more genres here */}
      </motion.div>

      {/* Series Grid */}
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          layout
        >
          {filteredSeries.map((series, index) => (
            <Link
              key={series.id}
              to={`/series/${series.id}`}
              className="group cursor-pointer block"
              aria-label={`View details for ${series.title}`}
            >
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800/50 backdrop-blur-sm border border-orange-500/10"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && window.location.assign(`/series/${series.id}`)}
              >
                <img
                  src={series.image}
                  alt={series.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold truncate">{series.title}</h3>
                  <p className="text-sm opacity-90">{series.genre}</p>
                  <p className="text-sm text-yellow-400">
                    <FaStar className="inline mr-1" /> {series.imdb?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-sm">{series.seasons} Seasons | {series.network}</p>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SeriesList;
