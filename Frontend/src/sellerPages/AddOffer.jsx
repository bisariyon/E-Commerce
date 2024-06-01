import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function AddOffer() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    const id = productId;
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/products/p/${id}`,
        { withCredentials: true }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.log("E1", error.response.data);
      throw new Error(error.response.data); // Added to throw error for better handling
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: fetchProduct,
  }); // Modified useQuery parameters

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minimumOrderValue, setMinimumOrderValue] = useState(0);
  const [validTill, setValidTill] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }, [successMessage]); // Corrected dependency

  const addOffer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/v1/product-offers/create/${productId}`,
        {
          discountType,
          discountValue,
          minimumOrderValue,
          validTill,
          validFrom,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Offer added successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error adding offer:", error.response.data.message);
      setErrorMessage(error.response.data.message);
      throw new Error(error.response.data); // Added to throw error for better handling
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      discountType === "percentage" &&
      (discountValue < 0 || discountValue > 100)
    ) {
      setErrorMessage(
        "Discount value must be between 0 and 100 for percentage discount"
      );
      return;
    }

    try {
      await addOffer();
      setSuccessMessage("Offer added successfully");
      setDiscountType("percentage");
      setDiscountValue(0);
      setMinimumOrderValue(0);
      setValidTill("");
      setValidFrom("");

      setTimeout(() => {
        navigate("/seller");
      }, 3000);
    } catch (error) {
      console.error("Error while handling form submit:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading Product Details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Error Loading Product Details...
        </div>
      </div>
    );
  }

  return (
    <div className="justify-center py-4 bg-gray-200">
      <div className="text-center">
        {successMessage && (
          <div className="rounded-lg text-2xl text-white font-bold py-2 bg-green-500">
            {successMessage}
          </div>
        )}
      </div>
      <div className="flex justify-center w-2/4 mx-auto space-x-2">
        <div className="w-1/2 py-4">
          {data && (
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <h2 className="text-lg font-bold mb-2">{data.title}</h2>
              <p className="mb-2">Description: {data.description}</p>
              <p className="mb-2">Brand: {data.brand.name}</p>
              <p className="mb-2">Category: {data.category.category}</p>
              <p className="mb-2">Price: {data.price}</p>
              <p className="mb-2">Quantity in Stock: {data.quantityInStock}</p>
              <img
                src={data.productImage}
                alt={data.title}
                className="w-72 h-auto rounded-md m-4"
              />
            </div>
          )}
        </div>
        <div className="w-1/2 py-4">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow-md p-4 h-full"
          >
            <div className="text-2xl font-bold mb-4">Add Offer</div>

            <div className="mb-4">
              <label
                htmlFor="discountType"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Discount Type
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    id="fixedDiscount"
                    name="discountType"
                    value="fixed"
                    checked={discountType === "fixed"}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Fixed</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    id="percentageDiscount"
                    name="discountType"
                    value="percentage"
                    checked={discountType === "percentage"}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2">Percentage</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="discountValue"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Discount Value
              </label>
              <input
                type="text"
                id="discountValue"
                name="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="minimumOrderValue"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Minimum Order Value
              </label>
              <input
                type="text"
                id="minimumOrderValue"
                name="minimumOrderValue"
                value={minimumOrderValue}
                onChange={(e) => setMinimumOrderValue(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="validFrom"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="validTill"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Valid Till
              </label>
              <input
                type="date"
                id="validTill"
                name="validTill"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            {errorMessage && (
              <div className="mb-4 p-2 rounded-lg text-red-500">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 active:bg-blue-700 active:scale-95 "
            >
              Add Offer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddOffer;
