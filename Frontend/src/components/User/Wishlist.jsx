import React, { useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      itemName: "New Laptop",
      addedDate: "2023-03-15",
    },
    {
      id: 2,
      itemName: "Smartphone",
      addedDate: "2023-04-22",
    },
    {
      id: 3,
      itemName: "Headphones",
      addedDate: "2023-02-10",
    },
  ]);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("addedDate");

  const handleRemove = (id) => {
    // Remove the item
    console.log(`Remove item with id ${id}`);
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleSort = (field) => {
    const sortedWishlist = [...wishlist].sort((a, b) => {
      if (field === "itemName") {
        if (sortOrder === "asc") {
          return a.itemName.localeCompare(b.itemName);
        } else {
          return b.itemName.localeCompare(a.itemName);
        }
      } else {
        if (sortOrder === "asc") {
          return new Date(a.addedDate) - new Date(b.addedDate);
        } else {
          return new Date(b.addedDate) - new Date(a.addedDate);
        }
      }
    });
    setWishlist(sortedWishlist);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Wishlist
      </h2>
      <div className="flex justify-end space-x-4 mb-6 mr-8">
        <button
          onClick={() => handleSort("addedDate")}
          className="mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none shadow-md transition duration-300"
        >
          Sort by Date Added ({sortOrder === "asc" && sortField === "addedDate" ? "Ascending" : "Descending"})
        </button>
        <button
          onClick={() => handleSort("itemName")}
          className="mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none shadow-md transition duration-300"
        >
          Sort by Name ({sortOrder === "asc" && sortField === "itemName" ? "Ascending" : "Descending"})
        </button>
      </div>

      <div className="mb-10 px-2 pt-2 pb-4 rounded-lg bg-gray-200">
        <div className="-m-1 px-4 pt-4 flex flex-col ">
          <span className="text-black text-2xl font-bold mb-1 px-2">
            Your Wishlist
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-4">
          {wishlist.map((item) => (
            <div key={item.id} className="rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-md font-semibold mb-2 text-black">Item {item.id}</h3>
              <div className="flex flex-col mb-2">
                <span>Item Name: {item.itemName}</span>
                <span>Added Date: {item.addedDate}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none text-s bg-transparent"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
