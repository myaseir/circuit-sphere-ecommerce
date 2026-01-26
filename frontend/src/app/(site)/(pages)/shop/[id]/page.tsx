import { Metadata } from "next";
import ProductClient from "./ProductClient";
import JsonLd from "@/components/Seo/JsonLd"; 
import { notFound } from "next/navigation";

// ✅ 1. Get Base URL from Environment (Fallback to localhost if missing)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Props = {
  params: Promise<{ id: string }>;
};

// --- HELPER: Fetch Data (Deduped automatically by Next.js) ---
async function getProduct(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/kits/${id}`, {
      next: { revalidate: 60 }, // Optional: Cache for 60 seconds
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

// 2. GENERATE METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Glacia Labs",
      description: "The product you are looking for does not exist."
    };
  }

  const socialImage = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;

  return {
    title: `${product.name} | Glacia Labs`,
    description: product.description || `Buy ${product.name} at the best price in Pakistan.`,
    alternates: {
      canonical: `https://www.glacialabs.com/shop/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: "Best Price in Pakistan. Fast Shipping.",
      images: socialImage ? [socialImage] : [],
      url: `https://www.glacialabs.com/shop/${product.id}`,
      type: "website",
    },
  };
}

// 3. MAIN COMPONENT
const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound(); // Returns the 404 page if product is missing
  }

  return (
    <>
      {/* ✅ SEO: This injects the Schema for Google Search */}
      <JsonLd product={product} />
      
      {/* Client Component for UI */}
      <ProductClient id={id} initialData={product} /> 
    </>
  );
};

export default ProductPage;