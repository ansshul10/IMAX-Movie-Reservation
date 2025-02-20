import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import movies from "../data/PremiumMovies";

const MovieBanner = () => {
  const [showTrailer, setShowTrailer] = useState(false);
  const movie = movies[0]; // First movie for banner

  return (
    <div className="relative w-full h-[500px] bg-black">
      {/* Banner image */}
      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover opacity-50" />

      {/* Banner text and button */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-10 text-white z-10">
        <h1 className="text-5xl font-bold">{movie.title}</h1>
        <p className="mt-3">{movie.description}</p>
        <div className="mt-4">
          <div
            className="bg-blue-600 px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
            onClick={() => setShowTrailer(true)}
          >
            <FaPlay /> Watch Trailer
          </div>
        </div>
      </div>

      {/* Trending Now Sidebar */}
      <div className="absolute top-10 right-8 w-80 z-20">
        <div className="sticky top-20 bg-black/30 backdrop-blur-lg p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Trending Now</h2>
          <div className="space-y-4">
            {movies.slice(0, 3).map((movie) => (
              <div
                key={movie.id}
                className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
              >
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-14 h-14 rounded-lg object-cover" 
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-white text-sm font-semibold">{movie.title}</h3>
                  <p className="text-gray-400 text-xs">{movie.genre}, {movie.year}</p>
                </div>
                <div className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                  IMDb {movie.imdb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
          <div className="relative">
            <iframe
              width="800"
              height="450"
              src={movie.trailer}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div
              className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
              onClick={() => setShowTrailer(false)}
            >
              ✖
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBanner;
