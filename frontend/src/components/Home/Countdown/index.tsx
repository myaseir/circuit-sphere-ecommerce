"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // ✅ MEMOIZED CALCULATION FUNCTION
  const calculateTimeLeft = useCallback(() => {
    const deadline = new Date("December 31, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, []);

  useEffect(() => {
    // Initial call to avoid 1-second delay
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Helper for zero-padding (01 instead of 1)
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
              Solar & Generator Special
            </span>

            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              Automatic Transfer Switch (ATS) 63A
            </h2>

            <p className="text-gray-600 mb-6">
              Seamlessly switch between Solar, Wapda, and Generator without power interruptions. 
              Protect your home appliances with zero-lag automatic changeover.
            </p>

            {/* ✅ TIMER SECTION (Cleaned up Alpine attributes) */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="min-w-[60px] sm:min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-2 sm:px-4 mb-2">
                    {formatTime(item.value)}
                  </span>
                  <span className="block text-custom-sm text-dark text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ✅ LINK FIXED: Relative path for production safety */}
            <Link
              href="/shop-details/69599364f412c4afb08b8632" 
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-dark mt-7.5"
            >
              Shop Now
            </Link>
          </div>

          {/* ✅ IMAGE 1: Background Shape (Lazy loaded) */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 -z-1"
            width={737}
            height={482}
            loading="lazy"
          />

          {/* ✅ IMAGE 2: Product Image (Optimized with Sizes) */}
          <div className="hidden lg:block absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1 w-[300px] xl:w-[411px]">
            <Image
              src="https://res.cloudinary.com/dxxqrjnje/image/upload/v1768497038/electronic_kits/s91ylbqsopkueubyrgp8.png"
              alt="Automatic Transfer Switch ATS"
              width={411}
              height={376}
              quality={90}
              // Tells browser: "On mobile this is 0px, on Desktop it's roughly 411px"
              sizes="(max-width: 1024px) 1px, 411px" 
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountDown;