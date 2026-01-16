import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: 0,
    title: "",
    price: 0,
    reviews: 0,
    discountedPrice: 0,
    image: [],          // Matches image: string[] in your type
    img: "",            // Matches img?: string in your type
    imgs: { 
      thumbnails: [], 
      previews: [] 
    },
    specImages: [],     // Matches specImages?: string[] in your type
    // Note: 'images' was removed because it is not in your Product type
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