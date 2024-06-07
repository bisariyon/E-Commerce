import React, { useState, useEffect } from "react";
import axios from "axios";
import { Admin2 } from "../assets/imports/importImages";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";import { useSelector } from "react-redux";


import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AddNewBrand() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.isAdmin;
 
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryIDs, setCategoryIDs] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `/v1/sub-categories/list`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
    }
  };

  const { data: categories } = useQuery({
    queryKey: "categories",
    queryFn: fetchCategories,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("logo", logo);
    formData.append("categoryIDs", categoryIDs);

    // for(let pair of formData.entries()) {
    //   console.log(pair[0]+ ', '+ pair[1]);
    // }

    try {
      const response = await axios.post(
        "/v1/brands/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setName("");
      setDescription("");
      setLogo(null);
      setCategoryIDs([]);
      setErrorMessage("");
      console.log(response.data.data._id);
      navigate(`/admin/all-brands?brand=${response.data.data._id}`);
    } catch (error) {
      // Handle error response
      console.error(error.response.data.message || error.response.data);
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
              className="w-[375px] h-[375px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
            Add New Brand
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-lg mb-4">{errorMessage}</p>
          )}

          <form onSubmit={handleFormSubmit} className="">
            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                Brand name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                Categories
              </label>
              <div className="flex flex-wrap">
                {categories &&
                  categories.map((category) => (
                    <label
                      key={category.categoryID}
                      className="inline-flex items-center mr-4 mb-2"
                    >
                      <input
                        type="checkbox"
                        value={category.categoryID}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategoryIDs((prevCategoryIDs) => [
                              ...prevCategoryIDs,
                              category.categoryID,
                            ]);
                          } else {
                            setCategoryIDs((prevCategoryIDs) =>
                              prevCategoryIDs.filter(
                                (id) => id !== category.categoryID
                              )
                            );
                          }
                        }}
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={categoryIDs.includes(category.categoryID)}
                      />
                      <span className="ml-2">{category.category}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-blue-800 text-lg font-semibold mb-2">
                Logo
              </label>
              <input
                type="file"
                onChange={(e) => setLogo(e.target.files[0])}
                className="w-full px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewBrand;
