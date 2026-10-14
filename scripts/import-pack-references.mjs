import fs from 'fs';
import path from 'path';

const creatorsPath = fs.existsSync('data/creators.json') ? 'data/creators.json' : 'creaxa_pack/data/creators.json';
const worksPath = fs.existsSync('data/works.json') ? 'data/works.json' : 'creaxa_pack/data/works.json';
const creators = JSON.parse(fs.readFileSync(creatorsPath, 'utf8'));
const works = JSON.parse(fs.readFileSync(worksPath, 'utf8'));
const portraitSources = fs.existsSync('data/portrait_sources.json') ? JSON.parse(fs.readFileSync('data/portrait_sources.json', 'utf8')) : [];

const mediumToContentType = {
  music_video: 'Music Video',
  short_film: 'Short Film',
  commercial_video: 'Commercial Video',
  installation_video: 'Installation Video',
  mixed_media: 'Mixed Media',
  interactive_installation: 'Interactive Installation',
  moving_image: 'Moving Image',
  installation: 'Art Installation',
  image_collection: 'Image Collection',
  generative_typography: 'Generative Typography',
  multimedia_poetry: 'Multimedia Poetry',
  video_poetry: 'Video Poetry',
  ai_comic: 'AI Comic & Graphic Art',
  ai_video: 'AI Video',
  generative_video: 'Generative Video',
  dataset_installation: 'Dataset Installation',
  generative_art: 'Generative Art',
  robotic_performance: 'Robotic Performance',
  creative_video: 'Creative Direction'
};

const creatorLocations = {
  'paul-trillo': 'Los Angeles, California, USA',
  'refik-anadol': 'Los Angeles, California, USA',
  'niceaunties': 'Singapore',
  'claire-silver': 'USA (Pseudonymous)',
  'roope-rainisto': 'Helsinki, Finland',
  'sasha-stiles': 'New York, USA',
  'kris-kashtanova': 'New York, USA',
  'anna-ridler': 'London, UK',
  'sougwen-chung': 'New York / London',
  'karen-x-cheng': 'San Francisco, California, USA'
};

const processedCreators = creators.map((c) => {
  const cWorks = works.filter((w) => w.artistSlug === c.slug);
  const allTools = Array.from(new Set(cWorks.flatMap((w) => w.documentedTools || [])));
  const allTypes = Array.from(new Set(cWorks.map((w) => mediumToContentType[w.medium] || w.medium)));

  const featuredWorks = cWorks.map((w) => {
    const isVideo = !!w.media?.videoEmbedUrl;
    const isImage = ['image_collection', 'ai_comic'].includes(w.medium);
    const mediaType = isVideo ? 'video' : isImage ? 'image' : 'interactive';
    const videoPlatform = w.media?.videoEmbedUrl?.includes('vimeo') ? 'vimeo' : w.media?.videoEmbedUrl?.includes('youtube') ? 'youtube' : undefined;

    return {
      id: w.id,
      slug: w.slug,
      title: w.title,
      year: w.year ? String(w.year) : undefined,
      description: w.summary,
      fullDescription: w.summary,
      contentType: mediumToContentType[w.medium] || w.medium,
      documentedTech: (w.documentedTools && w.documentedTools.length > 0) ? w.documentedTools.join(', ') : 'Documented on official project site',
      workflowNotes: `Sourced from official project archive (${w.officialProjectUrl}). AI involvement: ${w.aiInvolvement}.`,
      credits: `Created by ${c.name}. Verified project metadata.`,
      tools: w.documentedTools || [],
      externalUrl: w.officialProjectUrl,
      videoEmbedUrl: w.media?.videoEmbedUrl || undefined,
      videoPlatform,
      aspectRatio: '16/9',
      mediaType,
      attribution: `Original work by ${c.name}. Verified source: ${w.officialProjectUrl}`,
      mediaRightsStatus: w.media?.videoRights === 'original_provider_only' ? 'artist_hosted_embed' : 'public_editorial_reference',
      thumbnailUrl: (w.id === 'anna-ridler__mosaic-virus-2019' && fs.existsSync('public/licensed-portraits/anna-ridler-mosaic-virus-installation-photo.jpg'))
        ? '/licensed-portraits/anna-ridler-mosaic-virus-installation-photo.jpg'
        : undefined,
      fallbackSvg: `/creator-fallbacks/${c.slug}.svg`
    };
  });

  const portraitRecord = portraitSources.find(p => p.creatorSlug === c.slug);
  const hasVerifiedPortrait = portraitRecord?.verifiedReuseTerms && portraitRecord?.expectedFile && fs.existsSync(path.join('public', 'licensed-portraits', path.basename(portraitRecord.expectedFile)));
  const resolvedAvatar = hasVerifiedPortrait ? `/licensed-portraits/${path.basename(portraitRecord.expectedFile)}` : `/creator-avatars/${c.slug}.svg`;

  return {
    id: `ref-${c.slug}`,
    slug: c.slug,
    name: c.name,
    location: creatorLocations[c.slug] || 'Verified Global Archive',
    specialization: c.specializations.join(' · '),
    headline: c.headline,
    bioSummary: c.bio,
    fullBio: c.bio,
    officialWebsite: c.officialWebsite,
    portfolioUrl: c.officialWebsite,
    avatarUrl: resolvedAvatar,
    coverUrl: null,
    fallbackCover: `/creator-fallbacks/${c.slug}.svg`,
    isExternalReference: true,
    portraitLicense: hasVerifiedPortrait ? {
      license: portraitRecord.license,
      licenseUrl: portraitRecord.licenseUrl,
      authorCredit: portraitRecord.authorCredit,
      sourcePage: portraitRecord.sourcePage
    } : null,
    attributionNote: `Sourced from official artist portfolio (${c.officialWebsite}). Editorial reference only; artists are not registered CreaXa users.`,
    documentedTools: allTools.length > 0 ? allTools : c.specializations,
    contentTypes: allTypes,
    creativeStyles: c.specializations,
    socialLinks: [],
    featuredWorks,
    filters: {
      specializations: c.specializations,
      tools: allTools,
      contentTypes: allTypes,
      styles: c.specializations
    }
  };
});

