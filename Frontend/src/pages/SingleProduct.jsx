import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { increaseQuantityOrAddToBasket } from "../store/BasketSlice";
import { useDispatch, useSelector } from "react-redux";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function SingleProduct() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const productId = useParams().productId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket.basket);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/products/p/${productId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/v1/reviews/get/${productId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(error.response.data.message || error.response.data);
      throw error.response.data.message || error.response.data;
    }
  };

  const {
    data: productData,
    isError: isProductError,
    error: productError,
    isLoading: productLoading,
  } = useQuery({
    queryKey: ["singleProduct", productId],
    queryFn: fetchSingleProduct,
  });

  const {
    data: reviewData,
    error: reviewError,
    isError: isReviewError,
    isLoading: reviewLoading,
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: fetchReviews,
  });

  // console.log(productData);
  // console.log(reviewData);

  if (productLoading || reviewLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading product details...</div>
      </div>
    );
  }

  if (isProductError || isReviewError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-24">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-red-700">
          {productError || reviewError}
        </div>
      </div>
    );
  }

  const addToCartBackend = async () => {
    try {
      const productId = productData._id;
      const response = await axios.post(
        `http://localhost:8000/v1/cart-items/add/${productId}?quantity=1`,
        {},
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Added to cart:", response.data);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const product = {
    productId: productData,
    quantity: 1,
    title: productData.title,
    productImage: productData.productImage,
    price: productData.price,
    brand: productData.brand._id,
    category: productData.category._id,
    sellerID: productData.sellerInfo._id,
    // sellerName,
  };

  const increase = async () => {
    if (productData.quantityInStock > 0) {
      console.log("Adding to cart", product);
      dispatch(increaseQuantityOrAddToBasket(product));
      await addToCartBackend();
    }
  };

  return (
    <>
      <div className="bg-blue-200 min-h-screen py-4 px-10">
        <div
          onClick={() => navigate(-1)}
          className="bg-blue-500 w-16 p-2 text-center text-white rounded-md cursor-pointer hover:bg-blue-600 hover:scale-105 transition ease-in-out active:scale-95"
        >
          Back
        </div>
        <div className="w-full p-6 rounded-lg shadow-lg bg-gray-200 mt-4">
          <div className="w-full text-gray-800 font-bold flex flex-col lg:flex-row justify-center items-start mb-8">
            <div className="w-full lg:w-1/2 flex justify-center items-center mb-4 lg:mb-0">
              <div className="w-96 h-96 flex justify-center items-center mt-12">
                <img
                  src={productData.productImage}
                  alt={productData.title}
                  className="w-full h-full rounded-lg shadow-md"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2 mx-4 flex flex-col py-6">
              <div className="text-4xl mb-4">{productData.title}</div>
              <div className="text-3xl text-blue-600 mb-4">
                ₹{productData.price}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                {productData.description}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Brand:</span>{" "}
                {productData.brand.name}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Category:</span>{" "}
                {productData.category.category}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">SubCategory:</span>{" "}
                {productData.subCategories?.map((subCategory) => (
                  <span
                    key={subCategory._id}
                    className="mr-2 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-300"
                  >
                    {subCategory.subCategory}
                  </span>
                ))}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">Seller:</span>{" "}
                {productData.sellerInfo.fullName}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold">In Stock:</span>{" "}
                {productData.quantityInStock}
              </div>
              <button
                onClick={increase}
                className="bg-blue-500 text-lg text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out active:scale-95 md:w-1/4"
              >
                {productData.quantityInStock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white my-8 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Reviews</h2>
          {reviewData && reviewData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewData.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col md:flex-row w-full"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="font-semibold mr-2 text-gray-800">
                        {review.user.fullName}
                      </div>
                      <div className="text-yellow-500">
                        {"★".repeat(review.rating)}{" "}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                  {review.images && (
                    <img
                      src={review.images}
                      alt="Review"
                      className="w-24 h-auto ml-4 rounded-lg shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-700">No reviews available.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
