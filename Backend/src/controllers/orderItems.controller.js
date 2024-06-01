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

const getOrderItemsBySeller = asyncHandler(async (req, res, next) => {
  const sellerInfo = req.seller._id;
  if (!sellerInfo) {
    throw new ApiError(400, "Only sellers can create products");
  }

  const orderItems = await OrderItems.aggregate([
    {
      $match: { sellerInfo: sellerInfo },
    },
    {
      $lookup: {
        from: "products", // The name of the product collection
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "users", // The name of the user collection
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "orders",
        localField: "orderID",
        foreignField: "_id",
        as: "order",
      },
    },
    {
      $unwind: "$order",
    },
    {
      $lookup: {
        from: "useraddresses", 
        localField: "order.address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $unwind: "$address",
    },
    {
      $project: {
        "product._id": 1,
        "product.title": 1,
        "product.productImage": 1,
        "product.price": 1,

        "user._id": 1,
        "user.fullName": 1,
        "user.email": 1,
        "user.phone": 1,

        "address._id": 1,
        "address.addressLine1": 1,
        "address.addressLine2": 1,
        "address.street": 1,
        "address.city": 1,
        "address.state": 1,
        "address.pincode": 1,
        "address.country": 1,
        "address.contact": 1,

        "order.createdAt": 1,

        status: 1,
        quantity: 1,
        amount: 1,
        orderID: 1,
      },
    },
  ]);


  if (!orderItems) {
    throw new ApiError(404, "Order Items not found");
  }

  if (orderItems.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Order Items found"));
  }

  // console.log(orderItems);

  return res
    .status(200)
    .json(new ApiResponse(200, orderItems, "Order Items found"));
});

export { createOrderItems, getOrderItems, getOrderItemsBySeller };
