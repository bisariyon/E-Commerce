import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res, next) => {
  const { category, description } = req.body;

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const findCategory = await Category.findOne({ category });
  if (findCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const imgLocalPath = req.file?.path;

  if (!imgLocalPath) {
    throw new ApiError(400, "Category Image is required");
  }

  const image = await uploadOnCloudinary(imgLocalPath);
  if (!image) {
    throw new ApiError(500, "Error in uploading avatar");
  }
  const newCategory = await Category.create({
    category,
    description,
    imageUrl: image.url,
  });
  if (!newCategory) {
    throw new ApiError(400, "Error in creating category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Category created successfully"));
});

const getCategorybyID = asyncHandler(async (req, res, next) => {
  let { _id } = req.params;

  const category = await Category.findById(_id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  // console.log(category._id);

  return res.status(200).json(new ApiResponse(200, category, "Category found"));
});

const getCategories = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 1000, sortBy = "_id", sortType = "1" } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: parseInt(sortType) },
  };

  try {
    const categories = await Category.paginate({}, options);
    if (categories.docs.length === 0) {
      throw new ApiError(404, "No category found");
    }

    res.status(200).json(new ApiResponse(200, categories, "Categories found"));
  } catch (error) {
    throw new ApiError(500, "Error in getting categories");
  }
}); //not checked for active

const getCategorybyName = asyncHandler(async (req, res, next) => {
  const { categoryName } = req.params;

  const category = await Category.findOne({ category: categoryName });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json(new ApiResponse(200, category, "Category found"));
});

//chnage in products
const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;
  let { newCategory, newDescription } = req.body;

  // console.log(req.body);
  // console.log(req.params);

  if (!newCategory && !newDescription) {
    throw new ApiError(400, "Category or description is required");
  }

  const findCategory = await Category.findById(categoryID);
  if (!findCategory) {
    throw new ApiError(404, "No category found to update");
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
  if (!updatedCategory) {
    throw new ApiError(500, "Error in updating category");
  }

  // console.log(updatedCategory);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});

const updateCategoryImage = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;
  console.log(categoryID);

  const findCategory = await Category.findById(categoryID);
  if (!findCategory) {
    throw new ApiError(404, "No category found to update");
  }

  console.log(req.file);
  const imgLocalPath = req.file?.path;
  if (!imgLocalPath) {
    throw new ApiError(400, "Category Image is required");
  }

  const oldImage = findCategory.imageUrl;

  const image = await uploadOnCloudinary(imgLocalPath);
  if (!image) {
    throw new ApiError(500, "Error in uploading avatar");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    findCategory._id,
    {
      $set: {
        imageUrl: image.url,
      },
    },
    { new: true }
  );
  if (!updateCategory) {
    throw new ApiError(500, "Error in updating category image");
  }

  if (oldImage) {
    const parts = oldImage.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];

    await deleteFromCloudinary(publicId);
  }

  console.log(updatedCategory);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCategory,
        "Category image updated successfully"
      )
    );
});

const deleteCategorybyID = asyncHandler(async (req, res, next) => {
  const { categoryID } = req.params;

  const category = await Category.findById(categoryID);
  if (!category) {
    throw new ApiError(404, "No category found to delete");
  }

  category.active = false;
  const updatedCategory = await category.save();
  if (!updatedCategory) {
    throw new ApiError(500, "Error in deleting category");
  }

  const subCategories = await SubCategory.find({ category: category._id });
  if (subCategories.length > 0) {
    subCategories.forEach(async (subCategory) => {
      subCategory.active = false;
      await subCategory.save();
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateCategory, "Category deleted successfully")
    );
});

const deleteCategorybyName = asyncHandler(async (req, res, next) => {
  const { catName } = req.params;

  const category = await Category.findOne({ category: catName });
  if (!category) {
    throw new ApiError(404, "No category found to delete");
  }

  await SubCategory.deleteMany({
    category: category._id,
  });

  const deletedCategory = await Category.findByIdAndDelete(category._id);
  if (!deletedCategory) {
    throw new ApiError(404, "No category found to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

//Admin
const getCategoriesAdmin = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 50,
    sortBy = "_id",
    sortType = "1",
    subCategory = "",
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
        from: "subcategories",
        localField: "_id",
        foreignField: "category",
        as: "subCategories",
      },
    },
    {
      $project: {
        _id: 1,
        category: 1,
        categoryDescription: "$description",
        active: 1,
        categoryImage: "$imageUrl",
        subCategories: {
          $map: {
            input: "$subCategories",
            as: "subCategory",
            in: {
              subCategoryId: "$$subCategory._id",
              subCategory: "$$subCategory.subCategory",
              subCategoryDescription: "$$subCategory.description",
            },
          },
        },
      },
    },
    {
      $match: {
        active: true,
      },
    },
  ];

  if (category) {
    pipeline.push({
      $match: {
        _id: new mongoose.Types.ObjectId(category),
      },
    });
  }

  if (subCategory) {
    pipeline.push({
      $match: {
        "subCategories.subCategoryId": new mongoose.Types.ObjectId(subCategory),
      },
    });
  }
  const aggregate = Category.aggregate(pipeline);
  const result = await Category.aggregatePaginate(aggregate, options);

  if (!result) {
    throw new ApiError(404, "No category found");
  }

  return res.status(200).json(new ApiResponse(200, result, "Categories found"));
});

export {
  createCategory,
  getCategories,
  getCategorybyID,
  getCategorybyName,
  updateCategory,
  deleteCategorybyID,
  deleteCategorybyName,
  updateCategoryImage,
  getCategoriesAdmin,
};
