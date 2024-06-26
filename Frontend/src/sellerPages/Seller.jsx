import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BenefitCard } from "../index";
import { useNavigate, useLocation } from "react-router-dom";

import refreshSeller from "../utility/refreshSeller";

function Seller() {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {};

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate("/seller", { replace: true });
      }, 3000);
    }
  }, [message, navigate]);

  const seller = useSelector((state) => state.seller.seller);
  console.log(seller);

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mx-auto mb-4">
              <h1 className="text-3xl font-bold text-black">Become a Seller</h1>
              <p className="text-gray-800 mt-2">
                Join us and start selling your products!
              </p>
            </div>

            <div className="flex justify-center mx-auto">
              <button
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
                onClick={() => navigate("/seller/register")}
              >
                Proceed to Become a Seller
              </button>
            </div>
          </div>

          {/* Seller Benefits Section */}
          <div className="bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-black mb-6">
                Benefits of Becoming a Seller
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Benefit Cards */}
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/zwujpnwdg4o0pugpzddy.jpg"
                  imageAlt="Global Audience"
                  title="Reach a Global Audience"
                  description="Sell your products to customers around the world."
                />
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/tihpw5sbnzytlr3kz4cx.jpg"
                  imageAlt="Increase Revenue"
                  title="Increase Revenue"
                  description="Boost your income by tapping into a large customer base."
                />
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/rswdsi2579zwzfqpcxb8.jpg"
                  imageAlt="Product Management"
                  title="Easy Product Management"
                  description="Manage your products effortlessly with our intuitive dashboard."
                />
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/ir0qwsr74fishzupwjaj.jpg"
                  imageAlt="Promote Brand"
                  title="Promote Your Brand"
                  description="Get exposure for your brand through our platform."
                />
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/vxqwpomvyihdcwhlhsaa.jpg"
                  imageAlt="Flexible Schedule"
                  title="Flexible Schedule"
                  description="Set your own schedule and work at your own pace."
                />
                <BenefitCard
                  imageSrc="https://res.cloudinary.com/deepcloud1/image/upload/v1717181251/pgceji2letja2ns2jyol.jpg"
                  imageAlt="Customer Support"
                  title="Dedicated Customer Support"
                  description="Access our dedicated support team for assistance."
                />
                {/* Add more BenefitCard components here as needed */}
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/seller/register")}
            >
              Proceed to Become a Seller
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Welcome, Seller!</h1>
          <p className="text-gray-800 mt-2">
            Manage your products and orders here.
          </p>
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">{message}</span>
            </div>
          )}
        </div>
        {/* Options to Manage Products and Orders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Add New Product
            </h2>
            <p className="text-gray-800 mb-4">
              Add a new product to your store.
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
              onClick={() => navigate("new-product")}
            >
              Add New Product
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Manage Your Products
            </h2>
            <p className="text-gray-800 mb-4">
              Edit or remove products from your store.
            </p>
            <button
              onClick={() => navigate("all-products")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Manage Your Products
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Your Orders
            </h2>
            <p className="text-gray-800 mb-4">
              View and fulfill orders from your customers.
            </p>
            <button
              onClick={() => navigate("orders")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              All Orders
            </button>
          </div>

          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              View Product Offers
            </h2>
            <p className="text-gray-800 mb-4">
              Check out special offers on products.
            </p>
            <button
              onClick={() => navigate("offers")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              View Product Offers
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              View Reviews
            </h2>
            <p className="text-gray-800 mb-4">
              View customer reviews on your products.
            </p>
            <button
              onClick={() => navigate("all-reviews")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              View Reviews
            </button>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-2">
              Request for New Brand
            </h2>
            <p className="text-gray-800 mb-4">
              Submit a request to add a new brand to your store.
            </p>
            <button
              onClick={() => navigate("brand-request")}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 active:scale-95"
            >
              Request for New Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seller;
