import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/', '/checkout/'], // Don't let Google index private pages
    },
    sitemap: 'https://circuitsphere.pk/sitemap.xml',
  };
}