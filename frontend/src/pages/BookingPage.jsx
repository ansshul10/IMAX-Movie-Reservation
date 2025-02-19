import { useState, useEffect } from "react";
import axios from "axios";

const BookingPage = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [showModal, setShowModal] = useState(false);  // For handling the modal visibility

  // Fetch all showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };
    fetchShowtimes();
  }, []);

  // Check if the user is logged in (based on token in localStorage)
  const isLoggedIn = localStorage.getItem("token");

  // Handle booking button click
  const handleBooking = (movieTitle, time) => {
    if (!isLoggedIn) {
      // If not logged in, show the modal
      setShowModal(true);
    } else {
      // Placeholder for actual booking functionality
      alert(`Booking for ${movieTitle} at ${time}`);
    }
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-black text-orange-500 p-8">
      <h2 className="text-3xl mb-6">Booking Page</h2>

      <div className="space-y-6">
        {showtimes.map((show) => (
          <div
            key={show._id}
            className="bg-black bg-opacity-70 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              {/* Display Movie Poster */}
              {show.poster && (
                <img
                  src={show.poster}
                  alt={show.movieTitle}
                  className="w-24 h-36 object-cover rounded-lg mr-4"
                />
              )}
              <div>
                {/* Movie Title - Bold and Orange */}
                <h3 className="text-xl font-bold text-orange-500">{show.movieTitle}</h3>
                {/* Description - White text */}
                <p className="text-white text-sm mt-2">{show.description}</p>
                <button
                  onClick={() => window.location.href = "/BookingForm"}
                  className="py-2 px-4 bg-orange-500 text-black rounded-lg hover:bg-orange-600 mt-4"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for not logged in */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-lg shadow-xl relative max-w-sm w-full">
            <h3 className="text-2xl text-orange-500">Error</h3>
            <p className="text-orange-500">You are not logged in. Please log in to book a ticket.</p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-orange-500 hover:text-black"
            >
              X
            </button>
            <button
              onClick={() => window.location.href = "/signin"} // Redirect to login page
              className="mt-4 px-6 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
