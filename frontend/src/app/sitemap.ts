import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ✅ UPDATE: Your new domain
  const baseUrl = "https://www.glacialabs.com"; 

  // Static routes that always exist
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // ✅ Ensure this Env Var points to your live backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    // Safety timeout prevents build hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    const response = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 3600 }, 
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend unreachable: ${response.status}`);
    }

    const products = await response.json();

    const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
      // ✅ Uses the new baseUrl automatically
      url: `${baseUrl}/shop/${product.slug || product.id}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productEntries];

  } catch (error) {
    console.warn("⚠️ Sitemap generation warning: Backend not reachable. Generating static pages only.");
    return staticRoutes;
  }
}