import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Orders() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentReview, setCurrentReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState(null);

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("-1");

  const [messages, setMessages] = useState("");

  const queryClient = useQueryClient();

  const fetchUserOrders = async ({ queryKey }) => {
    const [, page, sortBy, sortType] = queryKey;
    const response = await axios.get(
      `http://localhost:8000/v1/orders?page=${page}&sortBy=${sortBy}&sortType=${sortType}&limit=6`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  }; //working

  const fetchOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/order-items/${orderID}`,
        {
          withCredentials: true,
        }
      );
      console.log("Order details:", response.data.data);
      return response.data.data;
    } catch (error) {
      setError(error.message);
    }
  }; //workings

  const {
    data: ordersData,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["userOrders", page, sortBy, sortType],
    queryFn: fetchUserOrders,
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (selectedOrder) {
      fetchOrderDetails(selectedOrder._id)
        .then((details) => setOrderDetails(details))
        .catch((error) => console.error(error));
    }
  }, [selectedOrder]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleBackClick = () => {
    setSelectedOrder(null);
    setOrderDetails([]);
    setError("");
  };

  const handleAddReviewClick = (itemID) => {
    setCurrentReview((prevReview) => (prevReview === itemID ? null : itemID));
    setError("");
  };

  const handleCancelReviewClick = () => {
    setCurrentReview(null);
    setRating("");
    setComment("");
    setImages(null);
    setError("");
  };

  const handleReviewSubmit = async (productID) => {
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const response = await axios.post(
        `http://localhost:8000/v1/reviews/addReview/${productID}`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Review submitted:", response.data);
      setMessages("Review submitted successfully!");
      // Clear the message after 3-4 seconds
      setTimeout(() => {
        setMessages("");
      }, 3000);

      setCurrentReview(null);
      setRating("");
      setComment("");
      setImages(null);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);

      // Clear the error after 3-4 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (e) => {
    const [sortField, sortOrder] = e.target.value.split(",");
    console.log(sortField, sortOrder);
    setSortBy(sortField);
    setSortType(sortOrder);
    setPage(1); // Reset to first page on sort change
  };

  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError.message}</div>;
  }

  const { docs: orders, totalPages } = ordersData;

  if (orders && orders.length === 0) {
    return (
      <div className="mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Orders
        </h2>
        <div className="flex items-center justify-center p-4 rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            You have not placed any orders yet.
          </h3>
        </div>
      </div>
    );
  }

  // console.log("Orders:", orderDetails);
  return (
    <div className="mx-auto p-4">
      {messages && (
        <div className="text-2xl grid justify-center items-center text-green-500 mb-4">
          {messages}
        </div>
      )}

      {selectedOrder ? (
        <div className="mb-10 p-8 pt-6 rounded-lg bg-gray-100">
          <button
            onClick={handleBackClick}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back
          </button>
          <div className="rounded-lg shadow-md p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Order {selectedOrder._id}
            </h3>
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="w-full md:w-3/5 mb-4 md:mb-0">
                  <div className="flex flex-col mb-2">
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        Order Date:
                      </span>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        Status:
                      </span>{" "}
                      {selectedOrder.status}
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        Transaction ID:
                      </span>{" "}
                      {selectedOrder.transactionID}
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        Total Amount: ₹
                      </span>
                      {selectedOrder.total}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-2/5 mb-4 md:mb-0">
                  <div className="flex flex-col mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Address:
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedOrder.address.addressLine1},{" "}
                      {selectedOrder.address.addressLine2}
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedOrder.address.city},{" "}
                      {selectedOrder.address.state}
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedOrder.address.pincode},{" "}
                      {selectedOrder.address.country}
                    </span>
                    <span className="text-sm text-gray-700">
                      {selectedOrder.address.contact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Order Details
              </h4>

              <div className="mb-4 space-y-4">
                {orderDetails.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.productID.productImage}
                        alt={item.productID.title}
                        className="w-24 h-24 object-cover rounded mr-4"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Product:
                          </span>{" "}
                          {item.productID.title}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Quantity:
                          </span>{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Price:
                          </span>{" "}
                          ₹{item.productID.price}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Product status
                          </span>{" "}
                          {item.status}
                        </p>
                      </div>
                    </div>
                    {currentReview === item._id ? (
                      <div className="mt-4">
                        <h5 className="text-md font-semibold text-gray-900 mb-2">
                          Write a Review
                        </h5>
                        <div className="mt-2 mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Rating:
                          </label>
                          <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded"
                          >
                            <option value="">Select a rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>
                        <div className="mt-2 mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Comment:
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="block w-full mt-1 p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="mt-2 mb-4">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Upload Images:
                          </label>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => setImages(e.target.files)}
                            className="block w-full mt-1 p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleReviewSubmit(item.productID._id)
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={handleCancelReviewClick}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        </div>
                        {error && (
                          <div className="mt-2 text-red-600">{error}</div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          onClick={() => handleAddReviewClick(item._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Orders
          </h2>
          <div className="mb-4 flex justify-end items-center">
            <label htmlFor="sort" className="text-gray-700 font-semibold mr-4">
              Sort By:
            </label>
            <select
              id="sort"
              value={`${sortBy},${sortType}`}
              onChange={handleSortChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="createdAt,1">Oldest</option>
              <option value="createdAt,-1">Newest</option>
              <option value="total,-1">Highest Total</option>
              <option value="total,1">Lowest Total</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg shadow-md p-6 bg-white cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Order {order._id}
                </h3>
                <div className="flex flex-col mb-2">
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      Order Date:
                    </span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Status:</span>{" "}
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      Transaction ID:
                    </span>{" "}
                    {order.transactionID}
                  </span>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">
                      Total Amount: ₹
                    </span>
                    {order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            {totalPages &&
              Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
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
      )}
    </div>
  );
}

export default Orders;
