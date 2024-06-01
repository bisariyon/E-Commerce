import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyJwtToken,
  verifyJwtTokenSeller,
  verifySeller,
} from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
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
} from "../controllers/brand.controller.js";

const router = Router();

router.route("/:brandID").get(getBrandByID); //working
router.route("/").get(listAllBrands); //working

//Verified Seller Routes
router
  .route("/request-brand")
  .post(
    verifyJwtTokenSeller,
    verifySeller,
    upload.single("logo"),
    requestNewBrand
  ); //working

//Admin routes
router //working
  .route("/create")
  .post(
    verifyJwtToken,
    verifyIsAdmin,
    upload.single("logo"),
    createBrandByAdmin
  );

router
  .route("/verify/:brandID")
  .patch(verifyJwtToken, verifyIsAdmin, verifyBrand); //working

router
  .route("/unverified")
  .post(verifyJwtToken, verifyIsAdmin, getVerifiedOrUnverifiedBrands); //not working if set to get why? else woking

router
  .route("/updateByNames/:brandID")
  .patch(verifyJwtToken, verifyIsAdmin, updateBrandByName); //working
//or
router
  .route("/updateByID/:brandID")
  .patch(verifyJwtToken, verifyIsAdmin, updateBrandByID); //working

router
  .route("/delete/:brandID")
  .delete(verifyJwtToken, verifyIsAdmin, deleteBrand); //working

router.route("/getByCategory/:categoryID").get(getBrandByCategory); //working

export default router;
