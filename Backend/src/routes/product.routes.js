import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyJwtToken,
  verifyJwtTokenSeller,
  verifySeller,
} from "../middlewares/auth.middleware.js";

import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  updatePartialProduct,
  getProductByCategoryId,
  getProductByBrand, 
  getProductBySeller,
  getAllProductsAdmin,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getProducts);
router.route("/p/:productId").get(getProductById);
router.route("/category/:categoryId").get(getProductByCategoryId);
router.route("/brand/:brandId").get(getProductByBrand);

//Seller Routes
router.route("/delete/:productId").delete(verifyJwtTokenSeller, deleteProduct);

router
  .route("/updatePartial/:productId")
  .patch(
    verifyJwtTokenSeller,
    upload.single("productImage"),
    updatePartialProduct
  ); //Not used in frontend
router.route("/update/:productId").put(verifyJwtTokenSeller, updateProduct); //Not used in frontend

router.route("/seller/").get(verifyJwtTokenSeller, getProductBySeller);

//Verified Seller Routes
router
  .route("/create")
  .post(
    verifyJwtTokenSeller,
    verifySeller,
    upload.single("productImage"),
    createProduct
  );

//Admin Routes
router.route("/admin").get(verifyJwtToken, verifyIsAdmin, getAllProductsAdmin);

export default router;
