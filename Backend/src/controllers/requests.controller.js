import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "../models/requests.model.js";
import { sendMailNotification } from "../utils/sendMail.js";
import { ADMIN_EMAIL, PLATFORM_EMAIL } from "../constants.js";
import mongoose from "mongoose";

const createRequest = asyncHandler(async (req, res, next) => {
  const { type, orderItems, transactionID } = req.body;
  // console.log(type, orderItems, transactionID)

  if (!type) {
    throw new ApiError(400, "Type is required");
  }

  if (!orderItems) {
    throw new ApiError(400, "orderItems is required");
  }

  if (!transactionID) {
    throw new ApiError(400, "transactionID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(orderItems)) {
    throw new ApiError(400, "Invalid orderItems");
  }

  const request = await Request.create({
    type,
    orderItems,
    transactionID,
  });

  const mailOptionsToAdmin = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: ADMIN_EMAIL,
    subject: `Request for ${type}`,
    html: `
        <h2>Requet ID: ${request._id}</h2>
        <h3>Request for ${type}</h3>
        <p>Order Items: ${orderItems}</p>
        <p>Transaction ID: ${transactionID}</p>
                `,
  };

  const mailSentToAdmin = await sendMailNotification(mailOptionsToAdmin);
  if (!mailSentToAdmin) {
    throw new ApiError(500, "Error sending email for request to admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, request, "Request created successfully"));
});

const updateRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;

  if (!requestId) {
    throw new ApiError(400, "requestId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid requestId");
  }

  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  request.active = false;

  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request updated successfully"));
});

const checkRequest = asyncHandler(async (req, res, next) => {
  const { orderItemsID } = req.body;

  if (!orderItemsID) {
    throw new ApiError(400, "requestId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(orderItemsID)) {
    throw new ApiError(400, "Invalid orderItemsID");
  }

  const request = await Request.findOne({ orderItems: orderItemsID });
  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return res.status(200).json(new ApiResponse(200, request, "Request found"));
});

const getAllRequest = asyncHandler(async (req, res, next) => {
  const requests = await Request.find();

  return res.status(200).json(new ApiResponse(200, requests, "Requests found"));
});

export { createRequest, updateRequest, checkRequest,getAllRequest };
