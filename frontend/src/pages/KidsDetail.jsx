import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import kidsMovies from "../data/kidsMovies";

const KidsDetail = () => {
  const { id } = useParams();
  const movie = kidsMovies.find((m) => m.id === parseInt(id));
  const [showTrailer, setShowTrailer] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState([]);

  // Full list of 15 reviews with Indian names
  const allReviews = [
    { id: 1, user: "Aarav Sharma", text: "Bahut mazedaar movie hai, bacchon ko pasand aayegi!", rating: 5 },
    { id: 2, user: "Priya Patel", text: "Great animation and story, pura family enjoy kiya.", rating: 4 },
    { id: 3, user: "Rohan Gupta", text: "Superb movie for kids, thodi si comedy bhi hai!", rating: 5 },
    { id: 4, user: "Sneha Verma", text: "This film is amazing, visuals are top-notch!", rating: 4 },
    { id: 5, user: "Kunal Singh", text: "Ek number movie, dil se pasand aaya!", rating: 5 },
    { id: 6, user: "Anjali Rao", text: "Very entertaining, kids loved the characters.", rating: 4 },
    { id: 7, user: "Vikram Yadav", text: "Achhi story hai, thoda emotional bhi laga.", rating: 4 },
    { id: 8, user: "Neha Kapoor", text: "Mast movie, bacchon ke liye perfect hai!", rating: 5 },
    { id: 9, user: "Suresh Iyer", text: "Good fun for the whole family, highly recommend!", rating: 4 },
    { id: 10, user: "Pooja Desai", text: "Animation bahut sundar hai, story bhi acchi!", rating: 5 },
    { id: 11, user: "Arjun Malhotra", text: "Nice movie, kids were glued to the screen!", rating: 4 },
    { id: 12, user: "Meera Nair", text: "Thodi si slow hai, par enjoyable hai.", rating: 3 },
    { id: 13, user: "Rahul Joshi", text: "Full paisa vasool, kids enjoyed a lot!", rating: 5 },
    { id: 14, user: "Kavita Reddy", text: "Lovely film, perfect for a weekend watch.", rating: 4 },
    { id: 15, user: "Amitabh Tiwari", text: "Bahut badhiya movie, zaroor dekho!", rating: 5 },
  ];

  // Shuffle and select 5 reviews on each load
  useEffect(() => {
    if (movie) {
      // Update recently watched
      let watchedMovies = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
      watchedMovies = watchedMovies.filter((m) => m.id !== movie.id);
      watchedMovies.unshift(movie);
      localStorage.setItem("recentlyWatched", JSON.stringify(watchedMovies.slice(0, 5)));

      // Shuffle reviews and pick 5
      const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
      setDisplayedReviews(shuffled.slice(0, 5));
    }
  }, [movie]);

  if (!movie) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-orange-500 text-center text-2xl mt-10"
      >
        Movie not found!
      </motion.div>
    );
  }

  const trailerUrl = movie.trailer ? `https://www.youtube.com/embed/${movie.trailer}?autoplay=1` : null;

  const shareMovie = () => {
    navigator.share({
      title: movie.title,
      text: `Check out ${movie.title} on this awesome kids movie app!`,
      url: window.location.href,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-10 text-orange-500 flex flex-col items-center"
    >
      <motion.img
        src={movie.image}
        alt={movie.title}
        className="rounded-xl w-96 mb-8 shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      />

      <motion.h2
        className="text-5xl font-extrabold mb-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        {movie.title}
      </motion.h2>
      <p className="text-xl text-orange-400 mb-2">{movie.genre} | {movie.year}</p>
      <p className="text-xl text-yellow-400">IMDb: {movie.imdb}</p>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
          onClick={() => setShowTrailer(true)}
        >
          🎬 Watch Trailer
        </button>
        <button
          className="bg-gray-800 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
          onClick={shareMovie}
        >
          Share
        </button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
        >
          <div className="relative w-full max-w-3xl">
            <button
              className="absolute top-4 right-4 text-4xl text-orange-500"
              onClick={() => setShowTrailer(false)}
            >
              ✖
            </button>
            <iframe
              className="w-full h-80 md:h-[500px] rounded-xl"
              src={trailerUrl}
              title={`Trailer for ${movie.title}`}
              allow="autoplay"
              onError={() => {
                alert("Trailer failed to load!");
                setShowTrailer(false);
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 w-full max-w-4xl"
      >
        <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-semibold">{review.user}</p>
            <p>{review.text}</p>
            <p className="text-yellow-400">Rating: {review.rating}/5</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default KidsDetail;
