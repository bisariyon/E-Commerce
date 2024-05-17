import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
  emptyWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.post("/add/:productId", verifyJwtToken, addProductToWishlist);
router
  .route("/remove/:productId")
  .delete(verifyJwtToken, removeProductFromWishlist);

router.get("/", verifyJwtToken, getWishlist);

router.delete("/empty", verifyJwtToken, emptyWishlist);

export default router;
