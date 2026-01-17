import React from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Brand Update
  title: "Sign In | Glacia Labs",
  
  // ✅ Secure Description
  description: "Log in to your Glacia Labs account to manage orders and view your purchase history.",

  // ✅ SEO SECURITY: Prevents Google from indexing the login page
  robots: {
    index: false,
    follow: false,
  },
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;