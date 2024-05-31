import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItems } from "../models/orderItems.model.js";
import mongoose from "mongoose";

const createCartItems = asyncHandler(async (req, res, next) => {
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

export { createCartItems };
