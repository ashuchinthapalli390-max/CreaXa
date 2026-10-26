import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://creaxa.com';

export const viewport: Viewport = {
  themeColor: '#0a0d0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CreaXa — AI Creative Talent Marketplace & Production Workspaces',
    template: '%s | CreaXa'
  },
  description:
    'Discover verified AI filmmakers, generative artists and creative specialists. Build structured briefs, evaluate authentic workflows and collaborate from concept to final delivery.',
  keywords: [
    'AI Content Creator Marketplace',
    'AI Filmmakers',
    'Generative Artists',
    'AI Animation Creators',
    'AI Video Production',
    'Creative Brief Builder',
    'Find AI Creators',
    'AI Production Portfolios'
  ],
  authors: [{ name: 'CreaXa' }],
  creator: 'CreaXa',
  publisher: 'CreaXa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'CreaXa',
    title: 'CreaXa — AI Creative Talent Marketplace & Production Workspaces',
    description:
      'Discover verified AI filmmakers, generative artists and creative specialists. Build structured briefs, evaluate authentic workflows and collaborate from concept to final delivery.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CreaXa — Creative Talent. Intelligently Matched.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreaXa — AI Creative Talent Marketplace',
    description:
      'Discover verified AI filmmakers, generative artists and creative specialists.',
    images: ['/og-image.png'],
    creator: '@creaxa'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'CreaXa',
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      description: 'Independent marketplace connecting brands with verified AI filmmakers, animators, and generative artists.',
      sameAs: []
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'CreaXa',
      publisher: {
        '@id': `${siteUrl}/#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/discover?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ]
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
