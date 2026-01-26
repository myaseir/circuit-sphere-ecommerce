import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Updated Brand Name
  title: "Shop All Electronics | Glacia Labs",
  
  // ✅ Included Brand Name in description for better CTR
  description: "Browse Glacia Labs' full catalog of microcontrollers, sensors, and robotics kits with advanced filtering options. Fast shipping across Pakistan.",
  
  // ✅ SEO: Tells Google this is the main shop page
  alternates: {
    canonical: "https://glacialabs.com/shop-with-sidebar",
  },

  // ✅ Social Sharing
  openGraph: {
    title: "Shop All Electronics | Glacia Labs",
    description: "Browse our full catalog of Arduino, ESP32, and sensors.",
    url: "https://glacialabs.com/shop-with-sidebar",
    siteName: "Glacia Labs",
    type: "website",
  },
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;