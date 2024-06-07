import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsPencilSquare } from "react-icons/bs";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AllCategories() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.isAdmin;

  const navigate = useNavigate();
  const location = useLocation();
  const tempsubCategory = new URLSearchParams(location.search).get(
    "subCategory"
  );
  const tempcategory = new URLSearchParams(location.search).get("category");

  const [page, setPage] = useState(1);
  const [subCategory, setSubCategory] = useState(tempsubCategory || "");
  const [category, setCategory] = useState(tempcategory || "");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(Date.now());
  const [image, setImage] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `/v1/categories/all/admin?page=${page}&limit=8&subCategory=${subCategory}&category=${category}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const updateCategory = async (updatedCategory) => {
    const { category: newCategory, categoryDescription: newDescription } =
      updatedCategory;
    const body = { newCategory, newDescription };
    try {
      const response = await axios.put(
        `/v1/categories/update/${updatedCategory._id}`,
        body,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      setError(error.response.data.message || error.response.data);
    }
  };

  const updateImage = async (id) => {
    const formData = new FormData();
    formData.append("image", image);
    for (let key of formData.entries()) {
      console.log(key);
    }
    try {
      const response = await axios.put(
        `/v1/categories/update/image/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setFetchKey(Date.now());
      return response.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      setError(error.response.data.message || error.response.data);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, [error, setError]);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["categories", page, subCategory, category, fetchKey],
    queryFn: fetchCategories,
    staleTime: 100,
    refetchOnWindowFocus: true,
  });

  const handleImageChange = async (id, e) => {
    const file = e.target.files[0];
    setImage(file);
    try {
      const res = await updateImage(id);
      if (res.statusCode === 200) {
        alert("Image updated successfully");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      setError(error.message || "An error occurred while updating the image.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditedCategory(category);
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setEditedCategory({});
  };

  const handleSave = async () => {
    const res = await updateCategory(editedCategory);
    if (res.statusCode === 200) {
      setFetchKey(Date.now());
      setEditingCategoryId(null);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading all users..</div>
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
          {fetchError || "An error occurred. Please try again later."}
        </div>
      </div>
    );
  }

  const colors = [
    "blue",
    "green",
    "red",
    "purple",
    "red",
    "purple",
    "blue",
    "green",
  ];

  const handleResetFilters = () => {
    setSubCategory("");
    setCategory("");

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("category");
    searchParams.delete("subCategory");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <>
      {((category && tempcategory) || (subCategory && tempsubCategory)) && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 mx-6 mt-4"
          onClick={handleResetFilters}
        >
          View All Categories
        </button>
      )}

      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md m-6 ">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold">
            {tempcategory || tempsubCategory
              ? "Searched Category"
              : "All Categories"}
          </h2>
          {error && <div className="text-red-500">{error}</div>}

          <button
            onClick={() => navigate("/admin/add-category")}
            className="text-xxl font-semibold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 active:scale-95"
          >
            Add New Category
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6 ">
          {data &&
            data.docs.map((category, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={category._id}
                  className={`bg-${color}-100 p-4 rounded-lg shadow-lg border-t-4 border-${color}-500 relative`}
                >
                  <div className="absolute top-2 right-3">
                    <button
                      className="text-black cursor-pointer"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                  </div>
                  {editingCategoryId === category._id ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          New Name
                        </label>
                        <input
                          type="text"
                          value={editedCategory.category}
                          onChange={(e) =>
                            setEditedCategory({
                              ...editedCategory,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          New Description
                        </label>
                        <textarea
                          value={editedCategory.categoryDescription}
                          onChange={(e) =>
                            setEditedCategory({
                              ...editedCategory,
                              categoryDescription: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>{" "}
                      <div className="flex justify-end gap-2">
                        <button
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 active:scale-95"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pl-2 ">
                        <div className="relative w-3/4">
                          <img
                            src={category.categoryImage}
                            alt="Category Image"
                            className="mx-4 mr-auto mb-2 rounded-full w-40 h-40 "
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                          >
                            <BsPencilSquare className="absolute bottom-2 right-4 text-gray-700 hover:text-blue-700 size={16}" />
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleImageChange(category._id, e)}
                          />
                        </div>

                        <div className="text-gray-700">
                          <span className="font-medium">Category ID:</span>{" "}
                          {category._id}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Name:</span>{" "}
                          {category.category}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Description:</span>{" "}
                          {category.categoryDescription}
                        </div>

                        <div className="text-gray-700">
                          {category.subCategories.length > 0 && (
                            <span className="font-medium">Subcategories:</span>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {category.subCategories.length > 0 &&
                              category.subCategories.map((subCat) => (
                                <span
                                  key={subCat.subCategoryId}
                                  className={`bg-white text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 active:scale-95`}
                                  onClick={() =>
                                    navigate(
                                      `/admin/all-subcategories?subCategoryId=${subCat.subCategoryId}`
                                    )
                                  }
                                >
                                  {subCat.subCategory}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-evenly items-center mt-4 gap-4">
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95 hover:scale-105`}
                          onClick={() =>
                            navigate(
                              `/admin/all-sellers?category=${category._id}`
                            )
                          }
                        >
                          View Sellers
                        </button>
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95 hover:scale-105`}
                          onClick={() =>
                            navigate(
                              `/admin/all-products?categoryId=${category._id}`
                            )
                          }
                        >
                          View Products
                        </button>
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95 hover:scale-105`}
                          onClick={() =>
                            navigate(
                              `/admin/all-subcategories?categoryId=${category._id}`
                            )
                          }
                        >
                          View SubCat
                        </button>
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95 hover:scale-105`}
                          onClick={() =>
                            navigate(
                              `/admin/add-subcategory?category=${category._id}&name=${category.category}`
                            )
                          }
                        >
                          Add SubCat
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95 "
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <div className="bg-gray-200 py-3 px-4  rounded-md mx-4">
            Page {page} of {data.totalPages}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
            disabled={data && !data.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default AllCategories;
