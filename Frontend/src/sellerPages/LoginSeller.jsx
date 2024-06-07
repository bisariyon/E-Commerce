import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SellerLogo2 } from "../assets/imports/importImages";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setSeller } from "../store/SellerSlice";

import refreshSeller from "../utility/refreshSeller";

const LoginUser = () => {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        password: password,
      };

      if (loginType === "email") {
        requestBody.email = identifier;
      } else if (loginType === "phone") {
        requestBody.phone = identifier;
      }

      const response = await axios.post(
        "/v1/sellers/login",
        requestBody,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setError("");
        dispatch(setSeller(response.data.data.seller));
        navigate("/seller");
      }
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const handleForgotPassword = async () => {
    navigate("/#");
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-600 pb-8 pt-4">
      <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
          <img
            src={SellerLogo2}
            alt="Bisariyon E-Com Logo"
            className="w-[375px] h-[375px] object-cover shadow-md rounded-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-3">
            Sign in
          </h2>

          {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Login Type
              </label>
              <select
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                {loginType === "email" ? "Email" : "Phone Number"}
              </label>
              <input
                type={loginType === "email" ? "email" : "text"}
                placeholder={
                  loginType === "email"
                    ? "Enter your email"
                    : "Enter your phone number"
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label
                className="block text-blue-800 text-lg font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                onClick={() => handleForgotPassword()}
                className="text-blue-600 hover:underline text-sm font-semibold px-1"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="active:scale-95 w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
            >
              Sign In
            </button>
          </form>

          <div>
            <p className="mt-4 text-sm font-medium text-blue-700 text-center">
              By signing-in you agree to the BISARIYON E-COM Conditions of Use &
              Sale. Please see our Privacy Notice, our Cookies Notice and our
              Interest-Based Ads Notice.
            </p>
            <p className="mt-4 text-md text-center">
              New to Bisariyon E-Com?
              <Link
                to="/seller/register"
                className="text-green-500  hover:text-violet-500 font-semibold"
              >
                <span className="text-xl ml-2">Create an account</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
