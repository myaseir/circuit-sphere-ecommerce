"use client";

import React from "react";
import Image from "next/image"; // ✅ Import Next.js Image
import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";

const OrderList = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Your Order</h3>
      </div>

      <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
        {/* Header */}
        <div className="flex items-center justify-between py-5 border-b border-gray-3">
          <div>
            <h4 className="font-medium text-dark">Product</h4>
          </div>
          <div>
            <h4 className="font-medium text-dark text-right">Subtotal</h4>
          </div>
        </div>

        {/* Cart Items List */}
        {cartItems.length > 0 ? (
          cartItems.map((item, key) => (
            <div
              key={item.id || key}
              className="flex items-start justify-between py-5 border-b border-gray-3"
            >
              <div className="flex items-center gap-3">
                {/* ✅ Safe Image Rendering */}
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 border border-gray-200">
                   <Image
                      src={
                        // Check if image exists and is an array or string
                        item.image && item.image.length > 0 
                          ? (Array.isArray(item.image) ? item.image[0] : item.image) 
                          : "/images/product/product-01.png"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                   />
                </div>
                
                <div>
                  <p className="text-dark mb-1 text-sm font-medium line-clamp-1 max-w-[150px]">
                    {item.title}
                  </p>
                  <span className="text-xs text-gray-500 block">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Price: ${(item.discountedPrice || item.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <p className="text-dark text-right font-medium text-sm">
                   {/* ✅ Safe Price Calculation */}
                  ${((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 text-center text-gray-500">
            No items in cart.
          </div>
        )}

        {/* Total Footer */}
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="font-medium text-lg text-dark">Total</p>
          </div>
          <div>
            <p className="font-medium text-lg text-blue text-right">
              PKR{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;