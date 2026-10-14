import type { Metadata } from 'next';
import Marketplace from '../marketplace';
import { requireAuthUser } from '../auth';
import { EXTERNAL_CREATOR_REFERENCES } from '../../lib/creators/external-references';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://creaxa.com';

export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> {
  const { path } = await params;
  const section = path[0];

  // 1. Directory / Discover
  if (section === 'discover') {
    return {
      title: 'Discover Verified Generative AI Filmmakers & Artists | CreaXa',
      description: 'Explore and hire world-class verified AI directors, 3D generative artists, and neural animators. Filter by Runway Gen-3, Kling, Midjourney, ComfyUI, commercial rights, and budget.',
      keywords: ['AI Filmmakers', 'Generative Artists', 'AI Video Creators', 'Runway Gen-3 Filmmakers', 'Hire AI Artists', 'CreaXa Talent Directory'],
      alternates: { canonical: `${SITE_URL}/discover` },
      openGraph: {
        title: 'Discover Verified Generative AI Filmmakers & Artists | CreaXa',
        description: 'Explore and hire world-class verified AI directors, 3D generative artists, and neural animators with authentic project provenance.',
        url: `${SITE_URL}/discover`,
        type: 'website'
      }
    };
  }

  // 2. The Workroom / Portfolios
  if (section === 'work') {
    return {
      title: 'The Workroom — Authentic AI Production Portfolios | CreaXa',
      description: 'Explore 38+ authentic AI project portfolios from pioneering artists like Refik Anadol, Sasha Stiles, Paul Trillo, and Niceaunties with complete workflow documentation.',
      keywords: ['AI Project Portfolios', 'Generative Cinema', 'AI Video Showcase', 'Machine Hallucinations', 'Neural Video Production'],
      alternates: { canonical: `${SITE_URL}/work` },
      openGraph: {
        title: 'The Workroom — Authentic AI Production Portfolios | CreaXa',
        description: 'Explore 38+ authentic AI project portfolios with verified workflow documentation and prompt architectures.',
        url: `${SITE_URL}/work`,
        type: 'website'
      }
    };
  }

  // 3. Brief Structures / Templates
  if (section === 'templates') {
    return {
      title: 'AI Production Brief Structures & Project Presets | CreaXa',
      description: 'Download and customize structured creative briefs for generative video, AI fashion, commercial campaigns, and digital art with defined rights and deliverables.',
      alternates: { canonical: `${SITE_URL}/templates` },
      openGraph: {
        title: 'AI Production Brief Structures & Project Presets | CreaXa',
        description: 'Ready-to-use creative brief templates for commissioning AI generative video and digital productions.',
        url: `${SITE_URL}/templates`
      }
    };
  }

  // 4. Resources / Field Notes
  if (section === 'resources') {
    return {
      title: 'Field Notes & AI Production Guidelines | CreaXa',
      description: 'Essential guides on briefing AI filmmakers, legal rights, model attribution, version control, and delivery standards for generative media.',
      alternates: { canonical: `${SITE_URL}/resources` }
    };
  }

  // 5. Creator Profile (/creators/:slug or /artists/:slug)
  if ((section === 'creators' || section === 'artists') && path[1]) {
    const ref = EXTERNAL_CREATOR_REFERENCES.find(r => r.slug === path[1]);
    if (ref) {
      if (path[2] === 'works' && path[3]) {
        const work = ref.featuredWorks.find(w => w.slug === path[3] || w.id === path[3] || `${ref.slug}-${w.slug}` === path[3]);
        if (work) {
          return {
            title: `${work.title} by ${ref.name} | CreaXa AI Project Portfolio`,
            description: `${work.description.slice(0, 155)}... Built with ${work.documentedTech}.`,
            alternates: { canonical: `${SITE_URL}/artists/${ref.slug}/works/${work.slug}` },
            openGraph: {
              title: `${work.title} by ${ref.name}`,
              description: work.description,
              images: work.thumbnailUrl ? [{ url: work.thumbnailUrl }] : undefined,
              type: 'article'
            }
          };
        }
      }

      return {
        title: `${ref.name} — ${ref.headline} | CreaXa Verified AI Artist`,
        description: `${ref.bioSummary.slice(0, 155)}... Specializing in ${ref.specialization} using ${ref.documentedTools.slice(0, 4).join(', ')}.`,
        keywords: [ref.name, ref.specialization, ...ref.documentedTools, 'AI Artist', 'CreaXa Creator'],
        alternates: { canonical: `${SITE_URL}/creators/${ref.slug}` },
        openGraph: {
          title: `${ref.name} — ${ref.headline}`,
          description: ref.bioSummary,
          images: ref.avatarUrl ? [{ url: ref.avatarUrl }] : undefined,
          type: 'profile'
        }
      };
    }

    const formattedName = path[1].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    return {
      title: `${formattedName} — AI Creator Profile | CreaXa`,
      description: `View ${formattedName}'s AI filmmaking portfolio, creative toolkit, typical turnaround, rates, and verified capabilities on CreaXa.`,
      alternates: { canonical: `${SITE_URL}/creators/${path[1]}` }
    };
  }

  // 6. Projects (/projects/:slug)
  if (section === 'projects' && path[1]) {
    const formattedTitle = path[1].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    return {
      title: `${formattedTitle} — AI Production Portfolio | CreaXa`,
      description: `Explore ${formattedTitle} on CreaXa with documented AI tools, creative workflow, and commercial-use specifications.`,
      alternates: { canonical: `${SITE_URL}/projects/${path[1]}` }
    };
  }

  // 7. Compare
  if (section === 'compare') {
    return {
      title: 'Compare AI Creator Capabilities & Rates | CreaXa',
      description: 'Side-by-side comparison of AI creative talent: tools, output formats, typical turnaround, rates, and commercial terms.'
    };
  }

  // 8. How it works
  if (section === 'how-it-works') {
    return {
      title: 'How CreaXa Works — Safe AI Creative Collaboration & Media Rights | CreaXa',
      description: 'Understand the end-to-end workflow: discovery, structured briefs, mutual rights agreements, milestone delivery, and verified evidence.'
    };
  }

  // 9. Login & Signup
  if (section === 'login') {
    return {
      title: 'Sign In to Your Creative Workspace | CreaXa',
      description: 'Access your CreaXa workspace as a creator, brand, or platform administrator.'
    };
  }
  if (section === 'signup') {
    return {
      title: 'Join CreaXa — Independent Generative AI Creator Marketplace',
      description: 'Create your account as an AI filmmaker, generative visual artist, brand, or agency.'
    };
  }

  // 10. Admin
  if (section === 'admin') {
    return {
      title: 'Platform Governance & Moderation Console | CreaXa Admin',
      robots: { index: false, follow: false }
    };
  }

  // Default fallback
  return {
    title: 'CreaXa — AI Creative Talent Marketplace & Production Workspaces',
    description: 'Discover verified AI filmmakers, generative artists and creative specialists. Build structured briefs and collaborate safely.'
  };
}

