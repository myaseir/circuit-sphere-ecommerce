import React from "react";
import Error from "@/components/Error";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ User-Friendly Title
  title: "Page Not Found | Glacia Labs",
  
  // ✅ Helpful Description
  description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",

  // ✅ SEO SECURITY: Prevents Google from indexing 404 pages
  robots: {
    index: false,
    follow: true, // Allows bots to find their way back to the homepage
  },
};

const ErrorPage = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default ErrorPage;