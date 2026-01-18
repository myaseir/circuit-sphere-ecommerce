"use client";
import React, { useState, useEffect } from "react";
// keeping your exact relative paths
import Header from "../../components/Header";
import Footer from "../../components/Footer";
// ❌ REMOVED: import { SpeedInsights }... (It's already in layout.tsx)

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
    // ✅ Keep this: Instant loading for better LCP
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

      {loading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "white" }}>
          <PreLoader />
        </div>
      )}

      {/* ❌ REMOVED: <SpeedInsights /> (Already in layout.tsx) */}

      <ScrollToTop />
      <Footer />
    </>
  );
}