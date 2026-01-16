import { MetadataRoute } from 'next';

const BASE_URL = 'https://circuitsphere.pk'; // ⚠️ REPLACE WITH YOUR REAL DOMAIN

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch all your products
  // Note: Change localhost to your deployed API URL when launching
  const response = await fetch('http://localhost:8000/api/v1/kits/'); 
  const products = await response.json();

  // 2. Generate URLs for every product
  const productUrls = products.map((product: any) => ({
    url: `${BASE_URL}/shop/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Add your static pages
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop-with-sidebar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}