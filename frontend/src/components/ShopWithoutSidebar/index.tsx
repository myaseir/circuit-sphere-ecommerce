"use client";
import  { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import { Product } from "@/types/product";

const ShopWithoutSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12; 

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const skip = (page - 1) * limit;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // ✅ REMOVED "&category=Laptops" to fetch everything
      const response = await fetch(
        `${baseUrl}/api/v1/kits?skip=${skip}&limit=${limit}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch");
      const apiData = await response.json();

      const mappedProducts: Product[] = apiData.map((item: any) => {
        let safeImage = "/images/placeholder.svg";
        if (Array.isArray(item.image_url) && item.image_url.length > 0) {
            safeImage = item.image_url[0];
        } else if (typeof item.image_url === "string" && item.image_url.trim() !== "") {
            safeImage = item.image_url;
        }

        return {
          id: item.id,
          title: item.name,
          price: item.price,
          discountedPrice: item.price,
          image: [safeImage], 
          reviews: 50, 
          category: item.category,
          stock: item.stock_quantity,
          originalPrice: item.original_price, 
          isOnSale: item.on_sale,
        };
      });

      setProducts(mappedProducts); 
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <>
      <Breadcrumb
        title={"All Electronics"}
        pages={["shop", "/", "All Products"]}
      />

      <section className="relative pb-20 pt-10 bg-[#f9fafb]">
        <div className="max-w-[1170px] mx-auto px-4 lg:px-8">
          
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-4 mb-10 flex items-center justify-between shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="text-dark font-bold">{products.length}</span> items total
            </p>

            <div className="flex items-center gap-2">
              <button onClick={() => setProductStyle("grid")} className={`p-2 rounded-lg ${productStyle === "grid" ? "bg-blue text-white" : "bg-gray-50 text-gray-400"}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
              </button>
              <button onClick={() => setProductStyle("list")} className={`p-2 rounded-lg ${productStyle === "list" ? "bg-blue text-white" : "bg-gray-50 text-gray-400"}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 10h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-40">
              <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className={productStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
              {products.length > 0 ? (
                products.map((item, i) => (
                  <SingleGridItem key={item.id || i} item={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400">No products found in the database.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-15">
            <button 
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }}
              disabled={page === 1}
              className="px-6 py-2 border rounded-l-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="px-6 py-2 border-y bg-white font-bold">Page {page}</span>
            <button 
              onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
              disabled={products.length < limit}
              className="px-6 py-2 border rounded-r-xl disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;