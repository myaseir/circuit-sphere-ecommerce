import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Personal & Branded Title
  title: "My Wishlist | Glacia Labs",
  
  // ✅ Functional Description
  description: "Save your favorite Arduino boards, sensors, and robotics parts for later at Glacia Labs.",

  // ✅ SEO SECURITY: Prevents Google from indexing private user lists
  robots: {
    index: false,
    follow: false,
  },
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;