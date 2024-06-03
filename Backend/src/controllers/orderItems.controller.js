import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItems } from "../models/orderItems.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const createOrderItems = asyncHandler(async (req, res, next) => {
  const user = req.user._id;

  const { orderID, productID, sellerInfo, quantity, amount } = req.body;
  console.log(req.body);

  if (!orderID || !productID || !sellerInfo || !quantity || !amount) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const product = await Product.findByIdAndUpdate(productID, {
    $inc: { quantityInStock: -quantity },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
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
    await Product.findByIdAndUpdate(productID, {
      $inc: { stock: quantity },
    });
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
    select: "title productImage price",
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

  const {
    page = 1,
    limit = 10,
    sortBy = "_id",
    sortType = "1",
    status,
    before,
    after,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const pipeline = [
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

        createdAt: 1,
        status: 1,
        quantity: 1,
        amount: 1,
        orderID: 1,
      },
    },
  ];

  if (status) {
    pipeline.push({
      $match: { status: { $regex: status, $options: "ix" } },
    });
  }

  if (before) {
    pipeline.push({
      $match: { createdAt: { $lte: new Date(before) } },
    });
  }

  if (after) {
    pipeline.push({
      $match: { createdAt: { $gte: new Date(after) } },
    });
  }

  const aggregate = OrderItems.aggregate(pipeline);
  const orderItems = await OrderItems.aggregatePaginate(aggregate, options);

  if (!orderItems) {
    throw new ApiError(404, "Order Items not found");
  }

  if (orderItems.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No Order Items found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orderItems, "Order Items found"));
});

const getOrderItemById = asyncHandler(async (req, res, next) => {
  const { orderItemId } = req.params;
  console.log(orderItemId);

  const orderItem = await OrderItems.findById(orderItemId)
    .populate("user")
    .populate("productID");
  if (!orderItem) {
    throw new ApiError(404, "Order Item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orderItem, "Order Items found"));
});

const updateStatus = asyncHandler(async (req, res, next) => {
  const { orderItemId } = req.params;
  const { status } = req.body;

  if (!orderItemId) {
    throw new ApiError(400, "Please provide orderItemId");
  }

  if (!status) {
    throw new ApiError(400, "Please provide status");
  }

  const orderItem = await OrderItems.findById(orderItemId);
  if (!orderItem) {
    throw new ApiError(500, "Status not updated");
  }

  if (orderItem.sellerInfo.toString() !== req.seller._id.toString()){
    // console.log(orderItem.sellerInfo, req.seller._id);
    throw new ApiError(401, "Unauthorized to update status");
  }

  orderItem.status = status;
  const saved = await orderItem.save();
  if (!saved) {
    throw new ApiError(500, "Status not updated");
  }

  return res.status(200).json(new ApiResponse(200, saved, "Status updated"));
});

export {
  createOrderItems,
  getOrderItems,
  getOrderItemsBySeller,
  getOrderItemById,
  updateStatus,
};
