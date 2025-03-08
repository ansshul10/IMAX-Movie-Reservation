import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa"; // Added missing import
import seriesData from "../data/series";

const SeriesList = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          layout
        >
          {seriesData.map((series, index) => (
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
