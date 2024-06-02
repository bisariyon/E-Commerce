import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery ,QueryClient} from "@tanstack/react-query";

function Reviews() {
  const client = new QueryClient();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("1");
  const [editingReview, setEditingReview] = useState(null);
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState(null);
  const [errorMessages, setErrorMessages] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/reviews/getUserReviews?page=${page}&sortBy=${sortBy}&sortType=${sortType}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("E1", error.response.data.message);
      throw error.response.data.message;
    }
  };

  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews", page, sortBy, sortType],
    queryFn: fetchReviews,
    staleTime: 10,
    refetchInterval :10
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessages("");
      setSuccessMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [errorMessages, successMessage]);

  const updateReview = async (reviewId) => {
    const formData = new FormData();
    formData.append("comment", comments);
    formData.append("rating", rating);
    formData.append("images", images);

    try {
      const response = await axios.put(
        `http://localhost:8000/v1/reviews/updateReview/${reviewId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      setSuccessMessage("Review updated successfully!");
      return response.data.data;
    } catch (error) {
      console.error("E2", error.response.data.message);
      setErrorMessages(error.response.data.message);
      throw error.response.data.message;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/v1/reviews/deleteReview/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      setSuccessMessage("Review deleted successfully!");
      console.log("Review deleted successfully!", response.data.data);
      
    } catch (error) {
      console.error("E3", error.response.data.message);
      // setErrorMessages(error.response.data.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setComments(review.comment);
    setRating(review.rating);
    setImages(review.images);
  };

  const handleCancelEditClick = () => {
    setEditingReview(null);
    setComments("");
    setRating(0);
    setImages(null);
    setErrorMessages("");
    setSuccessMessage("");
  };

  const handleUpdateReviewSubmit = async (reviewId) => {
    await updateReview(reviewId);
    // Invalidate and refetch the query after updating
    fetchReviews();
    setEditingReview(null);
    setComments("");
    setRating(0);
    setImages(null);
  };

  if (isLoading) {
    return (
      <div className="text-blue-500 flex items-center justify-center text-5xl">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 flex items-center justify-center text-5xl">
        {error}
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-xl">
            {index < rating ? "🌟" : ""}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Reviews
      </h2>

      {errorMessages && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          {errorMessages}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mr-2"
        >
          <option value="createdAt">Date</option>
          <option value="rating">Rating</option>
        </select>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="1">Ascending</option>
          <option value="-1">Descending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 bg-gray-200 p-6 rounded-md md:grid-cols-2 lg:grid-cols-3 mx-6 my-4">
        {reviewsData.docs.map((review) => (
          <div
            key={review._id}
            className="bg-white flex flex-col items-center justify-center shadow-md rounded-lg p-6"
          >
            <div className="bg-gray-200 px-3 py-2 rounded-md flex flex-col items-center mb-4">
              <img
                src={review.product.productImage}
                alt={review.product.title}
                className="h-36 w-36 object-cover mb-4 rounded-md"
              />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {review.product.title}
              </h3>
            </div>
            {editingReview === review._id ? (
              <div className="w-full">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  rows="4"
                ></textarea>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="file"
                  onChange={(e) => setImages(e.target.files[0])}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => handleUpdateReviewSubmit(review._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditClick}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <p className="mb-2 text-sm">
                  Description:{" "}
                  <span className="text-md font-semibold">
                    {review.comment}
                  </span>
                </p>
                <div className="mb-2">{renderStars(review.rating)}</div>
                <p className="mb-2 text-sm">
                  Date:
                  <span className="text-md font-semibold">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <img
                  src={review.images}
                  alt={review.product.title}
                  className="w-24 h-24 object-cover rounded-md mb-2"
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!reviewsData.hasPrevPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="pt-2">
          Page {reviewsData.page} of {reviewsData.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!reviewsData.hasNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Reviews;
