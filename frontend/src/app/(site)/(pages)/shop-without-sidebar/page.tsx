import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Updated Brand Name
  title: "Shop Electronics (Full Width) | Glacia Labs",
  
  // ✅ Better Description with keywords
  description: "Explore the complete Glacia Labs inventory of Arduino, ESP32, and robotics parts. Full-width view for easier browsing.",

  // ✅ SEO: Canonical URL (Assuming this route is /shop-full or similar)
  alternates: {
    canonical: "https://www.glacialabs.com/shop-without-sidebar", // Update if your route is different
  },

  openGraph: {
    title: "Shop Electronics | Glacia Labs",
    description: "Browse our full collection of robotics and electronics components.",
    url: "https://www.glacialabs.com/shop-without-sidebar",
    siteName: "Glacia Labs",
    type: "website",
  },
};

const ShopWithoutSidebarPage = () => {
  return (
    <main>
      <ShopWithoutSidebar />
    </main>
  );
};

export default ShopWithoutSidebarPage;