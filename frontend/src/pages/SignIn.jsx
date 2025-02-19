import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const jokes = [
  "Welcome back! Time to unlock the secret world. Let’s get you inside!"
];

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // For the login message
  const navigate = useNavigate();

  // Randomly select a joke
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signin", user);

      // Save token and user data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Save user data

      setMessage("Great job! You’re in! 🔓");
      // Navigate to home and reload the page
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100); // Small delay ensures the navigation is completed before reload
    } catch (err) {
      setMessage("Oops! Wrong password or user not registered. Try again! 😜");
    }
  };

  return (
    <div className="flex justify-between items-center min-h-screen bg-black">
      {/* Left side - Joke */}
      <div className="w-1/2 text-center text-orange-500 font-semibold text-2xl p-10 space-y-4">
        <p>{randomJoke}</p>
      </div>

      {/* Right side - Sign In Form */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 text-orange-500 m-10">
        <h2 className="text-3xl font-bold text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-black p-3 rounded-lg font-bold hover:bg-orange-600 shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Response Message */}
        {message && (
          <div
            className={`mt-4 text-center font-semibold rounded-lg p-4 ${
              message.includes("Oops!") ? "bg-red-500" : "bg-green-500"
            } text-white`}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: message.includes("Oops!") ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)"
            }}
          >
            {message}
          </div>
        )}

        {/* Sign Up Link */}
        <p className="text-center text-orange-400 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-300 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
