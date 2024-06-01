import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyJwtTokenSeller,
  verifySeller,
} from "../middlewares/auth.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductByCategoryId,
  getProductByBrand,
  getProductBySeller,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(getProducts);
router.route("/p/:productId").get(getProductById);
router.route("/category/:categoryId").get(getProductByCategoryId);
router.route("/brand/:brandId").get(getProductByBrand);

//Seller Routes
router.route("/delete/:productId").delete(verifyJwtTokenSeller, deleteProduct);
router.route("/update/:productId").put(verifyJwtTokenSeller, updateProduct);
router.route("/seller/").get(verifyJwtTokenSeller,getProductBySeller);

//Verified Seller Routes
router
  .route("/create")
  .post(
    verifyJwtTokenSeller,
    verifySeller,
    upload.single("productImage"),
    createProduct
  );

export default router;
