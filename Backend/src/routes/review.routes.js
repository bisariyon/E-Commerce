import { Router } from "express";
import {
  verifyJwtToken,
  verifyJwtTokenSeller,
  verifyUser,
} from "../middlewares/auth.middleware.js";

import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getUserReviews,
  getReviewAdmin,
  getSellerReviews,
} from "../controllers/review.controller.js";

const router = Router();

router
  .route("/addReview/:productId")
  .post(verifyJwtToken, upload.single("images"), addReview);

router
  .route("/deleteReview/:reviewId")
  .delete(verifyJwtToken, upload.array("images"), deleteReview);

router
  .route("/updateReview/:reviewId")
  .put(verifyJwtToken, upload.single("images"), updateReview);

router.route("/get/:productId").get(getReviews);

router.route("/getUserReviews").get(verifyJwtToken, getUserReviews);

router.route("/getSellerReviews").get(verifyJwtTokenSeller, getSellerReviews);

router
  .route("/getAdminReviews")
  .get(verifyJwtToken, verifyIsAdmin, getReviewAdmin);

export default router;
