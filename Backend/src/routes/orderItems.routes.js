import { Router } from "express";
import { verifyJwtToken, verifyUser ,verifyJwtTokenSeller } from "../middlewares/auth.middleware.js";

import {
  createOrderItems,
  getOrderItems,
  getOrderItemsBySeller,
} from "../controllers/orderItems.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken, verifyUser, createOrderItems);
router.route("/:orderID").get(verifyJwtToken, getOrderItems);

router.route("/seller").post(verifyJwtTokenSeller, getOrderItemsBySeller);

export default router;
