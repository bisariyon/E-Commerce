import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    patchProducts: (state, action) => {
      const { _id, quantity } = action.payload;
      const product = state.products.find((product) => product._id === _id);
      if (product) {
        product.quantityInStock -= quantity;
      }
    }

  },
});

export const { setProducts, patchProducts } = productSlice.actions;
export default productSlice.reducer;
