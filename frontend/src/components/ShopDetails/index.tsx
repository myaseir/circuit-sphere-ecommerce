"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "./RecentlyViewed";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const ShopDetails = () => {
  const [activeColor, setActiveColor] = useState("blue");
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);

  const [storage, setStorage] = useState("gb128");
  const [type, setType] = useState("active");
  const [sim, setSim] = useState("dual");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");

  // State to handle the product safely
  const [product, setProduct] = useState<any>(null);

  const productFromRedux = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  // Constants for selection UI
  const storages = [
    { id: "gb128", title: "128 GB" },
    { id: "gb256", title: "256 GB" },
    { id: "gb512", title: "521 GB" },
  ];
  const types = [
    { id: "active", title: "Active" },
    { id: "inactive", title: "Inactive" },
  ];
  const sims = [
    { id: "dual", title: "Dual" },
    { id: "e-sim", title: "E Sim" },
  ];
  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabTwo", title: "Additional Information" },
    { id: "tabThree", title: "Reviews" },
  ];
  const colors = ["red", "blue", "orange", "pink", "purple"];

  // 🛠️ FIX: Safely handle localStorage after component mounts
  useEffect(() => {
    const savedProduct = localStorage.getItem("productDetails");
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct));
    } else {
      setProduct(productFromRedux);
    }
  }, [productFromRedux]);

  // Update localStorage whenever the product state changes
  useEffect(() => {
    if (product) {
      localStorage.setItem("productDetails", JSON.stringify(product));
    }
  }, [product]);

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  // Prevent rendering until we have the product data to avoid hydration errors
  if (!product) {
    return <div className="py-20 text-center">Loading product details...</div>;
  }

  return (
    <>
      <Breadcrumb title={"Shop Details"} pages={["shop details"]} />

      {product.title === "" ? (
        <div className="py-20 text-center text-dark">Please add product</div>
      ) : (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <div>
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581Z" />
                        </svg>
                      </button>

                      {product.imgs?.previews?.[previewImg] && (
                        <Image
                          src={product.imgs.previews[previewImg]}
                          alt={product.title || "Product details"}
                          width={400}
                          height={400}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {product.imgs?.thumbnails.map((item: string, key: number) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${key === previewImg ? "border-blue" : "border-transparent"}`}
                      >
                        <Image width={50} height={50} src={item} alt="thumbnail" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-w-[539px] w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">{product.title}</h2>
                    <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">30% OFF</div>
                  </div>
                  
                  {/* Price Section */}
                  <h3 className="font-medium text-custom-1 mb-4.5">
                    <span className="text-sm sm:text-base text-dark">Price: ${product.price}</span>
                    <span className="line-through ml-2 text-gray-500">${product.discountedPrice}</span>
                  </h3>

                  {/* Rest of your UI for options (Color, Storage, etc.) stays exactly the same as your file */}
                  {/* ... */}
                  
                  <div className="flex flex-wrap items-center gap-4.5 mt-9">
                     <button className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark">
                        Purchase Now
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden bg-gray-2 py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
               {/* Tab Headers */}
               <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${activeTab === item.id ? "text-blue before:w-full" : "text-dark before:w-0"}`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              
              {/* Tab Contents Logic stays the same... */}
            </div>
          </section>

          <RecentlyViewdItems />
          <Newsletter />
        </>
      )}
    </>
  );
};

export default ShopDetails;