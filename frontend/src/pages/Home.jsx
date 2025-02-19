import React from "react";
import { Link } from "react-router-dom";
import MovieBanner from "../components/MovieBanner";
import MovieList from "../components/MovieList";

const Home = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Movie Banner Section */}
      <MovieBanner />
      
      {/* Movie List Section */}
      <MovieList />
    </div>
  );
};

export default Home;
