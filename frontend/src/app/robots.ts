import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // ✅ Hardcoding this ensures it matches your sitemap exactly
  const baseUrl = "https://glacialabs.com"; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/checkout/',
        '/cart/',
        '/auth/',
        '/api/',      // 🚫 STOP Google from indexing your backend API
        '/orders/',   // 🚫 Block order history pages (private user data)
        '/success/',  // 🚫 Block "Thank You" pages (no SEO value)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}