import React from "react";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Professional Title
  title: "Contact Us | Glacia Labs",
  
  // ✅ Customer-Service Focused Description
  description: "Get in touch with Glacia Labs for support with your orders, technical questions about Arduino & ESP32, or business inquiries.",

  // ✅ SEO: Canonical URL
  alternates: {
    canonical: "https://glacialabs.com/contact",
  },

  // ✅ Social Sharing
  openGraph: {
    title: "Contact Glacia Labs Support",
    description: "Need help with your electronics project? Contact our support team.",
    url: "https://glacialabs.com/contact",
    siteName: "Glacia Labs",
    type: "website",
  },
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;