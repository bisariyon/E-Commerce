import React, { useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD123",
      orderDate: "2023-01-01",
      status: "Delivered",
    },
    {
      id: 2,
      orderNumber: "ORD124",
      orderDate: "2023-01-10",
      status: "Pending",
    },
    {
      id: 3,
      orderNumber: "ORD125",
      orderDate: "2023-02-01",
      status: "Shipped",
    },
  ]);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("orderDate");

  const handleSort = (field) => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (field === "orderDate") {
        return sortOrder === "asc" ? new Date(a.orderDate) - new Date(b.orderDate) : new Date(b.orderDate) - new Date(a.orderDate);
      } else {
        return sortOrder === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      }
    });
    setOrders(sortedOrders);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Orders
      </h2>
      <div className="flex justify-end space-x-4 mb-6 mr-8">
        <button
          onClick={() => handleSort("orderDate")}
          className="mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none shadow-md transition duration-300"
        >
          Sort by Date ({sortOrder === "asc" && sortField === "orderDate" ? "Ascending" : "Descending"})
        </button>
        <button
          onClick={() => handleSort("status")}
          className="mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none shadow-md transition duration-300"
        >
          Sort by Status ({sortOrder === "asc" && sortField === "status" ? "Ascending" : "Descending"})
        </button>
      </div>

      <div className="mb-10 px-2 pt-2 pb-4 rounded-lg bg-gray-200">
        <div className="-m-1 px-4 pt-4 flex flex-col">
          <span className="text-black text-2xl font-bold mb-1 px-2">
            Your Orders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-md font-semibold mb-2 text-black">
                Order {order.id}
              </h3>
              <div className="flex flex-col mb-2">
                <span>Order Number: {order.orderNumber}</span>
                <span>Order Date: {order.orderDate}</span>
                <span>Status: {order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
