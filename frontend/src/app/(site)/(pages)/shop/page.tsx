"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Product } from "@/types/product";
import Link from "next/link";
// ✅ Import the component we fixed earlier
import SingleGridItem from "@/components/Shop/SingleGridItem"; 

const ShopContent = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryId = searchParams.get("category") || "0";

  const categoryMap: { [key: string]: string } = {
    "1": "Microcontrollers & Development Boards",
    "2": "Robotics & Mechanical Actuators",
    "3": "Final Year Project Kits",
    "4": "Computer Storage & Speed Upgrades",
    "5": "IoT Sensors & Environmental Modules",
    "6": "Smart Home Automation",
    "7": "Batteries & Power Management (BMS)",
    "8": "Wireless Communication Modules",
    "9": "Solar Electronics & DC Protection",
    "10": "Prototyping Tools & Consumables",
  };

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://circuit-sphere-ecommerce.onrender.com/api/v1/kits`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const targetCategoryName = categoryMap[categoryId]?.toLowerCase();

        // 1. FILTERING
        const filtered = data.filter((item: any) => {
          const productName = item.name ? String(item.name).toLowerCase() : "";
          const itemCategory = item.category ? String(item.category).toLowerCase() : "";
          
          const matchesSearch = searchQuery === "" || productName.includes(searchQuery);
          const matchesCategory = categoryId === "0" || itemCategory === targetCategoryName;

          return matchesSearch && matchesCategory;
        });

        // 2. MAPPING (Updated to include Sale Info)
        const mappedData: Product[] = filtered.map((item: any) => {
          let safeImage = "/images/product/product-01.png";
          
          if (item.image_url && typeof item.image_url === "string" && item.image_url.trim() !== "") {
            safeImage = item.image_url;
          } else if (Array.isArray(item.image_url) && item.image_url[0]) {
            safeImage = item.image_url[0];
          }

          return {
            id: item.id,
            title: item.name || "Unnamed Product",
            price: Number(item.price) || 0,
            discountedPrice: Number(item.price) || 0,
            image: [safeImage], 
            category: item.category || "General",
            stock: item.stock_quantity || 0,
            reviews: 0,
            
            // ✅ CRITICAL FIX: Mapping the Sale Data here!
            originalPrice: item.original_price, // Backend (snake_case) -> Frontend (camelCase)
            isOnSale: item.on_sale,             // Backend (snake_case) -> Frontend (camelCase)
          };
        });

        setProducts(mappedData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery, categoryId]);

  return (
    <div className="max-w-[1170px] mx-auto px-4">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-dark">
          {searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
          {categoryId !== "0" && ` in ${categoryMap[categoryId]}`}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20 min-h-[400px]">Searching...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              // ✅ FIX: Use the Component! Do not hardcode HTML here.
              // This component contains the Red Badge & Strikethrough logic.
              <SingleGridItem key={product.id} item={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-lg shadow-1">
              <p className="text-xl text-gray-500">No products found matching your search.</p>
              <Link href="/shop" className="text-blue underline mt-4 inline-block">Reset All Filters</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ShopPage = () => {
  return (
    <>
      <Breadcrumb title="Shop" pages={["Home", "Shop"]} />
      <section className="py-20 bg-gray-2 min-h-screen">
        <Suspense fallback={<div className="text-center py-20">Loading Shop...</div>}>
          <ShopContent />
        </Suspense>
      </section>
    </>
  );
};

export default ShopPage;