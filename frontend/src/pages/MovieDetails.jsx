import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import movies from "../data/PremiumMovies";

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL params
  const [movie, setMovie] = useState(null); // Store the movie details
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch movie details based on ID from URL
  useEffect(() => {
    const selectedMovie = movies.find((m) => m.id === parseInt(id));
    if (selectedMovie) {
      setMovie(selectedMovie);
    } else {
      setMovie(null); // If no movie is found, set movie state to null
    }
  }, [id]);

  // When movie data is available, fetch related movies
  useEffect(() => {
    if (movie) {
      let watchedMovies = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
      watchedMovies = watchedMovies.filter((m) => m.id !== movie.id);
      watchedMovies.unshift(movie);
      localStorage.setItem("recentlyWatched", JSON.stringify(watchedMovies.slice(0, 5)));

      const related = movies.filter((m) => m.genre === movie.genre && m.id !== movie.id);
      setRelatedMovies(related.slice(0, 4)); // Limit to 4 related movies
    }
  }, [movie]);

  if (movie === null) {
    // Movie not found error message
    return (
      <div className="text-orange-500 text-center text-2xl mt-10">
        Movie not found! Please check the URL or try again later.
      </div>
    );
  }

  const handleTrailerError = () => {
    alert("Trailer could not be loaded. Please try again later.");
    setShowTrailer(false);
  };

  const trailerUrl = movie.trailer ? `https://www.youtube.com/embed/${movie.trailer}?autoplay=1` : null;

  return (
    <div className="bg-black text-orange-500 min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 p-4">
        <div className="text-white text-2xl">Movie Details</div>
      </nav>

      {/* Content below the navbar */}
      <div className="pt-20"> {/* Added pt-20 to create space for the fixed navbar */}
        {/* Movie Poster */}
        <img src={movie.image} alt={movie.title} className="rounded-lg w-80 mb-6 shadow-lg mx-auto" />

        {/* Movie Info */}
        <h2 className="text-4xl font-bold text-center">{movie.title}</h2>
        <p className="text-lg mt-2 text-center">{movie.genre} | {movie.year}</p>
        <p className="text-lg text-yellow-400 mt-1 text-center">IMDb: {movie.imdb}</p>

        {/* Movie Details */}
        <div className="text-center mt-6">
          <p><strong>Release Date:</strong> {movie.releaseDate}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Plot:</strong> {movie.plot}</p>
        </div>

        {/* Trailer Button */}
        <div className="text-center mt-6">
          <button
            className="bg-black text-orange-500 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transform transition hover:text-red-500 hover:bg-black hover:scale-105"
            onClick={() => setShowTrailer(true)}
            aria-label={`Watch trailer for ${movie.title}`}
          >
            🎬 Watch Trailer
          </button>
        </div>

        {/* Trailer Modal */}
        {showTrailer && trailerUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40">
            <div className="relative w-full max-w-2xl">
              <button
                className="absolute top-2 right-2 text-white text-3xl"
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
          <div className="mt-10 w-full max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Related Movies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedMovies.map((related) => (
                <Link
                  key={related.id}
                  to={`/movies/${related.id}`}
                  className="cursor-pointer"
                  aria-label={`View details for ${related.title}`}
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="rounded-lg w-full shadow-lg hover:scale-105 transition"
                  />
                  <h4 className="text-lg font-semibold mt-2">{related.title}</h4>
                  <p className="text-sm text-yellow-400">IMDb: {related.imdb}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
