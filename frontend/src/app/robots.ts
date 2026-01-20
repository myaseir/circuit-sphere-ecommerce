import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Use your environment variable if you have one, otherwise fallback to the string
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.glacialabs.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // ✅ Added '/cart/' and '/auth/' to keeps Google out of private user flows
      disallow: ['/admin/', '/account/', '/checkout/', '/cart/', '/auth/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}