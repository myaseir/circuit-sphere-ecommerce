import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-10 lg:py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* ================= BIG BANNER (Water Tank Kit) ================= */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-10 lg:py-17.5 xl:py-22.5 px-6 lg:px-14 xl:px-19 mb-7.5 flex flex-col lg:flex-row items-center justify-between">
          <div className="max-w-[550px] w-full text-center lg:text-left z-10">
            <span className="block font-medium text-lg lg:text-xl text-dark mb-3">
              Smart Home Automation
            </span>

            <h2 className="font-bold text-2xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              WiFi Water Tank Kit <br />
              <span className="text-blue">UP TO 30% OFF</span>
            </h2>

            <p className="text-gray-600 mb-2 text-sm lg:text-base">
              Automate your home's water motor with our complete IoT kit. 
              Prevent overflow, save electricity, and monitor levels on your phone.
            </p>

            <Link
              href="/shop"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9 rounded-md ease-out duration-200 hover:bg-dark mt-6 lg:mt-7.5"
            >
              Order Kit Now
            </Link>
          </div>

          {/* Responsive Image Wrapper */}
          <div className="relative mt-10 lg:mt-0 lg:absolute lg:bottom-0 lg:right-4 xl:right-20 lg:z-[-1]">
             <Image
                src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768495152/electronic_kits/gnb9mtqyb5uk2v1syz0w.png"
                alt="Smart WiFi Water Tank Automation Kit"
                width={320}
                height={320}
                // ✅ ADDED SIZES: Critical for mobile performance
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-contain hover:scale-105 transition-transform duration-500 w-[240px] lg:w-[320px]"
             />
          </div>
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          
          {/* ================= SMALL BANNER 1 (Arduino) ================= */}
         {/* ================= SMALL BANNER 1 (Arduino) ================= */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#E0F7FA] py-10 lg:py-16 px-6 lg:px-10 flex flex-col lg:flex-row items-center">
            
            <div className="w-full lg:text-right lg:ml-auto lg:max-w-[240px] text-center z-10">
              <span className="block text-base lg:text-lg text-dark mb-1.5">
                For Beginners
              </span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Start Robotics
              </h2>
              <p className="font-semibold text-teal-800 mb-6">
                Arduino Uno R3 <br/> Flat 20% off
              </p>

              <Link
                href="/shop/696a32182a70bea3e9ec3071"
                // ✅ FIX: Used Hex Code [#059669] to force Green color
                className="inline-flex font-bold text-sm !text-white !bg-[#059669] py-3 px-8 rounded-full shadow-md hover:!bg-[#047857] hover:shadow-lg transition-all duration-300"
              >
                Grab Now
              </Link>
            </div>

            <div className="relative mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-3 xl:left-6 lg:z-[-1]">
               <Image
                  src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768489890/electronic_kits/hb8rk8hifj33h1gseray.png"
                  alt="Arduino Uno R3"
                  width={180}
                  height={180}
                  sizes="(max-width: 768px) 100vw, 180px"
                  className="object-contain hover:rotate-3 transition-transform duration-500 w-[140px] lg:w-[180px] mx-auto"
               />
            </div>
          </div>

          {/* ================= SMALL BANNER 2 (ESP32) ================= */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 lg:py-16 px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left">
            <div className="max-w-full lg:max-w-[240px]">
              <span className="block text-base lg:text-lg text-dark mb-1.5">
                IoT & WiFi
              </span>
              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                ESP32 NodeMCU
              </h2>
              <p className="text-sm text-gray-700 mb-4 font-medium">
                  Dual-core power for your next FYP.
              </p>
              <span className="block font-bold text-orange-600 text-lg mb-6">
                Save 15% Today
              </span>

              <Link
                href="/shop/696a3adf2a70bea3e9ec3076"
                // ✅ FIX: Used Hex Code [#059669] to force Green color
                className="inline-flex font-bold text-sm !text-white !bg-[#059669] py-3 px-8 rounded-full shadow-md hover:!bg-[#047857] hover:shadow-lg transition-all duration-300"
              >
                Buy Now
              </Link>
            </div>

            <div className="mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-3 xl:right-6 lg:z-[-1]">
               <Image
                  src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768490079/electronic_kits/m7vxszetvuxresgcakz8.png"
                  alt="ESP32 NodeMCU"
                  width={160}
                  height={160}
                  sizes="(max-width: 768px) 100vw, 160px"
                  className="object-contain hover:scale-110 transition-transform duration-500 w-[140px] lg:w-[160px]"
               />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromoBanner;