import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import SingleGridItem from "../../Shop/SingleGridItem";

// 1. Define Fetch Logic outside the component (or in a separate utility file)
async function getBestSellers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Add "no-store" or "revalidate" to control caching
    const response = await fetch(`${baseUrl}/api/v1/kits?limit=6`, {
      next: { revalidate: 3600 } // Re-fetch data every 1 hour
    });

    if (!response.ok) return [];

    const apiData = await response.json();

    // Mapping Logic
    return apiData.map((item: any) => {
      let finalImage = "/images/product/product-01.png"; 

      if (Array.isArray(item.image_url) && item.image_url.length > 0) {
        finalImage = item.image_url[0];
      } else if (typeof item.image_url === "string" && item.image_url.trim() !== "") {
        finalImage = item.image_url;
      }

      return {
        id: item.id,
        title: item.name,
        price: item.price,
        discountedPrice: item.price,
        image: [finalImage],
        reviews: 50,
        category: item.category,
        stock: item.stock_quantity,
        originalPrice: item.original_price,
        isOnSale: item.on_sale,
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

// 2. Make the Component Async
const BestSeller = async () => {
  const products = await getBestSellers();

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

        {/* 3. Direct Rendering (No Loading State needed) */}
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