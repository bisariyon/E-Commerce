import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";

import {
  createOrderItems,
  getOrderItems,
} from "../controllers/orderItems.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken,verifyUser,createOrderItems);
router.route("/:orderID").get(verifyJwtToken,getOrderItems);

export default router;
