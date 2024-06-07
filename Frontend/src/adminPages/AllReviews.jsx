import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";
function AllOrderItems() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const userRedux = useSelector((state) => state.user.user);
  const isAdmin = userRedux?.isAdmin;

  const navigate = useNavigate();
  const location = useLocation();

  const tempSeller = new URLSearchParams(location.search).get("seller");
  const tempUser = new URLSearchParams(location.search).get("user");
  const tempProduct = new URLSearchParams(location.search).get("product");
  const tempReview = new URLSearchParams(location.search).get("review");

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("_id");
  const [sortType, setSortType] = useState(1);

  const [user, setUser] = useState(tempUser || "");
  const [seller, setSeller] = useState(tempSeller || "");
  const [product, setProduct] = useState(tempProduct || "");
  const [review, setReview] = useState(tempReview || "");

  const [status, setStatus] = useState("");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const [tempBefore, setTempBefore] = useState("");
  const [tempAfter, setTempAfter] = useState("");

  const [showSelectedReview, setShowSelectedReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get(
        `/v1/reviews/getAdminReviews?page=${page}&sortBy=${sortBy}&sortType=${sortType}&user=${user}&seller=${seller}&status=${status}&before=${before}&after=${after}&limit=8&product=${product}&review=${review}`,
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

  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "allReviews",
      page,
      sortBy,
      sortType,
      user,
      seller,
      status,
      before,
      after,
      product,
    ],
    queryFn: fetchAllReviews,
  });

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleApplyRange = () => {
    if (tempAfter) setAfter(tempAfter);
    if (tempBefore) setBefore(tempBefore);
  };

  const handleRemoveRange = () => {
    setAfter("");
    setBefore("");
    setTempAfter("");
    setTempBefore("");
  };

  const handleResetFilters = () => {
    setUser("");
    setSeller("");
    setProduct("");
    setStatus("");
    setBefore("");
    setAfter("");
    setTempAfter("");
    setTempBefore("");
    setSortBy("_id");
    setSelectedReview(null);
    setShowSelectedReview(false);

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("user");
    searchParams.delete("seller");
    searchParams.delete("product");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };
  const renderStars = (rating) => {
    return (
      <span className="flex">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-md">
            {index < rating ? "🌟" : ""}
          </span>
        ))}
      </span>
    );
  };

  // console.log(reviews);
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
        <div className="text-3xl text-gray-700">Loading all Reviews..</div>
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
          {error || "An error occurred. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      {!showSelectedReview && (
        <div className="w-1/4 p-4 bg-white m-4 ">
          <div>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
              onClick={() => handleResetFilters()}
            >
              Reset Filters
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={handleFilterChange(setSortBy)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="_id">ID</option>
              <option value="createdAt">Created At</option>
              {/* Add more sorting options as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Sort Type</label>
            <select
              value={sortType}
              onChange={handleFilterChange(setSortType)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="1">
                {sortBy === "createdAt" ? "Oldest First" : "Ascending"}
              </option>
              <option value="-1">
                {sortBy === "createdAt" ? "Latest First" : "Descending"}
              </option>
            </select>
          </div>
          <div className="bg-gray-200 p-4 rounded-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reviews Before</label>
              <input
                type="date"
                value={tempBefore}
                onChange={(e) => setTempBefore(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reviews After</label>
              <input
                type="date"
                value={tempAfter}
                onChange={(e) => setTempAfter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleApplyRange}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Set Date Range
              </button>
              <button
                onClick={handleRemoveRange}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove Date
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="w-full p-4 bg-blue-200">
        {!showSelectedReview ? (
          <>
            <div className="grid gap-x-4 gap-y-2 m-4">
              {reviews &&
                reviews.docs.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-center items-center p-4 border border-gray-300 rounded-lg mb-4 bg-white">
                      <div className="flex-1 flex flex-col items-start mx-4">
                        <p className="text-lg font-semibold">
                          Review Item ID: {review._id}
                        </p>
                        <p>
                          Created At:{" "}
                          {new Date(review.createdAt).toLocaleString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </p>
                        {tempSeller && (
                          <p>
                            Seller: {review.seller.fullName} (
                            {review.seller.email})
                          </p>
                        )}
                        {tempUser && (
                          <p>
                            User: {review.user.fullName} ({review.user.email})
                          </p>
                        )}
                        {tempUser && <p>Product: {review.product.title}</p>}
                        <button
                          onClick={() => {
                            setShowSelectedReview(true);
                            setSelectedReview(review);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                        >
                          View Review
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col items-start mx-4">
                        <p className="">Product : {review.product.title}</p>
                        <p>User : {review.user.fullName}</p>
                      </div>

                      <div className="mx-4 flex flex-col items-center">
                        <img
                          src={review.product.productImage}
                          alt={review.product.title}
                          className="w-28 h-28 object-cover rounded-md"
                        />
                        <p className="text-xs">Product Image</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 disabled:opacity-40 hover:bg-blue-600 active:scale-95"
              >
                Previous Page
              </button>

              <div className="px-4 py-2">
                {page} of {reviews.totalPages}
              </div>

              <button
                disabled={reviews && reviews.nextPage === null}
                onClick={() => setPage(page + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-blue-600 active:scale-95"
              >
                Next Page
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-8 pb-8 mx-2">
              <button
                onClick={() => setShowSelectedReview(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
              >
                Back to Reviews
              </button>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Selected Review Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-blue-100 p-4 rounded-lg shadow-lg border-t-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    Review Details
                  </h3>
                  <div className="pl-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Review ID:</span>{" "}
                      {selectedReview._id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Comment:</span>{" "}
                      {selectedReview.comment}
                    </p>
                    <p className="text-gray-700 flex">
                      <span className="font-medium">Ratings:</span>
                      {renderStars(selectedReview.rating)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Date of review:</span>{" "}
                      {new Date(selectedReview.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg shadow-lg border-t-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                    Review Image
                  </h3>
                  <div className="pl-2 flex justify-center items-center">
                    <img
                      src={selectedReview.images}
                      alt="Review Image"
                      className="w-40 h-40 object-cover rounded-md mb-4"
                    />
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg shadow-lg border-t-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    User Details
                  </h3>
                  <div className="pl-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Full Name:</span>{" "}
                      {selectedReview.user.fullName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Username:</span>{" "}
                      {selectedReview.user.username}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedReview.user.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedReview.user.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Verified:</span>{" "}
                      {selectedReview.userverified ? "True" : "False"}
                    </p>
                    <div className="flex justify-start items-center mt-4 gap-4">
                      <button
                        className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 active:scale-95`}
                        onClick={() =>
                          navigate(
                            `/admin/all-users?user=${selectedReview.user._id}`
                          )
                        }
                      >
                        View User
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 p-4  rounded-lg shadow-lg border-t-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-700 mb-2 ">
                    Product Details
                  </h3>
                  <div className="pl-2 flex">
                    <div className="mr-4">
                      <p className="text-gray-700">
                        <span className="font-medium">Title:</span>{" "}
                        {selectedReview.product.title}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Price:</span> $
                        {selectedReview.product.price}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity In Stock:</span>{" "}
                        {selectedReview.product.quantityInStock}
                      </p>
                    </div>
                    <img
                      src={selectedReview.product.productImage}
                      alt={selectedReview.product.title}
                      className="w-24 h-24 object-cover rounded-md ml-auto -mt-5"
                    />
                  </div>
                  <div className="flex justify-start items-center gap-4 pl-2">
                    <button
                      className={`bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 active:scale-95 mt-4`}
                      onClick={() =>
                        navigate(
                          `/admin/all-products?product=${selectedReview.product._id}`
                        )
                      }
                    >
                      View Product
                    </button>
                  </div>
                </div>

                <div className="bg-red-100 p-4 rounded-lg shadow-lg border-t-4 border-red-500">
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    Seller Details
                  </h3>
                  <div className="pl-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Full Name:</span>{" "}
                      {selectedReview.seller.fullName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedReview.seller.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedReview.seller.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Verified:</span>{" "}
                      {selectedReview.seller_verified ? "True" : "False"}
                    </p>
                    <div className="flex justify-start items-center mt-4 gap-4">
                      <button
                        className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 active:scale-95`}
                        onClick={() =>
                          navigate(
                            `/admin/all-sellers?seller=${selectedReview.seller._id}`
                          )
                        }
                      >
                        View Seller
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllOrderItems;
