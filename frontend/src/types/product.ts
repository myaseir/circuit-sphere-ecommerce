export type Product = {
  id: string;
  title: string;
  price: number;
  image: string[];
  
  // ✅ Front-end standard keys
  rating?: number;
  reviews?: number;

  // ✅ BACKEND API KEYS (Add these to fix the missing data)
  average_rating?: number;
  total_reviews?: number;

  discountedPrice?: number;
  img?: string;
  category?: string;
  stock?: number;
  description?: string;
  originalPrice?: number;
  isOnSale?: boolean;
  specifications?: Record<string, string>;
  specImages?: string[];
  
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};