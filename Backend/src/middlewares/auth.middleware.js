import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Seller } from "../models/seller.model.js";

//User Verification and Authentication
export const verifyJwtToken = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    // console.log("token ",token);

    if (!token) {
      return next(new ApiError(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Invalid Access Token");
    }

    req.user = user;
    // console.log("User : ",req.user);
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifyUser = asyncHandler(async (req, res, next) => {
  if (!req.user.verified) {
    throw new ApiError(400, "Not a verified user");
  }
  next();
});

//Seller verification and Authentication
export const verifyJwtTokenSeller = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const seller = await Seller.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!seller) {
      throw new ApiError(404, "Invalid Access Token");
    }

    req.seller = seller;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifySeller = asyncHandler(async (req, res, next) => {
  if (!req.seller.verified) {
    throw new ApiError(400, "Not a verified seller");
  }
  next();
});
