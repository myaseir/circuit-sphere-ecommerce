import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          
          {/* ================= LEFT SIDE: MAIN CAROUSEL ================= */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              
              {/* ✅ FIX APPLIED: Changed 'loading="lazy"' to 'priority' */}
              {/* This fixes the "LCP request discovery" error in your audit */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
                priority 
              />
              
              <HeroCarousel />
            </div>
          </div>

          {/* ================= RIGHT SIDE: PROMO PRODUCTS ================= */}
          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              
              {/* Product 1: Smart WiFi Water Tank Automation Kit */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[193px] font-semibold text-dark text-xl mb-20">
                      <Link href="shop-with-sidebar" className="hover:text-blue transition-colors">
                        Smart WiFi Water Tank Automation Kit
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        FYP Special
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-6 text-blue">
                          PKR 5,500
                        </span>
                        <span className="font-medium text-s text-dark-4 line-through">
                          PKR 7,500
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768495152/electronic_kits/gnb9mtqyb5uk2v1syz0w.png" 
                      alt="Smart WiFi Water Tank Automation Kit"
                      width={173}
                      height={181}
                      sizes="(max-width: 768px) 150px, 173px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Product 2: SG90 Micro Servo Motor */}
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                      <Link href="/shop/696f851e00d61952b7a5efd8" className="hover:text-blue transition-colors">
                        SG90 Servo
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                        Best Seller
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-6 text-blue">
                          PKR 299
                        </span>
                        <span className="font-medium text-s text-dark-4 line-through">
                          PKR 399
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768491038/electronic_kits/yhzn680fszrqt6ta1rrf.png"
                      alt="SG90 Micro Servo Motor"
                      width={223}
                      height={261}
                      sizes="(max-width: 768px) 150px, 223px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <HeroFeature />
    </section>
  );
};

export default Hero;