function generateJsonLd(path: string[]) {
  const section = path[0];
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: section.charAt(0).toUpperCase() + section.slice(1),
        item: `${SITE_URL}/${section}`
      },
      ...(path[1] ? [{
        '@type': 'ListItem',
        position: 3,
        name: path[1].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        item: `${SITE_URL}/${section}/${path[1]}`
      }] : [])
    ]
  };

  if (section === 'discover') {
    return [
      breadcrumbs,
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Verified Generative AI Creators Directory',
        description: 'Directory of verified AI filmmakers, 3D visual artists, and neural animators with authentic provenance.',
        url: `${SITE_URL}/discover`
      }
    ];
  }

  if ((section === 'creators' || section === 'artists') && path[1]) {
    const ref = EXTERNAL_CREATOR_REFERENCES.find(r => r.slug === path[1]);
    if (ref) {
      if (path[2] === 'works' && path[3]) {
        const work = ref.featuredWorks.find(w => w.slug === path[3] || w.id === path[3] || `${ref.slug}-${w.slug}` === path[3]);
        if (work) {
          return [
            breadcrumbs,
            {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: work.title,
              headline: work.title,
              description: work.description,
              creator: {
                '@type': 'Person',
                name: ref.name,
                url: `${SITE_URL}/creators/${ref.slug}`
              },
              image: work.thumbnailUrl,
              genre: work.contentType
            }
          ];
        }
      }

      return [
        breadcrumbs,
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: ref.name,
            jobTitle: ref.specialization,
            description: ref.bioSummary,
            image: ref.avatarUrl,
            knowsAbout: ref.documentedTools
          }
        }
      ];
    }
  }

  return [breadcrumbs];
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{
    path: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { path } = await params;
  const route = '/' + path.join('/');

  if (path[0] === 'app' || path[0] === 'onboarding' || path[0] === 'admin') {
    const values = await searchParams;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
        query.append(key, v);
      }
    }
    await requireAuthUser(route + (query.size ? '?' + query.toString() : ''));
  }

  const jsonLdSchemas = generateJsonLd(path);

  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Marketplace path={route} />
    </>
  );
}
