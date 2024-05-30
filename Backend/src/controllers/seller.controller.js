import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Seller } from "../models/seller.model.js";
import { Category } from "../models/category.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { verifySellerMail } from "../utils/verifySeller.js";
import jwt from "jsonwebtoken";
import { sendMailNotification } from "../utils/sendMail.js";
import otpGenerator from "otp-generator";
import { PLATFORM_EMAIL } from "../constants.js";
import mongoose from "mongoose";

//helpers
const generateAccessAndRefreshToken = async (sellerId) => {
  try {
    const seller = await Seller.findById(sellerId);
    const accessToken = seller.generateAccessToken();
    const refreshToken = seller.generateRefreshToken();

    seller.refreshToken = refreshToken;
    await seller.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const options = {
  httpOnly: true,
  secure: true,
};

//Controllers
const registerSeller = asyncHandler(async (req, res, next) => {
  let { fullName, email, phone, password, GSTnumber, niche } = req.body;

  // console.log(fullName, email, phone, password, GSTnumber);

  if (
    [fullName, email, password, phone, GSTnumber].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(400, "All marked fields are required");
  }

  //convery niche to array
  // niche = niche.split(",").map((category) => category.trim());
  // console.log("split",niche);

  if (!niche || niche.length === 0) {
    throw new ApiError(400, "Atleast one niche is required");
  }

  if (niche.length > 3) {
    throw new ApiError(400, "Maximum 3 niches are allowed");
  }

  for (let category of niche) {
    const findCategory = await Category.findById(category);
    if (!findCategory) {
      throw new ApiError(404, `Invalid category ${category}`);
    }
  }

  const existedSeller = await Seller.findOne({
    $or: [{ email }, { phone }],
  });

  if (existedSeller) {
    throw new ApiError(409, "Seller already exists");
  }

  const avatarLocalPath = req.file?.path;

  let avatar = "";
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Error in uploading avatar");
    }
  }

  let mailToAdmin = "";
  try {
    const seller = await Seller.create({
      fullName,
      email,
      password,
      phone,
      GSTnumber,
      niche,
      avatar: avatar?.url !== "" ? avatar.url : "",
    });

    const createdSeller = await Seller.findById(seller._id).select(
      "-password -refreshToken"
    );

    if (!createdSeller) {
      throw new ApiError(500, "Error in creating seller");
    }

    const data = {
      sellerId: createdSeller._id,
      email: createdSeller.email,
      GSTnumber: createdSeller.GSTnumber,
      subject: "New Seller Registration",
      message:
        "A new seller has registered \nPlease verify the seller details.",
    };

    mailToAdmin = await verifySellerMail(data);

    //Login the seller
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      createdSeller._id
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          createdSeller,
          `Seller created successfully and ${mailToAdmin}`
        )
      );
  } catch (error) {
    if (avatar?.public_id) {
      await deleteFromCloudinary(avatar?.public_id);
    }
    return next(new ApiError(500, error.message));
  }
});

const loginSeller = asyncHandler(async (req, res, next) => {
  const { phone, email, password } = req.body;

  if (!(phone || email)) {
    throw new ApiError(400, "Email or phone is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const seller = await Seller.findOne({
    $or: [{ email }, { phone }],
  });

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const isPasswordValid = await seller.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    seller._id
  );

  const loggedInSeller = await Seller.findById(seller._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          seller: loggedInSeller,
          refreshToken,
          accessToken,
        },
        "Seller logged in successfully"
      )
    );
});

const logoutSeller = asyncHandler(async (req, res, next) => {
  Seller.findByIdAndUpdate(
    req.seller._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Seller logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized incoming token request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const seller = await Seller.findById(decodedToken?._id);

    if (!seller) {
      throw new ApiError(404, "Invalid refresh token");
    }

    if (seller.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(seller._id);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

const getCurrentSeller = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.seller, "Seller retrieved successfully"));
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log(oldPassword, newPassword, confirmPassword);

  if (!(oldPassword && newPassword && confirmPassword)) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const seller = await Seller.findById(req.seller._id);
  const isPasswordValid = await seller.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  seller.password = newPassword;
  await seller.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Email OTP
const generateEmailOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new ApiError(404, "No seller found with this email");
  }

  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  const encodedOTP = jwt.sign(
    {
      email: email,
      otp: otp,
    },
    process.env.OTP_SECRET,
    {
      expiresIn: process.env.OTP_EXPIRY,
    }
  );

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: email,
    subject: "Your OTP for password reset",
    html: `
            <p>Dear Seller,</p>
            <p>The verification code for your request at <em>BISARIYON E-COM</em> is <strong>${otp}</strong>.</p>
            `,
  };

  const mailSent = await sendMailNotification(mailOptions);
  if (!mailSent) {
    throw new ApiError(500, "Error sending email");
  }

  return res
    .status(200)
    .cookie("otp", encodedOTP, options)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
};

