import React from "react";
import Image from "next/image";

// ✅ 1. Define Interface for Type Safety
interface Feature {
  img: string;
  title: string;
  description: string;
}

const featureData: Feature[] = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Free Shipping",
    description: "For all orders over PKR 500", // Clarified text slightly
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 & 1 Returns",
    description: "Cancellation after 1 day",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Secure Payments",
    description: "Guarantee secure payments", // ✅ Fixed "Gurantee" typo
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "24/7 Dedicated Support",
    description: "Anywhere & anytime",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      {/* ✅ Updated Layout: Centered on mobile, spread out on desktop */}
      <div className="flex flex-wrap justify-center sm:justify-between items-center gap-7.5 xl:gap-12.5 mt-10">
        
        {featureData.map((item, index) => (
          <div className="flex items-center gap-4" key={item.title}> {/* ✅ Use title as key instead of index */}
            <Image 
              src={item.img} 
              alt={item.title} // ✅ SEO: Descriptive Alt Text
              width={40} 
              height={41} 
              className="flex-shrink-0" // Prevents icon squishing on small screens
            />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;