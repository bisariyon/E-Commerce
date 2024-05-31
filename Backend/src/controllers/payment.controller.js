import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Payment } from "../models/payment.model.js";
import { instance } from "../utils/razorPay.js";
import mongoose from "mongoose";
import crypto from "crypto";

const createOrder = asyncHandler(async (req, res, next) => {
  const { amount, orderId } = req.body;
  // console.log(amount, orderId);

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  if (!orderId) {
    throw new ApiError(400, "orderId is required");
  }

  //check if orderId is valid
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid orderId");
  }

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
    notes: {
      orderId: orderId,
    },
  };

  const orders = await instance.orders.create(options);
  // console.log(orders);
  if (!orders) {
    new ApiError(400, "Error creating payment order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Payment order created successfully"));
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // console.log(req.body);

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  // console.log(isAuthentic);

  if (!isAuthentic) {
    console.log("Payment Failed");
    throw new Error("Invalid Signature || Payment Failed");
  }

  const payment = await instance.payments.fetch(razorpay_payment_id);
  if (!payment) {
    throw new ApiError(400, "No payment found");
  }

  // const response = {
  //   razorpay_order_id: razorpay_order_id,
  //   razorpay_payment_id: razorpay_payment_id,
  //   razorpay_signature: razorpay_signature,
  //   paymentStatus: payment.status,
  //   paymentMethod: payment.method,
  //   mongooseOrderId: payment.notes.orderId,
  //   payment,
  // };

  //Database Logic
  const newPayment = await Payment.create({
    orderID: payment.notes.orderId,
    user: req.user._id,
    modeOfPayment: payment.method,
    total: payment.amount/100,
    transactionID: razorpay_payment_id,
  });
  if (!newPayment) {
    throw new ApiError(
      400,
      "Error creating payment || Your payment will be refunded"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newPayment, "Payment Successful"));
});

const fetchOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await instance.orders.fetch(id);
  if (!order) {
    throw new ApiError(400, "Error fetching order");
  }

  return res.status(200).json(new ApiResponse(200, order, "Order fetched"));
});

const fetchPayment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const payment = await instance.payments.fetch(id);
  if (!payment) {
    throw new ApiError(400, "No payment found");
  }

  return res.status(200).json(new ApiResponse(200, payment, "Payment fetched"));
});

const paymentfailure = asyncHandler(async (req, res, next) => {
  const { response } = req.body;
  // console.log("Payment Failed Response:", response);

  return res.status(200).json(new ApiResponse(200, {response}, "Payment Failed"));
});

const getKeys = asyncHandler(async (req, res, next) => {
  const keyId = process.env.RAZORPAY_API_KEY;
  // console.log(key_id);
  return res.status(200).json(new ApiResponse(200, keyId, "Key fetched"));
});

export {
  createOrder,
  verifyPayment,
  fetchOrder,
  fetchPayment,
  paymentfailure,
  getKeys,
};
