import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Admin,
  Buy,
  EmptyCart,
  FullCart,
  Login,
  Logout,
} from "../../assets/imports/importImages";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/UserSlice";
import axios from "axios";
import { setBasket } from "../../store/BasketSlice";
import { SearchBar } from "../../index";

function Header() {
  const basket = useSelector((state) => state.basket.basket);
  const user = useSelector((state) => state.user.user);
  const isVerified = user?.verified || false;

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
        dispatch(setBasket([]));
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="header h-24 flex items-center px-2 pr-5 bg-gray-900 text-white space-x-4">
        <Link to="/admin">
          <img
            className="h-20 w-40 py-3 mr-3 transition duration-300 ease-in-out transform hover:scale-110"
            src={Admin}
            alt="Bisariyon Ecom"
          />
        </Link>
        <div className="">
          <Link to="/">
            <img
              src={Buy}
              alt="Buy"
              className="w-16 py-3 mr-4 transition duration-300 ease-in-out transform hover:scale-110"
            />
          </Link>
        </div>

        <div className="flex space-x-6 items-center">
          {user ? (
            <>
              <Link to="/user/profile">
                <div className="flex items-center ml-4 hover:cursor-pointer bg-gray-800 py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-110">
                  <img
                    src={user.avatar}
                    className="rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 w-10 h-10"
                    alt="User Avatar"
                  />
                  <div className="text-lg ml-2 text-cyan-500  font-bold transition duration-300 ease-in-out transform hover:scale-110">
                    {user?.username?.charAt(0).toUpperCase() +
                      user?.username?.slice(1, 4).toLowerCase()}
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
        </div>
      </div>
    </header>
  );
}

export default Header;
