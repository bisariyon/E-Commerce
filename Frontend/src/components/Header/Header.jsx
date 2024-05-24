import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Logo,
  EmptyCart,
  FullCart,
  Login,
  Logout,
} from "../../assets/imports/importImages";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/UserSlice";
import axios from "axios";

function Header() {
  const basket = useSelector((state) => state.basket.basket);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Logout successful");
        dispatch(setUser(null));
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="header h-20 flex items-center px-2 pr-5 bg-gray-900 text-white">
        <Link to="/">
          <img
            className="h-20 w-40 py-3 mr-3"
            src={Logo}
            alt="Bisariyon Ecom"
          />
        </Link>

        <div className="flex-1 hidden sm:flex items-center rounded-full bg-white bg-opacity-10 mr-2">
          <div className="h-10 w-10 ml-3">
            <img
              src="https://res.cloudinary.com/deepcloud1/image/upload/v1716378719/k2nuienbsmq25bwihp5r.png"
              alt="Search Icon"
            />
          </div>
          <input
            type="text"
            className="flex-1 h-full p-2 bg-transparent outline-none text-white placeholder-gray-400 text-xl"
            placeholder="Search"
          />
        </div>

        <div className="flex space-x-6 items-center">
          {user ? (
            <>
              <Link to="/#">
                <div className="flex items-center ml-4 hover:cursor-pointer bg-gray-800 py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                  <img
                    src={user.avatar}
                    width="40"
                    className="rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                    alt="User Avatar"
                  />
                  <div className="text-lg ml-2 text-cyan-500  font-bold transition duration-300 ease-in-out transform hover:scale-110">
                    {user.username.charAt(0).toUpperCase() +
                      user.username.slice(1).toLowerCase()}
                  </div>
                </div>
              </Link>

              <div
                onClick={handleLogout}
                className="hover:text-cyan-500 hover:cursor-pointer w-14 transition duration-300 ease-in-out transform hover:scale-110"
              >
                <img src={Logout} width="full" alt="Logout" />
              </div>
            </>
          ) : (
            <>
              <div className="text-xl ml-4 text-cyan-500 hover:cursor-pointer font-bold transition duration-200 ease-in-out transform hover:scale-110 ">
                Guest
              </div>
              <div className="hover:text-cyan-500 hover:cursor-pointer w-14 transition duration-300 ease-in-out transform hover:scale-110 ">
                <Link to="/user/login">
                  <img src={Login} width="full" alt="Login" />
                </Link>
              </div>
            </>
          )}

          <div className="text-lg mx-3">
            <Link to="">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-110">
                <img
                  className="h-14 w-14"
                  src={basket.length > 0 ? FullCart : EmptyCart}
                  alt="Cart"
                />
                <span className="text-white rounded-full px-2 py-1 ml-1">
                  {basket.length}
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
