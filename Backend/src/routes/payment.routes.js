import { Router } from "express";
import { verifyJwtToken, verifyUser } from "../middlewares/auth.middleware.js";

import {
  createOrder,
  verifyPayment,
  fetchOrder,
  fetchPayment,
  paymentfailure,
  getKeys,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/getKeys").post(verifyJwtToken, verifyUser, getKeys);
router.route("/createOrder").post(verifyJwtToken, verifyUser, createOrder);
router.route("/verifyPayment").post(verifyJwtToken, verifyUser, verifyPayment);
router.route("/paymentfailure").post(verifyJwtToken, paymentfailure);

router.route("/fetchOrder/:id").get(verifyJwtToken, fetchOrder);
router.route("/fetchPayment/:id").get(verifyJwtToken, fetchPayment);

export default router;
