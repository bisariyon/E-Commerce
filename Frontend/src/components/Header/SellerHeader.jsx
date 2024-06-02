import React ,{useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SellerLogo,
  Login,
  Logout,
  OrdersEmpty,
  OrdersFull,
  Buy,
} from "../../assets/imports/importImages";
import { useSelector, useDispatch } from "react-redux";
import { setSeller } from "../../store/SellerSlice";
import axios from "axios";
import { SellerSearchBar } from "../../index";
import refreshSeller from "../../utility/refreshSeller";

const SellerHeader = () => {
  const { refreshSellerData } = refreshSeller();
  useEffect(() => {
    refreshSellerData();
  }, []);

  const seller = useSelector((state) => state.seller.seller);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/sellers/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Logout successful");
        dispatch(setSeller(null));
        navigate("/seller");
      }
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="header h-24 flex items-center px-2 pr-5 bg-gray-900 text-white">
        <Link to="/seller">
          <img
            className="w-40 h-24 py-3 mr-3 transition duration-300 ease-in-out transform hover:scale-110"
            src={SellerLogo}
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

        <SellerSearchBar />

        <div className="flex space-x-6 items-center">
          {seller ? (
            <>
              <Link to="dashboard">
                <div className="ml-4 mr-2 hover:cursor-pointer py-2 transition duration-300 ease-in-out transform hover:scale-110">
                  <img
                    src={seller.avatar || "https://res.cloudinary.com/deepcloud1/image/upload/v1715772761/wzkwecfnwvoeozs2tezw.jpg"}
                    className="rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 w-14 h-14"
                    alt="User Avatar"
                  />
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
                <Link to="/seller/login">
                  <img src={Login} width="full" alt="Login" />
                </Link>
              </div>
            </>
          )}

          <div className="text-lg mx-3">
            <Link to="#">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-110">
                <img className="w-24" src={OrdersEmpty} alt="Orders" />
                <span className="text-white rounded-full px-2 py-1 ml-1">
                  0
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
