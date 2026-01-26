import React from "react";
import Image from "next/image";
import Link from "next/link";

type CategoryItem = {
  id: number;
  title: string;
  image: string;
  path: string;
  productCount?: number;
};

const SingleItem = ({ item }: { item: CategoryItem }) => {
  return (
    <Link 
      href={item.path || "#"} 
      className="group flex flex-col items-center w-full"
    >
      {/* 1. CONTAINER: 
         - Changed rounded-[20px] to rounded-full (Circle) 
         - Removed 'p-4' or inner padding constraints so image touches edges
      */}
      <div className="
        relative w-full aspect-square 
        flex items-center justify-center 
        bg-gray-100 
        rounded-full 
        border border-gray-200
        shadow-sm 
        overflow-hidden
        transition-all duration-300 
        group-hover:shadow-md group-hover:border-blue-500 group-hover:-translate-y-1
        mb-4
      ">
        
        {/* 2. IMAGE:
           - Removed the wrapping div (w-2/3) so it fills 100%
           - Changed 'object-contain' to 'object-cover' (Crucial for filling)
        */}
        <Image 
          src={item.image} 
          alt={item.title} 
          fill 
          sizes="(max-width: 768px) 150px, 200px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy" 
        />
      </div>

      {/* TITLE & COUNT */}
      <div className="flex flex-col items-center px-2">
        <h3 className="text-sm font-semibold text-center text-dark leading-tight transition-colors duration-300 group-hover:text-blue lg:text-base">
          {item.title}
        </h3>
        {item.productCount && (
          <span className="text-xs text-gray-500 mt-1">{item.productCount} Products</span>
        )}
      </div>
    </Link>
  );
};

export default SingleItem;