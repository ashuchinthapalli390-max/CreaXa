import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://creaxa.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/discover',
          '/work',
          '/creators/*',
          '/projects/*',
          '/templates',
          '/resources',
          '/resources/*',
          '/for-brands',
          '/for-creators',
          '/how-it-works',
          '/about',
          '/faq',
          '/contact',
          '/privacy',
          '/terms'
        ],
        disallow: [
          '/app/',
          '/api/',
          '/onboarding',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/verify-email'
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
