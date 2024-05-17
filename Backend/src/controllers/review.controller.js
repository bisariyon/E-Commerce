import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { OrderItems } from "../models/orderItems.model.js";

const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return next(new ApiError(400, "Comment and rating are required"));
  }

  if (![1, 2, 3, 4, 5].includes(Number(rating))) {
    return next(new ApiError(400, "Rating must be between 1 and 5"));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  const reviewExists = await Review.findOne({
    user: req.user._id,
    product: productId,
  });
  if (reviewExists) {
    return next(new ApiError(400, "You have already reviewed this product"));
  }

  const ifEligible = await OrderItems.findOne({
    productID: productId,
    user: req.user._id,
  });

  if (!ifEligible) {
    return next(
      new ApiError(400, "You can only review products you have purchased")
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, "At least one image is required"));
  }

  try {
    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const uploadImage = await uploadOnCloudinary(req.files[i].path);
      if (!uploadImage) {
        return next(new ApiError(500, "Error uploading image"));
      }
      images.push(uploadImage.url);
    }

    const review = await Review.create({
      comment,
      rating,
      user: req.user._id,
      product: productId,
      images,
    });

    res
      .status(201)
      .json(new ApiResponse(201, review, "Review added successfully"));
  } catch (error) {
    if (images.length > 0) {
      images.forEach(async (image) => {
        await deleteFromCloudinary(image);
      });
    }
    throw new ApiError(500, "Error adding review");
  }
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findOneAndDelete({
      user: req.user._id,
      _id: reviewId,
    });

    if (!deletedReview) {
      return next(new ApiError(404, "Review not found"));
    }

    deletedReview.images.forEach(async (image) => {
      await deleteFromCloudinary(image);
    });

    res.json(new ApiResponse(200, null, "Review deleted successfully"));
  } catch (error) {
    throw new ApiError(500, {}, "Error deleting review");
  }
});

const updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;

  if (!comment && !rating) {
    return next(new ApiError(400, "Comment and rating are required"));
  }

  if (![1, 2, 3, 4, 5].includes(Number(rating))) {
    return next(new ApiError(400, "Rating must be between 1 and 5"));
  }

  const review = await Review.findOneAndUpdate(
    {
      user: req.user._id,
      _id: reviewId,
    },
    {
      comment,
      rating,
    },
    { new: true }
  );

  if (!review) {
    return next(new ApiError(404, "Review not found"));
  }

  res.json(new ApiResponse(200, review, "Review updated successfully"));
});

const getReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId }).populate({
    path: "user",
    select: "fullName username",
  });
  if (!reviews) {
    return next(new ApiError(404, "No reviews found"));
  }

  return res.json(
    new ApiResponse(200, reviews, "Reviews retrieved successfully")
  );
});

const getUserReviews = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "_id",
    sortType = "1",
    query,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const aggregate = Review.aggregate([
    {
      $match: { user: req.user._id },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        rating: 1,
        images: 1,
        product: {
          _id: 1,
          title: 1,
          productImage: 1,
        },
      },
    },
  ]);

  const reviews = await Review.aggregatePaginate(aggregate, options);
  if (!reviews) {
    return next(new ApiError(404, "No reviews found"));
  }

  return res.json(
    new ApiResponse(200, reviews, "Reviews retrieved successfully")
  );
});

export { addReview, deleteReview, updateReview, getReviews, getUserReviews };