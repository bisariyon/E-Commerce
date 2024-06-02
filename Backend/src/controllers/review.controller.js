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

  // console.log("Files", req.file);
  if (!req.file || req.file.length === 0) {
    return next(new ApiError(400, "At least one image is required"));
  }

  let images;
  try {
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
      throw new ApiError(400, "Image is required");
    }

    images = await uploadOnCloudinary(imageLocalPath);
    if (!images) {
      throw new ApiError(500, "Error in uploading images");
    }

    // console.log(product.sellerInfo)
    const review = await Review.create({
      comment,
      rating,
      user: req.user._id,
      product: productId,
      images: images.url,
      seller: product.sellerInfo,
    });

    if (!review) {
      throw new ApiError(500, "Error adding review");
    }

    // console.log("Review", review);

    return res
      .status(201)
      .json(new ApiResponse(201, review, "Review added successfully"));
  } catch (error) {
    if (images.public_id) {
      await deleteFromCloudinary(images.public_id);
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

    const image = deletedReview.images;
    const parts = image.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    await deleteFromCloudinary(publicId);

    res.json(new ApiResponse(200, null, "Review deleted successfully"));
  } catch (error) {
    throw new ApiError(500, {}, "Error deleting review");
  }
});

const updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  let { comment, rating } = req.body;

  // Validation
  if (!comment && !rating) {
    throw ApiError(400, "Comment and rating are required");
  }

  if (rating && ![1, 2, 3, 4, 5].includes(Number(rating))) {
    new ApiError(400, "Rating must be between 1 and 5");
  }

  // Find the review
  const review = await Review.findOne({
    user: req.user._id,
    _id: reviewId,
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Update comment and rating
  if (comment) review.comment = comment;
  if (rating) review.rating = rating;

  // Handle image deletions
  // if (deleteImages && deleteImages.length > 0) {
  //   await Promise.all(
  //     deleteImages.map(async (image) => {
  //       const parts = image.split("/");
  //       const publicId = parts[parts.length - 1].split(".")[0];
  //       await deleteFromCloudinary(publicId);
  //       review.images = review.images.filter((img) => img !== image);
  //     })
  //   );
  // }

  //Single image delete
  if (review.images) {
    console.log("Review images", review.images);
    const parts = review.images.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  //For now single image upload
  const image = req.file?.path;
  if (!image) return next(new ApiError(400, "Image is required"));

  const uploadImage = await uploadOnCloudinary(image);
  if (!uploadImage) {
    throw new ApiError(500, "Error uploading image");
  }

  // Handle new image uploads
  // if (req.files && req.files.length > 0) {
  //   const localImages = req.files.map((file) => file.path);
  //   const uploadPromises = localImages.map((localImage) =>
  //     uploadOnCloudinary(localImage)
  //   );
  //   const uploadResults = await Promise.all(uploadPromises);
  //   uploadResults.forEach((uploadImage) => {
  //     if (uploadImage && uploadImage.url) {
  //       review.images.push(uploadImage.url);
  //     } else {
  //       throw new ApiError(500, "Error uploading image");
  //     }
  //   });
  // }

  // Save the updated review
  review.images = uploadImage.url;
  const updatedReview = await review.save();
  if (!updatedReview) {
    throw new ApiError(500, "Error updating review");
  }

  res.json(new ApiResponse(200, updatedReview, "Review updated successfully"));
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
    limit = 9,
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
        createdAt: 1,
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

//Seller
const getSellerReviews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 9, sortBy = "_id", sortType = "1" } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const sellerId = req.seller._id;
  if (!sellerId) {
    throw new ApiError(400, "Only sellers can view reviews");
  }

  const aggregate = Review.aggregate([
    {
      $match: { seller: sellerId },
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
      $project: {
        _id: 1,
        comment: 1,
        rating: 1,
        images: 1,
        createdAt: 1,
        seller: 1,
        createdAt: 1,
        product: {
          _id: 1,
          title: 1,
          productImage: 1,
        },
        user: {
          _id: 1,
          fullName: 1,
          username: 1,
        },
      },
    },
  ]);

  const reviews = await Review.aggregatePaginate(aggregate, options);

  if (!reviews) {
    throw new ApiError(404, "No reviews found");
  }

  return res.json(
    new ApiResponse(200, reviews, "Reviews retrieved successfully")
  );
});

export {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getUserReviews,
  getSellerReviews,
};
