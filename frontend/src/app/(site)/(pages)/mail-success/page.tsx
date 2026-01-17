import React from "react";
import MailSuccess from "@/components/MailSuccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Clear Confirmation Title
  title: "Message Sent Successfully | Glacia Labs",
  
  // ✅ Friendly Confirmation Text
  description: "Thank you for contacting Glacia Labs. We have received your inquiry and will get back to you shortly.",

  // ✅ SEO: Prevent Google from indexing this page
  // (Users should only see this after submitting a form, not via search)
  robots: {
    index: false,
    follow: true, // It's okay to let Google follow links back to the homepage
  },
};

const MailSuccessPage = () => {
  return (
    <main>
      <MailSuccess />
    </main>
  );
};

export default MailSuccessPage;