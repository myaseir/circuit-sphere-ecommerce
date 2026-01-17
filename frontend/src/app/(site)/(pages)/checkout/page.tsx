import React from "react";
import Checkout from "@/components/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Trustworthy Title
  title: "Secure Checkout | Glacia Labs",
  
  // ✅ Clear Description
  description: "Complete your purchase securely at Glacia Labs. Fast shipping for Arduino, ESP32, and robotics parts.",

  // ✅ SEO SECURITY: Prevents Google from indexing the checkout process
  robots: {
    index: false,
    follow: false,
  },
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;