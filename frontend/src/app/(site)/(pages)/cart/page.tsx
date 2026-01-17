import React from "react";
import Cart from "@/components/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Clear Title
  title: "Shopping Cart | Glacia Labs",
  
  // ✅ Description
  description: "Review your selected electronics, Arduino kits, and robotics parts before checkout.",

  // ✅ SEO SECURITY: Do not index dynamic user pages
  robots: {
    index: false,
    follow: false,
  },
};

const CartPage = () => {
  return (
    <main>
      <Cart />
    </main>
  );
};

export default CartPage;