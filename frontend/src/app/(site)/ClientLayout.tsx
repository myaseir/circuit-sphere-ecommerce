"use client";
import React, { useState, useEffect } from "react";
// keeping your exact relative paths
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"; // ✅ Used below
import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ✅ CRITICAL FIX: Removed the 1000ms delay.
    // We now turn off loading as soon as the component mounts (hydration complete).
    // This allows Google to see your Hero Image instantly, drastically improving LCP score.
    setLoading(false);
  }, []);

  return (
    <>
      <ReduxProvider>
        <CartModalProvider>
          <ModalProvider>
            <PreviewSliderProvider>
              <Header />
              {children}

              <QuickViewModal />
              <CartSidebarModal />
              <PreviewSliderModal />
            </PreviewSliderProvider>
          </ModalProvider>
        </CartModalProvider>
      </ReduxProvider>

      {/* Show PreLoader only while React is Hydrating (milliseconds) */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "white" }}>
          <PreLoader />
        </div>
      )}

      {/* ✅ ADDED: You imported this but didn't render it */}
      <SpeedInsights />

      <ScrollToTop />
      <Footer />
    </>
  );
}