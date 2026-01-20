import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: "", // ✅ FIXED: Changed from 0 to "" to match string type
    title: "",
    price: 0,
    reviews: 0,
    discountedPrice: 0,
    image: [],          // Matches image: string[]
    img: "",            // Matches img?: string
    imgs: { 
      thumbnails: [], 
      previews: [] 
    },
    specImages: [],     // Matches specImages?: string[]
  },
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;