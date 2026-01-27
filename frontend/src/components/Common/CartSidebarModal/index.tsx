"use client";
import React, { useEffect } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { removeItemFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element).closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent background scrolling when cart is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <>
      {/* ✅ OVERLAY: Smooth fade-in backdrop */}
      <div
        className={`fixed inset-0 z-[99999] bg-dark/70 transition-opacity duration-300 ${
          isCartModalOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* ✅ SIDEBAR: Hardware accelerated slide-in */}
      <div
        className={`fixed top-0 right-0 z-[100000] h-screen w-full max-w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out modal-content ${
          isCartModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-3 sm:px-7.5 lg:px-11">
            <h2 className="text-lg font-medium text-dark sm:text-2xl">Cart View</h2>
            <button
              onClick={() => closeCartModal()}
              className="p-2 transition-colors duration-150 rounded-full bg-gray-2 text-dark-5 hover:text-dark hover:bg-gray-3"
            >
              <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-grow p-4 overflow-y-auto no-scrollbar sm:p-7.5 lg:p-11">
            <div className="flex flex-col gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item, key) => (
                  <SingleItem
                    key={key}
                    item={item}
                    removeItemFromCart={removeItemFromCart}
                  />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          {/* Footer / Subtotal */}
          <div className="p-4 bg-white border-t border-gray-3 sm:p-7.5 lg:p-11">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="text-xl font-medium text-dark">Subtotal:</p>
              <p className="text-xl font-bold text-blue">PKR {totalPrice.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={() => closeCartModal()}
                href="/cart"
                className="flex justify-center w-full rounded-md bg-blue py-[13px] px-6 font-medium text-white transition-all hover:bg-blue-dark active:scale-95"
              >
                View Cart
              </Link>

              <Link
                onClick={() => closeCartModal()}
                href="/checkout"
                className="flex justify-center w-full rounded-md bg-dark py-[13px] px-6 font-medium text-white transition-all hover:bg-opacity-90 active:scale-95"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebarModal;