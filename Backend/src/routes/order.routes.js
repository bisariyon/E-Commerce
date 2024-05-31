import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";

import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken, verifyUser, createOrder);
router.route("/").get(verifyJwtToken, getUserOrders);

export default router;
