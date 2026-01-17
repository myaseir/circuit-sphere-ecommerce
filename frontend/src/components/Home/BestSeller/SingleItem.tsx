"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ IMPROVED: Unbox image URL safely
  const displayImage = Array.isArray(item.image) 
    ? item.image[0] 
    : (item.image || "/images/product/product-01.png");

  const isOutOfStock = item.stock <= 0;

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addItemToCart({ ...item, quantity: 1 }));
  };

  const handleItemToWishList = () => {
    dispatch(addItemToWishlist({ ...item, status: "available", quantity: 1 }));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-[#F6F7FB] min-h-[403px] flex flex-col justify-between">
        
        {/* Badge for Out of Stock */}
        {isOutOfStock && (
          <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
            Out of Stock
          </span>
        )}

        <div className="text-center px-4 py-7.5">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Image key={i} src="/images/icons/icon-star.svg" alt="star" width={14} height={14} />
              ))}
            </div>
            <p className="text-custom-sm">({item.reviews || 0})</p>
          </div>

          <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
            <Link href={`/shop-details/${item.id}`}> {item.title} </Link>
          </h3>

          <span className="flex items-center justify-center gap-2 font-medium text-lg">
            <span className="text-dark">Rs. {item.discountedPrice}</span>
            {item.price > item.discountedPrice && (
              <span className="text-dark-4 line-through text-sm">Rs. {item.price}</span>
            )}
          </span>
        </div>

        {/* Product Image */}
        <div className="flex justify-center items-center pb-8">
          <Image 
            src={displayImage} 
            alt={item.title} 
            width={240} 
            height={240}
            className={`object-contain h-[220px] transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute right-0 bottom-0 translate-x-full flex flex-col gap-2 p-5.5 ease-linear duration-300 group-hover:translate-x-0 z-20">
          <button
            onClick={() => { handleQuickViewUpdate(); openModal(); }}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 text-dark bg-white hover:text-white hover:bg-blue"
            title="Quick View"
          >
            {/* SVG Eye Icon */}
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16"><path d="M7.99992 5.49996C6.61921 5.49996 5.49992 6.61925 5.49992 7.99996..." /></svg>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 transition-all ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:text-white hover:bg-blue text-dark'}`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            {/* SVG Cart Icon */}
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16"><path d="M1.4915 1.52567C1.22953 1.43835 0.94637 1.57993 0.859046 1.8419..." /></svg>
          </button>

          <button
            onClick={handleItemToWishList}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 text-dark bg-white hover:text-white hover:bg-blue"
            title="Add to Wishlist"
          >
            {/* SVG Heart Icon */}
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16"><path d="M3.74949 2.94946C2.6435 3.45502 1.83325 4.65749 1.83325 6.0914..." /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;