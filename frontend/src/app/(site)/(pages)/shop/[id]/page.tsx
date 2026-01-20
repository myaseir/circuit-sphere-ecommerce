import { Metadata } from "next";
import ProductClient from "./ProductClient";
import JsonLd from "@/components/Seo/JsonLd"; 

// 1. UPDATE TYPE: params is now a Promise in Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

// 2. GENERATE METADATA (SEO OPTIMIZED)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${baseUrl}/api/v1/kits/${id}`);
    
    if (!response.ok) return { title: "Product Not Found | Glacia Labs" };
    const product = await response.json();
    
    const socialImage = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
    const productName = product.name || "Electronics Component";

    return {
      // 🔥 SEO GOLD: Puts "Price in Pakistan" directly in the browser tab
      title: `${productName} Price in Pakistan - Glacia Labs`,
      
      // 🔥 SEO GOLD: Targeted description for clicks
      description: `Buy ${productName} online at the best price in Pakistan. 100% original stock, Cash on Delivery available in Lahore, Karachi, Islamabad & nationwide.`,
      
      // Keywords help Google understand context
      keywords: [
        productName, 
        `${productName} price in Pakistan`, 
        "buy electronics online pakistan", 
        "arduino sensors pakistan",
        "robotics parts lahore"
      ],

      alternates: {
        canonical: `https://www.glacialabs.com/shop/${product.id}`,
      },
      openGraph: {
        title: `${productName} Price in Pakistan`,
        description: `Check the latest price of ${productName}. Order now for fast delivery.`,
        images: socialImage ? [socialImage] : [],
        url: `https://www.glacialabs.com/shop/${product.id}`,
        type: "website",
        siteName: "Glacia Labs",
        locale: "en_PK", // Tells Google this is for Pakistan
      },
    };
  } catch (error) {
    return { 
      title: "Shop Electronics | Glacia Labs",
      description: "Best online store for robotics and electronics in Pakistan."
    };
  }
}

// 3. MAIN COMPONENT
const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  let product = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Next.js automatically deduplicates this request with the one in metadata
    const res = await fetch(`${baseUrl}/api/v1/kits/${id}`);
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error("Failed to load product for SEO", error);
  }

  return (
    <>
      {/* ✅ Structured Data: This puts the Star Rating & Price 
         directly in Google Search Results 
      */}
      {product && <JsonLd product={product} />}
      
      <ProductClient id={id} /> 
    </>
  );
};

export default ProductPage;