import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Brand } from "../models/brand.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import mongoose from "mongoose";

//Verified Seller routes
const createProduct = asyncHandler(async (req, res, next) => {
  const sellerInfo = req.seller._id;
  if (!sellerInfo) {
    throw new ApiError(400, "Only sellers can create products");
  }

  const seller = await Seller.findById(sellerInfo);
  if (!seller.verified) {
    throw new ApiError(400, "Seller is not verified yet");
  }

  let {
    title,
    description,
    price,
    quantityInStock,
    brand,
    category,
    subCategories,
  } = req.body;

  if (!title) throw new ApiError(400, "Title is required");
  if (!description) throw new ApiError(400, "Description is required");
  if (!price) throw new ApiError(400, "Price is required");
  if (!quantityInStock) throw new ApiError(400, "Max Quantity is required");
  if (!brand) throw new ApiError(400, "Brand is required");

  if (!category) throw new ApiError(400, "Category is required");
  if (!subCategories || subCategories.length === 0)
    throw new ApiError(400, "SubCategories are required");

  quantityInStock = parseInt(quantityInStock);
  price = parseInt(price);

  const productImageLocalPath = req.file.path;
  if (!productImageLocalPath) {
    throw new ApiError(400, "Product Image is required");
  }

  const productImage = await uploadOnCloudinary(productImageLocalPath);
  if (!productImage) {
    throw new ApiError(500, "Error uploading image");
  }

  //check if category exists
  if (!seller.niche.includes(category)) {
    throw new ApiError(
      400,
      "Product's category does not match existing seller niche"
    );
  }

  //check if brand exists
  const brandExists = await Brand.findById(brand);
  if (!brandExists || !brandExists.categories.includes(category)) {
    throw new ApiError(
      400,
      "Brand does not exist or does not belong to category"
    );
  }

  //check if subCategory exists
  subCategories = subCategories
    .split(",")
    .map((subCategory) => subCategory.trim());

  const validSubCategories = [];

  for (const subCategory of subCategories) {
    const subCategoryExists = await SubCategory.findById(subCategory);
    if (!subCategoryExists || !subCategoryExists.category.equals(category)) {
      throw new ApiError(
        400,
        "SubCategory does not exist or does not belong to the category"
      );
    }
    validSubCategories.push(subCategoryExists._id);
  }

  try {
    const newProduct = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price,
      quantityInStock,
      brand: brand.trim(),
      category,
      subCategories: validSubCategories,
      sellerInfo,
      productImage: productImage.url,
    });

    res.status(201).json(new ApiResponse(201, newProduct, "Product created"));
  } catch (error) {
    if (productImage && productImage.public_id) {
      await deleteFromCloudinary(productImage.public_id);
    }
    throw new ApiError(500, "Error creating product");
  }
});

//Seller routes
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerInfo.equals(req.seller._id)) {
    throw new ApiError(403, "You are not authorized to delete this product");
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(500, "Error deleting product");
  }

  const parts = deletedProduct.productImage.split("/");
  const deletedImagePublicId = parts[parts.length - 1].split(".")[0];
  console.log("deletedImagePublicId", deletedImagePublicId);

  await deleteFromCloudinary(deletedImagePublicId);

  res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  let {
    title,
    description,
    price,
    quantityInStock,
    brand,
    category,
    subCategories,
  } = req.body;

  if (
    !title &&
    !description &&
    !price &&
    !quantityInStock &&
    !brand &&
    !category &&
    !subCategories
  ) {
    throw new ApiError(400, "No fields to update");
  }

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.sellerInfo.equals(req.seller._id)) {
    throw new ApiError(403, "You are not authorized to update this product");
  }

  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (quantityInStock) {
    quantityInStock = parseInt(quantityInStock);
    product.quantityInStock = quantityInStock;
  }

  let brandExists, categoryExists;
  if (brand) {
    brandExists = await Brand.findById(brand);
    if (!brandExists) {
      throw new ApiError(400, "Brand does not exist");
    }
    product.brand = brand;
  }

  if (category) {
    categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(400, "Category does not exist");
    }

    const searchBrand = brandExists || (await Brand.findById(product.brand));
    if (!searchBrand.categories.includes(category)) {
      throw new ApiError(400, "Category does not belong to the brand");
    }

    product.category = category;
  }

  if (subCategories) {
    const validSubCategories = subCategories
      .split(",")
      .map((subCategory) => subCategory.trim());

    for (const subCategory of validSubCategories) {
      const subCategoryExists = await SubCategory.findById(subCategory);
      if (
        !subCategoryExists ||
        !subCategoryExists.category.equals(product.category)
      ) {
        throw new ApiError(
          400,
          "SubCategory does not exist or does not belong to the category"
        );
      }
    }

    product.subCategories = validSubCategories;
  }

  const updatedProduct = await product.save();
  if (!updatedProduct) {
    throw new ApiError(500, "Error updating product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
}); //Working but edges cases check needed i guess

