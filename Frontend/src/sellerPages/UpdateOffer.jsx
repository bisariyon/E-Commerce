import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Admin2 } from "../assets/imports/importImages";

function UpdateOffer() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState();
  const [updateFormData, setUpdateFormData] = useState({
    discountType: "",
    discountValue: "",
    minimumOrderValue: "",
    validFrom: "",
    validTill: "",
  });

  const fetchOffer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/product-offers/${offerId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Offer fetched:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching offer:", error.response);
      throw error.response.data.message || error.response.data;
    }
  };

  useEffect(() => {
    fetchOffer().then((data) => {
      //   console.log("Offer data:", data);
      setProduct(data.product.productImage);
      const validFromDate = new Date(data.validFrom);
      const validTillDate = new Date(data.validTill);

      const formattedValidFrom = validFromDate.toISOString().split("T")[0];
      const formattedValidTill = validTillDate.toISOString().split("T")[0];

      setUpdateFormData({
        discountType: data.discountType,
        discountValue: data.discountValue,
        minimumOrderValue: data.minimumOrderValue,
        validFrom: formattedValidFrom,
        validTill: formattedValidTill,
      });
    });
  }, []);

  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/v1/product-offers/update/${offerId}`,
        updateFormData,
        {
          withCredentials: true,
        }
      );
      console.log("Offer updated:", response.data);
      navigate("/seller/offers");
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  };

  return (
    <div>
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
        <div className="flex flex-wrap w-full max-w-4xl bg-blue-400 rounded-xl shadow-lg overflow-hidden my-8">
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={product}
              alt="Loading..."
              className="w-80 h-auto rounded-md"
            />
          </div>
          <div className="w-1/2 bg-gray-200 p-8">
            <div className="text-slate-800">
              <h2 className="text-3xl font-bold text-blue-900 mb-8">
                Update Offer
              </h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={updateFormData.discountType}
                    onChange={handleUpdateChange}
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
                    name="discountValue"
                    value={updateFormData.discountValue}
                    onChange={handleUpdateChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Minimum Order Value
                  </label>
                  <input
                    type="number"
                    name="minimumOrderValue"
                    value={updateFormData.minimumOrderValue}
                    onChange={handleUpdateChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Valid From
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={updateFormData.validFrom}
                    onChange={handleUpdateChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Valid Till
                  </label>
                  <input
                    type="date"
                    name="validTill"
                    value={updateFormData.validTill}
                    onChange={handleUpdateChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 active:bg-blue-700 active:scale-95 mt-4"
                >
                  Update Offer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateOffer;
