import React, { useEffect, useState } from "react";
import { Profile, SellerLogOut } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import refreshSeller from "../utility/refreshSeller";

const SellerDashboard = () => {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("account");

  const seller = useSelector((state) => state.seller.seller);
  useEffect(() => {
    if (!seller) {
      navigate("/seller");
    }
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case "profile":
        return <Profile />;
      // case "help":
      //   return <Help />;
      case "logout":
        return <SellerLogOut />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 lg:w-1/5 bg-slate-900 text-white p-4 rounded-r-sm">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <img
            src={seller?.avatar}
            className="rounded-full w-20 h-20 mx-auto"
          />
          <h2 className="text-2xl font-bold text-center text-cyan-500">
            <span className="">Hi, </span>
            {seller?.fullName}
          </h2>
        </div>
        <ul className="space-y-1">
          {[
            { label: "Profile", option: "profile" },
            // { label: "Help", option: "help" },
            { label: "Logout", option: "logout" },
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

export default SellerDashboard;
