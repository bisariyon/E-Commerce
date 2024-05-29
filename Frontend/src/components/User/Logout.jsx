import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutLogo } from "../../assets/imports/importImages";
import { setUser } from "../../store/UserSlice";
import { setBasket } from "../../store/BasketSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

function Logout() {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Logout successful");
        dispatch(setUser(null));
        dispatch(setBasket([]));
        setLogoutSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Logout failed: ", error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}
      {logoutSuccess ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <img src={LogoutLogo} alt="Logout" className="mb-8" />
            <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">
              Logout Successful
            </h2>
            <p className="text-gray-700 text-center">
              You have been successfully logged out. Thank you for using our
              service.
            </p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Logout
          </h2>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Logout;
