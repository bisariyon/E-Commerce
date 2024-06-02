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
  const { page = 1, limit = 5, sortBy = "_id", sortType = "1" } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const aggregate = Order.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $lookup: {
        from: "useraddresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $unwind: "$address",
    },
    {
      $project: {
        _id: 1,
        transactionID: 1,
        status: 1,
        total: 1,
        user:1,
        total:1,
        createdAt: 1,
        address: {
          _id: 1,
          addressLine1: 1,
          addressLine2: 1,
          city: 1,
          state: 1,
          country: 1,
          pincode: 1,
          contact: 1,
        },
      },
    },
  ]);

  const orders = await Order.aggregatePaginate(aggregate, options);

  // const orders = await Order.find({ user }).populate({
  //   path: "address",
  //   select: "-user -__v ",
  // });

  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  return res.status(200).json(new ApiResponse(200, orders, "Orders found"));
});

export { createOrder, getUserOrders };
