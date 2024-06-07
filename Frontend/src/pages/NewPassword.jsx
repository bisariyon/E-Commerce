import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function NewPassword() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const backendReq = async (data) => {
    try {
      const response = await axios.post(
        `/v1/users/resetpassword/${token}`,
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // console.log("Password changed successfully");
        navigate("/user/login");
      }
    } catch (error) {
      // console.log(error.response.data.message);
      setError(error.response.data.message);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    backendReq();
    // Add your logic here to handle password submission
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-600 pb-8 pt-4">
      <div className="flex flex-wrap md:w-1/3 max-w-4xl bg-gray-200 shadow-lg rounded-xl overflow-hidden my-8">
        <div className="w-full p-8">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-2">
            New Password
          </h2>
          {error && (
            <p className="text-red-500 text-center text-lg mb-2">
              Error : {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 active:scale-95 transition-transform"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
