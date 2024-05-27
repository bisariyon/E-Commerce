import React, { useState } from "react";

function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: "Laptop",
      rating: 4,
      description: "Great laptop, works well for my needs.",
    },
    {
      id: 2,
      productName: "Smartphone",
      rating: 5,
      description: "Fantastic smartphone, highly recommend!",
    },
    {
      id: 3,
      productName: "Headphones",
      rating: 3,
      description: "Decent headphones, but could be better.",
    },
  ]);

  const [editReview, setEditReview] = useState({
    id: null,
    rating: null,
    description: "",
  });

  const handleEditReview = (id, rating, description) => {
    setEditReview({ id, rating, description });
  };

  const handleSaveReview = () => {
    const updatedReviews = reviews.map((review) =>
      review.id === editReview.id
        ? {
            ...review,
            rating: editReview.rating,
            description: editReview.description,
          }
        : review
    );
    setReviews(updatedReviews);
    setEditReview({ id: null, rating: null, description: "" });
  };

  const handleCancelEdit = () => {
    setEditReview({ id: null, rating: null, description: "" });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Reviews
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {review.productName}
            </h3>
            <div className="flex flex-col mb-4">
              <span className="font-semibold">Rating:</span>
              {editReview.id === review.id ? (
                <div className="flex items-center">
                  <div className="w-full">
                    <input
                      type="number"
                      value={editReview.rating}
                      onChange={(e) =>
                        setEditReview({ ...editReview, rating: e.target.value })
                      }
                      className="rounded-md border bg-purple-200 border-gray-300 py-3 px-4 text-gray-700 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
                  <p className="text-md text-gray-700 font-semibold">
                    {review.rating}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <span className="font-semibold">Description:</span>
              {editReview.id === review.id ? (
                <input
                  type="text"
                  value={editReview.description}
                  onChange={(e) =>
                    setEditReview({
                      ...editReview,
                      description: e.target.value,
                    })
                  }
                  className="rounded-md border bg-purple-200 border-gray-300 py-3 px-4 text-gray-700 focus:outline-none focus:border-purple-500"
                />
              ) : (
                <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
                  <p className="text-md text-gray-700 font-semibold">
                    {review.description}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              {editReview.id === review.id ? (
                <>
                  <button
                    onClick={handleSaveReview}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    handleEditReview(
                      review.id,
                      review.rating,
                      review.description
                    )
                  }
                  className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
