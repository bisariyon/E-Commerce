import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Admin2 } from "../assets/imports/importImages";
import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function SellerVerification() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const seller = location.state.seller;
  // console.log(seller.verified)

  const userRedux = useSelector((state) => state.user.user);
  const isAdmin = userRedux?.isAdmin;

  const [verify, setVerify] = useState(seller?.verified || false);

  const SellerVerificationBackend = async () => {
    try {
      const response = await axios.patch(
        `/v1/sellers/verify/${seller._id}?verify=${verify}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await SellerVerificationBackend();
    navigate(`/admin/all-sellers?seller=${seller._id}`);
  };

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
    <>
      <div className="min-h-screen flex items-center justify-center bg-blue-200 pb-8">
        <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
          <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
            <div className="text-white text-center">
              <img
                src={Admin2}
                alt="Product Image"
                className="w-[350px] h-[350px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 mx-auto">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
              Seller Verification
            </h2>

            <form onSubmit={handleFormSubmit} className="">
              <div className="mb-6">
                <label className="block text-blue-800 text-lg font-semibold mb-2">
                  Seller Name
                </label>
                <input
                  type="text"
                  value={seller.fullName}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-6">
                <label className="block text-blue-800 text-lg font-semibold mb-2">
                  Seller Email
                </label>
                <input
                  type="email"
                  value={seller.email}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-6">
                <label className="block text-blue-800 text-lg font-semibold mb-2">
                  Seller GST Number
                </label>
                <input
                  type="text"
                  value={seller.GSTnumber}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="mb-6">
                <label className="block text-blue-800 text-lg font-semibold mb-2">
                  Verification Status (Current:{" "}
                  {seller.verified ? "Verified" : "Unverified"})
                </label>
                <div>
                  <label className="inline-block mr-4">
                    <input
                      type="radio"
                      value="verify"
                      checked={verify === true}
                      onChange={(e) => setVerify(true)}
                      className="mr-2"
                    />
                    Verify
                  </label>
                  <label className="inline-block">
                    <input
                      type="radio"
                      value="unverify"
                      checked={verify === false}
                      onChange={(e) => setVerify(false)}
                      className="mr-2"
                    />
                    Unverify
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerVerification;
