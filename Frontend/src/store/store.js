import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./ProductSlice";
import basketReducer from "./BasketSlice";
import userReducer from "./UserSlice";
import themeReducer from "./ThemeSlice";
import sellerReducer from "./SellerSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    basket: basketReducer,
    user: userReducer,
    theme: themeReducer,
    seller: sellerReducer,
  },
});

export default store;
