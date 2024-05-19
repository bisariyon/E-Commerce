import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//basic middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subCategoryRouter from "./routes/subCategory.routes.js";
import brandRouter from "./routes/brand.routes.js";
import addressRouter from "./routes/address.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import reviewRouter from "./routes/review.routes.js";
import productOffersRouter from "./routes/productOffers.routes.js";
import cartProductsRouter from "./routes/cartProducts.routes.js";
import orderRouter from "./routes/order.routes.js";

//routes declaration
app.use("/v1/healthcheck", healthcheckRouter);
app.use("/v1/users", userRouter);
app.use("/v1/sellers", sellerRouter);
app.use("/v1/products", productRouter);
app.use("/v1/categories", categoryRouter);
app.use("/v1/sub-categories", subCategoryRouter);
app.use("/v1/brands", brandRouter);
app.use("/v1/addresses", addressRouter);
app.use("/v1/wishlist", wishlistRouter);
app.use("/v1/reviews", reviewRouter);
app.use("/v1/product-offers", productOffersRouter);
app.use("/v1/cart-items", cartProductsRouter);
app.use("/v1/orders", orderRouter);

export { app };
