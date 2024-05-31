import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res, next) => {
  const { orderId, address, transactionID, total } = req.body;
  // console.log(req.body);

  if (!orderId || !address || !transactionID || !total) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const user = req.user._id;

  const newOrder = await Order.create({
    _id: orderId,
    user,
    address,
    transactionID,
    total,
  });

  // console.log(newOrder);

  if (!newOrder) {
    throw new ApiError(500, "Order not created");
  }

  return res.status(201).json(new ApiResponse(201, newOrder, "Order created"));
});

const getUserOrders = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const orders = await Order.find({ user }).populate({
    path: "address",
    select: "-user -__v ",
  });

  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  return res.status(200).json(new ApiResponse(200, orders, "Orders found"));
});

export { createOrder, getUserOrders };