const changePasswordWithOTP = asyncHandler(async (req, res, next) => {
  const { newPassword, confirmPassword, otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  if (!(newPassword && confirmPassword)) {
    throw new ApiError(
      400,
      "Both new password and confirm password are required"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const CookieOtp = req.cookies?.otp;
  if (!CookieOtp) {
    throw new ApiError(401, "Unauthorized OTP request");
  }

  const decodedOtp = jwt.verify(CookieOtp, process.env.OTP_SECRET);

  if (decodedOtp.otp !== otp) {
    throw new ApiError(401, "Invalid OTP entered");
  }

  await Seller.findByIdAndUpdate(req.cookies?.email, {
    $set: {
      password: newPassword,
    },
  });

  const seller = await Seller.findOne({ email: decodedOtp.email });
  seller.password = newPassword;
  await seller.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("otp", options)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP verified!! and Password updated successfully"
      )
    );
});

// Reset password link
const forgotPasswordResetLink = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new ApiError(404, "No seller found with this email");
  }

  const sellerId = seller._id;

  const token = jwt.sign(
    {
      id: sellerId,
    },
    process.env.RESET_TOKEN_SECRET,
    {
      expiresIn: process.env.LINK_EXPIRY,
    }
  );

  const link = `http://localhost:8000/v1/seller/resetpassword/${token}`;

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: email,
    subject: "Password reset link",
    html: `Greetings from the platform. Please click on the link below to reset your password. <br><a href="${link}"> Reset Password</a>`,
  };

  const mailSent = await sendMailNotification(mailOptions);
  if (!mailSent) {
    throw new ApiError(500, "Error sending email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email sent successfully"));
});

const resetpasswordByLink = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  console.log(token, newPassword, confirmPassword);

  if (!(newPassword && confirmPassword)) {
    throw new ApiError(
      400,
      "Both new password and confirm password are required"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
  if (!decodedToken) {
    throw new ApiError(401, "Invalid token");
  }

  const seller = await Seller.findById(decodedToken?.id);
  if (!seller) {
    throw new ApiError(404, "No user found with this email");
  }

  seller.password = newPassword;
  const updatesSeller = await seller.save({ validateBeforeSave: false });
  if (!updatesSeller) {
    throw new ApiError(500, "Error in updating password");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Update Seller Profile
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { GSTnumber, fullName } = req.body;

  if (!GSTnumber && !fullName) {
    throw new ApiError(400, "New details are required");
  }

  const tempSeller = await Seller.findById(req.seller._id);

  if (fullName) {
    tempSeller.fullName = fullName;
  }

  if (GSTnumber && tempSeller.GSTnumber === GSTnumber) {
    throw new ApiError(400, "New GST number is same as current GST number");
  }

  let mailToAdmin = "";
  if (GSTnumber && tempSeller.GSTnumber !== GSTnumber) {
    const findIfGSTexists = await Seller.findOne({ GSTnumber });
    if (findIfGSTexists) {
      throw new ApiError(400, "GSTNumber already exists");
    }

    tempSeller.GSTnumber = GSTnumber;
    tempSeller.verified = false;

    //send email to admin for verification
    const data = {
      sellerId: tempSeller._id,
      email: tempSeller.email,
      GSTnumber: tempSeller.GSTnumber,
      subject: "GST Number Verification",
      message: `GST number has been updated. \nPlease verify the GST number of the seller.`,
    };

    mailToAdmin = await verifySellerMail(data);
  }

  await tempSeller.save({ validateBeforeSave: false });

  const updatesSeller = await Seller.findById(req.seller._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatesSeller, `Profile updated and ${mailToAdmin}`)
    );
});

