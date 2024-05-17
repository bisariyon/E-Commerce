import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  verifyJwtToken,
  verifyJwtTokenSeller,
} from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  registerSeller,
  loginSeller,
  logoutSeller,
  refreshAccessToken,
  getCurrentSeller,
  changePassword,
  generateEmailOTP,
  changePasswordWithOTP,
  forgotPasswordResetLink,
  resetpasswordByLink,
  updateEmail,
  updatePhone,
  updateAvatar,
  updateNiche,
  deleteSeller,
  updateUserProfile,
  getAllSellers,
  getSellerByID,
  verifySeller,
} from "../controllers/seller.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerSeller);
router.route("/login").post(loginSeller);

//Secure routes
router.route("/logout").post(verifyJwtTokenSeller, logoutSeller);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-seller").get(verifyJwtTokenSeller, getCurrentSeller);
router.route("/change-password").post(verifyJwtTokenSeller, changePassword);

router.route("/generate-email-otp").post(generateEmailOTP);
router.route("/verifyotp").post(changePasswordWithOTP);

router.route("/change-password-reset-link").post(forgotPasswordResetLink);
router.route("/resetpassword/:token").post(resetpasswordByLink);

router.route("/update/niche").patch(verifyJwtTokenSeller, updateNiche);
router.route("/update/profile").patch(verifyJwtTokenSeller, updateUserProfile);
router.route("/update/email").patch(verifyJwtTokenSeller, updateEmail);
router.route("/update/phone").patch(verifyJwtTokenSeller, updatePhone);
router
  .route("/update/avatar")
  .patch(verifyJwtTokenSeller, upload.single("avatar"), updateAvatar);
router.route("/delete").delete(verifyJwtTokenSeller, deleteSeller);

//admin routes
router.route("/").get(verifyJwtToken, verifyIsAdmin, getAllSellers);
router.route("/:sellerId").get(verifyJwtToken, verifyIsAdmin, getSellerByID);
router
  .route("/verify/:sellerId")
  .patch(verifyJwtToken, verifyIsAdmin, verifySeller);

export default router;
