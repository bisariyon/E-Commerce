import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  addReview,
  deleteReview,
  updateReview,
  getReviews,
  getUserReviews,
} from "../controllers/review.controller.js";

const router = Router();

router
  .route("/addReview/:productId")
  .post(verifyJwtToken, verifyUser, upload.array("images"), addReview);

router.route("/deleteReview/:reviewId").delete(verifyJwtToken, deleteReview);

router.route("/updateReview/:reviewId").put(verifyJwtToken, updateReview);

router.route("/get/:productId").get(getReviews);

router.route("/getUserReviews").get(verifyJwtToken, getUserReviews);

export default router;