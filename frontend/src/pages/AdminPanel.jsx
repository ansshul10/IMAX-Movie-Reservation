import { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [formData, setFormData] = useState({
    movieTitle: "",
    poster: "",
    description: "",
    price: "",
    date: "",
    time: "",
    theater: "",
  });

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Password validation
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "Anshul10") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password, please try again.");
    }
  };

  // Fetch all showtimes
  useEffect(() => {
    if (!isAuthenticated) return; // Don't fetch data if not authenticated
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [isAuthenticated]);

  // Get token from localStorage or sessionStorage (depending on how you store it)
  const token = localStorage.getItem("token");

  // Handle form submission (Add Showtime)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/add-showtime", // Add '/api' here
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the header
          }
        }
      );
      alert("Showtime added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding showtime:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/delete-showtime/${id}`, // Add '/api' here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the header
          }
        }
      );
      alert("Showtime deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting showtime:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50">
        <form onSubmit={handlePasswordSubmit} className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg space-y-4 w-96">
          <h2 className="text-2xl text-orange-500 text-center">Enter Admin Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
            placeholder="Enter password"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 focus:outline-none"
          >
            Submit
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-orange-500 p-8">
      <h2 className="text-3xl mb-6">Admin Panel - Manage Showtimes</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-black bg-opacity-70 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Movie Title"
          onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Poster URL"
          onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <input
          type="date"
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <input
          type="time"
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Theater Name"
          onChange={(e) => setFormData({ ...formData, theater: e.target.value })}
          required
          className="w-full p-3 bg-black border border-orange-500 rounded-lg text-white placeholder-orange-300 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 focus:outline-none"
        >
          Add Showtime
        </button>
      </form>

      <h3 className="text-2xl mt-8">Showtimes</h3>
      <ul className="space-y-4 mt-4">
        {showtimes.map((show) => (
          <li key={show._id} className="bg-black bg-opacity-70 p-4 rounded-lg shadow-lg">
            <strong>{show.movieTitle}</strong> - {show.date} at {show.time} - ₹{show.price} - {show.theater}
            <button
              onClick={() => handleDelete(show._id)}
              className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
