import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import refreshSeller from "../utility/refreshSeller";
import {SellerLogo2} from "../assets/imports/importImages"

function BrandRequest() {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sentRequest = async () => {
    // console.log(brandName, description, category, logo);

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("logo", logo);

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/brands/request-brand",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Res", response.data.message);
      return response.data.message;
    } catch (error) {
      // console.error("Error : ", error.response.data.message);
      return error.response.data.message;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await sentRequest();

    if (res === "Request sent for brand creation") {
      setMessage("Brand Requested Successfully");
    } else {
      setError(res);
    }

    setBrandName("");
    setDescription("");
    setCategory("");
    setLogo(null);
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  }, [setMessage, setError, message, error]);

  return (
    <>
      <div className="bg-blue-200 px-4 pt-2 text-xl -mb-8">
        <Link to="/seller">
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1717357419/zb86nifhiz6ggbnhckzd.png"
            alt="Back"
            className="w-16 h-16 inline-block hover:scale-110 active:scale-100 transition-transform duration-100 ease-in-out"
          />
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-blue-200">
        <div className="w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
          <div className="md:flex">
            <div className="md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
              <div className="text-white text-center">
                <img
                  src={SellerLogo2}
                  alt="Product Image"
                  className="w-[375px] h-[375px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
                Brand Request
              </h2>
              <form
                onSubmit={handleRegister}
                className="bg-white rounded-lg shadow-md p-8"
              >
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Category
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    Give comma (,) separated values
                  </p>
                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Logo
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setLogo(e.target.files[0])}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  {message && <div className="text-green-600">{message}</div>}
                  {error && <div className="text-red-600">{error}</div>}
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 active:bg-blue-700 active:scale-95"
                >
                  Request Brand
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BrandRequest;
