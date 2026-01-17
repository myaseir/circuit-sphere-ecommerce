"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product"; // ✅ Ensure this type exists
import SingleGridItem from "../../Shop/SingleGridItem"; // ✅ Use the Product Card component

const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch Real Data from API
useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      // 1. Get the base URL from environment variables
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 2. Fetch 6 items using the dynamic base URL
      const response = await fetch(`${baseUrl}/api/v1/kits?limit=6`);
      
      if (!response.ok) throw new Error("Failed to fetch");

      const apiData = await response.json();

      // Map Backend -> Frontend Data Structure
      const mappedProducts: Product[] = apiData.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: item.price,
        discountedPrice: item.price, // Adjust if you have discounts in your Pydantic model
        image: item.image_url ? [item.image_url] : ["/images/product/product-01.png"],
        reviews: 50, // Static for now
        category: item.category,
        stock: item.stock_quantity,
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchBestSellers();
}, []);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        {/* ✅ Show Loading State or Real Products */}
        {isLoading ? (
          <div className="text-center py-10">Loading Best Sellers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
            {products.length > 0 ? (
              products.map((item, key) => (
                // ✅ Use SingleGridItem (Product Card) instead of SingleItem (Category Bubble)
                <SingleGridItem item={item} key={key} />
              ))
            ) : (
              <div className="col-span-3 text-center">No products found.</div>
            )}
          </div>
        )}

        <div className="text-center mt-12.5">
          <Link
            // ✅ Link to the dynamic Shop page we just fixed
            href="/shop-with-sidebar" 
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;