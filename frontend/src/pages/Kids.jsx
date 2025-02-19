import React, { useState } from "react";
import kidsMovies from "../data/kidsMovies";
import { Link } from "react-router-dom";

const Kids = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const filteredMovies = kidsMovies.filter((movie) =>
    (movie.title.toLowerCase().includes(search.toLowerCase()) || movie.genre.toLowerCase().includes(search.toLowerCase())) &&
    (genre === "All" || movie.genre.includes(genre))
  );

  return (
    <div className="p-10 bg-black text-orange-500 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">🎬 Kids Movies</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search Movies..."
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-orange-500 outline-none focus:ring-2 focus:ring-orange-500 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Genre Filter */}
      <select
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-orange-500 outline-none mb-6"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option value="All">All Genres</option>
        <option value="Animation">Animation</option>
        <option value="Adventure">Adventure</option>
        <option value="Comedy">Comedy</option>
        <option value="Family">Family</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Action">Action</option>
        <option value="Drama">Drama</option>
        <option value="Musical">Musical</option>
      </select>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} to={`/kids/${movie.id}`} className="cursor-pointer">
            <div className="relative group">
              <img src={movie.image} alt={movie.title} className="rounded-lg w-full h-60 object-cover shadow-lg" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 text-orange-500 transition-opacity opacity-0 group-hover:opacity-100">
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm">{movie.genre}</p>
                <p className="text-sm text-yellow-400">IMDb: {movie.imdb}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Kids;
