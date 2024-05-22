import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basket: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      state.basket.push(action.payload);
      state.basket.sort((a, b) => a.price - b.price);
    },

    removeFromBasket: (state, action) => {
      const index = state.basket.findIndex(
        (item) => item.basketId === action.payload
      );
      if (index !== -1) {
        state.basket.splice(index, 1);
        state.basket.sort((a, b) => a.price - b.price);
      }
    },

    emptyBasket: (state) => {
      state.basket = [];
    },
  },
});

export const { addToBasket, removeFromBasket, emptyBasket } =
  basketSlice.actions;
export default basketSlice.reducer;
