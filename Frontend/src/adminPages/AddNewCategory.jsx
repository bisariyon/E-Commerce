import React, { useState } from "react";
import axios from "axios";
import { Admin2 } from "../assets/imports/importImages";
import { useNavigate } from "react-router-dom";

function AddNewCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send data as multipart/form-data
    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/categories/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCategory("");
      setDescription("");
      setImage(null);
      setErrorMessage("");
      navigate(`/admin/all-categories?category=${response.data.data._id}`);
    } catch (error) {
      // Handle error response
      console.error("Error adding category:", error);
      setErrorMessage(error.response.data.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-blue-200 pb-8 ">
      <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
          <div className="text-white text-center">
            <img
              src={Admin2}
              alt="Product Image"
              className="w-[375px] h-[375px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
            />
          </div>
        </div>
        <div className="w-1/2 md:w-1/2 p-8">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
            Add New Category
          </h2>
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Category Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full h-32"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Category Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>
            {errorMessage && (
              <div className="mb-4 p-2 rounded-lg text-red-500">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 active:bg-blue-700 active:scale-95 mt-4"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewCategory;
