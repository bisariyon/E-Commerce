import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { verifyIsAdmin } from "../middlewares/admin.middleware.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  generateEmailOTP,
  changePasswordWithOTP,
  forgotPasswordResetLink,
  resetpasswordByLink,
  updateUserProfile,
  updateEmail,
  updatePhone,
  updateAvatar,
  deleteUser,
  selfVerificationLinkRequest,
  selfVerify,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser); //done

// router.route("/login").post(upload.none(),loginUser); //why none needed for forms?
router.route("/login").post(loginUser); //done

//Secured routes
router.route("/logout").post(verifyJwtToken, logoutUser); //done
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJwtToken, getCurrentUser);

router.route("/generate-email-otp").post(generateEmailOTP);
router.route("/verifyotp").post(changePasswordWithOTP);

router.route("/change-password-reset-link").post(forgotPasswordResetLink);
router.route("/resetpassword/:token").post(resetpasswordByLink);

router.route("/change-password").post(verifyJwtToken, changePassword);
router.route("/update/profile").patch(verifyJwtToken, updateUserProfile); //done
router.route("/update/email").patch(verifyJwtToken, updateEmail); //done
router.route("/update/phone").patch(verifyJwtToken, updatePhone); //done
router
  .route("/update/avatar")
  .patch(verifyJwtToken, upload.single("avatar"), updateAvatar); //done
router.route("/delete").delete(verifyJwtToken, deleteUser);

//Self verification
router
  .route("/self-verification-link")
  .post(verifyJwtToken, selfVerificationLinkRequest);
router.route("/self-verify/:token").post(selfVerify);

export default router;
