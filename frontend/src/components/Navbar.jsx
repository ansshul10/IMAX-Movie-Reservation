import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fade, setFade] = useState(false); // For fade-in/fade-out effect
  const navigate = useNavigate();

  // Load user data from localStorage and update the state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sign Out function
  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // Clear user state
    navigate("/signin");
  };

  // Handle Profile Image Click to Toggle Dropdown
  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
    setFade(true); // Start fade-in effect

    // Automatically close the dropdown after 3 seconds
    setTimeout(() => {
      setFade(false);
      setTimeout(() => setDropdownOpen(false), 300); // Delay to allow fade-out
    }, 3000); // Close after 3 seconds
  };

  // Update user state when a user signs in
  const handleSignIn = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <nav className="bg-black text-orange-500 py-4 px-6 flex items-center justify-between">
      {/* Left Side - Logo & Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold flex items-center">
          Movies <span className="ml-1">🎬</span>
        </Link>
        <Link to="/" className="hover:text-orange-300">Home</Link>
        <Link to="/series" className="hover:text-orange-300">Series</Link>
        <Link to="/movies" className="hover:text-orange-300">Movies</Link>
        <Link to="/kids" className="hover:text-orange-300">Kids</Link>
        <Link to="/BookingPage" className="hover:text-orange-300">Book Ticket</Link>
      </div>

      {/* Right Side - Profile Image & Dropdown */}
      <div className="flex items-center space-x-4 relative">
        {user ? (
          <div className="relative">
            {/* Profile Image with fallback */}
            <img
              src={`https://imax-movie-reservation.onrender.com${user.profileImage || '/uploads/default-profile.png'}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-white"
              onClick={handleProfileClick}
            />

            {/* Dropdown Menu with fade-in and fade-out */}
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 bg-white/10 backdrop-blur-lg text-black p-4 rounded-lg shadow-lg w-48 z-50 transition-all duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Username directly below the image */}
                <div className="flex flex-col items-center mt-2">
                  <p className="text-sm text-gray-500">Hey, {user.nickname || user.name}!</p>
                </div>

                <hr className="my-2" />

                <button
                  className="w-full text-left text-blue-600 hover:underline"
                  onClick={() => navigate("/profile")}
                >
                  Edit Profile
                </button>

                <button
                  className="w-full text-left text-red-600 hover:underline mt-2"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin">
            <FaUserCircle size={28} className="cursor-pointer hover:text-gray-400" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
