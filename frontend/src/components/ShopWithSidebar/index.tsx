"use client"; 
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "@/components/Shop/SingleListItem"; 
import { Product } from "@/types/product";

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

const ShopContent = () => {
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
      
      // 1. Get Params
      const categorySlug = searchParams.get("category") || "";
      const searchQuery = searchParams.get("search") || "";
      
      const found = categories.find(cat => convertToSlug(cat.name) === categorySlug);
      const activeName = found ? found.name : "";
      setSelectedCategoryName(activeName);

      // 2. Build URL
      const apiParams = new URLSearchParams();
      apiParams.append("skip", "0");
      apiParams.append("limit", "100"); // Ensure we get enough items to filter
      if (activeName) apiParams.append("category", activeName);
      if (searchQuery) apiParams.append("search", searchQuery);

      const url = `${baseUrl}/api/v1/kits?${apiParams.toString()}`;
      
      console.log("Fetching:", url); // Debug

      const response = await fetch(url);
      if (!response.ok) throw new Error("API Error");
      
      let apiData = await response.json();

      // ✅ THE FIX: Manual Client-Side Filtering
      // If the API returned results but didn't filter them, we do it here.
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        apiData = apiData.filter((item: any) => 
          item.name.toLowerCase().includes(lowerQuery)
        );
      }

      // Map to your frontend structure
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
        rating: item.average_rating || 0,
        reviews: item.total_reviews || 0,
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
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const currentSearch = searchParams.get("search");

  return (
    <>
      <Breadcrumb
        title={currentSearch ? `Search: "${currentSearch}"` : (selectedCategoryName || "All Electronics")}
        pages={["shop", "/", "Results"]}
      />

      <section className="relative pb-20 pt-6 bg-[#f9fafb]">
        <div className="max-w-[1170px] mx-auto px-4 lg:px-8">
          {/* Mobile Overlay */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] xl:hidden transition-all duration-300 ${
              productSidebar ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setProductSidebar(false)}
          />

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white z-[10001] shadow-2xl transition-transform duration-500 ease-in-out xl:static xl:translate-x-0 xl:z-1 xl:w-[240px] xl:bg-transparent xl:shadow-none ${
              productSidebar ? "translate-x-0" : "-translate-x-full"
            }`}>
              <div className="flex flex-col h-full p-6 xl:p-0">
                <h4 className="font-bold text-dark mb-4 text-base">Categories</h4>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      selectedCategoryName === "" ? "bg-blue text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-xs font-medium leading-tight ${
                        selectedCategoryName === cat.name ? "bg-blue text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
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
                    products.map((item) => (
                      productStyle === "grid" ? <SingleGridItem key={item.id} item={item} /> : <SingleListItem key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-gray-400">No components found for "{currentSearch}".</p>
                      <button 
                         onClick={() => router.push('/shop')}
                         className="mt-4 text-blue font-bold hover:underline"
                      >
                         Clear Filters
                      </button>
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

const ShopWithSidebar = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
};

export default ShopWithSidebar;