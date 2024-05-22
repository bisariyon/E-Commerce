import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./ProductSlice";
import basketReducer from "./BasketSlice";
import userReducer from "./UserSlice";
import themeReducer from "./ThemeSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    basket: basketReducer,
    user: userReducer,
    theme: themeReducer,
  },
});

export default store;
