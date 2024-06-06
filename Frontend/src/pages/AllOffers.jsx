import React, { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function AllOffers() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/product-offers/all"
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "offers",
    queryFn: fetchOffers,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading Offers..</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          Error fetching offers. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6 bg-blue-300">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        All Offers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6 py-4">
        {data.map((offer) => (
          <div
            key={offer._id}
            className="p-6 border border-gray-300 rounded-lg shadow-md bg-white flex justify-around"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {offer.product.title}
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Code : </strong> {offer.code}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Discount Type : </strong> {offer.discountType}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Discount Value : </strong>
                {offer.discountType === "fixed"
                  ? "₹" + offer.discountValue
                  : offer.discountValue + "%"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Minimum Order Value : </strong>{" "}
                {offer.minimumOrderValue}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Valid From : </strong>{" "}
                {new Date(offer.validFrom).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Valid Till : </strong>{" "}
                {new Date(offer.validTill).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Seller : </strong> {offer.seller.fullName}
              </p>
            </div>
            <div className="">
              <img
                src={offer.product.productImage}
                alt={offer.product.title}
                className="w-24 h-24"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllOffers;
