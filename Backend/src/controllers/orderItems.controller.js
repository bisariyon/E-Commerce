import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItems } from "../models/orderItems.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const createOrderItems = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const { orderID, productID, sellerInfo, quantity, amount } = req.body;
  //   console.log(req.body);

  if (!orderID || !productID || !sellerInfo || !quantity || !amount) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const newOrderItem = await OrderItems.create({
    orderID,
    productID,
    sellerInfo,
    quantity,
    amount,
    user,
  });

  if (!newOrderItem) {
    throw new ApiError(500, "Order Item not created");
  }
  //   console.log(newOrderItem);

  return res
    .status(201)
    .json(new ApiResponse(201, newOrderItem, "Order Item created"));
});

const getOrderItems = asyncHandler(async (req, res, next) => {
  const { orderID } = req.params;
  // console.log(orderID);

  if (!orderID) {
    throw new ApiError(400, "Please provide order ID");
  }

  const checkOrder = await Order.findById(orderID);
  if (!checkOrder) {
    throw new ApiError(404, "Order not found");
  }

  const orderItems = await OrderItems.find({
    orderID,
    user: req.user._id,
  }).populate({
    path: "productID",
    select: "title productImage",
  });
  if (!orderItems) {
    throw new ApiError(404, "Order Items not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orderItems, "Order Items found"));
});

export { createOrderItems, getOrderItems };
