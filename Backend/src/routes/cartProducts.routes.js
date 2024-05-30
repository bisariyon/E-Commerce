import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
  addToCart,
  decreaseFromCart,
  emptyCart,
  getCart,
  removeItemFromCart,
  checkCartForOrder
} from "../controllers/cartProducts.controller.js";

const router = Router();

router.route("/add/:productId").post(verifyJwtToken, addToCart); //working
router.route("/decrease/:productId").patch(verifyJwtToken, decreaseFromCart); //working
router.route("/empty").delete(verifyJwtToken, emptyCart); //working
router.route("/").get(verifyJwtToken, getCart); //working
router.route("/remove/:productId").delete(verifyJwtToken, removeItemFromCart); //working

router.route("/check").get(verifyJwtToken, checkCartForOrder); //working

export default router;
