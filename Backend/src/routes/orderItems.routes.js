import { Router } from "express";
import {
  verifyJwtToken,
  verifyUser,
  verifyJwtTokenSeller,
} from "../middlewares/auth.middleware.js";

import {
  createOrderItems,
  getOrderItems,
  getOrderItemsBySeller,
  getOrderItemById,
  updateStatus,
} from "../controllers/orderItems.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken, verifyUser, createOrderItems);
router.route("/:orderID").get(verifyJwtToken, getOrderItems);

router.route("/seller").post(verifyJwtTokenSeller, getOrderItemsBySeller);
router.route("/status/:orderItemId").get(getOrderItemById);
router.route("/status/:orderItemId").put(verifyJwtTokenSeller, updateStatus);

export default router;
