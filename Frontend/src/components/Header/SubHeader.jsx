import React from "react";
import { Link } from "react-router-dom";

function SubHeader() {
  return (
    <header className="sticky top-24 z-50">
      <div className="header h-14 flex items-center justify-between px-1 sm:px-4 bg-gray-700 text-white w-full">
        <div className="text-sm md:text-base lg:text-lg xl:text-xl flex justify-center w-full font-semibold space-x-2 md:space-x-4 lg:space-x-6">
          <Link to="/products" className="nav-link hover:text-cyan-500 hover:scale-105">
            All Products
          </Link>
          <Link to="/#" className="nav-link hover:text-cyan-500 hover:scale-105">
            All Categories
          </Link>
          <Link to="/#" className="nav-link hidden sm:inline hover:text-cyan-500 hover:scale-105">
            Offers & Discounts
          </Link>
          <Link to="user/profile" className="nav-link hidden md:inline hover:text-cyan-500 hover:scale-105">
            Order History
          </Link>
          <Link to="/user/register" className="nav-link hidden hover:text-cyan-500 hover:scale-105">
            Wishlist
          </Link>
          <Link to="/user/register" className="nav-link hover:text-cyan-500 hover:scale-105">
            Create New Account
          </Link>
          <Link to="/seller" className="nav-link lg:inline hover:text-cyan-500 hover:scale-105">
            Become a Seller
          </Link>
          <Link to="/#" className="nav-link hidden lg:inline hover:text-cyan-500 hover:scale-105">
            Contact
          </Link>
          <Link to="/#" className="nav-link hidden lg:inline hover:text-cyan-500 hover:scale-105">
            About
          </Link>
          {/* Add links to other necessary pages */}
        </div>
      </div>
    </header>
  );
}

export default SubHeader;