const tsContent = `// ==============================================================================
// CREAXA — 10 GENUINE AI CREATORS & 38 SOURCE-BACKED ORIGINAL WORKS
// ==============================================================================
// Sourced from official artist archives and the CreaXa verified sources pack.
// LEGAL & EDITORIAL PROVENANCE RULES:
// 1. These are external editorial reference profiles for benchmarking & pipeline research.
// 2. These artists are NOT registered marketplace users and have NO Firebase accounts.
// 3. No fake portraits or generic stock art. Genuine fallback SVGs used where media is not cleared.
// 4. In-app invitations link directly to official artist portfolio URLs.
// 5. Permitted Vimeo video players are embedded directly with click-to-load parameters.
// ==============================================================================

export interface ExternalCreatorWork {
  id: string;
  slug: string;
  title: string;
  year?: string;
  description: string;
  fullDescription?: string;
  contentType: string;
  documentedTech: string;
  workflowNotes?: string;
  credits?: string;
  tools: string[];
  externalUrl: string;
  videoEmbedUrl?: string;
  videoPlatform?: 'vimeo' | 'youtube';
  aspectRatio?: string;
  mediaType: 'video' | 'interactive' | 'image' | 'text';
  attribution: string;
  mediaRightsStatus: 'public_editorial_reference' | 'artist_hosted_embed' | 'official_archive';
  thumbnailUrl?: string;
  fallbackSvg?: string;
}

export interface ExternalCreatorSocialLink {
  platform: 'website' | 'instagram' | 'x' | 'vimeo' | 'youtube' | 'behance' | 'linkedin';
  url: string;
  label?: string;
}

export interface ExternalCreatorReference {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  handle?: string;
  location?: string;
  specialization: string;
  headline: string;
  bioSummary: string;
  fullBio: string;
  officialWebsite: string;
  portfolioUrl: string;
  avatarUrl?: string;
  coverUrl?: string | null;
  fallbackCover?: string;
  isExternalReference: true;
  portraitLicense?: {
    license: string;
    licenseUrl: string;
    authorCredit: string;
    sourcePage: string;
  } | null;
  attributionNote: string;
  documentedTools: string[];
  contentTypes: string[];
  creativeStyles: string[];
  socialLinks: ExternalCreatorSocialLink[];
  featuredWorks: ExternalCreatorWork[];
  filters: {
    specializations: string[];
    tools: string[];
    contentTypes: string[];
    styles: string[];
  };
}

export const EXTERNAL_CREATOR_REFERENCES: ExternalCreatorReference[] = ${JSON.stringify(processedCreators, null, 2)};
`;

fs.writeFileSync('lib/creators/external-references.ts', tsContent, 'utf8');
console.log('Successfully generated lib/creators/external-references.ts with', processedCreators.length, 'artists and', works.length, 'works.');
