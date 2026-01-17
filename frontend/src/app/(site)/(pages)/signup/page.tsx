import React from "react";
import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Clear Action Title
  title: "Create Account | Glacia Labs",
  
  // ✅ Benefit-Driven Description
  description: "Join Glacia Labs today. Create an account to track orders, save shipping details, and get updates on new robotics gear.",

  // ✅ SEO SECURITY: Prevents Google from indexing the registration page
  robots: {
    index: false,
    follow: false,
  },
};

const SignupPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default SignupPage;