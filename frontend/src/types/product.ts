export type Product = {
  id: string | number; 
  title: string;
  price: number;
  
  // Optional fields for safety
  reviews?: number;
  discountedPrice?: number;
  
  // ✅ API STANDARD: Array of images
  image: string[]; 

  // ✅ UI FALLBACK: To prevent existing components from crashing
  // Use this in your components as: src={product.img || product.image[0]}
  img?: string; 

  category?: string;
  stock?: number;
  description?: string; 

  // ⚠️ BACKWARD COMPATIBILITY
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };

  // ----------------------------------------
  // ✅ NEW FIELDS FOR SALE & SPECIFICATIONS
  // ----------------------------------------
  originalPrice?: number;                
  isOnSale?: boolean;                    
  specifications?: Record<string, string>; 
  specImages?: string[];                 
};