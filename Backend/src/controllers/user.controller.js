import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMailNotification } from "../utils/sendMail.js";
import { PLATFORM_EMAIL } from "../constants.js";
import { Cart } from "../models/cart.model.js";

//helper functions
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    //save user with refresh token without validation
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const randomUsername = () => {
  const name = Math.random().toString(36).substring(2, 8);
  // console.log(name);
  return name;
};

const options = {
  httpOnly: true,
  secure: true,
};

//controllers
const registerUser = asyncHandler(async (req, res, next) => {
  let { fullName, username, email, phone, password } = req.body;
  // console.log(req.body);
  if (
    [fullName, email, password, phone].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(400, "All marked fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  if (username === "" || username === undefined) {
    username = randomUsername();
  }

  // console.log(req.file);
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Error in uploading avatar");
  }
  try {
    const user = await User.create({
      fullName,
      username,
      email,
      password,
      phone,
      avatar: avatar.url,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Error in creating user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      createdUser._id
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    if (avatar.public_id) {
      await deleteFromCloudinary(avatar.public_id);
    }
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error in creating user"));
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, phone, email, password } = req.body;

  if (!(username || phone || email)) {
    throw new ApiError(400, "Username or email or phone is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }, { phone }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const spreadedUser = { ...loggedInUser._doc, accessToken, refreshToken };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, spreadedUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  //get refresh token
  //verify refresh token
  //get user id
  //generate new access token
  //send new access token
  //send new refresh token

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

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

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

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User retrieved successfully"));
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

  const user = await User.findById(req.user._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

//Verification link
const selfVerificationLinkRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const redirectURL = req.body.redirectURL;

  if (!userId) {
    throw new ApiError(404, "UserId missing in request");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  if (user.verified) {
    throw new ApiError(400, "User is already verified");
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.USER_VERIFY_SECRET,
    {
      expiresIn: process.env.LINK_EXPIRY,
    }
  );

  const link = `${redirectURL}/${token}`;
  // console.log(link);
  // const link = `http://localhost:8000/v1/user/verify/${token}`;

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: user.email,
    subject: "Account verification link",
    html: `<p>Greetings from the platform.</p> 
           <p>Please click on the link below to verify your account.<br><a href="${link}"> Reset Password</a> </p>`,
  };

  const sendMail = sendMailNotification(mailOptions);
  if (!sendMail) {
    throw new ApiError(500, "Error sending link");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification link sent"));
});

const selfVerify = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "No token found");
  }

  const decodedToken = jwt.verify(token, process.env.USER_VERIFY_SECRET);
  if (!decodedToken) {
    throw new ApiError(401, "Invalid token");
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new ApiError(404, "Invalid token");
  }

  if (user.verified) {
    throw new ApiError(400, "User is already verified");
  }
  try {
    user.verified = true;
    const verifiedUser = await user.save({ validateBeforeSave: false });
    if (!verifiedUser) {
      throw new ApiError(500, "Error in verifying user");
    }

    const cart = await Cart.create({ user: user._id });
    if (!cart) {
      throw new ApiError(500, "Error in creating cart");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "User verified successfully and Cart created")
      );
  } catch (error) {
    throw new ApiError(500, "Error in verifying user");
  }
});

//Generate OTP and send it to the email
const generateEmailOTP = async (req, res, next) => {
  const { email } = req.body;
  // console.log(email);

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "No user found with this email");
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
          <p>Dear User,</p>
          <p>The verification code for your request at <em> BISARIYON E-COM</em> is <strong>${otp}</strong>.</p>
          `,
  };

  const notifyAdmin = sendMailNotification(mailOptions);
  if (!notifyAdmin) {
    throw new ApiError(500, "Error sending email");
  }

  return res
    .status(200)
    .cookie("otp", encodedOTP, options)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
};

const changePasswordWithOTP = asyncHandler(async (req, res, next) => {
  const { newPassword, confirmPassword, otp } = req.body;
  // console.log(newPassword, confirmPassword, otp)

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

  await User.findByIdAndUpdate(req.cookies?.email, {
    $set: {
      password: newPassword,
    },
  });

  const user = await User.findOne({ email: decodedOtp.email });
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

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

//Send reset password link to email
const forgotPasswordResetLink = asyncHandler(async (req, res, next) => {
  const { email, redirectURL } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "No user found with this email");
  }

  const userid = user._id;

  const token = jwt.sign(
    {
      id: userid,
    },
    process.env.RESET_TOKEN_SECRET,
    {
      expiresIn: process.env.LINK_EXPIRY,
    }
  );

  const link = `${redirectURL}/${token}`;
  // console.log(link);

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: email,
    subject: "Password reset link",
    html: `Greetings from the platform. Please click on the link below to reset your password. <br><a href="${link}"> Reset Password</a>`,
  };

  const notifyAdmin = sendMailNotification(mailOptions);
  if (!notifyAdmin) {
    throw new ApiError(500, "Error sending email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email sent successfully"));
});

const resetpasswordByLink = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // console.log(newPassword, confirmPassword);

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

  const user = await User.findById(decodedToken?.id);
  if (!user) {
    throw new ApiError(404, "No user found with this email");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

//SMS OTP
const forgotPasswordSms = asyncHandler(async (req, res, next) => {});

//Updates Profiles
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { username, fullName } = req.body;

  if (!username && !fullName) {
    throw new ApiError(400, "New details are required");
  }

  const tempUser = await User.findById(req.user._id);

  if (fullName) {
    tempUser.fullName = fullName;
  }

  if (username && tempUser.username !== username) {
    const findIfUsernameExists = await User.findOne({ username });
    if (findIfUsernameExists) {
      throw new ApiError(400, "Username already exists");
    }
    tempUser.username = username;
  }

  await tempUser.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

const updateEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findById(req.user._id);

  if (user.email === email) {
    throw new ApiError(400, "New email is same as current email");
  }

  const findIfEmailExists = await User.findOne({ email });
  if (findIfEmailExists) {
    throw new ApiError(400, "Email already exists");
  }

  user.email = email;

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  await user.save({ validateBeforeSave: true });

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

  const user = await User.findById(req.user._id);

  if (user.phone === phone) {
    throw new ApiError(400, "Phone number is same as current number");
  }

  const findIfPhoneExists = await User.findOne({ phone });
  if (findIfPhoneExists) {
    throw new ApiError(400, "Phone already exists");
  }

  user.phone = phone;
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password entered");
  }

  await user.save({ validateBeforeSave: true });

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

  const parts = req.user.avatar.split("/");
  const oldAvatarPublicId = parts[parts.length - 1].split(".")[0];

  const deleteOldAvatar = await deleteFromCloudinary(oldAvatarPublicId);
  if (!deleteOldAvatar) {
    throw new ApiError(500, "Error in deleting old avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    throw new ApiError(500, "Error in deleting user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// const getUserOrders = asyncHandler(async (req, res, next) => {});
// const getUserReviews = asyncHandler(async (req, res, next) => {});
// const updateAddress = asyncHandler(async (req, res, next) => {});
// const deleteAddress = asyncHandler(async (req, res, next) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  generateEmailOTP,
  forgotPasswordResetLink,
  resetpasswordByLink,
  changePasswordWithOTP,
  updateUserProfile,
  updateEmail,
  updatePhone,
  updateAvatar,
  deleteUser,
  selfVerificationLinkRequest,
  selfVerify,
};
