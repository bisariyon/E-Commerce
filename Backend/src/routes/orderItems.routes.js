import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";

import { createCartItems } from "../controllers/orderItems.controller.js";

const router = Router();

router.post("/create", verifyJwtToken, verifyUser, createCartItems);

export default router;
