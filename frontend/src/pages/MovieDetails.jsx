import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaStar, FaPlay, FaTimes } from "react-icons/fa";
import movies from "../data/PremiumMovies";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      const selectedMovie = movies.find((m) => m.id === parseInt(id));
      setTimeout(() => {
        setMovie(selectedMovie || null);
        setIsLoading(false);
      }, 300);
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      let watchedMovies = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
      watchedMovies = watchedMovies.filter((m) => m.id !== movie.id);
      watchedMovies.unshift({ ...movie, timestamp: Date.now() });
      localStorage.setItem("recentlyWatched", JSON.stringify(watchedMovies.slice(0, 5)));

      const related = movies.filter((m) => m.genre === movie.genre && m.id !== movie.id).slice(0, 4);
      setRelatedMovies(related);
    }
  }, [movie]);

  const trailerUrl = useMemo(() => 
    movie?.trailer ? `https://www.youtube.com/embed/${movie.trailer}?autoplay=1&rel=0` : null,
    [movie]
  );

  if (isLoading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-gray-900 text-orange-500">
        <motion.div className="text-2xl" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  if (!movie) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-orange-500"
      >
        <p className="text-2xl text-center">
          Movie not found!{" "}
          <button onClick={() => navigate("/")} className="underline hover:text-orange-300">
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
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black text-orange-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-orange-500/20 p-4 flex items-center justify-between"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center text-orange-500 hover:text-orange-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to movie list"
        >
          <FaArrowLeft className="mr-2" /> Back
        </motion.button>
        <div className="text-white text-2xl font-bold">Movie Details</div>
        <div className="w-10" />
      </motion.nav>

      <div className="pt-24 pb-10 px-6 md:px-10 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto rounded-xl shadow-2xl border border-orange-500/20 p-6 bg-gray-800/50 backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <motion.img
              src={movie.image}
              alt={movie.title}
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
                {movie.title}
              </motion.h2>
              <p className="text-gray-300 text-lg mb-2">
                {movie.genre} | {movie.year}
              </p>
              <p className="text-lg flex items-center text-yellow-400 mb-4">
                <FaStar className="mr-2" /> {movie.imdb?.toFixed(1) || "N/A"}
              </p>
              <div className="text-gray-200 space-y-3">
                <p><strong>Release Date:</strong> {movie.releaseDate || "N/A"}</p>
                <p><strong>Director:</strong> {movie.director || "N/A"}</p>
                <p><strong>Plot:</strong> {movie.plot || "No plot available."}</p>
              </div>
              <motion.button
                onClick={() => setShowTrailer(true)}
                className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!trailerUrl}
                aria-label={`Watch trailer for ${movie.title}`}
              >
                <FaPlay /> Watch Trailer
              </motion.button>
            </div>
          </div>
        </motion.div>

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
                  className="absolute top-4 right-4 text-white hover:text-orange-500"
                  whileHover={{ scale: 1.1 }}
                  aria-label="Close trailer"
                >
                  <FaTimes />
                </motion.button>
                <iframe
                  className="w-full h-64 md:h-96 rounded-lg"
                  src={trailerUrl}
                  title={`Trailer for ${movie.title}`}
                  allow="autoplay; fullscreen"
                  onError={handleTrailerError}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {relatedMovies.length > 0 && (
          <motion.div className="mt-12 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-6">
              Related Movies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {relatedMovies.map((related) => (
                <Link
                  key={related.id}
                  to={`/movies/${related.id}`}
                  className="group cursor-pointer block"
                >
                  <motion.div
                    className="relative rounded-lg shadow-lg overflow-hidden border border-orange-500/10 bg-gray-800/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === "Enter" && window.location.assign(`/movies/${related.id}`)}
                    aria-label={`View details for ${related.title}`}
                  >
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="p-2">
                      <h4 className="text-lg font-semibold truncate text-orange-500">{related.title}</h4>
                      <p className="text-sm text-yellow-400 flex items-center">
                        <FaStar className="mr-1" /> {related.imdb?.toFixed(1) || "N/A"}
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

export default MovieDetails;
