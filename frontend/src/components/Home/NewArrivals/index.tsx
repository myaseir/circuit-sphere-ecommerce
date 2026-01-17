"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product"; 
import SingleGridItem from "../../Shop/SingleGridItem";

const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // 1. Determine the API base URL dynamically
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // 2. Fetch the latest 8 items
        const response = await fetch(`${baseUrl}/api/v1/kits?limit=8`);
        
        if (!response.ok) throw new Error("Failed to fetch");

        const apiData = await response.json();

        // 3. Robust Image & Data Mapping
        const mappedProducts: Product[] = apiData.map((item: any) => {
          // Logic to ensure we extract a valid string for the image URL
          let finalImage = "/images/product/product-01.png"; // Default fallback

          if (Array.isArray(item.image_url) && item.image_url.length > 0) {
            // If backend sends an array, pick the first string
            finalImage = item.image_url[0];
          } else if (typeof item.image_url === "string" && item.image_url.trim() !== "") {
            // If backend sends a direct string
            finalImage = item.image_url;
          }

          return {
            id: item.id,
            title: item.name,
            price: item.price,
            discountedPrice: item.price,
            // SingleGridItem usually expects an array of strings for the image field
            image: [finalImage], 
            reviews: 50, 
            category: item.category,
            stock: item.stock_quantity,
            originalPrice: item.original_price,
            isOnSale: item.on_sale,
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              This Week’s
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        {/* Dynamic Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin h-10 w-10 border-4 border-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {products.length > 0 ? (
              products.map((item, key) => (
                <SingleGridItem item={item} key={item.id || key} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No new arrivals found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;