import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "UserAddress",
      required: true,
    },
    transactionID: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "delivered", "processing"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(aggregatePaginate);

export const Order = mongoose.model("Order", orderSchema);
