import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import SeriesList from "./pages/SeriesList";
import SeriesDetails from "./pages/SeriesDetails";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Kids from "./pages/Kids";
import KidsDetail from "./pages/KidsDetail";
import AdminPanel from "./pages/AdminPanel";
import BookingPage from "./pages/BookingPage";
import BookingForm from "./pages/BookingForm";
import Confirmation from "./pages/Confirmation";
import ResetPassword from "./pages/ResetPassword"; // Import the new ResetPassword component

const App = () => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(true);

  // Hide Navbar on /admin, /movies/:id, /series/:id, /kids/:id, /BookingPage, /BookingForm, /Confirmation, /reset-password/:token
  const hideNavbar =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/movies/") ||
    location.pathname.startsWith("/series/") ||
    location.pathname.startsWith("/kids/") ||
    location.pathname === "/BookingForm" ||
    location.pathname === "/Confirmation" ||
    location.pathname.startsWith("/reset-password/"); // Added reset-password route

  return (
    <>
      {!hideNavbar && <Navbar isMuted={isMuted} setIsMuted={setIsMuted} />}
      <Routes>
        <Route path="/" element={<Home isMuted={isMuted} setIsMuted={setIsMuted} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />

        {/* Movies Routes */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* Series Routes */}
        <Route path="/series" element={<SeriesList />} />
        <Route path="/series/:id" element={<SeriesDetails />} />

        {/* Kids Routes */}
        <Route path="/kids" element={<Kids />} />
        <Route path="/kids/:id" element={<KidsDetail />} />

        {/* Admin and Booking Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/BookingPage" element={<BookingPage />} />
        <Route path="/BookingForm" element={<BookingForm />} />
        <Route path="/Confirmation" element={<Confirmation />} />

        {/* Reset Password Route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
