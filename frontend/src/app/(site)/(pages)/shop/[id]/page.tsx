import { Metadata } from "next";
import ProductClient from "./ProductClient";
import JsonLd from "@/components/Seo/JsonLd"; 

// 1. UPDATE TYPE: params is now a Promise in Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

// 2. GENERATE METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ Await params before using them
  const { id } = await params;

  try {
   const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    const response = await fetch(`${baseUrl}/api/v1/kits/${id}`);
    
    if (!response.ok) return { title: "Product Not Found | Circuit Sphere" };
    const product = await response.json();
    
    const socialImage = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;

    return {
      title: `${product.name} | Circuit Sphere`,
      description: product.description || "Buy high-quality electronics in Pakistan.",
      alternates: {
        canonical: `https://circuitsphere.pk/shop/${product.id}`,
      },
      openGraph: {
        title: product.name,
        description: "Best Price in Pakistan. Fast Shipping.",
        images: socialImage ? [socialImage] : [],
        url: `https://circuitsphere.pk/shop/${product.id}`,
        type: "website",
      },
    };
  } catch (error) {
    return { 
      title: "Shop Electronics | Circuit Sphere",
      description: "Best online store for robotics and electronics in Pakistan."
    };
  }
}

// 3. MAIN COMPONENT
const ProductPage = async ({ params }: Props) => {
  // ✅ Await params here too
  const { id } = await params;

  let product = null;
  try {
    const res = await fetch(`http://localhost:8000/api/v1/kits/${id}`);
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error("Failed to load product for SEO", error);
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {product && <JsonLd product={product} />}
      
      {/* ⚠️ IMPORTANT: You usually need to pass the ID or Data 
        to ProductClient so it knows what to show.
      */}
      <ProductClient id={id} /> 
    </>
  );
};

export default ProductPage;