import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import refreshCart from "../../utility/refreshCart";
import refreshUser from "../../utility/refreshUser";

function PaymentFailure() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const navigate = useNavigate();

  const location = useLocation();
  const { error } = location.state || {}; // Destructure and provide a default value

  const description = error?.data?.response?.description;
  const orderId = error?.data?.response?.metadata?.order_id;
  const paymentId = error?.data?.response?.metadata?.payment_id;

  const Handler = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 bg-gray-100">
      <img
        src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
        alt="Payment Failed"
        className="mb-4 w-64 h-auto"
      />
      <div className="text-2xl text-red-500 mb-4">Payment Failed</div>
      <div className="text-gray-700 text-center">
        {description && (
          <p className="mb-2">
            <strong>Error Description:</strong> {description}
          </p>
        )}
        {orderId && (
          <p className="mb-2">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        {paymentId && (
          <p className="mb-2">
            <strong>Payment ID:</strong> {paymentId}
          </p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => Handler()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentFailure;
