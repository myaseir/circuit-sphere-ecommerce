"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Adjust path if needed
import { selectTotalPrice, clearCart } from "@/redux/features/cart-slice";

import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import OrderList from "./OrderList";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Get Cart Data
  // Assuming your store slice is named 'cart'
  const cartItems = useSelector((state: RootState) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "US",
    notes: "",
    paymentMethod: "cod", // Default to Cash on Delivery
  });

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Payment Method Selection
  const handlePaymentChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Submit Order
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // ✅ FIX: Use camelCase to match your specific Backend Schema
      const orderPayload = {
        customer: {
          firstName: formData.firstName, // 👈 Changed from first_name
          lastName: formData.lastName,   // 👈 Changed from last_name
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,             // 👈 Changed from postal_code
          country: formData.country,
        },
        items: cartItems.map((item) => ({
          // The error "Field 'id' is required" suggests it wants 'id', not 'kit_id'
          id: item.id,       
          kit_id: item.id, // Send both just to be safe
          title: item.title, // 👈 Error said 'title' is required
          quantity: item.quantity,
          price: item.price,
          discountedPrice: item.discountedPrice || item.price, // 👈 Error said 'discountedPrice' is required
        })),
        totalAmount: totalPrice,      // 👈 Changed from total_amount
        paymentMethod: formData.paymentMethod, // 👈 Changed from payment_method
        notes: formData.notes,
        status: "pending"
      };

      console.log("Submitting Order:", orderPayload);

      const response = await fetch("http://localhost:8000/api/v1/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const errorMsg = data.detail.map((err: any) => 
            `❌ Field '${err.loc[err.loc.length - 1]}' is ${err.msg}`
          ).join("\n");
          throw new Error(errorMsg);
        } else {
          throw new Error(data.detail || "Failed to place order");
        }
      }

      // Success
      dispatch(clearCart());
      router.push(`/order-success/${data.id}`);

    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(`⚠️ Order Failed:\n${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              
              {/* Left Side: Forms */}
              <div className="lg:max-w-[670px] w-full">
                {/* Optional: Only show login if not authenticated */}
                <Login />
                
                {/* Pass props to Billing Component */}
                <Billing 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />

                {/* Notes Section */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      value={formData.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Right Side: Order Summary & Payment */}
              <div className="max-w-[455px] w-full">
                
                {/* Order List Component - Ensure this reads from Redux too */}
                <OrderList />

                <Coupon />

                {/* Pass state to PaymentMethod */}
                <PaymentMethod 
                  selectedMethod={formData.paymentMethod}
                  onPaymentChange={handlePaymentChange}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 mt-7.5 ${
                    isLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue hover:bg-blue-dark"
                  }`}
                >
                  {isLoading ? "Processing..." : `Place Order (PKR ${totalPrice})`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;