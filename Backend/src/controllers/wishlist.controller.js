import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";

const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  // console.log("Product id is", productId);
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existingWishlist = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });
  if (existingWishlist) {
    throw new ApiError(400, "Product already in wishlist");
  }

  const wishlist = await Wishlist.create({
    user: req.user._id,
    product: productId,
  });
  if (!wishlist) {
    throw new ApiError(400, "Failed to add product to wishlist");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, wishlist,"Product added to wishlist" ));
});

const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // console.log("Product id is", productId);

  if (!productId) {
    throw new ApiError(400, "Product id is required");
  }

  console.log("Product id is", productId);
  const wishlist = await Wishlist.findOneAndDelete({
    user: req.user._id,
    product: productId,
  });

  if (!wishlist) {
    throw new ApiError(404, "Product not found in wishlist")``;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Product removed from wishlist", wishlist));
});

const getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.find({ user: req.user._id }).populate(
    "product"
  );
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched"));
});

const emptyWishlist = asyncHandler(async (req, res, next) => {
  const emptyList = await Wishlist.deleteMany({ user: req.user._id });
  if (!emptyList) {
    throw new ApiError(400, "Failed to empty wishlist");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Wishlist emptied"));
});

export {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
  emptyWishlist,
};
