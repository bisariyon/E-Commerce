import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSubHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-24 z-50">
      <div className="header h-14 flex items-center justify-between px-1 sm:px-4 bg-gray-700 text-white w-full">
        {/* Go Back Button */}
        <div
          onClick={() => {
            navigate(-1);
          }}
          className="nav-link hover:text-cyan-500 hover:scale-105 hover:cursor-pointer flex-shrink-0 active:scale-95"
        >
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1717697275/moivz3r963n5ugzht0rj.png"
            className="w-12"
            alt="Go Back"
          />
        </div>

        {/* Centered Links */}
        <div className="text-sm md:text-base lg:text-lg xl:text-xl flex justify-center w-full font-semibold space-x-2 md:space-x-4 lg:space-x-6">
          <Link
            to="/admin/all-users"
            className="nav-link hover:text-cyan-500 hover:scale-105"
          >
            Users
          </Link>
          <Link
            to="/admin/all-sellers"
            className="nav-link hover:text-cyan-500 hover:scale-105"
          >
            Sellers
          </Link>
          <Link
            to="/admin/all-categories"
            className="nav-link hidden sm:inline hover:text-cyan-500 hover:scale-105"
          >
            Categories
          </Link>
          <Link
            to="/admin/all-subcategories"
            className="nav-link hidden md:inline hover:text-cyan-500 hover:scale-105"
          >
            Subcategories
          </Link>
          <Link
            to="/admin/all-brands"
            className="nav-link hidden md:inline hover:text-cyan-500 hover:scale-105"
          >
            Brands
          </Link>

          <Link
            to="/admin/all-products"
            className="nav-link hidden lg:inline hover:text-cyan-500 hover:scale-105"
          >
            Products
          </Link>

          <Link
            to="/admin/all-orders"
            className="nav-link hover:text-cyan-500 hover:scale-105"
          >
            Orders
          </Link>
          <Link
            to="/admin/all-reviews"
            className="nav-link lg:inline hover:text-cyan-500 hover:scale-105"
          >
            Reviews
          </Link>

          <Link
            to="/admin/all-orderitems"
            className="nav-link hidden lg:inline hover:text-cyan-500 hover:scale-105"
          >
            OrderItems
          </Link>
        </div>
        <div className="flex-shrink-0 w-12"></div>
      </div>
    </header>
  );
}

export default AdminSubHeader;
