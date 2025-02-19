import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    pin: "",
    profileImage: null,
    balance: 0,
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check if balance is a positive number
    if (user.balance < 0) {
      alert("Balance must be a positive number!");
      return;
    }

    // Check if pin is entered
    if (!user.pin) {
      alert("Pin is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("password", user.password);
    formData.append("pin", user.pin);
    formData.append("profileImage", user.profileImage);
    formData.append("balance", user.balance);

    try {
      await axios.post("http://localhost:5000/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-6">
      {/* Left Side - Sign Up Text */}
      <div className="w-full sm:w-1/2 text-center text-orange-500 font-bold text-4xl p-10 space-y-4">
        <h1 className="text-5xl font-semibold">Create Your Account</h1>
        <p className="text-lg">Join the best movie booking system!</p>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full sm:w-1/2 lg:w-1/3 bg-white bg-opacity-20 p-6 rounded-lg shadow-lg text-orange-500 backdrop-blur-lg">
        <h2 className="text-3xl font-semibold text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Personal Information */}
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
          />

          {/* Security, Money & Pin */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-orange-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Initial Balance"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, balance: parseFloat(e.target.value) })}
            required
            min="0"
          />
          <input
            type="text"
            placeholder="Pin"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setUser({ ...user, pin: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border border-orange-500 rounded-lg bg-transparent text-orange-500 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={handleImageChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-black p-3 rounded-lg font-bold hover:bg-orange-600 shadow-lg transform hover:scale-105 transition-transform duration-200 mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-orange-400">
          Already have an account?{" "}
          <span
            className="text-orange-300 cursor-pointer hover:underline font-semibold"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
