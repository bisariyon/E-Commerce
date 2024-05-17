import { Router } from "express";
import {
  verifyJwtToken,
  verifyUser,
  verifyJwtTokenSeller,
  verifySeller,
} from "../middlewares/auth.middleware.js";

import {
  addProductOffer,
  deleteProductOffer,
  updateProductOffer,
  getSellerOffers,
  getAllOffers,
} from "../controllers/productOffers.controller.js";

const router = Router();

router
  .route("/create/:productId")
  .post(verifyJwtTokenSeller, verifySeller, addProductOffer);

router
  .route("/delete/:offerId")
  .delete(verifyJwtTokenSeller, deleteProductOffer);

router.route("/update/:offerId").put(verifyJwtTokenSeller, updateProductOffer);

router.route("/seller").get(verifyJwtTokenSeller, getSellerOffers);

//Admin routes
router.route("/all").get(verifyJwtToken, verifyUser, getAllOffers);

export default router;
