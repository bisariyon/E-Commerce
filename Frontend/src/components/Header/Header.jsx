import React from "react";
import { Link } from "react-router-dom";
import { Logo, EmptyCart, FullCart } from "../../assets/imports/importImages";
import { useSelector } from "react-redux";

function Header() {
  const basket = useSelector((state) => state.basket.basket);

  return (
    <header className="sticky top-0 z-50">
      <div className="header h-20 flex items-center px-2 pr-5 bg-gray-900 text-white ">
        <Link to="/">
          <img
            className="h-20 w-40 py-3 mr-3"
            src={Logo}
            alt="Bisariyon Ecom"
          />
        </Link>

        <div className=" flex-1 hidden sm:flex items-center rounded-full bg-white bg-opacity-10 mr-2">
          <div className="h-10 w-10 ml-3">
            <img src="https://res.cloudinary.com/deepcloud1/image/upload/v1716378719/k2nuienbsmq25bwihp5r.png" />
          </div>
          <input
            type="text"
            className="flex-1 h-full p-2 bg-transparent outline-none text-white placeholder-gray-400  text-xl"
            placeholder="Search"
          />
        </div>

        <div className="flex space-x-4 items-center">
          <div className="text-lg mx-3 hover:text-cyan-500 hover:cursor-pointer">User</div>
          <div className="text-lg mx-2 hover:text-cyan-500 hover:cursor-pointer">Login</div>
          <div className="text-lg mx-3">
            <Link to="">
              <div className="flex items-center  transition duration-300 ease-in-out transform hover:scale-110">
                <img
                  className="h-14 w-14"
                  src={basket.length > 0 ? FullCart : EmptyCart}
                />
                <span className="text-white rounded-full px-2 py-1 ml-1">
                  25
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
