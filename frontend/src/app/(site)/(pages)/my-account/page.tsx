import React from "react";
import MyAccount from "@/components/MyAccount";
import { Metadata } from "next";

export const metadata: Metadata = {
  // ✅ Brand Update
  title: "My Account | Glacia Labs",
  
  // ✅ User-focused Description
  description: "Manage your orders, track shipments, and update your profile details at Glacia Labs.",

  // ✅ SEO SECURITY: Tells Google NOT to index this private page
  robots: {
    index: false,
    follow: false,
  },
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;