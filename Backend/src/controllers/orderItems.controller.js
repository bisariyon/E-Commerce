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

  // console.log("Status",orderItemId, status);

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

  orderItem.status = status;
  const saved = await orderItem.save();
  if (!saved) {
    throw new ApiError(500, "Status not updated");
  }

  return res.status(200).json(new ApiResponse(200, saved, "Status updated"));
});

const getAllOrderAndDetails = asyncHandler(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "_id",
    sortType = "1",
    user = "",
    seller = "",
    status = "",
    before = "",
    after = "",
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const pipeline = [
    {
      $lookup: {
        from: "users",
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
        from: "products",
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
        from: "sellers",
        localField: "sellerInfo",
        foreignField: "_id",
        as: "seller",
      },
    },
    {
      $unwind: "$seller",
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
      $lookup: {
        from: "payments",
        localField: "order.transactionID",
        foreignField: "transactionID",
        as: "payment",
      },
    },
    {
      $unwind: "$payment",
    },
    {
      $project: {
        user_id: "$user._id",
        user_fullName: "$user.fullName",
        user_username: "$user.username",
        user_email: "$user.email",
        user_phone: "$user.phone",
        user_verified: "$user.verified",

        product_id: "$product._id",
        product_title: "$product.title",
        product_productImage: "$product.productImage",
        product_price: "$product.price",
        product_quantityInStock: "$product.quantityInStock",
        product_category: "$product.category",
        product_brand: "$product.brand",
        // product_subCategory: "$product.subCategory",

        seller_id: "$seller._id",
        seller_fullName: "$seller.fullName",
        seller_email: "$seller.email",
        seller_phone: "$seller.phone",
        seller_GSTnumber: "$seller.GSTnumber",
        seller_verified: "$seller.verified",

        order_id: "$order._id",
        order_transactionID: "$order.transactionID",
        order_status: "$order.status",
        order_total: "$order.total",

        address_id: "$address._id",
        address_id: "$address.addressLine1",
        address_addressLine2: "$address.addressLine2",
        address_city: "$address.city",
        address_state: "$address.state",
        address_pincode: "$address.pincode",
        address_country: "$address.country",
        address_contact: "$address.contact",

        payment_id: "$payment._id",
        payment_modeOfPayment: "$payment.modeOfPayment",
        payment_createdAt: "$payment.createdAt",

        amount: 1,
        quantity: 1,
        createdAt: 1,
        status: 1,
      },
    },
  ];

  if (user) {
    pipeline.push({
      $match: { user_id: new mongoose.Types.ObjectId(user) },
    });
  }

  if (seller) {
    pipeline.push({
      $match: { seller_id: new mongoose.Types.ObjectId(seller) },
    });
  }

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
  const orders = await OrderItems.aggregatePaginate(aggregate, options);

  if (!orders) {
    throw new ApiError(404, "Orders not found");
  }

  if (orders.length === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No Orders found"));
  }

  return res.status(200).json(new ApiResponse(200, orders, "Orders found"));
});

export {
  createOrderItems,
  getOrderItems,
  getOrderItemsBySeller,
  getOrderItemById,
  updateStatus,
  getAllOrderAndDetails,
};
