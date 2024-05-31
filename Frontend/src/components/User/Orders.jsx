import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function Orders() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentReview, setCurrentReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState(null);

  const [error, setError] = useState("");

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/v1/orders", {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/order-items/${orderID}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      setError(error.message);
    }
  };

  const {
    data: orders,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
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
    setImages([]);
    setError("");
  };

  const handleReviewSubmit = async (productID) => {
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("images", images);

      const response = await axios.post(
        `http://localhost:8000/v1/reviews/addReview/${productID}`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Review submitted:", response.data);
      setCurrentReview(null);
      setRating("");
      setComment("");
      setImages([]);
    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.message);
    }
  };

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

  return (
    <div className="mx-auto p-4">
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
                            Product ID:
                          </span>{" "}
                          {item.productID._id}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Quantity:
                          </span>{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Amount:
                          </span>{" "}
                          ₹{item.amount}
                        </p>

                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">
                            Status:
                          </span>{" "}
                          {item.status}
                        </p>
                        {error && currentReview === item._id && (
                          <p className="text-red-500 my-2">{error}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      {currentReview === item._id ? (
                        <div className="mt-4 p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                          <div className="flex items-center">
                            <label className="text-sm font-semibold text-gray-900 mr-2">
                              Rating:
                            </label>
                            <select
                              name="rating"
                              value={rating || ""}
                              onChange={(e) => setRating(e.target.value)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="">Select</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-900">
                              Comment:
                            </label>
                            <textarea
                              name="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="w-full mt-2 p-2 border rounded"
                              placeholder="Write your review here..."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-900">
                              Upload Images:
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                setImages(e.target.files[0]);
                              }}
                              className="w-full mt-2 p-2 border rounded"
                            />
                          </div>

                          <div className="flex justify-between">
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
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddReviewClick(item._id)}
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Add Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Orders
          </h2>
          <div className="mb-10 px-2 pt-2 pb-4 rounded-lg bg-gray-100">
            <div className="space-y-8 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {orders &&
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-lg shadow-md p-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover hover transition-shadow duration-300"
                      onClick={() => handleOrderClick(order)}
                    >
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        Order {order._id}
                      </h3>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="w-full md:w-3/5 mb-4 md:mb-0">
                          <div className="flex flex-col mb-2">
                            <span className="text-sm text-white">
                              <span className="font-semibold">Order Date:</span>{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-white">
                              <span className="font-semibold">Status:</span>{" "}
                              {order.status}
                            </span>
                            <span className="text-sm text-white">
                              <span className="font-semibold">
                                Transaction ID:
                              </span>{" "}
                              {order.transactionID}
                            </span>
                            <span className="text-sm text-white">
                              <span className="font-semibold">
                                Total Amount: ₹
                              </span>
                              {order.total}
                            </span>
                          </div>
                        </div>
                        <div className="w-full md:w-2/5 mb-4 md:mb-0">
                          <div className="flex flex-col mb-2">
                            <span className="text-sm font-semibold text-white">
                              Address:
                            </span>
                            <span className="text-sm text-white">
                              {order.address.addressLine1},{" "}
                              {order.address.addressLine2}
                            </span>
                            <span className="text-sm text-white">
                              {order.address.city}, {order.address.state}
                            </span>
                            <span className="text-sm text-white">
                              {order.address.pincode}, {order.address.country}
                            </span>
                            <span className="text-sm text-white">
                              {order.address.contact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
