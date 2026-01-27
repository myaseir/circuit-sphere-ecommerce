"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

const HeroCarousal = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      // ✅ Tailwind arbitrary variants keep style.css small and reduce render-blocking CSS
      className="hero-carousel [&_.swiper-pagination-bullet]:h-1 [&_.swiper-pagination-bullet]:w-4 [&_.swiper-pagination-bullet]:rounded-[11px] [&_.swiper-pagination-bullet]:bg-gray-4 [&_.swiper-pagination-bullet-active]:w-5.5 [&_.swiper-pagination-bullet-active]:bg-blue xl:[&_.swiper-pagination]:!bottom-5"
    >
      {/* ================= SLIDE 1 (LCP Target) ================= */}
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                30%
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Sale
                <br />
                Off
              </span>
            </div>

            <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <Link href="/shop">
                ESP32 NodeMCU (WiFi + Bluetooth)
              </Link>
            </h1>

            <p className="text-gray-600 leading-relaxed">
              The ultimate IoT solution for your FYP. Features dual-mode WiFi and Bluetooth 
              connectivity, making it perfect for Smart Home automation.
            </p>

            <Link
              href="/shop"
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10 transition-colors"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex justify-center relative">
            <Image
              src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768490079/electronic_kits/m7vxszetvuxresgcakz8.png"
              alt="ESP32 NodeMCU WiFi Bluetooth Board Pakistan"
              width={351}
              height={358}
              // ✅ CRITICAL FIXES FOR LCP:
              priority={true}             // Removes 'loading=lazy' and preloads the image
              fetchPriority="high"        // Instructs browser to prioritize this over other resources
              loading="eager"             // Forces immediate loading
              decoding="sync"            // Reduces delay between download and display
              sizes="(max-width: 640px) 100vw, 351px" 
              className="object-contain"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* ================= SLIDE 2 (Lazy Loaded) ================= */}
      <SwiperSlide>
        <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
          <div className="max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                Hot
              </span>
              <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                Best
                <br />
                Performance
              </span>
            </div>

            <h2 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
              <Link href="/shop-with-sidebar">
                Dual-Core Power & Arduino Compatible
              </Link>
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Experience blazing fast processing speed with the ESP32 Dual Core chip. 
              Fully compatible with Arduino IDE, MicroPython, and Lua.
            </p>

            <Link
              href="/shop/696a3adf2a70bea3e9ec3076" 
              className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10 transition-colors"
            >
              Buy Now
            </Link>
          </div>

          <div className="flex justify-center relative">
            <Image
              src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768489890/electronic_kits/hb8rk8hifj33h1gseray.png"
              alt="ESP32 Development Board Pinout and Features"
              width={361}
              height={368}
              // ✅ OPTIMIZED: No priority here so it doesn't fight with Slide 1 for bandwidth
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 361px"
              className="object-contain"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;