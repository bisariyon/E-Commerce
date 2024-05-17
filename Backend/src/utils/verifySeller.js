import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Seller } from "../models/seller.model.js";
import nodemailer from "nodemailer";
import { ADMIN_EMAIL ,PLATFORM_EMAIL} from "../constants.js";

const verifySellerMail = async (data) => {
  const { sellerId, email, GSTnumber, subject, message } = data;

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const transporter = nodemailer.createTransport({
    server: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Bisariyon E-com" ${PLATFORM_EMAIL}`,
    to: ADMIN_EMAIL,
    subject: subject,
    html:
      message +
      `<br>Seller details SellerId: <strong>${sellerId}</strong>  <br>Seller Email : <strong>${email}</strong> <br> GST Number: <strong>${GSTnumber}</strong>`,
  };

  const info = await transporter.sendMail(mailOptions);
  if (!info) {
    return `Email not sent to Admin for verification of Seller : ${sellerId}`;
  }
  return `Email sent to Admin : ${ADMIN_EMAIL} for verification Seller : ${sellerId}`;
};

export { verifySellerMail };
