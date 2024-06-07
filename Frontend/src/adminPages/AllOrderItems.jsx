import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";
import { useSelector } from "react-redux";

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

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("_id");
  const [sortType, setSortType] = useState(1);
  const [user, setUser] = useState(tempUser || "");
  const [seller, setSeller] = useState(tempSeller || "");
  const [status, setStatus] = useState("");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const [tempBefore, setTempBefore] = useState("");
  const [tempAfter, setTempAfter] = useState("");

  const [showSelectedOrder, setShowSelectedOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, [page]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `/v1/order-items?page=${page}&sortBy=${sortBy}&sortType=${sortType}&user=${user}&seller=${seller}&status=${status}&before=${before}&after=${after}&limit=8`,
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
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "allOrders",
      page,
      sortBy,
      sortType,
      user,
      seller,
      status,
      before,
      after,
    ],
    queryFn: fetchAllOrders,
  });

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
        <div className="text-3xl text-gray-700">Loading all OrderItems..</div>
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
  if (isError) return <div>Error: {error}</div>;

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
    setStatus("");
    setBefore("");
    setAfter("");
    setTempAfter("");
    setTempBefore("");
    setSortBy("_id");
    setSelectedOrder(null);
    setShowSelectedOrder(false);

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("user");
    searchParams.delete("seller");
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  console.log(orders);

  return (
    <div className="flex">
      {/* Sidebar */}
      {!showSelectedOrder && (
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
          {/* <div className="mb-4">
          <label className="block text-sm font-medium">User</label>
          <input
            type="text"
            value={user}
            onChange={handleFilterChange(setUser)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Seller</label>
          <input
            type="text"
            value={seller}
            onChange={handleFilterChange(setSeller)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div> */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={handleFilterChange(setStatus)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
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
              <label className="block text-gray-700 mb-2">Orders Before</label>
              <input
                type="date"
                value={tempBefore}
                onChange={(e) => setTempBefore(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Orders After</label>
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
        {!showSelectedOrder ? (
          <>
            <div className="grid gap-x-4 gap-y-2 m-4">
              {orders &&
                orders.docs.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-center items-center p-4 border border-gray-300 rounded-lg mb-4 bg-white">
                      {/* Details Section */}
                      <div className="flex-1 flex flex-col items-start mx-4">
                        <p className="text-lg font-semibold">
                          Order Item ID: {order._id}
                        </p>
                        <p>
                          Created At:{" "}
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </p>
                        {tempSeller && (
                          <p>
                            Seller: {order.seller_fullName} (
                            {order.seller_email})
                          </p>
                        )}
                        {tempUser && (
                          <p>
                            User: {order.user_fullName} ({order.user_email})
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setShowSelectedOrder(true);
                            setSelectedOrder(order);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                        >
                          View Order Item
                        </button>
                      </div>

                      {/* Image Section */}
                      <div className="mx-4 flex flex-col items-center">
                        <img
                          src={order.product_productImage}
                          alt={order.product_title}
                          className="w-28 h-28 object-cover rounded-md"
                        />
                      </div>

                      {/* Status Section */}
                      <div className="flex-1 flex flex-col items-center mx-4">
                        <img
                          src={
                            order.status === "delivered"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/iesbrwt25sydygmpda8e.jpg"
                              : order.status === "shipped"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/e7koh4z8xiv57sed4udf.jpg"
                              : order.status === "cancelled"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/a6qg2kdqh6g5tln4jz7q.jpg"
                              : "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/tu25xiut6lrqyrhzhkxe.jpg"
                          }
                          alt="Order Status"
                          className="w-3/5"
                        />
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
                {page} of {orders.totalPages}
              </div>

              <button
                disabled={orders && orders.nextPage === null}
                onClick={() => setPage(page + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-blue-600 active:scale-95"
              >
                Next Page
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-8 pb-8 mx-2">
            <button
              onClick={() => setShowSelectedOrder(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
            >
              Back to Orders
            </button>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Selected Order Details
            </h2>

            {/* Grid Container */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Order Details Card */}
              <div className="bg-blue-100 p-4 rounded-lg shadow-lg border-t-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Order Details
                </h3>
                <div className="pl-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Order ID:</span>{" "}
                    {selectedOrder.order_id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    {selectedOrder.status}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Transaction Id:</span>{" "}
                    {selectedOrder.order_transactionID}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Mode of Payment:</span>{" "}
                    {selectedOrder.payment_modeOfPayment}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Total:</span> $
                    {selectedOrder.amount}
                  </p>
                </div>
              </div>

              {/* User Details Card */}
              <div className="bg-green-100 p-4 rounded-lg shadow-lg border-t-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  User Details
                </h3>
                <div className="pl-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Full Name:</span>{" "}
                    {selectedOrder.user_fullName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Username:</span>{" "}
                    {selectedOrder.user_username}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.user_email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.user_phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Verified:</span>{" "}
                    {selectedOrder.user_verified ? "True" : "False"}
                  </p>
                  <div className="flex justify-start items-center mt-4 gap-4">
                    <button
                      className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 active:scale-95`}
                      onClick={() =>
                        navigate(
                          `/admin/all-users?user=${selectedOrder.user_id}`
                        )
                      }
                    >
                      View User
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Details Card */}
              <div className="bg-yellow-100 p-4 rounded-lg shadow-lg border-t-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                  Address Details
                </h3>
                <div className="pl-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Address Line 1:</span>{" "}
                    {selectedOrder.address_addressLine1}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Address Line 2:</span>{" "}
                    {selectedOrder.address_addressLine2}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">City:</span>{" "}
                    {selectedOrder.address_city}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">State:</span>{" "}
                    {selectedOrder.address_state}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Pincode:</span>{" "}
                    {selectedOrder.address_pincode}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Country:</span>{" "}
                    {selectedOrder.address_country}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Contact:</span>{" "}
                    {selectedOrder.address_contact}
                  </p>
                </div>
              </div>

              {/* Product Details Card */}
              <div className="bg-purple-100 p-4  rounded-lg shadow-lg border-t-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-700 mb-2 mx-4">
                  Product Details
                </h3>
                <div className="pl-2 flex items-center justify-around">
                  <div className="mr-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Title:</span>{" "}
                      {selectedOrder.product_title}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Price:</span> $
                      {selectedOrder.product_price}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Quantity:</span>
                      {selectedOrder.quantity}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Quantity In Stock:</span>{" "}
                      {selectedOrder.product_quantityInStock}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Category:</span>{" "}
                      {selectedOrder.product_category}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Brand:</span>{" "}
                      {selectedOrder.product_brand}
                    </p>
                  </div>
                  <img
                    src={selectedOrder.product_productImage}
                    alt={selectedOrder.product_title}
                    className="w-24 h-24 object-cover rounded-md mb-8"
                  />
                </div>
                <div className="flex justify-start items-center mt-4 gap-4 pl-4">
                  <button
                    className={`bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 active:scale-95`}
                    onClick={() =>
                      navigate(
                        `/admin/all-products?product=${selectedOrder.product_id}`
                      )
                    }
                  >
                    View Product
                  </button>
                </div>
              </div>

              {/* Seller Details Card */}
              <div className="bg-red-100 p-4 rounded-lg shadow-lg border-t-4 border-red-500">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  Seller Details
                </h3>
                <div className="pl-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Full Name:</span>{" "}
                    {selectedOrder.seller_fullName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.seller_email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.seller_phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">GST Number:</span>{" "}
                    {selectedOrder.seller_GSTnumber}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Verified:</span>{" "}
                    {selectedOrder.seller_verified ? "True" : "False"}
                  </p>
                  <div className="flex justify-start items-center mt-4 gap-4 ">
                    <button
                      className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 active:scale-95`}
                      onClick={() =>
                        navigate(
                          `/admin/all-sellers?seller=${selectedOrder.seller_id}`
                        )
                      }
                    >
                      View Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllOrderItems;
