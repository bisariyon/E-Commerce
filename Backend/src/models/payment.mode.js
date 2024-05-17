import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    orderID: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["COD", "Card", "NetBanking", "UPI"],
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
