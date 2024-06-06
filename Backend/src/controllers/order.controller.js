import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { OrderItems } from "../models/orderItems.model.js";
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
        user: 1,
        total: 1,
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

// const getAllOrdersDetails = asyncHandler(async (req, res, next) => {
//   const {
//     page = 1,
//     limit = 5,
//     sortBy = "_id",
//     sortType = "1",
//     user = "",
//     before = "",
//     after = "",
//   } = req.query;

//   const options = {
//     page: parseInt(page),
//     limit: parseInt(limit),
//     sort: { [sortBy]: parseInt(sortType) },
//   };

//   const pipeline = [
//     {
//       $lookup: {
//         from: "useraddresses",
//         localField: "address",
//         foreignField: "_id",
//         as: "address",
//       },
//     },
//     {
//       $unwind: "$address",
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "user",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     {
//       $unwind: "$user",
//     },
//     {
//       $lookup: {
//         from: "payments",
//         localField: "transactionID",
//         foreignField: "transactionID",
//         as: "payment",
//       },
//     },
//     {
//       $unwind: "$payment",
//     },
//     {
//       $project: {
//         _id: 1,
//         status: 1,
//         total: 1,
//         user: {
//           _id: 1,
//           username: 1,
//           fullName: 1,
//           email: 1,
//           phone: 1,
//         },
//         total: 1,
//         createdAt: 1,
//         address: {
//           _id: 1,
//           addressLine1: 1,
//           addressLine2: 1,
//           city: 1,
//           state: 1,
//           country: 1,
//           pincode: 1,
//           contact: 1,
//         },
//         payment: {
//           _id: 1,
//           modeOfPayment: 1,
//           transactionID: 1,
//         },
//       },
//     },
//   ];

//   if (user) {
//     pipeline.unshift({
//       $match: { user: new mongoose.Types.ObjectId(user) },
//     });
//   }

//   if (before) {
//     pipeline.unshift({
//       $match: { createdAt: { $lte: new Date(before) } },
//     });
//   }

//   if (after) {
//     pipeline.unshift({
//       $match: { createdAt: { $gte: new Date(after) } },
//     });
//   }

//   const aggregate = Order.aggregate(pipeline);
//   const orders = await Order.aggregatePaginate(aggregate, options);

//   if (!orders) {
//     throw new ApiError(404, "No orders found");
//   }

//   return res.status(200).json(new ApiResponse(200, orders, "Orders found"));
// });

const getAllOrdersDetails = asyncHandler(async (req, res, next) => {
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
      $lookup: {
        from: "sellers",
        localField: "product.sellerInfo",
        foreignField: "_id",
        as: "product.seller",
      },
    },
    {
      $unwind: "$product.seller",
    },
    {
      $project: {
        order_id: "$order._id",
        user: {
          _id: "$user._id",
          fullName: "$user.fullName",
          username: "$user.username",
          email: "$user.email",
          phone: "$user.phone",
          verified: "$user.verified",
        },
        product: {
          _id: "$product._id",
          title: "$product.title",
          productImage: "$product.productImage",
          price: "$product.price",
          quantityInStock: "$product.quantityInStock",
          category: "$product.category",
          brand: "$product.brand",
          subCategory: "$product.subCategory",
          seller: {
            _id: "$product.seller._id",
            fullName: "$product.seller.fullName",
            email: "$product.seller.email",
            phone: "$product.seller.phone",
            GSTnumber: "$product.seller.GSTnumber",
          },
        },
        order: {
          _id: "$order._id",
          transactionID: "$order.transactionID",
          status: "$order.status",
          total: "$order.total",
          createdAt: "$order.createdAt",
        },
        address: {
          _id: "$address._id",
          addressLine1: "$address.addressLine1",
          addressLine2: "$address.addressLine2",
          street: "$address.street",
          city: "$address.city",
          state: "$address.state",
          pincode: "$address.pincode",
          country: "$address.country",
          contact: "$address.contact",
        },
        payment: {
          _id: "$payment._id",
          modeOfPayment: "$payment.modeOfPayment",
          createdAt: "$payment.createdAt",
        },
        amount: 1,
        quantity: 1,
        createdAt: 1,
        status: 1,
      },
    },
    {
      $group: {
        _id: "$order._id",
        user: { $first: "$user" },
        order: { $first: "$order" },
        address: { $first: "$address" },
        payment: { $first: "$payment" },
        userId: { $first: "$user._id" },
        items: {
          $push: {
            product: {
              product_id: "$product._id",
              product_title: "$product.title",
              product_price: "$product.price",
              product_quantityInStock: "$product.quantityInStock",
              product_category: "$product.category",
              product_brand: "$product.brand",
              product_subCategory: "$product.subCategory",
              product_seller: "$product.seller",
              product_productImage: "$product.productImage",
            },
            amount: "$amount",
            quantity: "$quantity",
            createdAt: "$createdAt",
            status: "$status",
          },
        },
      },
    },
  ];

  if (user) {
    pipeline.push({
      $match: { userId: new mongoose.Types.ObjectId(user) },
    });
  }

  // if (seller) {
  //   pipeline.push({
  //     $match: { "seller._id": new mongoose.Types.ObjectId(seller) },
  //   });
  // }

  if (status) {
    pipeline.push({
      $match: { "order.status": { $regex: status, $options: "ix" } },
    });
  }

  if (before) {
    pipeline.push({
      $match: { "order.createdAt": { $lte: new Date(before) } },
    });
  }

  if (after) {
    pipeline.push({
      $match: { "order.createdAt": { $gte: new Date(after) } },
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

export { createOrder, getUserOrders, getAllOrdersDetails };
