import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"; 
import { SpeedInsights } from "@vercel/speed-insights/next";

// CSS IMPORTS
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

export const metadata: Metadata = {
  // ✅ FIX 1: Removed the extra dot "." before glacialabs
  metadataBase: new URL("https://glacialabs.com"), 

  // ✅ 2. Google Verification
  verification: {
    google: "TAMOlLE6pbk4jrdTqTnnUrA6151lR63gK_1xuB53f0k",
  },

  // ✅ 3. Title Template
  title: {
    default: "Glacia Labs | Best Online Electronics & Robotics Store in Pakistan",
    template: "%s | Glacia Labs", 
  },
  
  description: "Shop Glacia Labs for Pakistan's #1 collection of Arduino, ESP32, Solar protection, SSDs, and IoT sensors. Fast nationwide shipping.",
  
  keywords: ["Glacia Labs", "Electronics Pakistan", "Arduino Price", "ESP32", "Robotics Store", "IoT Sensors"],

  // ✅ 4. Canonical
  alternates: {
    canonical: "./", // Use "./" to resolve relative to metadataBase
  },

  // ✅ 5. Open Graph
  openGraph: {
    title: "Glacia Labs - Electronics & Robotics",
    description: "Arduino, ESP32, Sensors & More. Delivered across Pakistan.",
    url: "https://glacialabs.com",
    siteName: "Glacia Labs",
    images: [
      {
        url: "/images/logo/logo.png", // Next.js automatically combines this with metadataBase
        width: 1200, 
        height: 630,
        alt: "Glacia Labs Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // ✅ 6. Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* Analytics */}
        <SpeedInsights />
      </body>
    </html>
  );
}