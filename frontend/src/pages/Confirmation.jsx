import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaCheckCircle, FaDownload, FaHome, FaExclamationTriangle, FaShareAlt } from "react-icons/fa";
import { debounce } from "lodash"; // npm install lodash

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [particleCount, setParticleCount] = useState(50);
  const [isSharing, setIsSharing] = useState(false);
  const bookingId = location.state?.bookingId;

  // Optimized fetch with retry and caching
  const fetchBookingDetails = useCallback(
    debounce(async (id, retries = 3) => {
      try {
        const cachedData = sessionStorage.getItem(`booking_${id}`);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setBookingDetails({ ...data, bookingDateTime: new Date().toISOString() });
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://imax-movie-reservation.onrender.com/api/get-booking/${id}`, {
          timeout: 10000,
        });
        const dbData = response.data;
        const localBookingDateTime = new Date().toISOString();
        const details = {
          bookingId: id,
          name: dbData.name,
          email: dbData.email,
          age: dbData.age,
          seatType: dbData.seatType,
          showtime: dbData.showtime,
          numSeats: dbData.numSeats,
          price: dbData.price,
          bookingDateTime: localBookingDateTime,
        };
        setBookingDetails(details);
        sessionStorage.setItem(`booking_${id}`, JSON.stringify(details));
      } catch (err) {
        console.error("Error fetching booking details:", err);
        if (retries > 0) {
          setTimeout(() => fetchBookingDetails(id, retries - 1), 2000);
        } else {
          setError("❌ Failed to fetch booking details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!bookingId) {
      setError("❌ Booking ID is missing. Unable to fetch details.");
      setLoading(false);
      return;
    }
    fetchBookingDetails(bookingId);
  }, [bookingId, fetchBookingDetails]);

  // Dynamic particle count
  useEffect(() => {
    const updateParticleCount = () => {
      setParticleCount(window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 35 : 50);
    };
    updateParticleCount();
    window.addEventListener("resize", updateParticleCount);
    return () => window.removeEventListener("resize", updateParticleCount);
  }, []);

  // Generate QR code data
  const generateQRData = (details) => {
    return JSON.stringify({
      bookingId: details.bookingId,
      name: details.name,
      email: details.email,
      age: details.age,
      seatType: details.seatType,
      showtime: details.showtime,
      numSeats: details.numSeats,
      price: details.price,
      bookingDateTime: details.bookingDateTime,
    });
  };

  // Advanced PDF generation
  const downloadTicket = async () => {
    if (!ticketRef.current || !bookingDetails) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#1F2937",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth() - 20;
      const height = (canvas.height * width) / canvas.width;

      pdf.setFillColor(31, 41, 55);
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), "F");
      pdf.addImage(imgData, "PNG", 10, 10, width, height, "", "FAST");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(251, 146, 60);
      pdf.text(`IMAX Ticket - Booking #${bookingDetails.bookingId}`, 10, height + 20);
      pdf.save(`IMAX_Ticket_${bookingDetails.bookingId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("❌ Failed to download ticket. Please retry.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Share ticket via Web Share API
  const shareTicket = async () => {
    if (!bookingDetails) return;
    setIsSharing(true);

    try {
      const shareData = {
        title: "IMAX Ticket Confirmation",
        text: `Your ticket for ${bookingDetails.showtime} is confirmed!\nName: ${bookingDetails.name}\nSeats: ${bookingDetails.numSeats}\nTotal: ₹${bookingDetails.price}`,
        url: window.location.href,
      };
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Sharing not supported on this device. Copy the details manually.");
      }
    } catch (error) {
      console.error("Error sharing ticket:", error);
      setError("❌ Failed to share ticket. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 },
    },
  };
  const particleVariants = {
    initial: { opacity: 0, scale: 0, rotate: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      rotate: [0, 180],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-3xl font-semibold text-orange-400 animate-pulse tracking-wide">Crafting Your Ticket...</p>
          <div className="mt-6 flex justify-center gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-5 bg-orange-500 rounded-full shadow-lg"
                animate={{ y: [-15, 15, -15], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          className="p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-500/30 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaExclamationTriangle className="text-orange-500 text-5xl mb-4 mx-auto" />
          <p className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">{error}</p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Home <FaHome className="inline ml-2" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const qrData = generateQRData(bookingDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex justify-center items-center p-6 sm:p-10 relative overflow-hidden">
      {/* Particle Effects */}

      {/* Main Confirmation Card */}
      <motion.div
        className="bg-gray-900/95 backdrop-blur-3xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-orange-500/40 max-w-md w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6 text-center tracking-tight">
          Booking Confirmed
        </h2>
        <p className="text-gray-300 text-center mb-8 font-medium tracking-wide">
          Your premium cinematic journey is secured!
        </p>

        {/* Ticket Details */}
        <div
          id="ticketDetails"
          ref={ticketRef}
          className="bg-gray-800/80 p-6 rounded-2xl shadow-inner border border-orange-500/50"
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <QRCodeSVG
              value={qrData}
              size={130}
              bgColor="#1F2937"
              fgColor="#F97316"
              level="H"
              includeMargin={true}
            />
          </motion.div>
          <h3 className="text-xl font-semibold text-orange-400 mb-4 text-center tracking-wide">
            <FaCheckCircle className="inline mr-2" /> Ticket Details
          </h3>
          <div className="space-y-3 text-sm sm:text-base font-medium">
            <p><span className="text-orange-500">Name:</span> {bookingDetails.name}</p>
            <p><span className="text-orange-500">Email:</span> {bookingDetails.email}</p>
            <p><span className="text-orange-500">Age:</span> {bookingDetails.age}</p>
            <p><span className="text-orange-500">Seat Type:</span> {bookingDetails.seatType}</p>
            <p><span className="text-orange-500">Seats:</span> {bookingDetails.numSeats}</p>
            <p><span className="text-orange-500">Showtime:</span> {bookingDetails.showtime}</p>
            <p><span className="text-orange-500">Booked:</span> {new Date(bookingDetails.bookingDateTime).toLocaleString()}</p>
            <p><span className="text-orange-500">Total:</span> ₹{bookingDetails.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 relative z-20">
          <motion.button
            onClick={downloadTicket}
            disabled={isDownloading}
            className={`w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              isDownloading ? "opacity-50 cursor-not-allowed" : "hover:from-orange-700 hover:to-orange-800"
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 146, 60, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload className="inline mr-2" /> {isDownloading ? "Generating..." : "Download Ticket"}
          </motion.button>
          <motion.button
            onClick={shareTicket}
            disabled={isSharing}
            className={`w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              isSharing ? "opacity-50 cursor-not-allowed" : "hover:from-green-700 hover:to-green-800"
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShareAlt className="inline mr-2" /> {isSharing ? "Sharing..." : "Share Ticket"}
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome className="inline mr-2" /> Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Error Boundary Component
const ConfirmationWithBoundary = () => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("Uncaught error:", error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <motion.div
          className="p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-500/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaExclamationTriangle className="text-orange-500 text-5xl mb-4 mx-auto" />
          <p className="text-2xl font-bold text-orange-400 mb-6 tracking-wide">Something went wrong.</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reload Page
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <Confirmation />;
};

export default ConfirmationWithBoundary;
