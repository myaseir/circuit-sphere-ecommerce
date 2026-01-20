"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import RelatedProducts from "./RelatedProducts";
import ReviewsSection from "@/components/Shop/ReviewsSection";
import { StarIcon } from "@heroicons/react/20/solid"; 

interface ProductClientProps {
  id: string;
}

const ProductClient = ({ id }: ProductClientProps) => {
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        const response = await fetch(`${baseUrl}/api/v1/kits/${id}`);
        
        if (!response.ok) return; 
        
        const item = await response.json();

        // Cache-Busting
        const timestamp = Date.now();
        const addVersion = (url: string) => 
          url.includes("cloudinary.com") ? `${url}?v=${timestamp}` : url;

        const rawImages = item.image_url 
          ? (Array.isArray(item.image_url) ? item.image_url : [item.image_url]) 
          : ["/images/product/product-01.png"];
        
        const images = rawImages.map(addVersion);

        const rawSpecs = item.specifications || {};
        const processedSpecs: Record<string, string> = {};
        
        Object.keys(rawSpecs).forEach((key) => {
          processedSpecs[key] = String(rawSpecs[key]);
        });

        const mappedProduct: Product = {
          id: String(item.id),
          title: item.name,
          price: Number(item.price),
          discountedPrice: Number(item.price), 
          image: images,
          category: item.category || "Electronics",
          stock: Number(item.stock_quantity),
          description: item.description,
          
          reviews: item.total_reviews || 0,
          rating: item.average_rating || 0,
          
          originalPrice: item.original_price ? Number(item.original_price) : 0,
          isOnSale: Boolean(item.on_sale),
          specifications: processedSpecs,
          specImages: (item.spec_images || []).map(addVersion)
        };

        setProduct(mappedProduct);
        setMainImage(images[0]);
      } catch (error) {
        console.error("Database fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const getEffectivePrice = () => {
    if (!product) return 0;
    if (!product.isOnSale && product.originalPrice) return product.originalPrice;
    return product.price;
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItemToCart({ ...product, price: getEffectivePrice(), quantity }));
    }
  };

  if (loading) return <div className="text-center py-20 min-h-screen">Connecting to database...</div>;
  if (!product) return <div className="text-center py-20 min-h-screen">Product not found.</div>;

  const effectivePrice = getEffectivePrice();
  const isSaleActive = product.isOnSale && product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isSaleActive 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  return (
    <>
      <Breadcrumb title={product.title} pages={["Shop", product.category || "Details"]} />
      
      <section className="py-10 lg:py-20 bg-white min-h-screen">
        <div className="max-w-[1170px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-12 lg:mb-20">
            
            {/* --- LEFT: IMAGE GALLERY --- */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 lg:p-10 flex justify-center border border-gray-200 relative overflow-hidden">
                {isSaleActive && (
                  <span className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-red-600 text-white text-[10px] lg:text-xs font-bold px-2 py-1 lg:px-3 lg:py-1 rounded-full uppercase tracking-wider shadow-sm z-10 animate-pulse">
                    -{discountPercent}% OFF
                  </span>
                )}

                <div className="relative w-full aspect-square max-w-[280px] lg:max-w-[400px]">
                  <Image
                    src={mainImage}
                    alt={`${product.title} - Best Price in Pakistan | Circuit Sphere`} 
                    fill
                    className="object-contain transition-all duration-300 hover:scale-105"
                    priority
                  />
                </div>
              </div>

              {product.image.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.image.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`relative w-16 h-16 lg:w-24 lg:h-24 border-2 rounded-lg cursor-pointer overflow-hidden bg-gray-50 transition-all shrink-0
                        ${mainImage === img ? "border-blue ring-2 ring-blue/20" : "border-transparent hover:border-gray-300"}`}
                    >
                      <Image 
                        src={img} 
                        alt={`${product.title} view ${index + 1}`} 
                        fill 
                        className="object-contain p-1 lg:p-2" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- RIGHT: PRODUCT CONTENT --- */}
            <div className="w-full lg:w-1/2">
              <span className="text-blue font-bold uppercase tracking-widest text-xs lg:text-sm mb-2 lg:mb-4 block">
                {product.category}
              </span>
              
              <h1 className="text-2xl lg:text-4xl font-bold text-dark mb-4 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-6">
                <p className="text-2xl lg:text-3xl font-bold text-blue">
                  PKR {effectivePrice.toLocaleString()}
                </p>
                
                {isSaleActive && (
                  <span className="text-base lg:text-lg text-gray-400 line-through decoration-red-500/40">
                    PKR {product.originalPrice!.toLocaleString()}
                  </span>
                )}

                {/* ✅ FIXED: RATING BADGE WITH HEX COLOR */}
                {(product.rating && product.rating > 0) ? (
                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                      <StarIcon className="h-4 w-4 text-[#FBBF24]" /> {/* ✅ Forced Gold Color */}
                      <span className="text-sm font-bold text-gray-700">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                   </div>
                ) : null}

                <span className={`ml-auto px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold border uppercase tracking-wider
                  ${(product.stock && product.stock > 0) 
                    ? "text-green-600 bg-green-50 border-green-100" 
                    : "text-red-600 bg-red-50 border-red-100"}`}>
                  {(product.stock && product.stock > 0) ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h4 className="font-bold text-dark mb-3 text-base lg:text-lg">Product Overview</h4>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-lg">
                  {product.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex items-center justify-between border border-gray-300 rounded-lg bg-gray-50 h-[50px] lg:h-[56px] w-full sm:w-auto">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full hover:bg-gray-200 transition-colors font-bold text-xl text-gray-600">-</button>
                   <span className="px-6 font-semibold text-lg">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="px-5 h-full hover:bg-gray-200 transition-colors font-bold text-xl text-gray-600">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  className={`flex-1 h-[50px] lg:h-[56px] px-8 rounded-lg font-bold text-white transition-all shadow-md active:scale-95
                    ${(!product.stock || product.stock === 0) ? "bg-gray-400 cursor-not-allowed" : "bg-blue hover:bg-dark hover:shadow-lg"}`}
                >
                  {(!product.stock || product.stock === 0) ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* --- TECHNICAL SPECIFICATIONS --- */}
          {( (product.specifications && Object.keys(product.specifications).length > 0) || (product.specImages && product.specImages.length > 0) ) && (
            <div className="border-t border-gray-200 pt-10 lg:pt-16">
              <h2 className="text-xl lg:text-2xl font-bold text-dark mb-8 lg:mb-10 flex items-center gap-3">
                <span className="w-1 h-6 lg:h-8 bg-blue rounded-r-full"></span>
                Technical Details
              </h2>
              
              <div className="flex flex-col gap-12">
                {/* Part A: Specification Table */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="w-full">
                    <h3 className="text-sm lg:text-base font-bold text-gray-400 mb-4 uppercase tracking-widest">Quick Specs</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-100">
                          {Object.entries(product.specifications).map(([key, value], idx) => (
                            <tr key={key} className={idx % 2 === 0 ? "bg-gray-50/60" : "bg-white"}>
                              <td className="px-4 lg:px-6 py-3 lg:py-4 font-semibold text-gray-600 w-1/3 border-r border-gray-100">{key}</td>
                              <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 font-medium">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Part B: Long Visual Datasheet */}
                {product.specImages && product.specImages.length > 0 && (
                  <div className="w-full max-w-[956px] mx-auto">
                    <h3 className="text-sm lg:text-base font-bold text-gray-400 mb-4 uppercase tracking-widest">Technical Datasheet</h3>
                    <div className="flex flex-col gap-8">
                      {product.specImages.map((img, index) => (
                        <div key={index} className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                          <img 
                            src={img} 
                            alt={`${product.title} Technical Guide`}
                            className="w-full h-auto block object-contain mx-auto"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <ReviewsSection productId={product.id} />
          
        </div>
      </section>
      
      {product && (
        <RelatedProducts 
          currentProductId={String(product.id)} 
          category={product.category || "Electronics"} 
        />
      )}
    </>
  );
};

export default ProductClient;