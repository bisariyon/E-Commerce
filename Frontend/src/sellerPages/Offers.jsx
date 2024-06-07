import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import refreshSeller from "../utility/refreshSeller";
import { useNavigate } from "react-router-dom";

function Offers() {
  const navigate = useNavigate();
  const fetchSellerOffers = async () => {
    try {
      const response = await axios.get(
        "/v1/product-offers/seller",
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const removeOffer = async (offerId) => {
    try {
      const response = await axios.delete(
        `/v1/product-offers/delete/${offerId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Offer removed:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing offer:", error);
      throw error;
    }
  };

  const { refreshSellerData } = refreshSeller();
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    discountType: "",
    discountValue: "",
    minimumOrderValue: "",
    validFrom: "",
    validTill: "",
  });

  useEffect(() => {
    refreshSellerData();
  }, []);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["sellerOffers"],
    queryFn: fetchSellerOffers,
    staleTime: 100,
  });

  const removeMutation = useMutation({
    mutationFn: removeOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(["sellerOffers"]);
    },
    onError: (error) => {
      console.error("Error removing offer:", error);
    },
  });

  const handleRemove = (offerId) => {
    removeMutation.mutate(offerId);
  };

  const handleUpdateClick = (offer) => {
    navigate(`/seller/update-offer/${offer._id}`);
  };

  if (isLoading || removeMutation.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          {isLoading
            ? "Loading seller offers"
            : removeMutation.isLoading
            ? "Removing offer..."
            : "Updating offer..."}
        </div>
      </div>
    );
  }

  if (isError || removeMutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          {isError
            ? `Error fetching seller offers : ${error.response.data.message} `
            : `Error removing offer : ${removeMutation.error?.response?.data?.message}`}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 px-4 min-h-screen ">
      <div className="text-center mb-6 text-5xl font-semibold">
        Offers & Discounts
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 rounded-md px-8 py-8 bg-gray-200">
        {data &&
          data.map((offer) => (
            <div
              key={offer.code}
              className="bg-white shadow-md rounded-lg flex flex-col space-y-4 p-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Offer Code : {offer.code}
                </h2>
                <span className="text-sm text-gray-500 flex flex-col gap-2">
                  <span className="bg-blue-500 text-white py-1 px-2 rounded-md mr-2">
                    Start: {new Date(offer.validFrom).toLocaleDateString()}
                  </span>
                  <span className="bg-red-500 text-white py-1 px-2 rounded-md">
                    End: {new Date(offer.validTill).toLocaleDateString()}
                  </span>
                </span>
              </div>
              <div className="text-gray-700">
                <h3 className="text-lg font-semibold text-black">
                  {offer.product.title}
                </h3>
                <p>
                  <strong>Discount Type:</strong> {offer.discountType}
                </p>
                {offer.discountType === "percentage" ? (
                  <p>
                    <strong>Discount Value:</strong> {offer.discountValue}%
                  </p>
                ) : (
                  <p>
                    <strong>Discount Value:</strong> ₹{offer.discountValue}
                  </p>
                )}
                <p>
                  <strong>Minimum Order Value:</strong> ₹
                  {offer.minimumOrderValue}
                </p>
              </div>
              <div className="flex  space-y-2 ">
                <img
                  src={offer.product.productImage}
                  alt={offer.product.title}
                  className="w-48 h-48 object-cover rounded-md"
                />
                {/* <p className="text-gray-500">{offer.product.brand}</p> */}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdateClick(offer)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-800 active:scale-95"
                >
                  Update Offer
                </button>
                <button
                  onClick={() => handleRemove(offer._id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 active:bg-red-800 active:scale-95"
                >
                  Remove Offer
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Offers;
