import React, { useState } from "react";
import { Link } from "react-router-dom";

const KidsMovieCard = ({ movie }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-48 h-72 transform-style-3d transition-transform duration-500 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side (Movie Poster) */}
        <div className="absolute inset-0 backface-hidden">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full rounded-lg shadow-lg"
          />
        </div>

        {/* Back Side (Movie Details) */}
        <div className="absolute inset-0 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center rotate-y-180 backface-hidden">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <p className="text-sm">{movie.genre}</p>
          <p className="text-sm text-yellow-400">IMDb: {movie.imdb}</p>
          <Link
            to={`/kids/${movie.id}`}
            className="mt-2 bg-blue-500 px-4 py-1 text-sm rounded hover:bg-blue-600 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KidsMovieCard;