const updateNiche = asyncHandler(async (req, res, next) => {
  let { niche } = req.body;

  if (!niche) {
    throw new ApiError(400, "Niche is required");
  }

  niche = niche.split(",").map((category) => category.trim());
  if (niche.length > 3) {
    throw new ApiError(400, "Maximum 3 niches are allowed");
  }

  const seller = await Seller.findById(req.seller._id);

  niche.forEach(async (category) => {
    const findCategory = await Category.findById(category);
    if (!findCategory) {
      throw new ApiError(404, `Invalid category ${category}`);
    }
  });

  seller.niche = niche;
  seller.verified = false;

  const updatedSeller = await seller.save({ validateBeforeSave: false });
  if (!updatedSeller) {
    throw new ApiError(500, "Error in updating niche");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeller, "Niche updated successfully"));
});

const updateEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const seller = await Seller.findById(req.seller._id);

  if (seller.email === email) {
    throw new ApiError(400, "New email is same as current email");
  }

  const findIfEmailExists = await Seller.findOne({ email });
  if (findIfEmailExists) {
    throw new ApiError(400, "Email already exists");
  }

  seller.email = email;

  const isPasswordValid = await seller.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  await seller.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email updated successfully"));
});

const updatePhone = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const seller = await Seller.findById(req.seller._id);

  if (seller.phone === phone) {
    throw new ApiError(400, "Phone number is same as current number");
  }

  const findIfPhoneExists = await Seller.findOne({ phone });
  if (findIfPhoneExists) {
    throw new ApiError(400, "Phone already exists");
  }

  seller.phone = phone;

  const isPasswordValid = await seller.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  await seller.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Phone updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Error in uploading avatar");
  }

  if (
    req.seller.avatar !== "" &&
    req.seller.avatar !== null &&
    req.seller.avatar !== undefined
  ) {
    const parts = req.seller?.avatar.split("/");
    const oldAvatarPublicId = parts[parts.length - 1].split(".")[0];

    const deleteOldAvatar = await deleteFromCloudinary(oldAvatarPublicId);
    if (!deleteOldAvatar) {
      throw new ApiError(500, "Error in deleting old avatar");
    }
  }

  try {
    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      {
        $set: { avatar: avatar.url },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, seller, "Avatar updated successfully"));
  } catch (error) {
    if (avatar.public_id) {
      await deleteFromCloudinary(avatar.public_id);
    }
    throw new ApiError(500, error.message);
  }
});

const deleteSeller = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findByIdAndDelete(req.seller._id);

  if (!seller) {
    throw new ApiError(500, "Error in deleting seller");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Seller deleted successfully"));
});

//Admin routes
const getAllSellers = asyncHandler(async (req, res, next) => {
  const sellers = await Seller.find().select("-password -refreshToken");
  if (!sellers) {
    throw new ApiError(404, "No sellers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sellers, "Sellers retrieved successfully"));
});

const getSellerByID = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  const seller = await Seller.findById(sellerId).select(
    "-password -refreshToken"
  );
  if (!seller) {
    throw new ApiError(404, "Invalid seller ID");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Sellers retrieved successfully"));
});

const verifySeller = asyncHandler(async (req, res, next) => {
  const { sellerId } = req.params;
  if (!sellerId) {
    throw new ApiError(400, "Seller ID is required");
  }

  const { verify = true } = req.query;
  console.log(verify);

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  seller.verified = verify;

  const verifiedSeller = await seller.save({ validateBeforeSave: false });
  if (!verifiedSeller) {
    throw new ApiError(500, "Error in updating verification status");
  }

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: seller.email,
    subject: "Seller Verification",
    html: `
            <p>Dear Seller</p>
            <p>Your seller verifaction on <strong>Bisariyon E-com </strong> has been Updated.</p>
            <p>Contact Admin for more details.</p>
            `,
  };

  const mailSent = await sendMailNotification(mailOptions);
  if (!mailSent) {
    throw new ApiError(500, "Error sending email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, verifiedSeller, "Seller Verification updated"));
});

//Orders routes
//Product routes

export {
  registerSeller,
  loginSeller,
  getCurrentSeller,
  logoutSeller,
  refreshAccessToken,
  changePassword,
  generateEmailOTP,
  changePasswordWithOTP,
  forgotPasswordResetLink,
  resetpasswordByLink,
  updateEmail,
  updateNiche,
  updatePhone,
  updateAvatar,
  deleteSeller,
  updateUserProfile,
  getAllSellers,
  getSellerByID,
  verifySeller,
};
