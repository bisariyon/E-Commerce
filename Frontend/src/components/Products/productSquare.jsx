import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantityOrAddToBasket,
} from "../../store/BasketSlice";
import axios from "axios";

function ProductSquare({
  _id,
  title,
  description,
  price,
  quantityInStock,
  brandname,
  brandId,
  category,
  categoryId,
  subCategory,
  productImage,
  sellerID,
  rating = 2,
}) {
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket.basket);
  const user = useSelector((state) => state.user.user);
  const isVerified = user?.verified || false;

  const initialQuantity = basket.length;
  const [quantity, setQuantity] = useState(initialQuantity);

  const productData = {
    productId: _id,
    quantity: 1,
    title,
    productImage,
    price,
    brand: brandId,
    category: categoryId,
    sellerID,
  };

  const addToCartBackend = async () => {
    try {
      const productId = _id;
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

  const decreaseCartBackend = async () => {
    try {
      const productId = _id;
      const response = await axios.patch(
        `http://localhost:8000/v1/cart-items/decrease/${productId}?quantity=1`,
        {},
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Removed from cart:", response.data);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const decrease = async () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(decreaseQuantity({ productId: _id }));
      await decreaseCartBackend();
    }
  };

  const increase = async () => {
    if (quantity < quantityInStock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      console.log("Adding to cart", productData);
      dispatch(increaseQuantityOrAddToBasket(productData));
      await addToCartBackend();
    }
  };

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [basket]);

  //Wishlist
  const addToWishlistBackend = async (_id) => {
    const productId = _id;
    try {
      const response = await axios.post(
        `http://localhost:8000/v1/wishlist/add/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("Added to wishlist:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  };

  const addToWishlist = async (_id) => {
    console.log("Adding to wishlist", _id);
    addToWishlistBackend(_id);
  };

  return (
    <div
      className="product border border-gray-300 rounded-lg shadow-md z-10 w-full p-5 flex flex-col bg-white"
      id={_id}
    >
      <img
        className="w-full h-48 object-cover rounded-t-lg mb-4"
        src={productImage}
        alt={title}
        style={{ objectFit: "cover" }}
      />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="text-base text-cyan-600 font-semibold mb-2">₹{price}</div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-bold">In Stock:</span> {quantityInStock}
        <br />
        <span className="font-bold">Brand:</span> {brandname}
        <br />
        <span className="font-bold">Category:</span> {category}
        <br />
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-bold">SubCategory:</span>
          <div className="mt-1 flex flex-wrap">
            {subCategory.map((subCat) => (
              <div
                key={subCat.subCategoryID}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 mb-2 hover:bg-gray-300 hover:text-gray-800 cursor-pointer"
              >
                {subCat.subCategoryName}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-4 ">
        <span className="font-bold">Rating: {rating}</span>
      </div>

      <div className="flex items-center mb-4">
        <button
          onClick={decrease}
          className={`bg-red-500 text-white px-4 py-2 rounded-l-md hover:bg-red-600 shadow-md transform hover:scale-105 transition duration-300 ease-in-out active:bg-green-500 text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!isVerified}
        >
          -
        </button>
        {/* <div className="bg-gray-200 text-gray-700 px-4 py-2 text-md">
          {quantity}
        </div> */}
        <button
          onClick={increase}
          className={`bg-cyan-500 text-white px-4 py-2 rounded-r-md hover:bg-cyan-600 shadow-md transform hover:scale-105 transition duration-300 ease-in-out active:bg-green-500 text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!isVerified}
        >
          +
        </button>
        <button
          className="bg-green-500 text-white text-xs lg:text-md p-2 ml-4 lg:ml-6 rounded hover:bg-green-700 active:scale-95"
          onClick={() => addToWishlist(_id)}
        >
          Wishlist
        </button>
      </div>

      <div className="mt-auto flex space-x-3">
        <button className="bg-cyan-500 text-white px-2 py-2 rounded hover:bg-cyan-700 transition duration-300 ease-in-out">
          Add to Cart
        </button>
        <button className="bg-blue-900 text-white px-2 py-2 rounded hover:bg-gray-700 transition duration-300 ease-in-out">
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductSquare;
