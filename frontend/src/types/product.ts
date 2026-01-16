export type Product = {
  id: string | number; // Updated to support MongoDB strings
  title: string;
  price: number;
  
  // Make these optional since the API might not always return them initially
  reviews?: number;
  discountedPrice?: number;
  
  // ✅ New fields for the API
  image: string[]; // Standardized as an array for consistency
  category?: string;
  stock?: number;
  
  // ✅ New field added here
  description?: string; 

  // ⚠️ Old structure (kept for backward compatibility with other components)
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };

  // ----------------------------------------
  // ✅ NEW FIELDS FOR SALE & SPECIFICATIONS
  // ----------------------------------------
  originalPrice?: number;                // The "crossed out" price (e.g. 2000)
  isOnSale?: boolean;                    // Toggle for the "Sale" badge
  specifications?: Record<string, string>; // e.g. {"Voltage": "5V", "MCU": "ESP32"}
  specImages?: string[];                 // List of technical diagram URLs
};