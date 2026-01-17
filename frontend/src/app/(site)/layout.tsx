import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"; 
import { SpeedInsights } from "@vercel/speed-insights/next";

// CSS IMPORTS
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

export const metadata: Metadata = {
  // ✅ Base URL for Social Media Images (Facebook/WhatsApp)
  metadataBase: new URL("https://www.glacialabs.com"), 

  // ✅ Updated Branding
  title: "Glacia Labs | Best Online Electronics & Robotics Store in Pakistan",
  description: "Shop Glacia Labs for Pakistan's #1 collection of Arduino, ESP32, Solar protection, SSDs, and IoT sensors. Fast nationwide shipping.",
  
  keywords: ["Glacia Labs", "Electronics Pakistan", "Arduino Price", "ESP32", "Robotics Store", "IoT Sensors"],

  openGraph: {
    title: "Glacia Labs - Electronics & Robotics",
    description: "Arduino, ESP32, Sensors & More. Delivered across Pakistan.",
    url: "https://www.glacialabs.com",
    siteName: "Glacia Labs",
    images: [
      {
        url: "/images/logo/logo.png", // ⚠️ Ensure you update this image file to your new logo!
        width: 800,
        height: 600,
        alt: "Glacia Labs Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        {/* Analytics running on the client side */}
        <SpeedInsights />
      </body>
    </html>
  );
}