import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  addAddress,
  removeAddress,
  userAddresses,
  removeMultipleAddresses,
  updateAddress,
} from "../controllers/address.controller.js";

const router = Router();

//Logged In routes
router.route("/add").post(verifyJwtToken, addAddress);
router.route("/").get(verifyJwtToken, userAddresses);
router.route("/remove/:addressId").delete(verifyJwtToken, removeAddress);
router.route("/remove").delete(verifyJwtToken, removeMultipleAddresses);
router.route("/update/:addressId").patch(verifyJwtToken, updateAddress);

export default router;
