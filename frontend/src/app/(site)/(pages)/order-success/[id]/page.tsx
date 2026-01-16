"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ Grabs ID from URL
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cart-slice"; // ✅ Import clear action

const OrderSuccessPage = () => {
  const params = useParams();
  const orderId = params.id; // This gets "6967dce4..." from the URL
  const dispatch = useDispatch();

  // ✅ Automatically clear the cart when Order Success loads
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <section className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4">
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
            Your order <span className="font-bold text-dark">#{orderId}</span> has been placed successfully.
          </p>

          <div className="bg-blue-50 p-4 rounded-md mb-8">
            <p className="text-blue-600">
              A confirmation email has been sent to you.
            </p>
          </div>

          <div className="flex flex-col gap-3">
             {/* Optional: Add a button to view order details if you build that page later */}
             {/* <Link href={`/orders/${orderId}`} className="text-blue hover:underline">View Order Details</Link> */}

            <Link 
              href="/shop-with-sidebar" 
              className="inline-block bg-blue text-white font-medium py-3 px-8 rounded-md hover:bg-dark transition-all"
            >
              Continue Shopping
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessPage;