import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  createOrder,
  getUserOrders,
  getAllOrdersDetails,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken, verifyUser, createOrder);
router.route("/").get(verifyJwtToken, getUserOrders);

router.route("/all").get(verifyJwtToken, verifyIsAdmin, getAllOrdersDetails);

export default router;
