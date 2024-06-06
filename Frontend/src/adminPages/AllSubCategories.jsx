import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function AllSubCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const tempsubCategory = new URLSearchParams(location.search).get(
    "subCategoryId"
  );
  const tempcategory = new URLSearchParams(location.search).get("categoryId");

  const [page, setPage] = useState(1);
  const [subCategory, setSubCategory] = useState(tempsubCategory || "");
  const [category, setCategory] = useState(tempcategory || "");
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [editedSubCategory, setEditedSubCategory] = useState({});
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(Date.now());

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/sub-categories/get/?page=${page}&limit=8&subCategory=${subCategory}&category=${category}`,
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

  const updateSubCat = async (updatedSubCategory) => {
    const { subCategory: newSubCategory, subCategoryDescription: description } =
      updatedSubCategory;
    const body = { newSubCategory, description };
    try {
      const response = await axios.put(
        `http://localhost:8000/v1/sub-categories/update/${updatedSubCategory.subCategoryID}`,
        body,
        {
          withCredentials: true,
        }
      );
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
  }, [error]);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["subCategories", page, subCategory, category, fetchKey],
    queryFn: fetchSubCategories,
    staleTime: 100,
  });

  const handleEdit = (subCategory) => {
    setEditingSubCategoryId(subCategory.subCategoryID);
    setEditedSubCategory(subCategory);
  };

  const handleCancel = () => {
    setEditingSubCategoryId(null);
    setEditedSubCategory({});
  };

  const handleSave = async () => {
    const res = await updateSubCat(editedSubCategory);
    if (res?.statusCode === 200) {
      setEditingSubCategoryId(null);
      setSubCategory(res.data._id);
      navigate(`/admin/all-subcategories?subCategoryId=${res.data._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Loading all subcategories..
        </div>
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
          View All SubCategories
        </button>
      )}

      <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md m-6 ">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold">
            {tempcategory || tempsubCategory
              ? "Searched SubCategory"
              : "All SubCategories"}
          </h2>
          {error && <div className="text-red-500">{error}</div>}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6 ">
          {data &&
            data.docs.map((subcat, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={subcat.subCategoryID}
                  className={`bg-${color}-100 p-4 rounded-lg shadow-lg border-t-4 border-${color}-500 relative`}
                >
                  <div className="absolute top-2 right-3">
                    <button
                      className="text-black cursor-pointer hover:scale-105"
                      onClick={() => handleEdit(subcat)}
                    >
                      Update
                    </button>
                  </div>
                  {editingSubCategoryId === subcat.subCategoryID ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          New Name
                        </label>
                        <input
                          type="text"
                          value={editedSubCategory.subCategory}
                          onChange={(e) =>
                            setEditedSubCategory({
                              ...editedSubCategory,
                              subCategory: e.target.value,
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
                          value={editedSubCategory.subCategoryDescription}
                          onChange={(e) =>
                            setEditedSubCategory({
                              ...editedSubCategory,
                              subCategoryDescription: e.target.value,
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
                      <div className="pl-2 ">
                        <div className="text-gray-700">
                          <span className="font-medium">SubCategory ID:</span>{" "}
                          {subcat.subCategoryID}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Name:</span>{" "}
                          {subcat.subCategory}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Description:</span>{" "}
                          {subcat.subCategoryDescription}
                        </div>
                        <div className="text-gray-700">
                          <span className="font-medium">Category:</span>{" "}
                          {subcat.category}
                        </div>
                      </div>

                      <div className="flex justify-evenly items-center mt-4 gap-4">
                        <button
                          className={`bg-${color}-500 text-white py-2 px-4 rounded-lg hover:bg-${color}-600 active:scale-95`}
                          onClick={() =>
                            navigate(
                              `/admin/all-products?subCategoryId=${subcat.subCategoryID}`
                            )
                          }
                        >
                          View Products Of This SubCat
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

export default AllSubCategories;
