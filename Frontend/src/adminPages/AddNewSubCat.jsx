import React, { useState, useEffect } from "react";
import axios from "axios";
import { Admin2 } from "../assets/imports/importImages";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AddNewSubCat() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);
  
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.isAdmin;
  

  const location = useLocation();
  const CategoryId = new URLSearchParams(location.search).get("category");
  const CategoryName = new URLSearchParams(location.search).get("name");

  const navigate = useNavigate();
  const [category, setCategory] = useState(CategoryName);
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const body = {
      category,
      subCategory: subcategory,
      description,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/sub-categories/create",
        body,
        {
          withCredentials: true,
        }
      );

      setSubcategory("");
      setDescription("");
      setErrorMessage("");
      navigate(`/admin/all-categories?category=${CategoryId}`);
    } catch (error) {
      // Handle error response
      console.error("Error adding subcategory:", error);
      setErrorMessage(error.response.data.message || "An error occurred.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 pt-4 p-8">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717435538/sonr99spyfca75ignfhc.png"
          alt="Wrong Domain"
          className="max-w-full h-auto"
        />
        <h1 className="text-4xl font-bold mb-4">
          You have entered the wrong domain
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-blue-200 pb-8 ">
      <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
          <div className="text-white text-center">
            <img
              src={Admin2}
              alt="Product Image"
              className="w-[350px] h-[350px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            New SubCategory
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-lg mb-4">{errorMessage}</p>
          )}

          <form onSubmit={handleFormSubmit} className="">
            <div className="mb-6">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                SubCategory Name
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                SubCategory Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add SubCategory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewSubCat;
