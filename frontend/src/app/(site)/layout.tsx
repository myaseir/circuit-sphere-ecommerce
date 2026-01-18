import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"; 
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local"; // 👈 1. Import localFont

// CSS IMPORTS
// ❌ REMOVED: import "../css/euclid-circular-a-font.css"; 
import "../css/style.css";

// ✅ 2. Configure the Font (Update filenames to match yours)
const euclid = localFont({
  src: [
    {
      path: './fonts/EuclidCircularA-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/EuclidCircularA-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/EuclidCircularA-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/EuclidCircularA-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-euclid', // This creates a CSS variable
  display: 'swap',
});

export const metadata: Metadata = {
  // ✅ Base URL for Social Media Images
  metadataBase: new URL("https://www.glacialabs.com"), 

  // ✅ Google Verification
  verification: {
    google: "TAMOlLE6pbk4jrdTqTnnUrA6151lR63gK_1xuB53f0k",
  },

  // ✅ Branding
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
        url: "/images/logo/logo.png", 
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
    // ✅ 3. Inject the font variable into HTML
    <html lang="en" suppressHydrationWarning={true} className={euclid.variable}>
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