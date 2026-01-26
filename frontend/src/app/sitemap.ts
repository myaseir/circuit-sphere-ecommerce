import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.glacialabs.com"; 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // 1. STATIC ROUTES (Updated with your request)
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1 
    },
    { 
      url: `${baseUrl}/shop`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/categories`, // ✅ Added Categories
      lastModified: new Date(), 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/blog`, // ✅ This is your "Tutorials" page
      lastModified: new Date(), 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/return-policy`, // ✅ Swapped Shipping for Return Policy
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
  ];

  // 2. BLOG POSTS (Tutorials from 'content' folder)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const contentDir = path.join(process.cwd(), "content");
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir);
      blogRoutes = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => ({
          url: `${baseUrl}/blog/${file.replace('.mdx', '')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.warn("⚠️ Could not generate blog sitemap:", error);
  }

  // 3. PRODUCTS (From your Database/API)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    // Fetching from your specific endpoint
    const response = await fetch(`${apiUrl}/api/v1/kits`, {
      next: { revalidate: 3600 }, 
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const products = await response.json();
      productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/shop/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn("⚠️ Backend unreachable. Sitemap will skip products.");
  }

  // 4. COMBINE EVERYTHING
  return [...staticRoutes, ...blogRoutes, ...productRoutes];
}