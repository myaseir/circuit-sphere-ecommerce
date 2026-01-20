"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; 
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cart-slice";

// ✅ 1. Create a child component to handle the logic
const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id"); // ✅ Grabs ID from ?order_id=...
  const dispatch = useDispatch();

  // ✅ Automatically clear the cart when Order Success loads
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-1 p-10 text-center">
      
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-dark mb-4">
        Thank You for Your Order!
      </h1>
      
      <p className="text-gray-600 mb-6 text-lg">
        Your order {orderId && <span className="font-bold text-dark">#{orderId}</span>} has been placed successfully.
      </p>

      <div className="bg-blue-50 p-4 rounded-md mb-8">
        <p className="text-blue-600">
          A confirmation email has been sent to you.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link 
          href="/shop-with-sidebar" 
          className="inline-block bg-blue text-white font-medium py-3 px-8 rounded-md hover:bg-dark transition-all"
        >
          Continue Shopping
        </Link>
      </div>
      
    </div>
  );
};

// ✅ 2. Wrap the main page in Suspense (Required for useSearchParams)
const OrderSuccessPage = () => {
  return (
    <section className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="text-center p-10">Loading success details...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </section>
  );
};

export default OrderSuccessPage;