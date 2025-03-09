// frontend/src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowDown, FaBars, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = ({ isMuted, setIsMuted }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (label, path) => {
    setActiveSection(label);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Series", path: "/series" },
    { label: "Movies", path: "/movies" },
    { label: "Kids", path: "/kids" },
    { label: "Book Ticket", path: "/BookingPage" },
    { label: "Chat", path: "/chat" }, // Added Chat link
  ];

  return (
    <motion.nav
      className="bg-gradient-to-r from-black via-gray-900 to-black text-orange-500 py-2 px-6 fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-md border-b border-orange-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-orange-300 transition-colors duration-300 relative group"
            onClick={() => handleNavClick("Home", "/")}
          >
            <span className="relative">
              {activeSection}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-1 bg-orange-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </span>
          </Link>

          <div className="hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.path}
                  className="text-base font-medium hover:text-orange-300 transition-colors duration-300 relative group"
                  onClick={() => handleNavClick(item.label, item.path)}
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mute/Unmute Button */}
          <motion.button
            className="p-1.5 bg-gray-800/80 rounded-full text-orange-500 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-md"
            onClick={() => {
              if (typeof setIsMuted === "function") {
                setIsMuted((prev) => !prev);
              } else {
                console.error("setIsMuted is not a function. Ensure it is passed from App.jsx.");
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.div
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button onClick={toggleMobileMenu} className="text-orange-500 focus:outline-none">
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </motion.div>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
              >
                <img
                  src={
                    user.profileImage
                      ? user.profileImage // Updated to use base64 string directly
                      : "/uploads/default-profile.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/50 shadow-md transition-all duration-300 hover:shadow-lg hover:border-orange-400"
                  onError={(e) => (e.target.src = "/uploads/default-profile.png")}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-500 opacity-0 blur-md transition-opacity duration-300"
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.div>

              {dropdownOpen && !mobileMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-xl text-orange-400 p-4 rounded-xl shadow-2xl w-56 z-50 border border-orange-500/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex flex-col items-center mb-3">
                    <p className="text-sm font-semibold text-orange-300">
                      Hey, {user.nickname || user.name}!
                    </p>
                    <motion.div
                      className="w-16 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 mt-1"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <motion.button
                    className="w-full text-left text-orange-400 hover:text-orange-300 font-medium py-1 transition-colors duration-300 flex items-center gap-2 text-sm"
                    onClick={() => navigate("/profile")}
                    whileHover={{ x: 5 }}
                  >
                    <FaUserCircle /> Edit Profile
                  </motion.button>
                  <motion.button
                    className="w-full text-left text-orange-400 hover:text-red-400 font-medium py-1 transition-colors duration-300 flex items-center gap-2 text-sm"
                    onClick={handleSignOut}
                    whileHover={{ x: 5 }}
                  >
                    <FaArrowDown /> Sign Out
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/signin">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <FaUserCircle
                  size={28}
                  className="text-orange-500 hover:text-orange-300 transition-colors duration-300 drop-shadow-md"
                />
              </motion.div>
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-lg text-orange-500 p-4 absolute top-full left-0 w-full shadow-lg border-t border-orange-500/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block py-2 text-base font-medium hover:text-orange-300 transition-colors duration-300"
              onClick={() => handleNavClick(item.label, item.path)}
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/signin"
              className="block py-2 text-base font-medium hover:text-orange-300 transition-colors duration-300"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
