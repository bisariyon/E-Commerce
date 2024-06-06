import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function Categories() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("category");
  const [sortType, setSortType] = useState("1");

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/categories?page=${page}&limit=6&sortBy=${sortBy}&sortType=${sortType}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.log(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories", page, sortBy, sortType],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
  });

  const handleSortBy = (sortField) => {
    setSortBy(sortField);
    setPage(1); // Reset to the first page on sort change
  };

  const handleSortType = (type) => {
    setSortType(type);
    setPage(1); // Reset to the first page on sort change
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading categories..</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          Error fetching categories. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex">
        <div className="w-1/5 bg-gray-100 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Sort By</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              <input
                type="radio"
                name="sortBy"
                value="category"
                checked={sortBy === "category"}
                onChange={() => handleSortBy("category")}
                className="mr-2"
              />
              Category
            </label>
            <label className="block text-gray-700">
              <input
                type="radio"
                name="sortBy"
                value="createdAt"
                checked={sortBy === "createdAt"}
                onChange={() => handleSortBy("createdAt")}
                className="mr-2"
              />
              Creation Date
            </label>
            <label className="block text-gray-700">
              <input
                type="radio"
                name="sortBy"
                value="updatedAt"
                checked={sortBy === "updatedAt"}
                onChange={() => handleSortBy("updatedAt")}
                className="mr-2"
              />
              Last Updation
            </label>
          </div>
          <h2 className="text-2xl font-bold mb-4">Sort Type</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              <input
                type="radio"
                name="sortType"
                value="1"
                checked={sortType === "1"}
                onChange={() => handleSortType("1")}
                className="mr-2"
              />
              Ascending
            </label>
            <label className="block text-gray-700">
              <input
                type="radio"
                name="sortType"
                value="-1"
                checked={sortType === "-1"}
                onChange={() => handleSortType("-1")}
                className="mr-2"
              />
              Descending
            </label>
          </div>
        </div>
        <div className="w-4/5 bg-blue-300 rounded-lg shadow-md p-4">
          <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 px-8 p-6">
            {categories.docs.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition duration-300 ease-in-out"
                onClick={() =>
                  navigate(`/products?category=${category.category}`)
                }
              >
                <img
                  className="w-full h-48 object-cover"
                  src={category.imageUrl}
                  alt={category.category}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.category}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              className={`mx-1 px-4 py-2 bg-green-400 rounded ${
                !categories.hasPrevPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!categories.hasPrevPage}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="mx-1 px-4 py-2 bg-green-400">
              Page {categories.page} of {categories.totalPages}
            </span>
            <button
              className={`mx-1 px-4 py-2 bg-green-400 rounded ${
                !categories.hasNextPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!categories.hasNextPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
