import { Router } from "express";
import { verifyJwtToken, verifyJwtTokenSeller, verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getUserReviews,
  getSellerReviews,
} from "../controllers/review.controller.js";

const router = Router();

router
  .route("/addReview/:productId")
  .post(verifyJwtToken, upload.single('images'), addReview);

router
  .route("/deleteReview/:reviewId")
  .delete(verifyJwtToken, upload.array("images"), deleteReview);

router
  .route("/updateReview/:reviewId")
  .put(verifyJwtToken, upload.single("images"), updateReview);

router.route("/get/:productId").get(getReviews);

router.route("/getUserReviews").get(verifyJwtToken, getUserReviews);

router.route("/getSellerReviews").get(verifyJwtTokenSeller, getSellerReviews);

export default router;
