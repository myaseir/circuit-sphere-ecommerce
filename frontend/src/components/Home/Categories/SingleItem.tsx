import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link 
      // ✅ Using encodeURIComponent is vital for categories with "&" or spaces
      href={`/shop-with-sidebar?category=${encodeURIComponent(item.title)}`} 
      className="group flex flex-col items-center"
    >
      <div className="relative max-w-[130px] w-full h-32.5 rounded-full overflow-hidden flex items-center justify-center mb-4 border border-gray-100 shadow-sm bg-white">
        <Image 
          src={item.img} 
          alt={item.title} 
          fill 
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          priority
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