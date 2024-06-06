import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/category.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import _ from "mongoose-paginate-v2";
import { sendMailNotification } from "../utils/sendMail.js";
import { ADMIN_EMAIL, PLATFORM_EMAIL } from "../constants.js";
import mongoose from "mongoose";

//Admin
const createBrandByAdmin = asyncHandler(async (req, res, next) => {
  let { name, description, categoryIDs } = req.body;

  // Check if name and description are provided
  if (!name || !description) {
    throw new ApiError(400, "Both name and description are required");
  }

  // Trim inputs
  name = name.trim();
  description = description.trim();

  // Check if categoryIDs are provided
  if (!categoryIDs) {
    throw new ApiError(400, "Categories are required");
  }

  // Split categoryIDs string and trim each category ID
  categoryIDs = categoryIDs.split(",").map((category) => category.trim());

  // Check if each category exists
  for (const categoryID of categoryIDs) {
    const category = await Category.findById(categoryID);
    if (!category) {
      throw new ApiError(400, `Category with ID: ${categoryID} not found`);
    }
  }

  // Check if brand with the same name already exists
  const brand = await Brand.findOne({ name });
  if (brand) {
    throw new ApiError(400, "Brand already exists");
  }

  // Check if logo is uploaded
  const logoLocalePath = req.file.path;
  if (!logoLocalePath) {
    throw new ApiError(400, "Logo is required");
  }

  // Upload logo to Cloudinary
  const logo = await uploadOnCloudinary(logoLocalePath, "brand");
  if (!logo) {
    throw new ApiError(500, "Failed to upload logo");
  }

  try {
    // Create the brand
    const newBrand = await Brand.create({
      name,
      description,
      logo: logo.url,
      categories: categoryIDs,
      verified: true,
    });

    // Populate categories field for the created brand
    const createdBrand = await Brand.findById(newBrand._id).populate({
      path: "categories",
      select: "category",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, createdBrand, "Brand created successfully"));
  } catch (error) {
    // If an error occurs, delete uploaded logo from Cloudinary
    if (logo && logo.public_id) {
      await deleteFromCloudinary(logo.public_id);
    }
    throw new ApiError(500, "Failed to create new brand");
  }
});

const verifyBrand = asyncHandler(async (req, res, next) => {
  const { brandID } = req.params;

  const brand = await Brand.findById(brandID);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  if (brand.verified) {
    throw new ApiError(400, "Brand is already verified");
  }

  brand.verified = true;
  await brand.save();

  return res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand verified successfully"));
});

