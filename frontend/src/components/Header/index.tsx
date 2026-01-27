"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";

const menuData = [
  { id: 1, title: "Home", path: "/", submenu: null },
  { id: 2, title: "Shop", path: "/shop", submenu: null },
  { id: 3, title: "Categories", path: "/categories", submenu: null },
  { id: 4, title: "Tutorial", path: "/blog", submenu: null },
  { id: 5, title: "About Us", path: "/about", submenu: null },
  { id: 6, title: "Contact", path: "/contact", submenu: null },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const router = useRouter(); 
  const pathUrl = usePathname();

  useEffect(() => {
    setNavigationOpen(false);
  }, [pathUrl]);

  const handleStickyMenu = () => {
    setStickyMenu(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // ✅ Add Search Query if it exists
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    
    // ✅ Add Category Slug if selected
    if (selectedCategory !== "0") {
      params.set("category", selectedCategory);
    }

    router.push(`/shop?${params.toString()}`);
  };

  // ✅ Updated Values to match Slugs (Required for Shop Page logic)
  const options = [
    { label: "All Categories", value: "0" },
    { label: "Microcontrollers", value: "microcontrollers-development-boards" },
    { label: "Robotics", value: "robotics-mechanical-actuators" },
    { label: "Solar & Power", value: "solar-electronics-dc-protection" },
    { label: "FYP Kits", value: "fyp-final-year-project-kits" },
    { label: "IoT Sensors", value: "iot-sensors-environmental-modules" },
    { label: "Smart Home", value: "smart-home-automation" },
    { label: "Batteries", value: "batteries-power-management-bms" },
    { label: "Wireless", value: "wireless-communication-modules" },
    { label: "Computer Parts", value: "computer-storage-speed-upgrades" },
    { label: "Prototyping", value: "prototyping-tools-consumables" },
  ];

  return (
    <header className={`fixed left-0 top-0 w-full z-[9999] bg-white transition-all duration-300 ${stickyMenu && "shadow-md"}`}>
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between transition-all duration-200 ${stickyMenu ? "py-4" : "py-6"}`}>
          
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768661829/electronic_kits/db2rpvqtznxdtojmvcxb.png"
                alt="Glacia Labs" width={219} height={36} priority 
              />
            </Link>

            <div className="relative max-w-[475px] w-full z-[50] bg-white">
              <form onSubmit={handleSearch} className="bg-white rounded-[5px]">
                <div className="flex items-center bg-white border border-gray-3 rounded-[5px] relative z-[60]">
                  <CustomSelect 
                    options={options} 
                    selectedCategory={selectedCategory} 
                    onChange={(val) => setSelectedCategory(val)} 
                  />

                  {/* ✅ THE SEARCH INPUT (Restored) */}
                  <div className="relative flex-grow">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5.5 bg-gray-4"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      placeholder="I am shopping for..."
                      className="w-full bg-white py-2.5 pl-4 pr-10 outline-none rounded-r-[5px] focus:border-blue"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue transition-colors">
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex w-full lg:w-auto items-center gap-7.5 bg-white relative z-[40]">
             {/* Support/Account/Cart Buttons - Kept Hidden for brevity, ensure they are here in your code */}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-3 bg-white relative z-[30]">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0 bg-white">
          <div className="flex items-center justify-between bg-white">
            <div className={`absolute right-4 top-full z-[9999] flex min-w-[288px] flex-col rounded-md border border-gray-3 bg-white py-2.5 shadow-2xl transition-all duration-200 xl:static xl:flex xl:w-auto xl:translate-y-0 xl:flex-row xl:items-center xl:justify-between xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none xl:opacity-100 xl:visible ${navigationOpen ? "visible opacity-100 h-auto" : "invisible opacity-0 h-0 xl:h-auto xl:visible xl:opacity-100"}`}>
              <nav className="bg-white xl:bg-transparent w-full">
                <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6 bg-white xl:bg-transparent p-4 xl:p-0">
                  {menuData.map((menuItem, i) => (
                    <li key={i} className="group relative">
                      <Link href={menuItem.path} onClick={() => setNavigationOpen(false)} className={`hover:text-blue text-custom-sm font-medium text-dark flex bg-white xl:bg-transparent ${stickyMenu ? "xl:py-4" : "xl:py-6"}`}>
                        {menuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;