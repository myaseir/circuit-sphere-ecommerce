import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.glacialabs.com"), 

  verification: {
    google: "TAMOlLE6pbk4jrdTqTnnUrA6151lR63gK_1xuB53f0k",
  },

  icons: {
    icon: "/icon.png", 
    apple: "/icon.png", 
  },

  title: "Glacia Labs | Pakistan's #1 Robotics, Laptop Parts & Electronics Store",
  
  // ✅ UPGRADE 1: Description now lists your new high-demand categories
  description: "Shop Glacia Labs for Arduino, Servo Motors, Laptop Batteries, Screens, & IoT Sensors in Pakistan. Best prices for FYP students & repair shops. Fast shipping nationwide.",
  
  // ✅ UPGRADE 2: High-Intent Keywords for Servos & Laptops
  keywords: [
    // Brand
    "Glacia Labs", 
    // Robotics Core
    "Arduino Price in Pakistan", "ESP32", "STM32",
    // Servo Motors (Specific Models are SEO Gold)
    "Servo Motor Price Pakistan", "SG90 Micro Servo", "MG995 Metal Gear Servo", "MG90S", "High Torque Servo",
    // Laptop Parts (Repair Keywords)
    "Laptop Battery Pakistan", "Laptop Screen Replacement", "Laptop Keyboards", "SSD Upgrade", "Laptop Charger Price",
    // Audience Specific
    "FYP Hardware", "University Project Parts", "Wholesale Electronics Pakistan",
    // Location
    "Online Electronics Store Pakistan", "Buy Electronics Online", "Robotics Shop Islamabad"
  ],

  alternates: {
    canonical: "/", 
  },

  openGraph: {
    title: "Glacia Labs - Robotics, Laptop Parts & Electronics",
    description: "Buy Arduino, Servos, Laptop Batteries & Sensors at the best prices. Fast Shipping in Pakistan.",
    url: "https://www.glacialabs.com", 
    siteName: "Glacia Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png", 
        width: 1200, 
        height: 630, 
        alt: "Glacia Labs - Robotics & Electronics Store",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <Home />
  );
}