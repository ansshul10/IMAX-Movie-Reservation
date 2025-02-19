import React from "react";
import { Link } from "react-router-dom";
import seriesData from "../data/series"; // Assuming you have a series dataset

const SeriesList = () => {
  return (
    <div className="p-10 bg-black text-orange-500 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📺 Popular Series</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {seriesData.map((series) => (
          <Link key={series.id} to={`/series/${series.id}`} className="cursor-pointer">
            <div className="relative group">
              <img
                src={series.image}
                alt={series.title}
                className="rounded-lg w-full h-60 object-cover shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 text-orange-500 transition-opacity opacity-0 group-hover:opacity-100">
                <h3 className="text-lg font-semibold">{series.title}</h3>
                <p className="text-sm">{series.genre}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeriesList;
