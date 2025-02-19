import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bookingId = location.state?.bookingId;

  useEffect(() => {
    if (!bookingId) {
      setError("❌ Booking ID is missing. Unable to fetch details.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`https://imax-movie-reservation.onrender.com/api/get-booking/${bookingId}`);
        setBookingDetails(response.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("❌ Failed to fetch booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // 🟢 Download Ticket as PDF
  const downloadTicket = async () => {
    const ticketElement = document.getElementById("ticketDetails");
    if (!ticketElement) return;

    try {
      const canvas = await html2canvas(ticketElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Ticket_${bookingId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("❌ Failed to download ticket. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-2xl animate-pulse text-orange-500">Fetching booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-6 bg-red-600 rounded-lg shadow-lg">
          <p className="text-xl font-bold">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-orange-500 text-black font-bold rounded-lg shadow-md hover:bg-orange-600 transition-all"
          >
            Back to Home 🏠
          </button>
        </div>
      </div>
    );
  }

  const { name, email, seatType, numSeats, showtime, price } = bookingDetails;

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white p-8">
      <motion.div
        className="bg-opacity-10 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-4xl font-extrabold text-orange-500 mb-4 drop-shadow-lg">
          Booking Confirmed! 🎉
        </h2>
        <p className="text-gray-300">Your ticket has been successfully booked.</p>

        {/* Ticket Details */}
        <div
          id="ticketDetails"
          className="bg-opacity-20 backdrop-blur-xl p-6 mt-6 rounded-xl shadow-lg border border-gray-600 text-left"
        >
          <h3 className="text-lg font-semibold text-orange-400 border-b pb-2 mb-2">
            🎟️ Ticket Details
          </h3>
          <p className="text-orange-500"><strong>Name:</strong> {name}</p>
          <p className="text-orange-500"><strong>Email:</strong> {email}</p>
          <p className="text-orange-500"><strong>Seat Type:</strong> {seatType}</p>
          <p className="text-orange-500"><strong>Seats:</strong> {numSeats}</p>
          <p className="text-orange-500"><strong>Showtime:</strong> {showtime}</p>
          <p className="text-orange-500"><strong>Total Price:</strong> ${price.toFixed(2)}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <motion.button
            onClick={downloadTicket}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-6 rounded-lg shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Ticket 📄
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-6 rounded-lg shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home 🏠
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Confirmation;
