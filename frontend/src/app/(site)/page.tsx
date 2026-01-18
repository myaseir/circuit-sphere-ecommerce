import { Metadata } from "next";
import dynamic from "next/dynamic";

// ✅ 1. Import "Above the Fold" components (Instant Load)
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/Categories";
import NewArrival from "@/components/Home/NewArrivals";
import PromoBanner from "@/components/Home/PromoBanner";
import BestSeller from "@/components/Home/BestSeller";
import CountDown from "@/components/Home/Countdown";

// ✅ 2. Import "Testimonials" Dynamically (Lazy Load)
// This fixes the "Reduce Unused JavaScript" warning
const Testimonials = dynamic(() => import("@/components/Home/Testimonials"), {
  loading: () => <div className="py-20 text-center text-gray-400">Loading reviews...</div>,
  ssr: false, 
});

export const metadata: Metadata = {
  title: "Glacia Labs | Pakistan's #1 Robotics & Electronics Store",
  description: "Shop Glacia Labs for authentic Arduino, ESP32, Sensors, and IoT modules in Pakistan. Fast delivery to Islamabad, Lahore, Karachi & Nationwide. Best prices for FYP students & engineers.",
  keywords: ["Glacia Labs", "Arduino Price in Pakistan", "ESP32 Pakistan", "Electronics Store Islamabad", "Robotics Parts", "Online Electronics Shop"],
  alternates: {
    canonical: "https://www.glacialabs.com",
  },
  openGraph: {
    title: "Glacia Labs - Best Electronics Store in Pakistan",
    description: "Buy Arduino, Sensors & Robotics parts at the best prices. Fast Shipping.",
    url: "https://www.glacialabs.com",
    siteName: "Glacia Labs",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "Glacia Labs Logo",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <CountDown />
      <Testimonials />
    </main>
  );
}