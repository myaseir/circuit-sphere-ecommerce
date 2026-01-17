import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Updated Brand Name
  title: "Product Details | Glacia Labs",
  
  // ✅ Better Description
  description: "View detailed specifications, pricing, and reviews for electronics and robotics components at Glacia Labs.",
  
  openGraph: {
    title: "Product Details | Glacia Labs",
    description: "Shop the best Arduino, ESP32, and IoT sensors in Pakistan.",
    url: "https://www.glacialabs.com",
    siteName: "Glacia Labs",
    type: "website",
  },
};

const ShopDetailsPage = () => {
  return (
    <main>
      <ShopDetails />
    </main>
  );
};

export default ShopDetailsPage;