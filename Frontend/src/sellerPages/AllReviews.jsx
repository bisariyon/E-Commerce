import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function AllReviews() {
  const [page, setPage] = useState(1);
  const limit = 6;
  const sortBy = "_id";
  const sortType = "1";

  const fetchSellerReviews = async (page) => {
    try {
      const response = await axios.get(
        `/v1/reviews/getSellerReviews?limit=${limit}&page=${page}&sortBy=${sortBy}&sortType=${sortType}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response.data.message || error.response.data;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sellerReviews", page],
    queryFn: () => fetchSellerReviews(page),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Loading your product reviews...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Error loading reviews. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Reviews
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-green-200 p-8">
        {data.docs.map((review) => (
          <div
            key={review._id}
            className="rounded-lg shadow-md p-6 bg-white flex flex-col items-center"
          >
            <div className="flex flex-col items-center mb-4 bg-gray-200 p-4 rounded-md">
              <img
                src={review.product.productImage}
                alt={review.product.title}
                className="w-32 h-32 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {review.product.title}
              </h3>
            </div>
            <div className="border-t border-gray-200 pt-4 w-full">
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-gray-700 mr-2">
                  Description : {"  "}
                </span>
                <span className="text-md font-semibold text-gray-900">
                  {review.comment}
                </span>
              </div>
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-gray-700 mr-2">
                  Rating : {"  "}
                </span>
                <span className="text-md font-semibold text-gray-900">
                  {review.rating}
                </span>
              </div>
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-gray-700 mr-2">
                  Reviewed By <span className="text-xs">(username)</span>: 
                </span>
                <span className="text-md font-semibold text-gray-900">
                  {review.user.username}
                </span>
              </div>
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm font-semibold text-gray-900 mr-2">
                  Review Images
                </span>
              </div>
              {review.images && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={review.images}
                    alt="Review Image"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: data.totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`mx-1 px-4 py-2 rounded ${
                page === pageNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default AllReviews;
