import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  createSubCategory,
  getSubCategoriesByCategory,
  getAllSubCategories,
  getSubCategoryByID,
  getSubCategoryByName,
  updateSubCategorybyID,
  deleteSubCategoryByID,
  listCategoriesAndSubCategories
} from "../controllers/subCategory.controller.js";

const router = Router();

router.route("/get/:categoryID").get(getSubCategoriesByCategory); //working

router.route("/get").get(getAllSubCategories); //working
router.route("/getbyId/:subCategoryID").get(getSubCategoryByID); //working
router.route("/getbyName/:subCategoryName").get(getSubCategoryByName); //working

router.route("/list").get(listCategoriesAndSubCategories); //working

//secure admin routes
router.route("/create").post(verifyJwtToken, verifyIsAdmin, createSubCategory); //working
router
  .route("/update/:subCategoryID")
  .put(verifyJwtToken, verifyIsAdmin, updateSubCategorybyID); //working
router
  .route("/delete/:subCategoryID")
  .delete(verifyJwtToken, verifyIsAdmin, deleteSubCategoryByID); //working

export default router;
