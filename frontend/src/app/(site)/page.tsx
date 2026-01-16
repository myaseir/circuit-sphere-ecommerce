import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ 1. Strong Title: Brand Name + Main Keyword + Location
  title: "Circuit Sphere | Pakistan's #1 Robotics & Electronics Store",

  // ✅ 2. Description: Packed with keywords (Arduino, ESP32, FYP, Cities)
  description: "Shop authentic Arduino, ESP32, Sensors, and IoT modules in Pakistan. Fast delivery to Islamabad, Lahore, Karachi & Nationwide. Best prices for FYP students & engineers.",
  
  // ✅ 3. Keywords: Specific terms people search for
  keywords: ["Arduino Price in Pakistan", "ESP32 Pakistan", "Electronics Store Islamabad", "Robotics Parts", "Online Electronics Shop"],

  // ✅ 4. Canonical URL: Tells Google this is the homepage master copy
  alternates: {
    canonical: "https://circuitsphere.pk",
  },

  // ✅ 5. Open Graph: How your link looks on WhatsApp/Facebook
  openGraph: {
    title: "Circuit Sphere - Best Electronics Store in Pakistan",
    description: "Buy Arduino, Sensors & Robotics parts at the best prices. Fast Shipping.",
    url: "https://circuitsphere.pk",
    siteName: "Circuit Sphere",
    type: "website",
    // images: [
    //   {
    //     url: "/images/logo/logo.png", // Ensure you have a logo or banner here
    //     width: 800,
    //     height: 600,
    //   },
    // ],
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}