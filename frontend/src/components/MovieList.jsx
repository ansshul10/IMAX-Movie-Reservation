import React from "react";
import movies from "../data/PremiumMovies"; // Assuming this data is imported

const MovieList = () => {
  return (
    <div className="relative p-10 bg-gray-900 text-white min-h-screen flex">
      {/* Main Movie Grid */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="cursor-pointer">
              <div className="relative group">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="rounded-lg w-full object-cover h-60" 
                  loading="lazy"
                />
                {/* Movie Name on Hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm">{movie.imdb ? `IMDb: ${movie.imdb}` : "IMDb: N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
