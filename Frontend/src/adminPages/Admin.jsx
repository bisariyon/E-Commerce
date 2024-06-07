import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function Admin() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.isAdmin;

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

  return (
    <div className="bg-blue-100 pt-10 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              User Management
            </h2>
            <p className="text-gray-800 mb-4">user accounts and permissions.</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
              onClick={() => navigate("all-users")}
            >
              Users
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Sellers Management
            </h2>
            <p className="text-gray-800 mb-4">
              seller accounts and permissions.
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
              onClick={() => navigate("all-sellers")}
            >
              Sellers
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Category Management
            </h2>
            <p className="text-gray-800 mb-4">View and update categories.</p>
            <button
              onClick={() => navigate("all-categories")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Categories
            </button>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              SubCategory Management
            </h2>
            <p className="text-gray-800 mb-4">View or update subcategories.</p>
            <button
              onClick={() => navigate("all-subcategories")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              SubCategories
            </button>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Brands Management
            </h2>
            <p className="text-gray-800 mb-4">View or update products.</p>
            <button
              onClick={() => navigate("all-brands")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Brands
            </button>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Product Management
            </h2>
            <p className="text-gray-800 mb-4">
              View all products available on BISARIYON.
            </p>
            <button
              onClick={() => navigate("all-products")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Products
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Order Management
            </h2>
            <p className="text-gray-800 mb-4">
              View and manage orders from customers.
            </p>
            <button
              onClick={() => navigate("all-orders")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Orders
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Order Items Management
            </h2>
            <p className="text-gray-800 mb-4">
              View all order items and details.
            </p>
            <button
              onClick={() => navigate("all-orderitems")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Order Items
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Product Reviews
            </h2>
            <p className="text-gray-800 mb-4">
              View all product reviews.
            </p>
            <button
              onClick={() => navigate("all-reviews")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Reviews
            </button>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Marketing and Promotions
            </h2>
            <p className="text-gray-800 mb-4">
              Create and manage marketing campaigns.
            </p>
            <button
              onClick={() => navigate("#")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Marketing
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Analytics and Reporting
            </h2>
            <p className="text-gray-800 mb-4">
              View reports and analytics data.
            </p>
            <button
              onClick={() => navigate("#")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              View Reports
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Customer Support
            </h2>
            <p className="text-gray-800 mb-4">
              Assist customers with inquiries and issues.
            </p>
            <button
              onClick={() => navigate("#")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Customer Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
