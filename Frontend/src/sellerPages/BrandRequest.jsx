import React, { useEffect, useState } from "react";
import axios from "axios";
import refreshSeller from "../utility/refreshSeller";

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
      <div className="text-center text-3xl font-bold text-slate-600 my-4">
        New Brand Creation Request
      </div>
      {message && (
        <div className="text-center text-lg text-green-600">{message}</div>
      )}
      {error && <div className="text-center text-lg text-red-600">{error}</div>}
      <form
        onSubmit={handleRegister}
        encType="multipart/form-data"
        className="max-w-lg mx-auto p-6 shadow-md rounded-lg bg-gray-200 my-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Brand Name
          </label>
          <input
            type="text"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Logo</label>
          <input
            type="file"
            placeholder="Logo"
            onChange={(e) => setLogo(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-700 active:scale-95"
        >
          Request Brand
        </button>
      </form>
    </>
  );
}

export default BrandRequest;
