import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const convertToSlug = (text: string) => {
  return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link 
      href={`/shop-with-sidebar?category=${convertToSlug(item.title)}`} 
      className="group flex flex-col items-center"
    >
      <div className="relative max-w-[130px] w-full h-32.5 rounded-full overflow-hidden flex items-center justify-center mb-4 border border-gray-100 shadow-sm bg-white">
        <Image 
          src={item.img} 
          alt={item.title} 
          fill 
          // ✅ FIX 1: Tell browser this image is never wider than 130px
          sizes="(max-width: 768px) 100px, 130px" 
          
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          
          // ✅ FIX 2: Removed 'priority'. 
          // Only add 'loading="eager"' if this component is literally at the very top of your homepage.
          loading="lazy" 
        />
      </div>

      <div className="flex justify-center px-2">
        <h3 className="text-sm font-medium text-center text-dark leading-tight transition-colors duration-300 group-hover:text-blue lg:text-base">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;