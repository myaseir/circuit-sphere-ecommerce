"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item, removeItemFromCart }: { item: any; removeItemFromCart: any }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  // ✅ Optimized Image Logic
  const imageUrl =
    item.image && item.image.length > 0
      ? Array.isArray(item.image)
        ? item.image[0]
        : item.image
      : item.imgs?.thumbnails?.[0] || "/images/product/product-01.png";

  return (
    <div className="flex items-center justify-between gap-4 group">
      <div className="flex items-center w-full gap-4">
        {/* ✅ Image Container: Optimized for Cart Sidebar */}
        <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-2 border border-gray-3">
          <Image
            src={imageUrl}
            alt={item.title || "Product"}
            fill
            sizes="80px" // ✅ Prevents loading unnecessarily large images
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-medium leading-tight transition-colors duration-200 text-dark hover:text-blue line-clamp-1">
            <Link href={`/shop-details/${item.id}`}>
              {item.title}
            </Link>
          </h3>
          
          <p className="mt-1 font-semibold text-blue text-custom-sm">
            PKR {(item.discountedPrice || item.price || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          
          <p className="mt-1 text-xs text-dark-4">Qty: {item.quantity}</p>
        </div>
      </div>

      {/* ✅ Remove Button: Updated with better hover state */}
      <button
        onClick={handleRemoveFromCart}
        aria-label="Remove product"
        className="flex items-center justify-center flex-shrink-0 transition-all duration-200 border rounded-md w-9 h-9 bg-gray-2 border-gray-3 text-dark hover:bg-red-light-6 hover:border-red-light-4 hover:text-red active:scale-90"
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.45017 2.06252H12.5498C12.7482 2.06239 12.921 2.06228 13.0842 2.08834C13.7289 2.19129 14.2868 2.59338 14.5883 3.17244C14.6646 3.319 14.7192 3.48298 14.7818 3.6712L14.8841 3.97819C14.9014 4.03015 14.9064 4.04486 14.9105 4.05645C15.0711 4.50022 15.4873 4.80021 15.959 4.81217C15.9714 4.81248 15.9866 4.81254 16.0417 4.81254H18.7917C19.1714 4.81254 19.4792 5.12034 19.4792 5.50004C19.4792 5.87973 19.1714 6.18754 18.7917 6.18754H3.20825C2.82856 6.18754 2.52075 5.87973 2.52075 5.50004C2.52075 5.12034 2.82856 4.81254 3.20825 4.81254H5.95833C6.01337 4.81254 6.02856 4.81248 6.04097 4.81217C6.51273 4.80021 6.92892 4.50024 7.08944 4.05647C7.09366 4.0448 7.09852 4.03041 7.11592 3.97819L7.21823 3.67122C7.28083 3.48301 7.33538 3.319 7.41171 3.17244C7.71324 2.59339 8.27112 2.19129 8.91581 2.08834C9.079 2.06228 9.25181 2.06239 9.45017 2.06252ZM8.25739 4.81254C8.30461 4.71993 8.34645 4.6237 8.38245 4.52419C8.39338 4.49397 8.4041 4.4618 8.41787 4.42048L8.50936 4.14601C8.59293 3.8953 8.61217 3.84416 8.63126 3.8075C8.73177 3.61448 8.91773 3.48045 9.13263 3.44614C9.17345 3.43962 9.22803 3.43754 9.49232 3.43754H12.5077C12.772 3.43754 12.8265 3.43962 12.8674 3.44614C13.0823 3.48045 13.2682 3.61449 13.3687 3.8075C13.3878 3.84416 13.4071 3.89529 13.4906 4.14601L13.5821 4.42031L13.6176 4.52421C13.6535 4.62372 13.6954 4.71994 13.7426 4.81254H8.25739Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default SingleItem;