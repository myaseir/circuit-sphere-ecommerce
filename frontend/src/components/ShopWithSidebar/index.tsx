"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { Product } from "@/types/product";

// --- HELPERS ---
const convertToSlug = (text: string) => {
  return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

const categories = [
  { name: "Microcontrollers & Development Boards" },
  { name: "Robotics & Mechanical Actuators" },
  { name: "FYP (Final Year Project) Kits" },
  { name: "Computer Storage & Speed Upgrades" },
  { name: "IoT Sensors & Environmental Modules" },
  { name: "Smart Home Automation" },
  { name: "Batteries & Power Management (BMS)" },
  { name: "Wireless Communication Modules" },
  { name: "Solar Electronics & DC Protection" },
  { name: "Prototyping Tools & Consumables" },
];

const ShopWithSidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const categorySlug = searchParams.get("category") || "";
      const found = categories.find(cat => convertToSlug(cat.name) === categorySlug);
      const activeName = found ? found.name : "";
      
      setSelectedCategoryName(activeName);

      let url = `${baseUrl}/api/v1/kits?skip=0&limit=100`; 
      if (activeName) url += `&category=${encodeURIComponent(activeName)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("API Error");
      const apiData = await response.json();
      
      setProducts(apiData.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: item.price,
        discountedPrice: item.price,
        image: Array.isArray(item.image_url) ? [item.image_url[0]] : [item.image_url],
        category: item.category,
        stock: item.stock_quantity,
        originalPrice: item.original_price,
        isOnSale: item.on_sale,
      })));
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set("category", convertToSlug(categoryName));
    } else {
      params.delete("category");
    }
    setProductSidebar(false);
    router.push(`/shop-with-sidebar?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Breadcrumb
        title={selectedCategoryName ? selectedCategoryName : "All Electronics"}
        pages={["shop", "/", "Results"]}
      />

      <section className="relative pb-20 pt-6 bg-[#f9fafb]">
        <div className="max-w-[1170px] mx-auto px-4 lg:px-8">
          
          {/* MOBILE OVERLAY */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] xl:hidden transition-all duration-300 ${
              productSidebar ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setProductSidebar(false)}
          />

          <div className="flex flex-col xl:flex-row gap-6">
            
            {/* SIDEBAR - Slimmer Desktop Width (240px) */}
            <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white z-[10001] shadow-2xl transition-transform duration-500 ease-in-out xl:static xl:translate-x-0 xl:z-1 xl:w-[240px] xl:bg-transparent xl:shadow-none ${
              productSidebar ? "translate-x-0" : "-translate-x-full"
            }`}>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 xl:hidden flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-dark">Categories</h3>
                  </div>
                  <button onClick={() => setProductSidebar(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-dark">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 xl:p-0">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="hidden xl:block font-bold text-dark mb-4 text-base">Categories</h4>
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        selectedCategoryName === "" 
                        ? "bg-blue text-white shadow-md shadow-blue/20" 
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-xs font-medium leading-tight ${
                          selectedCategoryName === cat.name 
                          ? "bg-blue text-white shadow-md shadow-blue/20" 
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT - Expands to fill the space */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm border border-gray-100">
                <button 
                  onClick={() => setProductSidebar(true)}
                  className="xl:hidden flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg font-bold text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  Filter
                </button>

                <p className="text-sm font-medium text-gray-400">
                  <span className="text-dark font-bold">{products.length}</span> items found
                </p>

                <div className="flex items-center gap-2">
                  <button onClick={() => setProductStyle("grid")} className={`p-1.5 rounded-md ${productStyle === "grid" ? "bg-blue text-white" : "bg-gray-50 text-gray-400"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg>
                  </button>
                  <button onClick={() => setProductStyle("list")} className={`p-1.5 rounded-md ${productStyle === "list" ? "bg-blue text-white" : "bg-gray-50 text-gray-400"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-40">
                  <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className={productStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                  {products.length > 0 ? (
                    products.map((item, i) => (
                      <SingleGridItem key={item.id || i} item={item} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-gray-400">No components found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;