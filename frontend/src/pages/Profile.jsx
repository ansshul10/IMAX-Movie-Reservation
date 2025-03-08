import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaLock, FaTrash, FaWallet } from "react-icons/fa";

// Memoized FormInput Component
const FormInput = memo(({ label, name, type = "text", value, onChange, readOnly = false }) => {
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-orange-200 mb-1">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full p-3 bg-black/50 border border-orange-700 rounded-xl text-orange-200 placeholder-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
        autoComplete="off"
      />
    </div>
  );
});

const Profile = () => {
  // State Management
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    age: "",
    gender: "",
    oldPassword: "",
    newPassword: "",
    pin: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [accountBalance, setAccountBalance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  // Initialize User Data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        nickname: storedUser.nickname || "",
        age: storedUser.age || "",
        gender: storedUser.gender || "",
        oldPassword: "",
        newPassword: "",
        pin: "",
      });
    }
  }, []);

  // Memoized Message Handler
  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  }, []);

  // Memoized Input Handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handlers
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://imax-movie-reservation.onrender.com/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setPreviewImage(URL.createObjectURL(file));
      showMessage("Profile image updated!", "success");
    } catch (error) {
      showMessage("Error updating image!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        "https://imax-movie-reservation.onrender.com/profile",
        { nickname: formData.nickname, age: formData.age, gender: formData.gender },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      showMessage("Profile updated!", "success");
    } catch (error) {
      showMessage("Error updating profile!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "https://imax-movie-reservation.onrender.com/profile/password",
        { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setShowPasswordForm(false);
      setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
      showMessage("Password updated!", "success");
    } catch (error) {
      showMessage("Incorrect old password!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.delete("https://imax-movie-reservation.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      showMessage("Account deleted!", "success");
      setTimeout(() => (window.location.href = "/signup"), 2000);
    } catch (error) {
      showMessage("Error deleting account!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPin = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://imax-movie-reservation.onrender.com/profile/balance",
        { pin: formData.pin },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setAccountBalance(response.data.balance);
      showMessage("PIN verified!", "success");
    } catch (error) {
      showMessage("Incorrect PIN!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-950 text-orange-200 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-gradient-to-tr from-orange-500/10 via-black/10 to-orange-700/10 animate-gradient-xy" />
        <div className="absolute w-72 h-72 bg-orange-500/20 rounded-full top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-orange-700/20 rounded-full bottom-10 right-10 animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48Y2lyY2xlIGN4PSIyLjUiIGN5PSIyLjUiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-10" />
      </div>

      {/* Notification */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl border z-50 max-w-xs w-full ${message.type === "success" ? "bg-green-600/90 border-green-400" : "bg-red-600/90 border-red-400"}`}
          >
            <p className="text-center text-orange-200">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6 md:p-8 mt-16 md:mt-20"
      >
        <div className="bg-black/70 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-orange-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Profile Dashboard
          </h2>

          {user && (
            <>
              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <img
                    src={previewImage || `https://imax-movie-reservation.onrender.com${user.profileImage}`}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-500/50 cursor-pointer transition-all duration-300 shadow-lg"
                    onClick={() => fileInputRef.current.click()}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormInput label="Name" name="name" value={user.name} onChange={handleInputChange} readOnly />
                  <FormInput label="Nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} />
                  <FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
                  <div className="relative">
                    <label className="block text-sm font-medium text-orange-200 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-black/50 border border-orange-700 rounded-xl text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-black p-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaUserCircle /> Update Profile
                    </>
                  )}
                </motion.button>
              </form>

              {/* Password Section */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full bg-orange-800/80 text-orange-200 p-3 rounded-xl mt-6 font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <FaLock /> Change Password
              </motion.button>

              <AnimatePresence>
                {showPasswordForm && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleChangePassword}
                    className="mt-6 space-y-4"
                  >
                    <FormInput label="Old Password" name="oldPassword" type="password" value={formData.oldPassword} onChange={handleInputChange} />
                    <FormInput label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} />
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 text-orange-200 p-3 rounded-xl font-semibold shadow-md"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Balance Section */}
              <div className="mt-6 bg-black/30 p-4 sm:p-6 rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-300">
                  <FaWallet /> Account Balance
                </h3>
                <FormInput label="Enter PIN" name="pin" value={formData.pin} onChange={handleInputChange} />
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleVerifyPin}
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-black p-3 rounded-xl mt-4 font-semibold shadow-md"
                >
                  {isLoading ? "Verifying..." : "Verify PIN"}
                </motion.button>
                {accountBalance !== null && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-xl font-bold text-orange-400"
                  >
                    Balance: ${accountBalance.toFixed(2)}
                  </motion.p>
                )}
              </div>

              {/* Delete Account */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-600/90 text-orange-200 p-3 rounded-xl mt-6 font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <FaTrash /> Delete Account
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-black/90 p-6 sm:p-8 rounded-2xl shadow-2xl border border-orange-800/50 max-w-md w-full"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-red-400">Confirm Deletion</h3>
              <p className="mb-6 text-orange-300 text-sm sm:text-base">This action is permanent. Proceed?</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 text-orange-200 p-3 rounded-xl font-semibold shadow-md"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-orange-800 text-orange-200 p-3 rounded-xl font-semibold shadow-md"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 bg-black/70 text-center text-orange-400">
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          {["Help", "Contact", "Terms"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="hover:text-orange-300 transition-colors duration-300 text-sm sm:text-base"
            >
              {item}
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs sm:text-sm">© 2025 iMax. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
