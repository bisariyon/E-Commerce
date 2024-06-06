import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

function AllOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const tempUser = new URLSearchParams(location.search).get("user");

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("_id");
  const [sortType, setSortType] = useState(1);
  const [user, setUser] = useState(tempUser || "");
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
        `http://localhost:8000/v1/orders/all?page=${page}&sortBy=${sortBy}&sortType=${sortType}&user=${user}&status=${status}&before=${before}&after=${after}&limit=5`,
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
      status,
      before,
      after,
    ],
    queryFn: fetchAllOrders,
  });

  if (isLoading) return <div>Loading...</div>;
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
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleSelectedOrder = (order) => {
    setShowSelectedOrder(true);
    setSelectedOrder(order);
    console.log("Sel", order.items);
  };

  const navigationHandle = (item) => {
    navigate(`/admin/all-products?product=${item.product.product_id}`);
  };

  console.log(orders);

  return (
    <div className="flex">
      {/* Sidebar */}
      {!showSelectedOrder && (
        <div className="w-1/4 p-4 bg-white m-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 active:scale-95 transition-transform"
              onClick={() => handleResetFilters()}
            >
              Reset Filters
            </button>
          </div>
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
                    className="bg-gray-100 border border-reds-300 px-5 pt-5 pb-2  rounded-lg my-2"
                  >
                    <div className="flex justify-center items-center p-4 border border-gray-300 rounded-lg mb-4 bg-white">
                      {/* Details Section */}
                      <div className="flex-1 flex flex-col items-start mx-4">
                        <p className="text-lg font-semibold">
                          Order ID: {order._id}
                        </p>
                        <p>
                          Created At:{" "}
                          {new Date(order.order.createdAt).toLocaleString(
                            "en-IN",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}
                        </p>
                        <p>Amount: ₹ {order.order.total}</p>
                        {tempUser && (
                          <p>Ordered By: Mr./Ms. {order.user.fullName}</p>
                        )}
                        <button
                          onClick={() => handleSelectedOrder(order)}
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg mt-2"
                        >
                          View Order
                        </button>
                      </div>
                      {/*User Section*/}
                      <div className="flex-1 flex flex-col items-center ml-4">
                        <span className="text-lg ">User</span>
                        <span className="font-semibold">
                          {order.user.fullName}
                        </span>
                        <span>({order.user.email})</span>
                      </div>

                      {/* Status Section */}
                      <div className="flex-1 flex flex-col items-center mx-4">
                        <img
                          src={
                            order.order.status === "delivered"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/iesbrwt25sydygmpda8e.jpg"
                              : order.order.status === "shipped"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/e7koh4z8xiv57sed4udf.jpg"
                              : order.order.status === "pending"
                              ? "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/tu25xiut6lrqyrhzhkxe.jpg"
                              : "https://res.cloudinary.com/deepcloud1/image/upload/v1717488832/a6qg2kdqh6g5tln4jz7q.jpg"
                          }
                          alt={`Order ${order.order.status}`}
                          className="w-3/5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95 "
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <div className="bg-gray-200 py-3 px-4  rounded-md mx-4">
                {page} of {orders.totalPages}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-30 active:scale-95"
                disabled={orders && !orders.hasNextPage}
                onClick={() => setPage(page + 1)}
              >
                Next
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 ">
              {/* Order Details Card */}
              <div className="bg-blue-100 p-4 rounded-lg shadow-lg border-t-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Order Details
                </h3>
                <div className="pl-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Order ID:</span>{" "}
                    {selectedOrder._id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    {selectedOrder.order.status}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Transaction Id:</span>{" "}
                    {selectedOrder.order.transactionID}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Mode of Payment:</span>{" "}
                    {selectedOrder.payment.modeOfPayment}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Total:</span> ₹
                    {selectedOrder.order.total}
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
                    {selectedOrder.user.fullName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Username:</span>{" "}
                    {selectedOrder.user.username}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.user.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.user.phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Verified:</span>{" "}
                    {selectedOrder.user.verified ? "True" : "False"}
                  </p>
                  <div className="flex justify-start items-center mt-4 gap-4">
                    <button
                      className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 active:scale-95`}
                      onClick={() =>
                        navigate(`/admin/all-users?user=${selectedOrder.user._id}`)
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
                    {selectedOrder.address.addressLine1}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Address Line 2:</span>{" "}
                    {selectedOrder.address.addressLine2}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">City:</span>{" "}
                    {selectedOrder.address.city}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">State:</span>{" "}
                    {selectedOrder.address.state}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Pincode:</span>{" "}
                    {selectedOrder.address.pincode}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Country:</span>{" "}
                    {selectedOrder.address.country}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Contact:</span>{" "}
                    {selectedOrder.address.contact}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details Card */}
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Product Details
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 ">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.product.product_id}
                  className="bg-purple-100 p-4 col-span-1 rounded-lg shadow-lg border-t-4 border-purple-500 flex items-center justify-center text-wrap"
                >
                  <div className="mr-6">
                    <p className="text-gray-700">
                      <span className="font-medium"></span> {item.product.product_title}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Price:</span> ₹{" "}
                      {item.product.product_price}

                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Quantity:</span>{" "}
                      {item.quantity}
                    </p>
                    {/*<p className="text-gray-700">
                     <p className="text-gray-700">
                        <span className="font-medium">Quantity In Stock:</span> {item.product_quantityInStock}
                      </p>
                        <span className="font-medium">Brand:</span> {item.product_brand}
                      </p> */}
                  </div>
                  <div className="flex items-center">
                    <img
                      src={item.product.product_productImage}
                      alt={item.product.product_title}
                      className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                    <button
                      className="bg-purple-500 text-white py-2 px-4 rounded-lg shadow ml-4 "
                      onClick={() => navigationHandle(item)}
                    >
                      View Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllOrders;
