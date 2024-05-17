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

router.route("/filter").get(getProducts);
router.route("/p/:productId").get(getProductById);
router.route("/category/:categoryId").get(getProductByCategoryId);
router.route("/brand/:brandId").get(getProductByBrand);
router.route("/seller/:sellerId").get(getProductBySeller);

//Seller Routes
router.route("/delete/:productId").delete(verifyJwtTokenSeller, deleteProduct);
router.route("/update/:productId").put(verifyJwtTokenSeller, updateProduct);

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
