import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CartProduct } from "../models/cartProducts.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addToCart = asyncHandler(async (req, res, next) => {
  let { quantity } = req.query;
  const { productId } = req.params;
  const userId = req.user._id;

  quantity = parseInt(quantity);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found. User not verified.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existedInCart = await CartProduct.findOne({
    product: product._id,
    cart: cart._id,
  });

  if (existedInCart) {
    existedInCart.quantity += quantity;
    const updatedCart = await existedInCart.save();
    if (!updatedCart) {
      throw new ApiError(400, "Failed to update cart");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, updatedCart, "Cart Updated"));
  }

  const cartProduct = await CartProduct.create({
    cart: cart._id,
    product: product._id,
    quantity,
  });

  if (!cartProduct) {
    throw new ApiError(400, "Failed to add product to cart");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, cartProduct, "Product added to cart"));
});

const decreaseFromCart = asyncHandler(async (req, res, next) => {
  let { quantity } = req.query;
  const { productId } = req.params;
  const userId = req.user._id;

  quantity = parseInt(quantity);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existedInCart = await CartProduct.findOne({
    product: product._id,
    cart: cart._id,
  });

  if (!existedInCart) {
    throw new ApiError(404, "Product not found in cart");
  }

  if (existedInCart.quantity <= quantity) {
    const removedCartProduct = await CartProduct.findByIdAndDelete(
      existedInCart._id
    );

    if (!removedCartProduct) {
      throw new ApiError(400, "Failed to remove product from cart");
    }
  } else {
    existedInCart.quantity -= quantity;
    const updatedCart = await existedInCart.save();
    if (!updatedCart) {
      throw new ApiError(400, "Failed to update cart");
    }
  }

  return res.status(201).json(new ApiResponse(201, {}, "Cart Updated"));
});

const emptyCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const removedCartProducts = await CartProduct.deleteMany({ cart: cart._id });
  if (!removedCartProducts) {
    throw new ApiError(400, "Failed to empty cart");
  }

  return res.status(201).json(new ApiResponse(201, {}, "Cart Updated"));
});

const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const cartProducts = await CartProduct.find({ cart: cart._id }).populate(
    "product"
  );
  if (!cartProducts) {
    throw new ApiError(404, "Cart is empty");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cartProducts, "Cart Products"));
});

const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existedInCart = await CartProduct.findOne({
    product: product._id,
    cart: cart._id,
  });

  if (!existedInCart) {
    throw new ApiError(404, "Product not found in cart");
  }

  const removedCartProduct = await CartProduct.findByIdAndDelete(
    existedInCart._id
  );

  if (!removedCartProduct) {
    throw new ApiError(400, "Failed to delete item from cart");
  }

  return res.status(201).json(new ApiResponse(201, {}, "Cart Updated"));
});

export { addToCart, decreaseFromCart, emptyCart, getCart, removeItemFromCart };