const getVerifiedOrUnverifiedBrands = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 5,
    sortBy = "_id",
    sortType = "1",
    verified,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const aggregate = Brand.aggregate([
    {
      $match: { verified: verified === "true" ? true : false },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: {
        path: "$categoryInfo",
        preserveNullAndEmptyArrays: true, // Preserve brands without categories
      },
    },
    {
      $group: {
        _id: "$_id",
        brandID: { $first: "$_id" },
        name: { $first: "$name" },
        verified: { $first: "$verified" },
        description: { $first: "$description" },
        categories: {
          $push: {
            categoryID: "$categoryInfo._id",
            categoryName: "$categoryInfo.category",
          },
        },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $project: {
        _id: 0,
        brandName: "$name",
        brandID: 1,
        logo: 1,
        description: 1,
        categories: 1,
        verified: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const brandsPaginated = await Brand.aggregatePaginate(aggregate, options);

  if (!brandsPaginated.docs.length) {
    throw new ApiError(404, "No brands found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, brandsPaginated, "All brands"));
});

const updateBrandByName = asyncHandler(async (req, res, next) => {
  const { brandID } = req.params;
  let { newName, newDescription, categoriesToRemove, categoriesToAdd } =
    req.body;

  const brand = await Brand.findById(brandID);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  if (!newName && !newDescription && !categoriesToRemove && !categoriesToAdd) {
    throw new ApiError(400, "No changes detected");
  }

  newName = newName?.trim() || brand.name;
  newDescription = newDescription?.trim() || brand.description;

  if (categoriesToRemove) {
    categoriesToRemove = categoriesToRemove.split(",").map((c) => c.trim());
  }

  let updatedCategories = [...brand.categories];

  if (categoriesToRemove) {
    for (const categ of categoriesToRemove) {
      const category = await Category.findOne({ category: categ });
      if (category) {
        updatedCategories = updatedCategories.filter(
          (item) => !item.equals(category._id)
        );
      }
    }
  }

  if (categoriesToAdd) {
    categoriesToAdd = categoriesToAdd.split(",").map((c) => c.trim());
    for (const categ of categoriesToAdd) {
      const category = await Category.findOne({ category: categ });
      if (!category) {
        throw new ApiError(404, `Category ${categ} not found`);
      }
      if (!updatedCategories.some((catId) => catId.equals(category._id))) {
        updatedCategories.push(category._id);
      }
    }
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandID,
    {
      name: newName,
      description: newDescription,
      categories: updatedCategories,
    },
    { new: true }
  );

  if (!updatedBrand) {
    throw new ApiError(500, "Failed to update brand");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBrand, "Brand updated"));
});
//or
const updateBrandByID = asyncHandler(async (req, res, next) => {
  const { brandID } = req.params;
  let { newName, newDescription, categoriesToRemove, categoriesToAdd } =
    req.body;

  if (!newName && !newDescription && !categoriesToRemove && !categoriesToAdd) {
    throw new ApiError(400, "No changes detected");
  }

  const brand = await Brand.findById(brandID);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  newName = newName?.trim() || brand.name;
  newDescription = newDescription?.trim() || brand.description;

  let updatedCategories = [...brand.categories];

  // If categories to remove are provided
  if (categoriesToRemove) {
    categoriesToRemove = categoriesToRemove.split(",").map((c) => c.trim());

    for (const categ of categoriesToRemove) {
      const category = await Category.findById(categ);
      if (category) {
        updatedCategories = updatedCategories.filter(
          (item) => !item.equals(category._id)
        );
      }
    }
  }

  // If categories to add are provided
  if (categoriesToAdd) {
    categoriesToAdd = categoriesToAdd.split(",").map((c) => c.trim());

    for (const categ of categoriesToAdd) {
      const category = await Category.findById(categ);
      if (!category) {
        throw new ApiError(404, `Category ${categ} not found`);
      }
      if (!updatedCategories.some((catId) => catId.equals(category._id))) {
        updatedCategories.push(category._id);
      }
    }
  }

  // Update the brand with new values
  const updatedBrand = await Brand.findByIdAndUpdate(
    brandID,
    {
      name: newName,
      description: newDescription,
      categories: updatedCategories,
    },
    { new: true }
  );

  if (!updatedBrand) {
    throw new ApiError(500, "Failed to update brand");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBrand, "Brand updated"));
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  const { brandID } = req.params;

  const deletedBrand = await Brand.findById(brandID);
  if (!deletedBrand) {
    throw new ApiError(404, "Brand not found");
  }

  deletedBrand.active = false;
  const updatedBrand = await deletedBrand.save();
  if (!updatedBrand) {
    throw new ApiError(500, "Failed to delete brand");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBrand, "Brand deleted successfully"));
});

//Public
const listAllBrands = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 5,
    sortBy = "_id",
    sortType = "1",
    brand = "",
    category = "",
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const pipeline = [
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: {
        path: "$categoryInfo",
        preserveNullAndEmptyArrays: true, // Preserve brands without categories
      },
    },
    {
      $group: {
        _id: "$_id",
        brandID: { $first: "$_id" },
        name: { $first: "$name" },
        logo: { $first: "$logo" },
        active: { $first: "$active" },
        verified: { $first: "$verified" },
        description: { $first: "$description" },
        categories: {
          $push: {
            categoryID: "$categoryInfo._id",
            categoryName: "$categoryInfo.category",
            categoryActive: "$categoryInfo.active",
          },
        },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $project: {
        _id: 0,
        brandName: "$name",
        brandID: 1,
        logo: 1,
        description: 1,
        categories: 1,
        verified: 1,
        createdAt: 1,
        updatedAt: 1,
        active: 1,
      },
    },
    {
      $match: {
        active: true,
      },
    },
  ];

  if (brand) {
    pipeline.push({
      $match: { brandID: new mongoose.Types.ObjectId(brand) },
    });
  }

  if (category) {
    pipeline.push({
      $match: {
        "categories.categoryID": new mongoose.Types.ObjectId(category),
      },
    });
  }

  const aggregate = Brand.aggregate(pipeline);
  const brandsPaginated = await Brand.aggregatePaginate(aggregate, options);

  if (!brandsPaginated.docs.length) {
    throw new ApiError(404, "No brands found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, brandsPaginated, "All brands"));
});

const getBrandByID = asyncHandler(async (req, res, next) => {
  const { brandID } = req.params;

  const brand = await Brand.findById(brandID).populate({
    path: "categories",
    select: "category",
  });

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand retrieved successfully"));
});

const getBrandByCategory = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;

  const brands = await Brand.find({ categories: categoryID, active: true });

  if (!brands) {
    throw new ApiError(404, "No brands found for this category");
  }

  const mappedBrands = brands.map((brand) => ({
    _id: brand._id,
    name: brand.name,
    logo: brand.logo,
    description: brand.description,
    verified: brand.verified,
    categoryId: brand.categories[0],
    active: brand.active,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, mappedBrands, "Brand by category"));
});

const getBrandNames = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find({ active: true }).select("name");

  if (!brands) {
    throw new ApiError(404, "No brands found");
  }

  return res.status(200).json(new ApiResponse(200, brands, "All brand names"));
});

