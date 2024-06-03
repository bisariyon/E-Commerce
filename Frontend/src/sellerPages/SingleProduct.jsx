import React, { useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";

function SingleProduct() {
  const location = useLocation();
  const currentItem = location.state.currentItem;

  const params = useParams();
  const orderItemId = params.orderItemId;

  const [selectedStatus, setSelectedStatus] = useState(currentItem.status);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const updateStatus = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/v1/order-items/status/${orderItemId}`,
        { status },
        {
          withCredentials: true,
        }
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.error(error.response.data.message || error.response.data);
      setError(error.response.data.message || error.response.data);
      throw error.response;
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await updateStatus(selectedStatus);
      if (res.statusCode === 200) {
        setMessage("Status updated successfully");
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.message || error.response.data);
    }
  };

  return (
    <>
      <div className="bg-blue-200 px-4 text-xl mb-0">
        <Link to="/seller/orders">
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1717357419/zb86nifhiz6ggbnhckzd.png"
            alt="Bisariyon E-Com Logo"
            className="w-16 h-16 inline-block hover:scale-110 active:scale-100 transition-transform duration-100 ease-in-out"
          />
        </Link>
      </div>
      <div className=" bg-blue-200 flex items-center justify-center pb-10">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order ID: {currentItem.orderID}
            </h2>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ₹{currentItem.amount}
                </p>
                <p className="text-gray-700">
                  <strong>Order Date:</strong>{" "}
                  {new Date(currentItem.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {currentItem.status}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Product Details
              </h3>
              <div className="flex items-center mb-4">
                <img
                  src={currentItem.product.productImage}
                  alt={currentItem.product.title}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div>
                  <p className="text-gray-700">
                    <strong>Product ID:</strong> {currentItem.product._id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Title:</strong> {currentItem.product.title}
                  </p>
                  <p className="text-gray-700">
                    <strong>Price:</strong> ${currentItem.product.price}
                  </p>
                  <p className="text-gray-700">
                    <strong>Quantity:</strong> {currentItem.quantity}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                User Details
              </h3>
              <p className="text-gray-700">{currentItem.user.fullName}</p>
              <p className="text-gray-700">{currentItem.user.phone}</p>
              <p className="text-gray-700">{currentItem.user.email}</p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Address Details
              </h3>
              <p className="text-gray-700">
                {currentItem.address.addressLine1},{" "}
                {currentItem.address.addressLine2}
              </p>
              <p className="text-gray-700">
                {currentItem.address.city}, {currentItem.address.state}
              </p>
              <p className="text-gray-700">{currentItem.address.pincode}</p>
              <p className="text-gray-700">{currentItem.address.country}</p>
            </div>
            {/* Dropdown menu for status update */}
            <div className="border-t border-gray-200 pt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Update Status
              </h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="mt-2 bg-blue-500 hover:bg-blue-600 active:scale-105 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>

              {message && <div className="text-green-600 mt-2">{message}</div>}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
