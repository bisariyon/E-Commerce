import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
  emptyWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/add/:productId").post(verifyJwtToken, addProductToWishlist); //done
router
  .route("/remove/:productId")
  .delete(verifyJwtToken, removeProductFromWishlist); //done

router.route("/").get(verifyJwtToken, getWishlist); //done
router.route("/empty").delete(verifyJwtToken, emptyWishlist); //done

export default router;