//Verified Seller
const requestNewBrand = asyncHandler(async (req, res, next) => {
  const { brandName, description, category } = req.body;

  if (!brandName) {
    throw new ApiError(400, "Brand name is required");
  }

  if (!description) {
    throw new ApiError(400, "Brand description is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const logoLocalePath = req.file?.path;
  if (!logoLocalePath) {
    throw new ApiError(400, "Logo is required");
  }

  const logo = await uploadOnCloudinary(logoLocalePath, "brand");
  if (!logo) {
    throw new ApiError(500, "Failed to upload logo");
  }

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: req.seller.email,
    subject: "New Brand Creation Request",
    html: `
            <p>Dear Seller,</p>
            <p>Your request for a new Brand listing on <em>BISARIYON E-COM</em> has been sent to admin.</p>
            <p>Our team will review your request and get back to you shortly.</p>
            <p>Thank you for choosing <strong><em>BISARIYON E-COM</em></strong></p>
            <p>For any queries, please contact us at <a href="mailto:${PLATFORM_EMAIL}">${PLATFORM_EMAIL}</a></p>
            `,
  };

  const mailSent = await sendMailNotification(mailOptions);
  if (!mailSent) {
    throw new ApiError(500, "Error sending email to admin for brand creation");
  }

  const mailOptionsToAdmin = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: ADMIN_EMAIL,
    subject: "New Brand Creation Request",
    html: `
            <p>A new request for listing a brand on <strong>BISARIYON E-COM</strong> has been made by below given seller</p>
            <p><strong>Seller details</strong></p>
            <p>Name: ${req.seller.fullName}</p>
            <p>Id: ${req.seller._id}</p>
            <p>Email: ${req.seller.email}</p>
            <p>Phone: ${req.seller.phone}</p>
            <p><strong>Brand details</strong></p>
            <p>Brand Name: ${brandName}</p>
            <p>Description: ${description}</p>
            <p>Category: ${category}</p>
            <p>Logo: <img src="${logo.url}" alt="Brand Logo" width="100px" height="100px"></p>
            <p>Logo url: ${logo.url}</p>
            `,
  };

  const mailSentToAdmin = await sendMailNotification(mailOptionsToAdmin);
  if (!mailSentToAdmin) {
    throw new ApiError(500, "Error sending email to admin for brand creation");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Request sent for brand creation"));
});

export {
  createBrandByAdmin,
  verifyBrand,
  getVerifiedOrUnverifiedBrands,
  updateBrandByName,
  updateBrandByID,
  deleteBrand,
  listAllBrands,
  getBrandByID,
  requestNewBrand,
  getBrandByCategory,
  getBrandNames,
};
