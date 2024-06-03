import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderItemsSchema = new Schema(
  {
    orderID: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sellerInfo: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    amount: { 
      //price * quantity
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "shipped", "delivered"],
      default: "pending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

orderItemsSchema.plugin(aggregatePaginate);

export const OrderItems = mongoose.model("OrderItems", orderItemsSchema);
