"use client";
import React, { useState, useEffect } from "react";
// keeping your exact relative paths
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"
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
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer); // Good practice to cleanup timer
  }, []);

  return (
    <>
      {/* ✅ 1. Always render the Providers & Content so Google sees them immediately */}
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

      {/* ✅ 2. Show PreLoader as an OVERLAY on top (if loading) */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "white" }}>
          <PreLoader />
        </div>
      )}

      {/* Footer & ScrollToTop can stay visible or wait, usually fine to show immediately */}
      <ScrollToTop />
      <Footer />
    </>
  );
}