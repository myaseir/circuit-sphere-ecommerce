"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { Product } from "@/types/product";

// --- STATIC HELPERS (Outside component to prevent re-renders) ---

const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '') // Removes special chars
    .replace(/ +/g, '-');    // Replaces spaces with -
};

const categories = [
  { name: "Microcontrollers & Development Boards", products: 34 },
  { name: "Robotics & Mechanical Actuators", products: 40 },
  { name: "FYP (Final Year Project) Kits", products: 35 },
  { name: "Computer Storage & Speed Upgrades", products: 20 },
  { name: "IoT Sensors & Environmental Modules", products: 60 },
  { name: "Smart Home Automation", products: 30 },
  { name: "Batteries & Power Management (BMS)", products: 21 },
  { name: "Wireless Communication Modules", products: 22 },
  { name: "Solar Electronics & DC Protection", products: 23 },
  { name: "Prototyping Tools & Consumables", products: 23 },
];

// --- COMPONENT ---

const ShopWithSidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  
  // Derived state for the UI title
  const [selectedCategory, setSelectedCategory] = useState("");

  // 1. Fetch Logic (useCallback)
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const categorySlug = searchParams.get("category") || "";
      
      // Match slug back to real category name for the API
      const foundCategory = categories.find(cat => convertToSlug(cat.name) === categorySlug);
      const activeCategoryName = foundCategory ? foundCategory.name : "";
      
      // Update the UI title state
      setSelectedCategory(activeCategoryName);

      let url = `${baseUrl}/api/v1/kits?skip=0&limit=100`; 
      if (activeCategoryName) {
        url += `&category=${encodeURIComponent(activeCategoryName)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("API Error");
      
      const apiData = await response.json();
      
      const mappedData = apiData.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: item.price,
        discountedPrice: item.price,
        image: Array.isArray(item.image_url) ? [item.image_url[0]] : [item.image_url],
        category: item.category,
        stock: item.stock_quantity,
        originalPrice: item.original_price,
        isOnSale: item.on_sale,
      }));

      setProducts(mappedData);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]); // Only re-create if searchParams change

  // 2. Trigger Fetch on mount or URL change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Navigation Handler
  const handleCategoryChange = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set("category", convertToSlug(categoryName));
    } else {
      params.delete("category");
    }
    
    setProductSidebar(false);
    // Push update to URL
    router.push(`/shop-with-sidebar?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Breadcrumb
        title={selectedCategory ? selectedCategory : "Explore All Products"}
        pages={["shop", "/", "Results"]}
      />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-auto mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            
            {/* Sidebar Section */}
            <div className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
              productSidebar ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto" : "-translate-x-full"
            }`}>
              <div className="flex flex-col gap-6">
                <div className="bg-white shadow-1 rounded-lg py-4 px-5 flex items-center justify-between">
                  <p className="font-medium text-dark">Filters:</p>
                  <button 
                    onClick={() => handleCategoryChange("")} 
                    className="text-blue text-xs hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                
                <CategoryDropdown 
                  categories={categories} 
                  onSelectCategory={handleCategoryChange} 
                  selectedCategory={selectedCategory} 
                />
              </div>
            </div>

            {/* Main Content Section */}
            <div className="xl:max-w-[870px] w-full">
              
              {/* Toolbar */}
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <CustomSelect options={[{ label: "Latest Products", value: "0" }]} />
                   <p className="text-sm">
                     Showing <span className="text-dark font-bold">{products.length}</span> Products
                   </p>
                </div>
                
                {/* Mobile Sidebar Toggle */}
                <button 
                  onClick={() => setProductSidebar(true)}
                  className="xl:hidden text-sm font-medium text-blue"
                >
                  Filters
                </button>

                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => setProductStyle("grid")} 
                    className={`${productStyle === "grid" ? "bg-blue text-white" : "bg-gray-1"} w-10.5 h-9 rounded border flex items-center justify-center transition-all`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setProductStyle("list")} 
                    className={`${productStyle === "list" ? "bg-blue text-white" : "bg-gray-1"} w-10.5 h-9 rounded border flex items-center justify-center transition-all`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Product Display Logic */}
              {isLoading ? (
                <div className="flex justify-center py-32">
                  <div className="animate-spin h-10 w-10 border-4 border-blue border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className={productStyle === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9" 
                  : "flex flex-col gap-7.5"
                }>
                  {products.length > 0 ? (
                    products.map((item, index) => (
                      productStyle === "grid" 
                        ? <SingleGridItem item={item} key={item.id || index} /> 
                        : <SingleListItem item={item} key={item.id || index} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
                      <p className="text-xl font-medium text-dark/60">No products found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Try clearing filters or checking your database for category: "{selectedCategory}"
                      </p>
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