import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { emptyBasket } from "../store/BasketSlice";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Logo } from "../assets/imports/importImages";

import refreshCart from "../utility/refreshCart";
import refreshUser from "../utility/refreshUser";

function OrderConfirmation() {
  const { refreshUserData } = refreshUser();
  const { refreshCartData } = refreshCart();

  const user = useSelector((state) => state.user.user);
  // console.log("User", user);

  useEffect(() => {
    refreshUserData();
    refreshCartData();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const basket = useSelector((state) => state.basket.basket);

  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [resultant, setResultant] = useState(0);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    let total = 0;
    basket.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);

    const staticDiscount = 50;
    setDiscount(staticDiscount);

    const gst = parseInt(total * 0.1);
    const shipping = parseInt(total * 0.02);

    setResultant(total - staticDiscount + gst + shipping);
  }, [basket]);

  const fetchAddresses = async () => {
    const response = await axios.get("http://localhost:8000/v1/addresses", {
      withCredentials: true,
    });
    return response.data.data;
  };

  const {
    data: addressData,
    isLoading: addressLoading,
    isError: isAddressError,
    error: addressErrors,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    retry: 1,
  });

  //Check Availability of Items in the stock
  const checkCartForOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/cart-items/check",
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  };

  const {
    data: checkCartData,
    isLoading: checkCartLoading,
    isError: isCheckCartError,
    error: checkCartErrors,
  } = useQuery({
    queryKey: ["checkCart"],
    queryFn: checkCartForOrder,
    retry: 1,
    staleTime: 1000 * 10,
  });

  useEffect(() => {
    if (isCheckCartError) {
      console.error("Error checking cart ", checkCartErrors);
      setTimeout(() => {
        navigate("/checkout");
      }, 1000 * 4);
    }
  }, [isCheckCartError, checkCartErrors, navigate]);

  // Confirm Order

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

  const createOrderBackend = async (transactionID) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/orders/create",
        {
          orderId: checkCartData.orderId,
          address: selectedAddress._id,
          transactionID,
          total: resultant,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const createOrderItemsBackend = async (orderId) => {
    try {
      basket.forEach(async (item) => {
        const response = await axios.post(
          "http://localhost:8000/v1/order-items/create",
          {
            orderID: orderId, //
            productID: item.productId,
            sellerInfo: item.seller,
            quantity: item.quantity,
            amount: item.price * item.quantity,
          },
          {
            withCredentials: true,
          }
        );
        console.log("Order Items", response.data.data);
        return response.data.data;
      });
    } catch (error) {
      throw error;
    }
  };

  const checkoutHandler = async (key, orderIdMongoose) => {
    const response = await axios.post(
      "http://localhost:8000/v1/payments/createOrder",
      {
        amount: resultant,
        orderId: orderIdMongoose,
      },
      {
        withCredentials: true,
      }
    );

    const orders = response.data.data;
    // console.log("Orders", response.data.data);
    // console.log("Key", key);
    // console.log("Order ID", orderIdMongoose);

    var options = {
      key,
      amount: resultant,
      currency: "INR",
      name: "BISARIYON ECOM",
      description: "Purchase from Bisariyon E-Com",
      image: Logo,
      order_id: orders.id,
      handler: async function (response) {
        const body = {
          ...response,
        };

        try {
          const validateRes = await axios.post(
            "http://localhost:8000/v1/payments/verifyPayment",
            body,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const jsonRes = validateRes.data;
          console.log("JsonRes", jsonRes);

          // Logic to create Order
          createOrderBackend(jsonRes.data.transactionID);
          createOrderItemsBackend(orderIdMongoose);

          emptyCartBackend();
          dispatch(emptyBasket());
          navigate("/user/payment-success", { state: { transactionID : jsonRes.data.transactionID} });

        } catch (error) {
          navigate("/user/payment-failure", { state: { error: response } });
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone,
      },
      notes: {
        address: "Bisariyon E-com Meerut",
      },
      theme: {
        color: "#012652",
      },
      retry: {
        enabled: false,
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", async function (error) {
      // console.log("Error : ", error.error);

      try {
        const res = await axios.post(
          "http://localhost:8000/v1/payments/paymentfailure",
          {
            response: error.error,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        navigate("/user/payment-failure", { state: { error: res.data } });

      } catch (error) {
        console.error("Error while sending payment failure data:", error);
      }
    });

    razor.open();
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress._id) {
      setAddressError("Please select an address to proceed!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/payments/getKeys",
        {},
        { withCredentials: true }
      );
      const key = response.data.data;
      const orderIdMongoose = checkCartData.orderId;

      checkoutHandler(key, orderIdMongoose);
    } catch (error) {
      console.error("Error fetching payment keys: ", error);
    }
  };

  if (checkCartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="mb-4 w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Checking Availability of Items in the stock...
        </div>
      </div>
    );
  }

  if (isCheckCartError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717079336/f2hoqv8uvksdghgzo6dq.jpg"
          alt="Loading"
          className="mb-4 w-64 h-auto"
        />
        <div className="text-red-500 text-3xl my-0 text-center">
          {checkCartErrors.message}
        </div>
      </div>
    );
  }

  // console.log("Order ID", checkCartData);

  return (
    <div className="-mb-8 bg-purple-300 pb-16">
      <div className="p-4 rounded-lg ">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          onClick={() => setShowAddress(!showAddress)}
        >
          {showAddress ? "Hide Addresses" : "Select Address"}
        </button>

        {showAddress && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 hover:cursor-pointer">
            {addressData &&
              addressData.map((address, index) => (
                <div
                  key={address._id}
                  className="rounded-lg shadow-md p-4 bg-white hover:bg-green-200 duration-100 ease-in-out transform hover:scale-95 transition-all"
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                    setAddressError("");
                  }}
                >
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Address {index + 1}
                  </h3>
                  <div className="text-sm">
                    <p className="hidden">{address._id}</p>
                    <p>{address.addressLine1}</p>
                    <p>{address.addressLine2}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.pincode}</p>
                    <p>{address.country}</p>
                    <p>{address.contact}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="py-4 px-8 rounded-lg mb-8 max-w-md mx-auto mt-4 bg-gradient-to-r from-green-200 via-green-100 to-green-200 shadow-lg">
        <div className="my-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Order Summary:
          </h2>
          <div className="flex gap-6 my-1">
            <div>
              <p className="text-sm text-gray-700 font-semibold">
                Total Price:
              </p>
              <p className="text-sm text-gray-700 font-semibold">Discount:</p>
              <p className="text-sm text-gray-700 font-semibold">GST (10%):</p>
              <p className="text-sm text-gray-700 font-semibold">
                Shipping Charges (2%):
              </p>
              <p className="text-sm text-gray-700 font-semibold">Resultant:</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-semibold">
                ₹ {totalPrice}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                ₹ {discount}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                ₹ {parseInt(totalPrice * 0.1)}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                ₹ {parseInt(totalPrice * 0.02)}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                ₹ {resultant}
              </p>
            </div>
          </div>
        </div>

        {selectedAddress && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Selected Address:
            </h2>
            <div className="text-sm text-gray-700 p-2 border border-green-300 rounded-lg bg-white shadow-inner">
              <p className="hidden">{selectedAddress._id}</p>
              <p>{selectedAddress.addressLine1}</p>
              <p>{selectedAddress.addressLine2}</p>
              <p>{selectedAddress.city}</p>
              <p>{selectedAddress.state}</p>
              <p>{selectedAddress.pincode}</p>
              <p>{selectedAddress.country}</p>
              <p>{selectedAddress.contact}</p>
            </div>
          </div>
        )}
        {addressError && (
          <span className="text-red-500 text-sm my-0">{addressError}</span>
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform active:scale-105 shadow-md"
            onClick={handleConfirmOrder}
          >
            Proceed to Payment
          </button>

          <div className="text-center">
            <p className="text-md text-gray-700 font-bold">
              To Pay ₹{resultant}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
