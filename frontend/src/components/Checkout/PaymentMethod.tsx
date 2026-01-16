"use client";
import React from "react";
import Image from "next/image";

interface PaymentMethodProps {
  selectedMethod: string;
  onPaymentChange: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ 
  selectedMethod, 
  onPaymentChange 
}) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          
          {/* Option 1: Cash On Delivery */}
          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio" // Changed to radio for semantic correctness
                name="paymentMethod"
                id="cash"
                className="sr-only"
                checked={selectedMethod === "cash"}
                onChange={() => onPaymentChange("cash")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "cash"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                selectedMethod === "cash"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image 
                    src="/images/checkout/cash.svg" 
                    alt="cash" 
                    width={21} 
                    height={21} 
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Cash on delivery</p>
                </div>
              </div>
            </div>
          </label>

          {/* Option 2: Bank Transfer (Example - Added so you can switch) */}
         

        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;