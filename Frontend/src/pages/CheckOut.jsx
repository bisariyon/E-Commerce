import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CartProduct, Modal } from "../index";
import axios from "axios";
import { emptyBasket } from "../store/BasketSlice";

function CheckOut() {
  const basket = useSelector((state) => state.basket.basket);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const emptyCartBackend = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/v1/cart-items/empty`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("Cart Emptied", response.data);
      }
    } catch (error) {
      console.error("Failed to empty the cart:", error);
    }
  };

  const emptyCart = async () => {
    dispatch(emptyBasket());
    await emptyCartBackend();
  };

  const handleEmptyCartClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmEmptyCart = async () => {
    await emptyCart();
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-screen m-4">
      {/* Left Portion - Products */}
      <div className="lg:col-span-3 bg-gray-200 p-6 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {basket.map((product) => (
            <CartProduct
              key={product.productId}
              productId={product.productId}
              title={product.title}
              price={product.price}
              productImage={product.productImage}
              quantity={product.quantity}
            />
          ))}
        </div>
      </div>

      {/* Right Portion - Checkout */}
      <div className="lg:col-span-1 p-4 bg-indigo-200 rounded-xl flex flex-col items-center">
        <div className="text-xl font-semibold mb-4">Total: $200</div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-lg mb-4">
          Place Order
        </button>

        <div
          className="bg-gray-100 rounded-md p-3 flex items-center justify-center w-auto hover:bg-slate-400 active:bg-slate-500 active:scale-90 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          onClick={handleEmptyCartClick}
        >
          <img
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716645390/qukkwf5h4ymdb6owdcla.png"
            alt="Empty Cart"
            className="mr-2 w-16"
          />
          <span className="text-lg font-bold text-purple-900">Empty Cart</span>
        </div>
      </div>

      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmEmptyCart}
        message="Are you sure you want to empty the cart?"
      />
    </div>
  );
}

export default CheckOut;
