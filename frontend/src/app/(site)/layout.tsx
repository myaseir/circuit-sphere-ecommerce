import type { Metadata } from "next";
import localFont from "next/font/local"; // ✅ Added local font loader
import ClientLayout from "./ClientLayout"; 
import { SpeedInsights } from "@vercel/speed-insights/next";

// CSS IMPORTS
// ✅ REMOVED: "../css/euclid-circular-a-font.css" (Now handled by next/font)
import "../css/style.css"; 

// ✅ CONFIGURE LOCAL FONT
const euclid = localFont({
  src: [
    // 1. Climb out of (site) with ../
    // 2. Go into fonts/
    { 
      path: "../fonts/EuclidCircularA-Regular.woff2", // ✅ Fixed Path
      weight: "400", 
      style: "normal" 
    },
    { 
      path: "../fonts/EuclidCircularA-Italic.woff2", 
      weight: "400", 
      style: "italic" 
    },
    { 
      path: "../fonts/EuclidCircularA-Medium.woff2", 
      weight: "500", 
      style: "normal" 
    },
    { 
      path: "../fonts/EuclidCircularA-MediumItalic.woff2", 
      weight: "500", 
      style: "italic" 
    },
    { 
      path: "../fonts/EuclidCircularA-SemiBold.woff2", 
      weight: "600", 
      style: "normal" 
    },
    { 
      path: "../fonts/EuclidCircularA-SemiBoldItalic.woff2", 
      weight: "600", 
      style: "italic" 
    },
    { 
      path: "../fonts/EuclidCircularA-Bold.woff2", 
      weight: "700", 
      style: "normal" 
    },
    { 
      path: "../fonts/EuclidCircularA-BoldItalic.woff2", 
      weight: "700", 
      style: "italic" 
    },
  ],
  variable: "--font-euclid",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glacialabs.com"), 
  verification: {
    google: "TAMOlLE6pbk4jrdTqTnnUrA6151lR63gK_1xuB53f0k",
  },
  title: {
    default: "Glacia Labs | Best Online Electronics & Robotics Store in Pakistan",
    template: "%s | Glacia Labs", 
  },
  description: "Shop Glacia Labs for Pakistan's #1 collection of Arduino, ESP32, Solar protection, SSDs, and IoT sensors. Fast nationwide shipping.",
  keywords: ["Glacia Labs", "Electronics Pakistan", "Arduino Price", "ESP32", "Robotics Store", "IoT Sensors"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Glacia Labs - Electronics & Robotics",
    description: "Arduino, ESP32, Sensors & More. Delivered across Pakistan.",
    url: "https://glacialabs.com",
    siteName: "Glacia Labs",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200, 
        height: 630,
        alt: "Glacia Labs Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
    // ✅ Apply the font variable to the HTML class
    <html lang="en" suppressHydrationWarning={true} className={euclid.variable}>
      <body className="font-sans"> {/* ✅ Use font-sans or map it in tailwind.config */}
        <ClientLayout>
          {children}
        </ClientLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}