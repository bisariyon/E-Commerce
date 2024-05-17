import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";

const createCategory = asyncHandler(async (req, res, next) => {
  const { category, description } = req.body;

  if (!category) {
    return next(new ApiError(400, "Category is required"));
  }

  if (!description) {
    return next(new ApiError(400, "Description is required"));
  }

  const findCategory = await Category.findOne({ category });
  if (findCategory) {
    return next(new ApiError(400, "Category already exists"));
  }

  const newCategory = await Category.create({
    category,
    description,
  });
  if (!newCategory) {
    return next(new ApiError(400, "Error in creating category"));
  }

  res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Category created successfully"));
});

const getCategorybyID = asyncHandler(async (req, res, next) => {
  let { _id } = req.params;

  const category = await Category.findById(_id);
  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }
  console.log(category._id);

  res.status(200).json(new ApiResponse(200, category, "Category found"));
});

const getCategories = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 5,
    sortBy = "_id",
    sortType = "1",
    query,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  try {
    const categories = await Category.paginate({}, options);
    if (categories.docs.length === 0) {
      return next(new ApiError(404, "No category found"));
    }

    res.status(200).json(new ApiResponse(200, categories, "Categories found"));
  } catch (error) {
    return next(new ApiError(500, "Error in getting categories"));
  }
});

const getCategorybyName = asyncHandler(async (req, res, next) => {
  const { categoryName } = req.params;

  const category = await Category.findOne({ category: categoryName });
  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  res.status(200).json(new ApiResponse(200, category, "Category found"));
});

//chnage in products
const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;
  let { newCategory, newDescription } = req.body;

  if (!newCategory && !newDescription) {
    return next(new ApiError(400, "Category or description is required"));
  }

  const findCategory = await Category.findById(categoryID);
  if (!findCategory) {
    return next(new ApiError(404, "No category found to update"));
  }

  if (!newCategory) {
    newCategory = findCategory.category;
  }

  if (!newDescription) {
    newDescription = findCategory.description;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    findCategory._id,
    {
      $set: {
        category: newCategory,
        description: newDescription,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});

const deleteCategorybyID = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;

  const category = await Category.findById(categoryID);
  if (!category) {
    return next(new ApiError(404, "No category found to delete"));
  }

  await SubCategory.deleteMany({
    category: categoryID,
  });

  const deletedCategory = await Category.findByIdAndDelete(category._id);
  if (!deletedCategory) {
    return next(new ApiError(404, "No category found to delete"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

const deleteCategorybyName = asyncHandler(async (req, res, next) => {
  const { catName } = req.params;

  const category = await Category.findOne({ category: catName });
  if (!category) {
    return next(new ApiError(404, "No category found to delete"));
  }

  await SubCategory.deleteMany({
    category: category._id,
  });

  const deletedCategory = await Category.findByIdAndDelete(category._id);
  if (!deletedCategory) {
    return next(new ApiError(404, "No category found to delete"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
  createCategory,
  getCategories,
  getCategorybyID,
  getCategorybyName,
  updateCategory,
  deleteCategorybyID,
  deleteCategorybyName,
};
