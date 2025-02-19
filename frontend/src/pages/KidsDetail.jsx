import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import kidsMovies from "../data/kidsMovies"; // Make sure to import your kids movies dataset

const KidsDetail = () => {
  const { id } = useParams(); // Retrieve movie ID from URL
  const movie = kidsMovies.find((m) => m.id === parseInt(id)); // Find the movie by ID
  const [relatedMovies, setRelatedMovies] = useState([]); // Store related movies
  const [showTrailer, setShowTrailer] = useState(false); // Track if trailer modal is open

  useEffect(() => {
    if (movie) {
      // Save the movie to Recently Watched in localStorage
      let watchedMovies = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
      watchedMovies = watchedMovies.filter((m) => m.id !== movie.id); // Remove duplicate movie
      watchedMovies.unshift(movie); // Add the current movie to the beginning
      localStorage.setItem("recentlyWatched", JSON.stringify(watchedMovies.slice(0, 5))); // Keep only the last 5

      // Fetch related movies based on genre
      const related = kidsMovies.filter((m) => m.genre === movie.genre && m.id !== movie.id); // Filter movies with the same genre
      setRelatedMovies(related.slice(0, 4)); // Limit to 4 related movies
    }
  }, [movie]);

  // If the movie is not found, display an error message
  if (!movie) return <div className="text-orange-500 text-center text-2xl mt-10">Movie not found!</div>;

  const handleTrailerError = () => {
    alert("Trailer could not be loaded. Please try again later.");
    setShowTrailer(false); // Close the trailer on error
  };

  // Generate the trailer URL if it exists
  const trailerUrl = movie.trailer ? `https://www.youtube.com/embed/${movie.trailer}?autoplay=1` : null;

  return (
    <div className="p-10 bg-black text-orange-500 min-h-screen flex flex-col items-center">
      
      {/* Movie Poster */}
      <img src={movie.image} alt={movie.title} className="rounded-lg w-80 mb-6 shadow-lg" />

      {/* Movie Info */}
      <h2 className="text-4xl font-bold">{movie.title}</h2>
      <p className="text-lg text-orange-400 mt-2">{movie.genre} | {movie.year}</p>
      <p className="text-lg text-orange-400 mt-1">IMDb: {movie.imdb}</p>

      {/* Trailer Button */}
      <button 
        className="mt-6 bg-black text-orange-500 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transform transition hover:text-red-500 hover:bg-black hover:scale-105"
        onClick={() => setShowTrailer(true)}
        aria-label={`Watch trailer for ${movie.title}`}
      >
        🎬 Watch Trailer
      </button>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40">
          <div className="relative w-full max-w-2xl">
            <button 
              className="absolute top-2 right-2 text-orange-500 text-3xl" 
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              ✖
            </button>
            <iframe 
              className="w-full h-64 md:h-96 rounded-lg shadow-lg"
              src={trailerUrl} 
              title={`Trailer for ${movie.title}`}
              allow="autoplay"
              onError={handleTrailerError}
            />
          </div>
        </div>
      )}

      {/* Related Movies Section */}
      {relatedMovies.length > 0 && (
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4">Related Movies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedMovies.map((related) => (
              <Link 
                key={related.id} 
                to={`/kids/${related.id}`} 
                className="cursor-pointer"
                aria-label={`View details for ${related.title}`}
              >
                <img 
                  src={related.image} 
                  alt={related.title} 
                  className="rounded-lg w-full shadow-lg hover:scale-105 transition" 
                />
                <h4 className="text-lg font-semibold mt-2">{related.title}</h4>
                <p className="text-sm text-orange-400">IMDb: {related.imdb}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsDetail;
