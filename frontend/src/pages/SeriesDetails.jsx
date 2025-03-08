import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaStar, FaPlay, FaTimes } from "react-icons/fa";
import seriesData from "../data/series";

const SeriesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [recommendedSeries, setRecommendedSeries] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        const selectedSeries = seriesData.find((s) => s.id === parseInt(id));
        if (!selectedSeries) throw new Error("Series not found");
        setSeries(selectedSeries);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setIsLoading(false), 300); // Simulated async delay
      }
    };
    fetchSeries();
  }, [id]);

  useEffect(() => {
    if (series) {
      const related = seriesData
        .filter((s) => s.genre.split(", ").some((g) => series.genre.includes(g)) && s.id !== series.id)
        .sort((a, b) => b.imdb - a.imdb) // Sort by IMDb rating
        .slice(0, 4);
      setRecommendedSeries(related);
    }
  }, [series]);

  const trailerUrl = useMemo(
    () => (series?.trailer ? `https://www.youtube.com/embed/${series.trailer}?autoplay=1&rel=0` : null),
    [series]
  );

  if (isLoading) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-orange-500 flex items-center justify-center">
        <div className="max-w-5xl w-full p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 h-96 bg-gray-700/50 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-700/50 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-700/50 rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-gray-700/50 rounded w-1/3 animate-pulse" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700/50 rounded w-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !series) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-orange-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-2xl text-center">
          {error || "Series not found!"}{" "}
          <button
            onClick={() => navigate("/series")}
            className="underline hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Go back
          </button>
        </p>
      </motion.div>
    );
  }

  const handleTrailerError = () => {
    alert("Trailer unavailable.");
    setShowTrailer(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-orange-500 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Fixed Navbar */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-orange-500/20 p-4 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={() => navigate("/series")}
          className="flex items-center text-orange-500 hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to series list"
        >
          <FaArrowLeft className="mr-2" /> Back
        </motion.button>
        <div className="text-white text-2xl font-bold">Series Details</div>
        <div className="w-10" />
      </motion.nav>

      {/* Main Content */}
      <div className="pt-24 pb-10 px-6 md:px-10 relative z-10 flex flex-col items-center">
        <motion.div
          className="max-w-5xl w-full bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-orange-500/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <motion.img
              src={series.image}
              alt={series.title}
              className="w-full md:w-1/3 rounded-lg object-cover shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              loading="lazy"
            />
            <div className="flex-1">
              <motion.h2
                className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {series.title}
              </motion.h2>
              <p className="text-gray-300 text-lg mb-2">
                {series.genre} | {series.year}
              </p>
              <p className="text-lg flex items-center text-yellow-400 mb-4">
                <FaStar className="mr-2" /> {series.imdb?.toFixed(1) || "N/A"}
              </p>
              <div className="text-gray-200 space-y-3 text-base">
                <p><strong>Creator:</strong> {series.creator}</p>
                <p><strong>Cast:</strong> {series.cast.join(", ")}</p>
                <p>
                  <strong>Seasons:</strong> {series.seasons} | <strong>Episodes:</strong> {series.episodes}
                </p>
                <p><strong>Runtime:</strong> {series.runtime}</p>
                <p><strong>Network:</strong> {series.network}</p>
                <p><strong>Status:</strong> {series.status}</p>
                <p><strong>Description:</strong> {series.description || "No description available."}</p>
              </div>
              <motion.button
                onClick={() => setShowTrailer(true)}
                className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!trailerUrl}
                aria-label={`Watch trailer for ${series.title}`}
              >
                <FaPlay /> Watch Trailer
              </motion.button>
            </div>
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
              onClick={() => setShowTrailer(false)}
            >
              <motion.div
                className="relative w-full max-w-4xl rounded-lg shadow-2xl p-4 border border-orange-500/20 bg-gray-900/80 backdrop-blur-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 text-white hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  whileHover={{ scale: 1.1 }}
                  aria-label="Close trailer"
                >
                  <FaTimes />
                </motion.button>
                <iframe
                  className="w-full h-64 md:h-96 rounded-lg"
                  src={trailerUrl}
                  title={`Trailer for ${series.title}`}
                  allow="autoplay; fullscreen"
                  onError={handleTrailerError}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Series */}
        {recommendedSeries.length > 0 && (
          <motion.div
            className="mt-12 max-w-5xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-6">
              Recommended Series
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {recommendedSeries.map((recommended, index) => (
                <Link
                  key={recommended.id}
                  to={`/series/${recommended.id}`}
                  className="group cursor-pointer block"
                  aria-label={`View details for ${recommended.title}`}
                >
                  <motion.div
                    className="relative rounded-lg shadow-lg overflow-hidden border border-orange-500/10 bg-gray-800/50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img
                      src={recommended.image}
                      alt={recommended.title}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="p-2">
                      <h4 className="text-lg font-semibold truncate text-orange-500">{recommended.title}</h4>
                      <p className="text-sm text-yellow-400 flex items-center">
                        <FaStar className="mr-1" /> {recommended.imdb?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SeriesDetails;
