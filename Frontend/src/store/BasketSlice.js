import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basket: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // addToBasket: (state, action) => {
    //   state.basket.push(action.payload);
    //   state.basket.sort((a, b) => a.price - b.price);
    // },

    setBasket: (state, action) => {
      state.basket = action.payload;
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

    decreaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const index = state.basket.findIndex(
        (item) => item.productId === productId
      );
      if (index !== -1) {
        if (state.basket[index].quantity > 1) {
          state.basket[index].quantity -= 1;
        } else {
          state.basket.splice(index, 1);
        }
      }
    },

    increaseQuantityOrAddToBasket: (state, action) => {
      const {
        productId,
        title,
        productImage,
        price,
        brand,
        category,
        quantity = 1,
      } = action.payload;

      const index = state.basket.findIndex(
        (item) => item.productId === productId
      );
      if (index !== -1) {
        state.basket[index].quantity += 1;
      } else {
        state.basket.push({
          productId,
          title,
          productImage,
          price,
          brand,
          category,
          quantity,
        });
        state.basket.sort((a, b) => a.price - b.price);
      }
    },

    onlyIncreaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const index = state.basket.findIndex(
        (item) => item.productId === productId
      );
      if (index !== -1) {
        state.basket[index].quantity += 1;
      }
    },
  },
});

export const {
  // addToBasket,
  setBasket,
  removeFromBasket,
  emptyBasket,
  decreaseQuantity,
  increaseQuantityOrAddToBasket,
  onlyIncreaseQuantity,
} = basketSlice.actions;

export default basketSlice.reducer;
