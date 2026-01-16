import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"; 

// ✅ YOUR CSS IMPORTS (Must be here for Global Styles)
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

// ✅ SEO METADATA
export const metadata: Metadata = {
  title: "Circuit Sphere | Best Online Electronics & Robotics Store in Pakistan",
  description: "Shop Pakistan's #1 collection of Arduino, ESP32, Solar protection, SSDs, and IoT sensors. Affordable engineering parts & smart home gear with fast nationwide shipping.",
  openGraph: {
    title: "Circuit Sphere - Electronics & Robotics",
    description: "Arduino, ESP32, Sensors & More. Delivered across Pakistan.",
    // images: ["/images/logo/logo.png"], 
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
      </body>
    </html>
  );
}