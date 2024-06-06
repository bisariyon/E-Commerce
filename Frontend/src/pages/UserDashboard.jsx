import React, { useEffect, useState } from "react";
import {
  AccountInfo,
  Orders,
  Wishlist,
  Addresses,
  Reviews,
  Help,
  Logout,
} from "../index";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

const UserDashboard = () => {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("account");

  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (!user) {
      navigate("/redirect/home");
    }
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case "account":
        return <AccountInfo />;
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "addresses":
        return <Addresses />;
      case "reviews":
        return <Reviews />;
      case "help":
        return <Help />;
      case "logout":
        return <Logout />;
      case "admin":
        return isAdmin ? navigate("/admin") : <AccountInfo />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 lg:w-1/5 bg-slate-900 text-white p-4 rounded-r-sm">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <img src={user?.avatar} className="rounded-full w-20 h-20 mx-auto" />
          <h2 className="text-2xl font-bold text-center text-cyan-500">
            <span className="">Hi, </span>
            {user?.fullName}
          </h2>
        </div>
        <ul className="space-y-1">
          {[
            { label: "Account Information", option: "account" },
            { label: "Addresses", option: "addresses" },
            { label: "Orders", option: "orders" },
            { label: "Wishlist", option: "wishlist" },
            { label: "Reviews", option: "reviews" },
            { label: "Help", option: "help" },
            { label: "Logout", option: "logout" },
            ...(isAdmin ? [{ label: "Admin", option: "admin" }] : []),
          ].map((item) => (
            <li
              key={item.option}
              className={`px-4 py-2 cursor-pointer rounded-xl ${
                selectedOption === item.option ? "font-bold text-blue-400" : ""
              }`}
              onClick={() => setSelectedOption(item.option)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 lg:w-4/5">{renderContent()}</div>
    </div>
  );
};

export default UserDashboard;
