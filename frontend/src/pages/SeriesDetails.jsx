import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import seriesData from "../data/series"; // Assuming you have a series dataset

const SeriesDetails = () => {
  const { id } = useParams(); // Grabs the series ID from the URL
  const series = seriesData.find((s) => s.id === parseInt(id)); // Find the series based on the ID
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendedSeries, setRecommendedSeries] = useState([]);

  useEffect(() => {
    if (!series) {
      // If the series doesn't exist, show an error
      alert("Series not found!");
    } else {
      // Find recommended series based on the same genre
      const related = seriesData.filter((s) => s.genre === series.genre && s.id !== series.id);
      setRecommendedSeries(related.slice(0, 4)); // Limit to 4 related series
    }
  }, [series]);

  if (!series) return <div className="text-orange-500 text-center text-2xl mt-10">Series not found!</div>;

  const trailerUrl = series.trailer ? `https://www.youtube.com/embed/${series.trailer}?autoplay=1` : null;

  return (
    <div className="p-10 bg-black text-orange-500 min-h-screen flex flex-col items-center">
      {/* Series Poster */}
      <img src={series.image} alt={series.title} className="rounded-lg w-80 mb-6 shadow-lg" />

      {/* Series Info */}
      <h2 className="text-4xl font-bold">{series.title}</h2>
      <p className="text-lg text-orange-400 mt-2">{series.genre} | {series.year}</p>
      <p className="text-lg text-orange-400 mt-1">IMDb: {series.imdb}</p>

      {/* Trailer Button */}
      <button
        className="mt-6 bg-black text-orange-500 px-6 py-2 rounded-lg text-lg font-semibold shadow-lg transform transition hover:text-red-500 hover:bg-black hover:scale-105"
        onClick={() => setShowTrailer(true)}
        aria-label={`Watch trailer for ${series.title}`}
      >
        🎬 Watch Trailer
      </button>

      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
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
              title={`Trailer for ${series.title}`}
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Series Description */}
      <div className="mt-8 text-lg text-orange-400">{series.description}</div>

      {/* Recommended Series Section */}
      {recommendedSeries.length > 0 && (
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4">Recommended Series</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedSeries.map((recommended) => (
              <Link
                key={recommended.id}
                to={`/series/${recommended.id}`}
                className="cursor-pointer"
                aria-label={`View details for ${recommended.title}`}
              >
                <img
                  src={recommended.image}
                  alt={recommended.title}
                  className="rounded-lg w-full shadow-lg hover:scale-105 transition"
                />
                <h4 className="text-lg font-semibold mt-2">{recommended.title}</h4>
                <p className="text-sm text-orange-400">IMDb: {recommended.imdb}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetails;
