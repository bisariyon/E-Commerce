import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
  addToCart,
  removeFromCart,
  emptyCart,
} from "../controllers/cartProducts.controller.js";

const router = Router();

router.route("/add/:productId").post(verifyJwtToken, addToCart); //working
router.route("/remove/:productId").patch(verifyJwtToken, removeFromCart); //working
router.route("/empty").delete(verifyJwtToken, emptyCart); //working

export default router;
