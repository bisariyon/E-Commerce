import React, { useState } from "react";
import { Logout as LogoutLogo } from "../../assets/imports/importImages";

function Logout() {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    // Your logout logic here
    // For demonstration purposes, setLogoutSuccess is called after 2 seconds
    setTimeout(() => {
      setLogoutSuccess(true);
    }, 2000);
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
