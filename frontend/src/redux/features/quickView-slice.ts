import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: "", // ✅ FIXED: Initialize as string to match Product type
    title: "",
    price: 0,
    reviews: 0,
    rating: 0, // ✅ ADDED: Initialize rating to prevent UI errors
    discountedPrice: 0,
    category: "",
    stock: 0,
    description: "", // ✅ ADDED: Usually required for Quick View
    isOnSale: false, // ✅ ADDED: Good practice to initialize
    originalPrice: 0,
    
    // ✅ Initial state for the image field
    image: [], 
    
    // Backwards compatibility
    imgs: { thumbnails: [], previews: [] },
  } as Product,
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
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