//Public routes
const getProducts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "_id",
    sortType = "1",
    minQuantity,
    query,
    brand,
    category,
    subCategory,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  const pipeline = [
    {
      $match: {
        $or: [
          {
            description: { $regex: query || "", $options: "ix" },
          },
          {
            title: { $regex: query || "", $options: "ix" },
          },
          {
            "brand.brandname": { $regex: query || "", $options: "ix" },
          },
        ],
      },
    },
    {
      $match: {
        quantityInStock: { $gte: parseInt(minQuantity) || 0 },
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: "$brand",
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategories",
        foreignField: "_id",
        as: "subCategories",
      },
    },
    {
      $unwind: "$subCategories",
    },
    {
      $lookup: {
        from: "sellers",
        localField: "sellerInfo",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    {
      $unwind: "$sellerInfo",
    },
    {
      $group: {
        _id: "$_id",

        title: { $first: "$title" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        quantityInStock: { $first: "$quantityInStock" },
        ratings: { $first: "$ratings" },
        brand: { $first: "$brand" },
        category: { $first: "$category" },
        sellerInfo: { $first: "$sellerInfo" },
        productImage: { $first: "$productImage" },

        list: {
          $push: {
            subCategoryName: "$subCategories.subCategory",
            subCategoryID: "$subCategories._id",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        quantityInStock: 1,
        ratings: 1,
        brand: {
          brandname: "$brand.name",
          brandID: "$brand._id",
        },
        category: {
          categoryName: "$category.category",
          categoryID: "$category._id",
        },
        subCategory: "$list",
        sellerInfo: {
          sellerName: "$sellerInfo.fullName",
          sellerID: "$sellerInfo._id",
          GSTNumber: "$sellerInfo.GSTnumber",
        },
        productImage: 1,
      },
    },
  ];

  if (brand) {
    pipeline.push({
      $match: {
        "brand.brandname": { $regex: brand || "", $options: "ix" },
      },
    });
  }

  if (category) {
    pipeline.push({
      $match: {
        "category.categoryName": { $regex: category || "", $options: "i" },
      },
    });
  }

  if (subCategory) {
    pipeline.push({
      $match: {
        "subCategory.subCategoryName": {
          $regex: subCategory || "",
          $options: "i",
        },
      },
    });
  }

  const aggregate = Product.aggregate(pipeline);

  const products = await Product.aggregatePaginate(aggregate, options);
  if (products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  return res.status(200).json(new ApiResponse(200, products, "Products found"));
});

const getProductById = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId)
    .populate({
      path: "brand",
      select: "name",
    })
    .populate({
      path: "category",
      select: "category",
    })
    .populate({
      path: "subCategories",
      select: "subCategory",
    });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product found"));
});

const getProductByCategoryId = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "Category is required");
  }

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

  const pipeline = [
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: "$brand",
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategories",
        foreignField: "_id",
        as: "subCategories",
      },
    },
    {
      $unwind: "$subCategories",
    },
    {
      $lookup: {
        from: "sellers",
        localField: "sellerInfo",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    {
      $unwind: "$sellerInfo",
    },
    {
      $group: {
        _id: "$_id",

        title: { $first: "$title" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        quantityInStock: { $first: "$quantityInStock" },
        ratings: { $first: "$ratings" },
        brand: { $first: "$brand" },
        category: { $first: "$category" },
        sellerInfo: { $first: "$sellerInfo" },
        productImage: { $first: "$productImage" },

        list: {
          $push: {
            subCategoryName: "$subCategories.subCategory",
            subCategoryID: "$subCategories._id",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        quantityInStock: 1,
        ratings: 1,
        brand: {
          brandame: "$brand.name",
          brandID: "$brand._id",
        },
        category: {
          categoryName: "$category.category",
          categoryID: "$category._id",
        },
        subCategory: "$list",
        sellerInfo: {
          sellerName: "$sellerInfo.fullName",
          sellerID: "$sellerInfo._id",
          GSTNumber: "$sellerInfo.GSTnumber",
        },
        productImage: 1,
      },
    },
  ];

  try {
    const aggregate = Product.aggregate(pipeline);
    const products = await Product.aggregatePaginate(aggregate, options);

    if (products.docs.length === 0) {
      throw new ApiError(404, "No products found with given category ID");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, products, "Products found with given category ID")
      );
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getProductByBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;

  if (!brandId) {
    throw new ApiError(400, "Category is required");
  }

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

  const pipeline = [
    {
      $match: {
        brand: new mongoose.Types.ObjectId(brandId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategories",
        foreignField: "_id",
        as: "subCategories",
      },
    },
    {
      $unwind: "$subCategories",
    },
    {
      $lookup: {
        from: "sellers",
        localField: "sellerInfo",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    {
      $unwind: "$sellerInfo",
    },
    {
      $group: {
        _id: "$_id",

        title: { $first: "$title" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        quantityInStock: { $first: "$quantityInStock" },
        ratings: { $first: "$ratings" },
        category: { $first: "$category" },
        sellerInfo: { $first: "$sellerInfo" },
        productImage: { $first: "$productImage" },

        list: {
          $push: {
            subCategoryName: "$subCategories.subCategory",
            subCategoryID: "$subCategories._id",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        quantityInStock: 1,
        ratings: 1,
        category: {
          categoryName: "$category.category",
          categoryID: "$category._id",
        },
        subCategory: "$list",
        sellerInfo: {
          sellerName: "$sellerInfo.fullName",
          sellerID: "$sellerInfo._id",
          GSTNumber: "$sellerInfo.GSTnumber",
        },
        productImage: 1,
      },
    },
  ];

  try {
    const aggregate = Product.aggregate(pipeline);
    const products = await Product.aggregatePaginate(aggregate, options);

    if (products.docs.length === 0) {
      throw new ApiError(404, "No products found with given category ID");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, products, `Product with brand ${brandId} found`)
      );
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getProductBySeller = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;
  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  const products = await Product.find({ sellerInfo: sellerId })
    .populate({
      path: "brand",
      select: "name",
    })
    .populate({
      path: "category",
      select: "category",
    })
    .populate({
      path: "subCategories",
      select: "subCategory",
    })
    .select("-sellerInfo");

  if (products.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No products found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found for seller"));
});

export {
  createProduct,
  getProducts,
  updateProduct,
  getProductById,
  deleteProduct,
  getProductByCategoryId,
  getProductByBrand,
  getProductBySeller,
};
