import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change if hosted online

// Authentication APIs
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/login`, userData);
};

// Fetch Movies
export const fetchMovies = async () => {
  return await axios.get(`${API_URL}/movies`);
};

// Fetch Movie Details by ID
export const fetchMovieById = async (movieId) => {
  return await axios.get(`${API_URL}/movies/${movieId}`);
};

// Book a Seat
export const bookSeat = async (bookingData) => {
  return await axios.post(`${API_URL}/bookings`, bookingData);
};

// Fetch Booked Seats for a Movie
export const getBookedSeats = async (movieId) => {
  return await axios.get(`${API_URL}/bookings/${movieId}`);
};
