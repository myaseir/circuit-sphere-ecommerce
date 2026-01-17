import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // These are good. Prevents Google from indexing cart/login pages.
      disallow: ['/admin/', '/account/', '/checkout/'], 
    },
    // ✅ CRITICAL FIX: Must match the domain this code is deployed to
    sitemap: 'https://www.glacialabs.com/sitemap.xml',
  };
}