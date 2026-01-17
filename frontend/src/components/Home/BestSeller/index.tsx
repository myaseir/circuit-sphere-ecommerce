"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product"; 
import SingleGridItem from "../../Shop/SingleGridItem"; 

const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Fetch 6 items using the dynamic base URL
        const response = await fetch(`${baseUrl}/api/v1/kits?limit=6`);
        
        if (!response.ok) throw new Error("Failed to fetch");

        const apiData = await response.json();

        // ✅ Robust Image Mapping Logic
        const mappedProducts: Product[] = apiData.map((item: any) => {
          let finalImage = "/images/product/product-01.png"; // Default fallback

          if (Array.isArray(item.image_url) && item.image_url.length > 0) {
            // If it's an array, take the first string
            finalImage = item.image_url[0];
          } else if (typeof item.image_url === "string" && item.image_url.trim() !== "") {
            // If it's a direct string
            finalImage = item.image_url;
          }

          return {
            id: item.id,
            title: item.name,
            price: item.price,
            discountedPrice: item.price,
            image: [finalImage], // SingleGridItem expects an array
            reviews: 50, 
            category: item.category,
            stock: item.stock_quantity,
            originalPrice: item.original_price,
            isOnSale: item.on_sale,
          };
        });

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

        {/* Loading Spinner or Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin h-10 w-10 border-4 border-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
            {products.length > 0 ? (
              products.map((item, key) => (
                <SingleGridItem item={item} key={item.id || key} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No products found.
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12.5">
          <Link
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