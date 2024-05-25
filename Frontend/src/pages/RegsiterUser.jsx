import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Logo2 } from "../assets/imports/importImages";
import { useDispatch } from "react-redux";
import { setUser } from "../store/UserSlice";

function RegisterUser() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/users/register",
        formData,
        { withCredentials: true }
      );
      console.log("User registered:", response.data);
      return response.data;
      // dispatch(setUser(response.data.data));
      // navigate("/");
    } catch (error) {
      throw error;
      // setError(error.response?.data?.message || "Registration failed");
    }
  };
  const { mutate, isPending, isError, isSuccess} = useMutation({
    mutationFn: registerUser,
  });

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering user...");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("avatar", avatar);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    mutate(formData, {
      onSuccess: (data) => {
        console.log("Registration successful :", data);
        dispatch(setUser(data.data));
        navigate("/");

      },
      onError: (error) => {
        // console.error("Error registering user 2:", error.response.data.message);
        setError(error.response.data.message || "Registration failed");
      }

    });
  };

  {
    isPending && (
      <p className="text-blue-500 text-lg">Registering...</p>
    );
  }
  {
    isSuccess && (
      <p className="text-green-500 text-lg">Registration successful</p>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-slate-600 ">
      <div className="flex flex-wrap w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden my-8">
        <div className="w-full md:w-1/2 p-5 flex flex-col items-center bg-blue-400">
          <img
            src={Logo2}
            alt="Bisariyon E-Com Logo"
            className="w-[375px] h-[375px] object-cover shadow-md rounded-xl"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-6">
            Sign Up
          </h2>
          {error && <p className="text-red-500 text-lg mb-4">{error}</p>}
          <form onSubmit={handleRegister} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Email
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
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-blue-800 text-lg font-bold mb-2">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
          <div>
            <p className="mt-4 text-sm text-blue-700 text-center">
              By signing-up you agree to the BISARIYON E-COM Conditions of Use &
              Sale. Please see our Privacy Notice, our Cookies Notice and our
              Interest-Based Ads Notice.
            </p>
            <p className="mt-4 text-md text-center">
              Already have an account?
              <Link
                to="/user/login"
                className="text-green-500  hover:text-violet-500 font-semibold"
              >
                <span className="text-xl ml-2">Sign in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
