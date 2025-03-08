import React, { useState } from "react"; // Added useState
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

const App = () => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(true); // Added state for audio control

  // Hide Navbar on /admin, /movies/:id, /series/:id, /kids/:id, /BookingPage, /BookingForm, /Confirmation
  const hideNavbar =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/movies/") ||
    location.pathname.startsWith("/series/") ||
    location.pathname.startsWith("/kids/") ||
    location.pathname === "/BookingForm" ||
    location.pathname === "/Confirmation";

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

        <Route path="/admin" element={<AdminPanel />} /> {/* Admin Page */}
        <Route path="/BookingPage" element={<BookingPage />} />
        <Route path="/BookingForm" element={<BookingForm />} />
        <Route path="/Confirmation" element={<Confirmation />} />
      </Routes>
    </>
  );
};

export default App;
