import React, { useState ,useEffect} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

const ForgetPassword = () => {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const fullPath = window.location.href;
  const location = useLocation();
  const initialPath = fullPath.replace(location.pathname, "") + "/";

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const sendPasswordLink = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/users/change-password-reset-link",
        {
          email: email,
          redirectURL: initialPath + "user/new-password",
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Email sent successfully");
        // navigate("/user/new-password/:token");
      }
    } catch (error) {
      console.error("Email sending failed: ", error);
      setError(error.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordLink();
    setSubmitted(true);
  };

  return (
    <>
      {error ? (
        <div className="bg-red-100 min-h-screen text-xl py-2 rounded relative w-full flex flex-col items-center justify-center">
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => window.location.reload()}
          >
            Go back
          </button>
        </div>
      ) : (
        <div className="min-h-full flex items-center justify-center bg-gray-600 pb-8 pt-4">
          <div className="flex flex-wrap w-full md:w-1/2 max-w-4xl bg-gray-200 shadow-lg overflow-hidden my-8">
            <img
              src="https://res.cloudinary.com/deepcloud1/image/upload/v1716732730/e3bpxofvly0q3bidlbbr.jpg"
              alt="Bisariyon E-Com Logo"
              className="w-[300px] h-[300px] object-cover shadow-md"
            />

            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
                Forget Password
              </h2>

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-blue-800 text-lg font-bold mb-2">
                      Enter your email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <div className="text-center mt-8 flex">
                  <p className="text-xl text-cyan-600 font-semibold">
                    A link has been sent to your email. Click on the link to
                    change your password.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
