import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seller: null,
};

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;
    },

    patchSeller: (state, action) => {
      state.seller = { ...state.seller, ...action.payload };
    },
  },
});

export const { setSeller, patchSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
