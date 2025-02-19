import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fade, setFade] = useState(false);
  const [accountBalance, setAccountBalance] = useState(null);
  const [pin, setPin] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setNickname(storedUser.nickname || "");
      setAge(storedUser.age || "");
      setGender(storedUser.gender || "");
      fetchBookingHistory(storedUser._id);
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setFade(true);
    setTimeout(() => setFade(false), 2500);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchBookingHistory = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {  // ✅ Now using "id" instead of "_id"
        console.error("User ID not found in localStorage:", storedUser);
        return;
      }
  
      console.log("Fetching history for user ID:", storedUser.id);
  
      const response = await axios.get(`http://localhost:5000/api/history/${storedUser.id}`);
      setBookingHistory(response.data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };
  

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setPreviewImage(URL.createObjectURL(file));
      showMessage("Profile image updated successfully!", "success");
    } catch (error) {
      showMessage("Error updating profile image!", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put("http://localhost:5000/profile", { nickname, age, gender }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      showMessage("Profile updated successfully!", "success");
    } catch (error) {
      showMessage("Error updating profile!", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/profile/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      showMessage("Password updated successfully!", "success");
    } catch (error) {
      showMessage("Incorrect old password!", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }
    const token = localStorage.getItem("token");

    try {
      await axios.delete("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      showMessage("Account deleted successfully!", "success");
      setTimeout(() => (window.location.href = "/signup"), 3000);
    } catch (error) {
      showMessage("Error deleting account!", "error");
    }
  };

  const handleVerifyPin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please log in first!", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/profile/balance",
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setAccountBalance(response.data.balance);
      showMessage("PIN verified successfully!", "success");
    } catch (error) {
      showMessage("Incorrect PIN!", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-orange-500 relative overflow-hidden">
      {/* Success & Error Message */}
      {message.text && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl border backdrop-blur-lg transition-all duration-500 ${fade ? "opacity-100 scale-100" : "opacity-0 scale-90"} ${message.type === "success" ? "bg-green-500/30 border-green-400 text-green-200" : "bg-red-500/30 border-red-400 text-red-200"}`}
          style={{ zIndex: 1000 }}
        >
          {message.text}
        </div>
      )}

      <div className="bg-black/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full sm:w-96 border border-white/20">
        <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>

        {user && (
          <>
            <div className="flex justify-center mb-4">
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
              <img
                src={previewImage || `http://localhost:5000${user.profileImage}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white cursor-pointer hover:scale-105 transition-transform"
                onClick={() => fileInputRef.current.click()}
              />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Name:</label>
                  <input type="text" className="w-full p-2 border rounded text-black bg-gray-300" value={user.name} readOnly />
                </div>

                <div>
                  <label className="block text-sm">Nickname:</label>
                  <input type="text" className="w-full p-2 border rounded text-black" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm">Age:</label>
                  <input type="number" className="w-full p-2 border rounded text-black" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm">Gender:</label>
                  <select className="w-full p-2 border rounded text-black" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Update Profile
              </button>
            </form>

            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="w-full bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700">
              Change Password
            </button>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                <input type="password" placeholder="Old Password" className="w-full p-2 border rounded text-black" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                <input type="password" placeholder="New Password" className="w-full p-2 border rounded text-black" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Update Password</button>
              </form>
            )}

            <button onClick={() => setShowDeleteModal(true)} className="w-full bg-red-600 text-white p-2 rounded mt-4 hover:bg-red-700">
              Delete Account
            </button>

            {/* Account Balance Section */}
            <div className="mt-4">
              <label className="block text-sm">Enter PIN to view Account Balance:</label>
              <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full p-2 border rounded text-black" />
              <button onClick={handleVerifyPin} className="w-full bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700">
                Verify PIN
              </button>
              {accountBalance !== null && <p className="mt-2 text-lg">Account Balance: ${accountBalance}</p>}
            </div>
          </>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-100 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black text-orange-500 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">Are you sure you want to delete your account?</h3>
              <p className="mb-4 text-sm">This action is irreversible and cannot be recovered.</p>
              <div className="space-x-4 flex justify-center">
                <button onClick={handleDeleteAccount} className="w-1/2 bg-red-600 text-white p-2 rounded hover:bg-red-700">
                  Delete Account
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-1/2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Footer Section */}
      <div className="mt-8 w-full text-center py-4 bg--800 text-white">
        <ul>
          <li><a href="/help" className="hover:text-blue-400">Help</a></li>
          <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
          <li><a href="/terms" className="hover:text-blue-400">Terms and Conditions</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
