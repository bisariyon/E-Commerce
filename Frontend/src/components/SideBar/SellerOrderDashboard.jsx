import React, { useState } from "react";

const SellerOrderDashboard = ({
  setSortBy,
  setSortType,
  setStatus,
  sortBy,
  sortType,
  status,
  before,
  after,
  setBefore,
  setAfter,
}) => {
  const [tempBefore, setTempBefore] = useState("");
  const [tempAfter, setTempAfter] = useState("");

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

  return (
    <div className="w-80 h-full bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="_id">Order ID</option>
          <option value="amount">Amount</option>
          <option value="createdAt">Order Date</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Sort Type</label>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="1">
            {sortBy === "createdAt"
              ? "Oldest First"
              : sortBy === "amount"
              ? "Lowest"
              : "Ascending"}
          </option>
          <option value="-1">
            {sortBy === "createdAt"
              ? "Latest First"
              : sortBy === "amount"
              ? "Highest"
              : "Descending"}
          </option>
=        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
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
        <div className="flex justify-between">
          <button
            onClick={handleApplyRange}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Set
          </button>
          <button
            onClick={handleRemoveRange}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Remove filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDashboard;
