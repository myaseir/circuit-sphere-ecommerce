import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: 0, // Can be string or number now
    title: "",
    price: 0,
    reviews: 0,
    discountedPrice: 0,
    category: "",
    stock: 0,
    
    // ✅ Initial state for the new image field
    image: [], 
    
    // Backwards compatibility
    imgs: { thumbnails: [], previews: [] },
  } as Product,
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    // ✅ Typed the action payload correctly
    updateQuickView: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },

    resetQuickView: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;