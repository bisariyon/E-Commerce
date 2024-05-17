import mongoose from "mongoose";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";

const createSubCategory = asyncHandler(async (req, res, next) => {
  //here category is the name of the category and subCategory is the name of the subCategory
  const { category, subCategory, description } = req.body;

  if (!category) {
    return next(new ApiError(400, "Category is required"));
  }
  if (!subCategory) {
    return next(new ApiError(400, "Sub category is required"));
  }
  if (!description) {
    return next(new ApiError(400, "Description is required"));
  }

  const findCategory = await Category.findOne({ category });
  if (!findCategory) {
    return next(new ApiError(404, "Given category does not exists"));
  }

  const findSubCategory = await SubCategory.findOne({
    $and: [{ category: findCategory._id }, { subCategory }],
  });
  if (findSubCategory) {
    return next(new ApiError(400, "Sub category already exists"));
  }

  const newSubCategory = await SubCategory.create({
    category: findCategory._id,
    subCategory,
    description,
  });

  if (!newSubCategory) {
    return next(new ApiError(500, "Error in creating sub category"));
  }

  const newSubCategoryCreated = await SubCategory.findById(
    newSubCategory._id
  ).populate({
    path: "category",
    select: "category",
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newSubCategoryCreated,
        "Sub category created successfully"
      )
    );
});

const getSubCategoriesByCategory = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;

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

  const category = await Category.findById(categoryID);
  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  const pipeline = [
    {
      $match: {
        category: new mongoose.Types.ObjectId(category._id),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        _id: 0,
        categoryId: "$categoryInfo._id",
        category: "$categoryInfo.category",
        subCategoryID: "$_id",
        subCategory: 1,
        subCategoryDescription: "$description",
      },
    },
  ];

  const aggregate = SubCategory.aggregate(pipeline);

  const subCategories = await SubCategory.aggregatePaginate(aggregate, options);

  if (subCategories.length === 0) {
    return next(new ApiError(404, "No subcategory found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subCategories, "Sub categories found"));
});

const getAllSubCategories = asyncHandler(async (req, res, next) => {
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

  const aggregate = SubCategory.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        _id: 0,
        subCategoryID: "$_id",
        categoryId: "$categoryInfo._id",
        category: "$categoryInfo.category",
        subCategoryDescription: "$description",
        subCategory: 1,
      },
    },
  ]);

  const subCategories = await SubCategory.aggregatePaginate(aggregate, options);
  if (subCategories.length === 0) {
    return next(new ApiError(404, "No subcategory found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subCategories, "Sub categories found"));
});


const listCategoriesAndSubCategories = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find({});

    if (!categories || categories.length === 0) {
      return next(new ApiError(404, "No categories found"));
    }

    const categoryArray = [];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const subCategories = await SubCategory.find({ category: category._id });

      // categoryArray.push({
      //   category: category.category,
      //   subCategories: subCategories.map(
      //     (subCategory) => subCategory.subCategory
      //   ),
      // });

      categoryArray.push({
        category: category.category,
        categoryID: category._id,
        subCategories: subCategories.map((subCategory) => ({
          subCategoryID: subCategory._id,
          subCategory: subCategory.subCategory,
        })),
      });
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categoryArray,
          "Categories and subcategories found"
        )
      );
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
});

const getSubCategoryByID = asyncHandler(async (req, res, next) => {
  const { subCategoryID } = req.params;
  const subCategory = await SubCategory.findById(subCategoryID);
  if (!subCategory) {
    return next(new ApiError(404, "Sub category not found"));
  }
  res.status(200).json(new ApiResponse(200, subCategory, "Sub category found"));
});

const getSubCategoryByName = asyncHandler(async (req, res, next) => {
  const { subCategoryName } = req.params;

  const subCategory = await SubCategory.find({
    subCategory: subCategoryName,
  });
  if (!subCategory || subCategory.length === 0) {
    return next(new ApiError(404, "Sub category not found"));
  }

  res.status(200).json(new ApiResponse(200, subCategory, "Sub category found"));
});

//update product
const updateSubCategorybyID = asyncHandler(async (req, res, next) => {
  const { subCategoryID } = req.params;
  let { newSubCategory, description } = req.body;

  const subCategory = await SubCategory.findById(subCategoryID);
  if (!subCategory) {
    return next(new ApiError(404, "Sub category not found"));
  }

  if (!newSubCategory && !description) {
    return next(new ApiError(400, "All fields can't be empty"));
  }

  if (!newSubCategory) newSubCategory = subCategory.subCategory;
  if (!description) description = subCategory.description;

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subCategoryID,
    {
      subCategory: newSubCategory,
      description,
    },
    { new: true }
  );

  if (!updatedSubCategory) {
    return next(new ApiError(500, "Error in updating sub category"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSubCategory,
        "Sub category updated successfully"
      )
    );
});

//update product
const deleteSubCategoryByID = asyncHandler(async (req, res, next) => {
  const { subCategoryID } = req.params;

  const deleteSubCategory = await SubCategory.findByIdAndDelete(subCategoryID);
  if (!deleteSubCategory) {
    return next(new ApiError(404, "Sub category not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleteSubCategory,
        "Sub category deleted successfully"
      )
    );
});

export {
  createSubCategory,
  getSubCategoriesByCategory, //not working
  getAllSubCategories,
  getSubCategoryByID,
  getSubCategoryByName,
  updateSubCategorybyID,
  deleteSubCategoryByID,
  listCategoriesAndSubCategories
};
