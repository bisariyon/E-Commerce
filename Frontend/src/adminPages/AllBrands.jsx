import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import { useSelector } from "react-redux";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AllBrands() {
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
  const temBrand = new URLSearchParams(location.search).get("brand");
  const tempcategory = new URLSearchParams(location.search).get("category");

  const [page, setPage] = useState(1);
  const [brand, setBrand] = useState(temBrand || "");
  const [category, setCategory] = useState(tempcategory || "");
  const [editingBrandID, setEditingBrandID] = useState(null);
  const [editedBrand, setEditedBrand] = useState({});
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(Date.now());

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `/v1/brands/?page=${page}&limit=8&brand=${brand}&category=${category}&sortBy=_id&sortType=1,`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 4000);
  }, [error]);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["brands", page, brand, category, fetchKey],
    queryFn: fetchBrands,
    staleTime: 100,
    refetchOnWindowFocus: true,
  });

  const updateBrandBackend = async (updatedBrand) => {
    const { brandName, description } = updatedBrand;
    const body = { newName: brandName, newDescription: description };
    try {
      const response = await axios.patch(
        `/v1/brands/updateByID/${updatedBrand.brandID}`,
        body,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      setError(error.response.data.message || error.response.data);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrandID(brand.brandID);
    setEditedBrand(brand);
  };

  const handleCancel = () => {
    setEditingBrandID(null);
    setEditedBrand({});
  };

  const handleSave = async () => {
    const res = await updateBrandBackend(editedBrand);
    if (res?.statusCode === 200) {
      setFetchKey(Date.now());
      setEditingBrandID(null);
      setBrand(res.data._id); // Update the brand state with the updated ID
      navigate(`/admin/all-brands?brand=${res.data._id}`);
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
        <div className="text-3xl text-gray-700">Loading all Brands..</div>
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
    setBrand("");
    setCategory("");

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("brand");
    searchParams.delete("category");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <>
      {((category && tempcategory) || (brand && temBrand)) && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 mx-6 mt-4"
          onClick={handleResetFilters}
        >
          View All Brands
        </button>
      )}

      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md m-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold">
            {tempcategory || temBrand ? "Searched Brand" : "All Brands"}
          </h2>
          {error && <div className="text-red-500">{error}</div>}
          <button
            onClick={() => navigate("/admin/add-brand")}
            className="text-xxl font-semibold bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 active:scale-95"
          >
            Add New Brand
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6">
          {data &&
            data.docs.map((bran, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={bran.brandID}
                  className={`bg-${color}-100 p-4 rounded-lg shadow-lg border-t-4 border-${color}-500 relative`}
                >
                  <div className="absolute top-2 right-3">
                    <button
                      className="text-black cursor-pointer hover:scale-105"
                      onClick={() => handleEdit(bran)}
                    >
                      Update
                    </button>
                  </div>
                  {editingBrandID === bran.brandID ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          New Name
                        </label>
                        <input
                          type="text"
                          value={editedBrand.brandName}
                          onChange={(e) =>
                            setEditedBrand({
                              ...editedBrand,
                              brandName: e.target.value,
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
                          value={editedBrand.description}
                          onChange={(e) =>
                            setEditedBrand({
                              ...editedBrand,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
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
                      <div className="pl-2 mt-4 pt-2">
                        <div className="relative w-3/4">
                          <img
                            src={bran.logo}
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
                          <span className="font-medium">Brand ID:</span>{" "}
                          {bran.brandID}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Name:</span>{" "}
                          {bran.brandName}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Description:</span>{" "}
                          <span className="text-md">{bran.description}</span>
                        </div>
                        <div className="text-gray-700">
                          {bran.categories.length > 0 && (
                            <span className="font-medium">Categories:</span>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {bran.categories.length > 0 &&
                              bran.categories.map((cat) => (
                                <span
                                  key={cat.categoryID}
                                  className="bg-white text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 active:scale-95"
                                  onClick={() =>
                                    navigate(
                                      `/admin/all-subcategories?subCategoryId=${cat.categoryID}`
                                    )
                                  }
                                >
                                  {cat.categoryName}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-evenly items-center mt-4 gap-4">
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                          onClick={() =>
                            navigate(
                              `/admin/all-products?brandId=${bran.brandID}`
                            )
                          }
                        >
                          View Products Of This Brand
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
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <div className="bg-gray-200 py-3 px-4 rounded-md mx-4">
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

export default AllBrands;
