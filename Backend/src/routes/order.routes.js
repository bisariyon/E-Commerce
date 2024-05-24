import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";

// import { createOrder } from "../controllers/order.controller.js";

const router = Router();

// router.route("/create/:cartId").post(verifyJwtToken, verifyUser, createOrder);

export default router;
