import mongoose, { Schema } from "mongoose";

const RequestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["return", "cancel", "refund"],
      required: true,
    },
    orderItems: {
      type: Schema.Types.ObjectId,
      ref: "OrderItems",
      required: true,
    },
    transactionID: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Request = mongoose.model("Request", RequestSchema);
