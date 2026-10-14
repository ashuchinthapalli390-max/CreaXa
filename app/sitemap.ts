import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://creaxa.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/discover`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/work`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/templates`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/for-brands`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/for-creators`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 }
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const { queryAll } = await import('../lib/database');
    const creators = await queryAll('profiles', 'where published = 1 limit 50');
    const portfolios = await queryAll('portfolios', 'where published = 1 limit 50');

    const creatorRoutes: MetadataRoute.Sitemap = (creators || []).map((c: any) => ({
      url: `${siteUrl}/creators/${c.slug}`,
      lastModified: new Date(c.updated || now),
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = (portfolios || []).map((p: any) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updated || now),
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    dynamicRoutes = [...creatorRoutes, ...portfolioRoutes];
  } catch {
    // Graceful fallback
  }

  return [...staticRoutes, ...dynamicRoutes];
}
