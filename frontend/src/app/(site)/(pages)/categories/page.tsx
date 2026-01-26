import React from "react";
import Link from "next/link";
import Image from "next/image";
import data from "@/components/Home/Categories/categoryData"; // Import your shared data file

// Reusing the same styling logic but for a Grid view
const CategoryCard = ({ item }: { item: any }) => {
  return (
    <Link href={item.path || "#"} className="group block w-full">
      <div className="
        relative flex flex-col items-center justify-center 
        bg-white rounded-[20px] border border-gray-200 
        p-4 shadow-sm aspect-square
        transition-all duration-300 
        hover:shadow-xl hover:border-blue-500 hover:-translate-y-1
      ">
        {/* ✅ FIX: Increased to w-40 (Mobile) and w-52 (Desktop) */}
        <div className="relative w-40 h-40 md:w-52 md:h-52 mb-4 transition-transform duration-300 group-hover:scale-110">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 160px, 220px"
          />
        </div>
        
        <h3 className="text-lg md:text-xl font-bold text-dark group-hover:text-blue-600 text-center leading-tight px-2 z-10">
          {item.title}
        </h3>
        
        {item.productCount && (
           <p className="text-sm text-gray-500 mt-1 font-medium">{item.productCount} Products</p>
        )}
      </div>
    </Link>
  );
};

export const metadata = {
  title: "All Categories | Glacia Labs Electronics",
  description: "Browse our full catalog of Arduino, Sensors, Robotics, and IoT components.",
};

const CategoriesPage = () => {
  return (
    <section className="pt-24 pb-20 bg-gray-50">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-medium tracking-wider uppercase text-sm">
            Product Catalog
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mt-2">
            Browse All Categories
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            From microcontrollers to mechanical parts, find exactly what you need for your next invention.
          </p>
        </div>

        {/* ✅ THE GRID: This shows everything at a glance */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesPage;