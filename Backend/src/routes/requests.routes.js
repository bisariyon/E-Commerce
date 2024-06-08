import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  createRequest,
  updateRequest,
  checkRequest,
  getAllRequest,
} from "../controllers/requests.controller.js";

const router = Router();

router.route("/create").post(verifyJwtToken, createRequest);
router.route("/check").get(verifyJwtToken, checkRequest);
router
  .route("/update/:requestId")
  .put(verifyJwtToken, verifyIsAdmin, updateRequest);

router.route("/").get(verifyJwtToken, verifyIsAdmin, getAllRequest);

export default router;
