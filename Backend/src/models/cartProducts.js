import mongoose, { Schema } from "mongoose";

const cartProductsSchema = new Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const CartProduct = mongoose.model("CartProduct", cartProductsSchema);
