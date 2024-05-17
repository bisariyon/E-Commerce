import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  createCategory,
  getCategories,
  getCategorybyID,
  getCategorybyName,
  updateCategory,
  deleteCategorybyID,
  deleteCategorybyName,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(getCategories);
router.route("/:_id").get(getCategorybyID);
router.route("/name/:categoryName").get(getCategorybyName);

//Secure Admin routes
router.route("/create").post(verifyJwtToken, verifyIsAdmin, createCategory);
router
  .route("/update/:categoryID")
  .put(verifyJwtToken, verifyIsAdmin, updateCategory);
router
  .route("/delete/:categoryID")
  .delete(verifyJwtToken, verifyIsAdmin, deleteCategorybyID);
router
  .route("/delete/name/:catName")
  .delete(verifyJwtToken, verifyIsAdmin, deleteCategorybyName);

export default router;
