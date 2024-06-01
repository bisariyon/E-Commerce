import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProductOffers } from "../models/productOffers.model.js";
import { Product } from "../models/product.model.js";

//Helper
const generateCode = () => {
  const code = Math.random().toString(36).substring(2, 14);
  return code;
};

//Controller
const addProductOffer = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  let { discountType, discountValue, minimumOrderValue, validTill, validFrom } =
    req.body;

  if (
    [discountType, discountValue, validTill].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(400, "All marked fields are required");
  }

  if (!minimumOrderValue) minimumOrderValue = 0;

  const code = generateCode();

  if (!["percentage", "fixed"].includes(discountType)) {
    throw new ApiError(400, "Invalid discount type");
  }
  if (
    discountType == "percentage" &&
    (discountValue > 100 || discountValue < 0)
  ) {
    throw new ApiError(400, "Invalid discount value");
  }

  const now = new Date();
  if (!validFrom) validFrom = now;
  validFrom = new Date(validFrom);
  validTill = new Date(validTill);

  if (validFrom < now) {
    throw new ApiError(
      400,
      "Invalid date range: validFrom must be in the future"
    );
  }

  if (validTill < validFrom) {
    throw new ApiError(
      400,
      "Invalid date range: validTill must be greater than validFrom"
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerInfo.equals(req.seller._id)) {
    throw new ApiError(403, "Only the product seller can create an offer");
  }

  const productOffer = await ProductOffers.create({
    code,
    discountType,
    discountValue,
    minimumOrderValue,
    validTill,
    validFrom,
    product: productId,
    seller: req.seller._id,
  });

  if (!productOffer) {
    throw new ApiError(400, "Product Offer not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, productOffer, "Product Offer created"));
});

const deleteProductOffer = asyncHandler(async (req, res, next) => {
  const { offerId } = req.params;

  const productOffer = await ProductOffers.findById(offerId);
  if (!productOffer) {
    throw new ApiError(404, "Product Offer not found");
  }

  const product = await Product.findById(productOffer.product);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerInfo.equals(req.seller._id)) {
    throw new ApiError(403, "Only the product seller can delete an offer");
  }

  const deleteOffer = await ProductOffers.findByIdAndDelete(offerId);
  if (!deleteOffer) {
    throw new ApiError(400, "Product Offer not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteOffer, "Product Offer deleted"));
});

const updateProductOffer = asyncHandler(async (req, res, next) => {
  const { offerId } = req.params;
  let { discountType, discountValue, minimumOrderValue, validTill, validFrom } =
    req.body;

  if (
    [
      discountType,
      discountValue,
      minimumOrderValue,
      validFrom,
      validTill,
    ].every((field) => field?.trim() === "" || field === undefined)
  ) {
    throw new ApiError(400, "No changes to update");
  }

  const productOffer = await ProductOffers.findById(offerId);
  if (!productOffer) {
    throw new ApiError(404, "Product Offer not found");
  }

  const product = await Product.findById(productOffer.product);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerInfo.equals(req.seller._id)) {
    throw new ApiError(403, "Only the product seller can delete an offer");
  }

  if (discountType) {
    if (!["percentage", "fixed"].includes(discountType)) {
      throw new ApiError(400, "Invalid discount type");
    }
    productOffer.discountType = discountType;
  }

  if (discountValue) {
    if (
      productOffer.discountType == "percentage" &&
      (discountValue > 100 || discountValue < 0)
    ) {
      throw new ApiError(400, "Invalid discount value");
    }
    productOffer.discountValue = discountValue;
  }

  if (minimumOrderValue) productOffer.minimumOrderValue = minimumOrderValue;

  if (validFrom) {
    productOffer.validFrom = new Date(validFrom);
  }

  if (validTill) {
    if (validTill < validFrom || validTill < new Date()) {
      throw new ApiError(
        400,
        "Invalid date range: validTill must be greater than validFrom and in the future"
      );
    }
    productOffer.validTill = new Date(validTill);
  }

  const updateOffer = await productOffer.save();
  if (!updateOffer) {
    throw new ApiError(400, "Product Offer not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateOffer, "Product Offer updated"));
});

const getSellerOffers = asyncHandler(async (req, res, next) => {
  const sellerOffers = await ProductOffers.find({ seller: req.seller._id }).populate("product");

  if (!sellerOffers) {
    throw new ApiError(404, "No offers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sellerOffers, "Seller offers found"));
});

//Admin routes
const getAllOffers = asyncHandler(async (req, res, next) => {
  const allOffers = await ProductOffers.find();

  if (!allOffers) {
    throw new ApiError(404, "No offers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allOffers, "All offers found"));
});

export {
  addProductOffer,
  deleteProductOffer,
  updateProductOffer,
  getSellerOffers,
  getAllOffers,
};
