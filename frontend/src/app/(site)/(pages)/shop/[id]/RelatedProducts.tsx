"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

type Props = {
  currentProductId: string;
  category: string;
};

const RelatedProducts = ({ currentProductId, category }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // 1. Fetch all kits (or use a specific category endpoint if your API supports it)
      // This picks up the Render URL from Vercel or falls back to local for development
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const res = await fetch(`${baseUrl}/api/v1/kits`);
const data = await res.json();

        // 2. FILTER LOGIC:
        // - Must match the Category
        // - Must NOT be the current product (don't show what I'm already looking at)
        const related = data
          .filter((item: any) => 
            item.category === category && item.id !== currentProductId
          )
          .map((item: any) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            image: Array.isArray(item.image_url) ? item.image_url : [item.image_url],
            category: item.category,
          }))
          .slice(0, 4); // Limit to 4 items

        setProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (products.length === 0) return null; // Don't show section if no related items found

  return (
    <section className="py-10 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1170px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-dark mb-8">Related Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/shop/${product.id}`}
              className="group block bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={product.image[0]}
                  alt={product.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="text-xs text-blue font-semibold uppercase tracking-wider mb-1 block">
                  {product.category}
                </span>
                <h3 className="font-medium text-dark group-hover:text-blue transition-colors line-clamp-2 h-12">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-dark mt-2">
                  PKR {product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;