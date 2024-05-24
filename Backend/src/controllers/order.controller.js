// import { ApiResponse } from "../utils/apiResponse.js";
// import { ApiError } from "../utils/apiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Order } from "../models/order.model.js";
// import { CartProduct } from "../models/cartProducts.js";
// import { OrderItems } from "../models/orderItems.model.js";
// import { Product } from "../models/product.model.js";
// import mongoose from "mongoose";

/*
const createOrder = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const user = req.user;
  const { address, amount } = req.body;

  //Get CartProducts to Order
  const cartProducts = await CartProduct.find({ cart: cartId });
  if (cartProducts.length === 0) {
    throw new ApiError(400, "No products in cart");
  }

  const orderId = new mongoose.Types.ObjectId();

  //search each product and check if quantity is available and add to orderItems
  for (const CartProduct of cartProducts) {
    const product = await Product.findById(CartProduct._id);
    if (!product) {
      throw new ApiError(400, "Product not found");
    }

    if (product.quantityInStock < CartProduct.quantity) {
      throw new ApiError(400, "Product quantity not available");
    }

    
    
  }
});
*/

// export { createOrder };
