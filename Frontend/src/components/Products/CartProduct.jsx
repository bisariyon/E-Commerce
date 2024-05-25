import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  onlyIncreaseQuantity,
  removeFromBasket,
} from "../../store/BasketSlice";
import axios from "axios";

function CartProduct({
  productId = "1",
  title = "Test",
  price = "50",
  productImage = "https://picsum.photos/200",
  quantity = "10",
}) {
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket.basket);
  // const [quantity, setQuantity] = useState(initialQuantity);

  const addToCartBackend = async () => {
    try {
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
      const response = await axios.patch(
        `http://localhost:8000/v1/cart-items/decrease/${productId}?quantity=1`,
        {},
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Cart Updated cart:", response.data);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const removeFromCartBackend = async (productId) => {
    console.log("Removing from cart:", productId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/v1/cart-items/remove/${productId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("Removed from cart:", response.data);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const decrease = async () => {
    // if (quantity > 0) {
    await decreaseCartBackend();
    dispatch(decreaseQuantity({ productId }));
    // }
  };

  const increase = async () => {
    // if (quantity < quantityInStock) {
    dispatch(onlyIncreaseQuantity({ productId }));
    await addToCartBackend();
    // }
  };

  const remove = async () => {
    dispatch(removeFromBasket({ productId }));
    await removeFromCartBackend(productId);
  };

  return (
    <div
      id={productId}
      className="flex items-start border-b border-gray-200 py-4 bg-green-100 p-4 rounded-lg shadow-md"
    >
      <div className="w-32 h-32 bg-gray-200 rounded-lg mr-4 overflow-hidden">
        <img
          src={productImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-md font-bold text-green-700">{title}</div>
          <div className="flex items-center mt-1">
            <span className="text-sm font-semibold text-gray-700 mr-2">
              Price:
            </span>
            <span className="text-md text-green-600 font-bold">
              ₹ {parseInt(price)}
            </span>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <div className="flex items-center">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-l-md hover:bg-red-600 transition duration-300 ease-in-out"
              onClick={decrease}
            >
              -
            </button>
            <div className="bg-gray-100 text-gray-700 px-2 py-1 text-base">
              {basket.find((item) => item.productId === productId).quantity}
            </div>
            <button
              className="bg-cyan-500 text-white px-2 py-1 rounded-r-md hover:bg-cyan-600 transition duration-300 ease-in-out"
              onClick={increase}
            >
              +
            </button>
          </div>

          <button
            className="ml-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={remove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
