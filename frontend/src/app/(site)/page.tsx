import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ 1. Strong Title: Brand Name + Main Keyword + Location
  title: "Glacia Labs | Pakistan's #1 Robotics & Electronics Store",

  // ✅ 2. Description: Packed with keywords and the new Brand Name
  description: "Shop Glacia Labs for authentic Arduino, ESP32, Sensors, and IoT modules in Pakistan. Fast delivery to Islamabad, Lahore, Karachi & Nationwide. Best prices for FYP students & engineers.",
  
  // ✅ 3. Keywords: Added your new Brand Name
  keywords: ["Glacia Labs", "Arduino Price in Pakistan", "ESP32 Pakistan", "Electronics Store Islamabad", "Robotics Parts", "Online Electronics Shop"],

  // ✅ 4. Canonical URL: Points to your new domain
  alternates: {
    canonical: "https://glacialabs.com",
  },

  // ✅ 5. Open Graph: For Facebook/WhatsApp sharing
  openGraph: {
    title: "Glacia Labs - Best Electronics Store in Pakistan",
    description: "Buy Arduino, Sensors & Robotics parts at the best prices. Fast Shipping.",
    url: "https://www.glacialabs.com",
    siteName: "Glacia Labs",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png", // ⚠️ Ensure this file is your new Glacia Labs logo!
        width: 800,
        height: 600,
        alt: "Glacia Labs Logo",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <Home />
  );
}