import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
        `/v1/products/p/${id}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error.response.data);
      throw new Error(error.response.data);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: fetchProduct,
  });

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
  }, [successMessage]);

  const addOffer = async () => {
    try {
      const response = await axios.post(
        `/v1/product-offers/create/${productId}`,
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
      return response.data.data;
    } catch (error) {
      console.error("Error adding offer:", error.response.data.message);
      setErrorMessage(error.response.data.message);
      throw new Error(error.response.data);
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
      setTimeout(() => {
        navigate("/seller/offers");
      }, 3000);
    } catch (error) {
      console.error("Error while handling form submit:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <div className="text-3xl text-gray-700">Loading Product Details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <div className="text-3xl text-gray-700">
          Error Loading Product Details...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-200 px-4 pt-2 text-xl">
        <Link to="/seller/offers">
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1717357419/zb86nifhiz6ggbnhckzd.png"
            alt="Back"
            className="w-16 h-16 inline-block hover:scale-110 active:scale-100 transition-transform duration-100 ease-in-out"
          />
        </Link>
      </div>
      <div className="min-h-full flex items-center justify-center bg-blue-200 pb-8 ">
        <div className="flex flex-wrap w-full max-w-4xl bg-gray-200 rounded-xl shadow-lg overflow-hidden my-8">
          <div className="w-full md:w-1/2 p-5 flex flex-col justify-center items-center bg-blue-400">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold text-center text-blue-900 ">
                {data.title}
              </h2>
              <p className="text-lg ">{data.description}</p>
              <p className="text-lg ">Price: ₹{data.price}</p>
              <p className="text-lg ">
                Quantity In Stock: {data.quantityInStock}
              </p>
              <img
                src={data.productImage}
                alt="Product Image"
                className="w-[375px] h-[375px] object-cover shadow-md rounded-xl bg-gray-200 mt-4"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
              Add Offer
            </h2>
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Discount Value
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  value={minimumOrderValue}
                  onChange={(e) => setMinimumOrderValue(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Valid From
                </label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Valid Till
                </label>
                <input
                  type="date"
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
                className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 active:bg-blue-700 active:scale-95 mt-4"
              >
                Add Offer
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddOffer;
