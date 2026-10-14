// ==============================================================================
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
  coverUrl?: string;
  fallbackCover?: string;
  isExternalReference: true;
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

export const EXTERNAL_CREATOR_REFERENCES: ExternalCreatorReference[] = [
  {
    "id": "ref-paul-trillo",
    "slug": "paul-trillo",
    "name": "Paul Trillo",
    "location": "Los Angeles, California, USA",
    "specialization": "AI Filmmaking · Experimental Cinema · Music Videos",
    "headline": "AI filmmaking, directing and experimental moving images",
    "bioSummary": "Filmmaker and director whose official portfolio documents experimental storytelling, music videos and AI-assisted moving-image production. Individual film pages identify the techniques used for specific works.",
    "fullBio": "Filmmaker and director whose official portfolio documents experimental storytelling, music videos and AI-assisted moving-image production. Individual film pages identify the techniques used for specific works.",
    "officialWebsite": "https://paultrillo.com/",
    "portfolioUrl": "https://paultrillo.com/",
    "avatarUrl": "/creator-avatars/paul-trillo.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/paul-trillo.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://paultrillo.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "OpenAI Sora",
      "Runway Gen-2"
    ],
    "contentTypes": [
      "Music Video",
      "Short Film",
      "Commercial Video"
    ],
    "creativeStyles": [
      "AI Filmmaking",
      "Experimental Cinema",
      "Music Videos"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "paul-trillo__washed-out-the-hardest-part",
        "slug": "washed-out-the-hardest-part",
        "title": "Washed Out — The Hardest Part",
        "year": "2024",
        "description": "Official Washed Out music video directed by Paul Trillo using OpenAI Sora, described on the filmmaker’s official site.",
        "fullDescription": "Official Washed Out music video directed by Paul Trillo using OpenAI Sora, described on the filmmaker’s official site.",
        "contentType": "Music Video",
        "documentedTech": "OpenAI Sora",
        "workflowNotes": "Sourced from official project archive (https://vimeo.com/941713443). AI involvement: documented.",
        "credits": "Created by Paul Trillo. Verified project metadata.",
        "tools": [
          "OpenAI Sora"
        ],
        "externalUrl": "https://vimeo.com/941713443",
        "videoEmbedUrl": "https://player.vimeo.com/video/941713443",
        "videoPlatform": "vimeo",
        "aspectRatio": "16/9",
        "attribution": "Original work by Paul Trillo. Verified source: https://vimeo.com/941713443",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/paul-trillo.svg"
      },
      {
        "id": "paul-trillo__thank-you-for-not-answering",
        "slug": "thank-you-for-not-answering",
        "title": "Thank You For Not Answering",
        "year": "2023",
        "description": "An AI-generated short film about a voicemail and imagined memories; official portfolio identifies Runway Gen-2.",
        "fullDescription": "An AI-generated short film about a voicemail and imagined memories; official portfolio identifies Runway Gen-2.",
        "contentType": "Short Film",
        "documentedTech": "Runway Gen-2",
        "workflowNotes": "Sourced from official project archive (https://paultrillo.com/). AI involvement: documented.",
        "credits": "Created by Paul Trillo. Verified project metadata.",
        "tools": [
          "Runway Gen-2"
        ],
        "externalUrl": "https://paultrillo.com/",
        "videoEmbedUrl": "https://player.vimeo.com/video/821101511",
        "videoPlatform": "vimeo",
        "aspectRatio": "16/9",
        "attribution": "Original work by Paul Trillo. Verified source: https://paultrillo.com/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/paul-trillo.svg"
      },
      {
        "id": "paul-trillo__gofundme-help-changes-everything",
        "slug": "gofundme-help-changes-everything",
        "title": "GoFundMe — Help Changes Everything",
        "description": "Commercial creative work featured in the director’s portfolio. Do not assign AI tools without project evidence.",
        "fullDescription": "Commercial creative work featured in the director’s portfolio. Do not assign AI tools without project evidence.",
        "contentType": "Commercial Video",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://paultrillo.com/). AI involvement: unverified_for_this_project.",
        "credits": "Created by Paul Trillo. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://paultrillo.com/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Paul Trillo. Verified source: https://paultrillo.com/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/paul-trillo.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI Filmmaking",
        "Experimental Cinema",
        "Music Videos"
      ],
      "tools": [
        "OpenAI Sora",
        "Runway Gen-2"
      ],
      "contentTypes": [
        "Music Video",
        "Short Film",
        "Commercial Video"
      ],
      "styles": [
        "AI Filmmaking",
        "Experimental Cinema",
        "Music Videos"
      ]
    }
  },
  {
    "id": "ref-refik-anadol",
    "slug": "refik-anadol",
    "name": "Refik Anadol",
    "location": "Los Angeles, California, USA",
    "specialization": "Data Art · Machine Learning · Immersive Installation",
    "headline": "Machine-learning media art and immersive installation",
    "bioSummary": "Media artist and founder of Refik Anadol Studio, creating data-driven installations, performances and architecture-scale artworks. The studio documents custom machine-learning methods and archival-data work.",
    "fullBio": "Media artist and founder of Refik Anadol Studio, creating data-driven installations, performances and architecture-scale artworks. The studio documents custom machine-learning methods and archival-data work.",
    "officialWebsite": "https://refikanadolstudio.com/",
    "portfolioUrl": "https://refikanadolstudio.com/",
    "avatarUrl": "/licensed-portraits/refik-anadol.png",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/refik-anadol.svg",
    "isExternalReference": true,
    "portraitLicense": {
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
      "authorCredit": "SHERPA Blog",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Refik_Anadol_in_2017.png"
    },
    "attributionNote": "Sourced from official artist portfolio (https://refikanadolstudio.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "StyleGAN2 ADA",
      "Custom Latent Space Browser",
      "Archive + Machine Learning"
    ],
    "contentTypes": [
      "Installation Video"
    ],
    "creativeStyles": [
      "Data Art",
      "Machine Learning",
      "Immersive Installation"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "refik-anadol__unsupervised-machine-hallucinations-moma",
        "slug": "unsupervised-machine-hallucinations-moma",
        "title": "Unsupervised — Machine Hallucinations — MoMA",
        "year": "2022",
        "description": "A data-driven, continuously evolving media installation involving MoMA collection material and custom machine-learning processes.",
        "fullDescription": "A data-driven, continuously evolving media installation involving MoMA collection material and custom machine-learning processes.",
        "contentType": "Installation Video",
        "documentedTech": "StyleGAN2 ADA, Custom Latent Space Browser",
        "workflowNotes": "Sourced from official project archive (https://refikanadolstudio.com/projects/unsupervised-machine-hallucinations-moma/). AI involvement: documented.",
        "credits": "Created by Refik Anadol. Verified project metadata.",
        "tools": [
          "StyleGAN2 ADA",
          "Custom Latent Space Browser"
        ],
        "externalUrl": "https://refikanadolstudio.com/projects/unsupervised-machine-hallucinations-moma/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Refik Anadol. Verified source: https://refikanadolstudio.com/projects/unsupervised-machine-hallucinations-moma/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/refik-anadol.svg"
      },
      {
        "id": "refik-anadol__living-architecture-casa-batll",
        "slug": "living-architecture-casa-batll",
        "title": "Living Architecture: Casa Batlló",
        "year": "2022",
        "description": "Audiovisual architectural installation and performance presented at Casa Batlló.",
        "fullDescription": "Audiovisual architectural installation and performance presented at Casa Batlló.",
        "contentType": "Installation Video",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://refikanadolstudio.com/projects/living-architecture-casa-batllo/). AI involvement: documented.",
        "credits": "Created by Refik Anadol. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://refikanadolstudio.com/projects/living-architecture-casa-batllo/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Refik Anadol. Verified source: https://refikanadolstudio.com/projects/living-architecture-casa-batllo/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/refik-anadol.svg"
      },
      {
        "id": "refik-anadol__wdch-dreams",
        "slug": "wdch-dreams",
        "title": "WDCH Dreams",
        "year": "2018",
        "description": "Archive- and machine-learning-based public artwork for the Walt Disney Concert Hall.",
        "fullDescription": "Archive- and machine-learning-based public artwork for the Walt Disney Concert Hall.",
        "contentType": "Installation Video",
        "documentedTech": "Archive + Machine Learning",
        "workflowNotes": "Sourced from official project archive (https://refikanadolstudio.com/projects/wdch-dreams/). AI involvement: documented.",
        "credits": "Created by Refik Anadol. Verified project metadata.",
        "tools": [
          "Archive + Machine Learning"
        ],
        "externalUrl": "https://refikanadolstudio.com/projects/wdch-dreams/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Refik Anadol. Verified source: https://refikanadolstudio.com/projects/wdch-dreams/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/refik-anadol.svg"
      },
      {
        "id": "refik-anadol__machine-hallucination",
        "slug": "machine-hallucination",
        "title": "Machine Hallucination",
        "year": "2019",
        "description": "Immersive machine-learning audiovisual installation series.",
        "fullDescription": "Immersive machine-learning audiovisual installation series.",
        "contentType": "Installation Video",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://refikanadolstudio.com/projects/machine-hallucination/). AI involvement: documented.",
        "credits": "Created by Refik Anadol. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://refikanadolstudio.com/projects/machine-hallucination/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Refik Anadol. Verified source: https://refikanadolstudio.com/projects/machine-hallucination/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/refik-anadol.svg"
      }
    ],
    "filters": {
      "specializations": [
        "Data Art",
        "Machine Learning",
        "Immersive Installation"
      ],
      "tools": [
        "StyleGAN2 ADA",
        "Custom Latent Space Browser",
        "Archive + Machine Learning"
      ],
      "contentTypes": [
        "Installation Video"
      ],
      "styles": [
        "Data Art",
        "Machine Learning",
        "Immersive Installation"
      ]
    }
  },
  {
    "id": "ref-niceaunties",
    "slug": "niceaunties",
    "name": "niceaunties (Wenhui Lim)",
    "location": "Singapore",
    "specialization": "AI Visual Storytelling · Installation · Mixed Media",
    "headline": "Surreal AI world-building and multimedia installation",
    "bioSummary": "Wenhui Lim uses AI and mixed media to develop the Auntieverse, exploring ageing, care and cultural identity through surreal visual narratives, installations and moving images.",
    "fullBio": "Wenhui Lim uses AI and mixed media to develop the Auntieverse, exploring ageing, care and cultural identity through surreal visual narratives, installations and moving images.",
    "officialWebsite": "https://www.niceaunties.com/",
    "portfolioUrl": "https://www.niceaunties.com/",
    "avatarUrl": "/creator-avatars/niceaunties.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/niceaunties.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://www.niceaunties.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Motion Tracking"
    ],
    "contentTypes": [
      "Mixed Media",
      "Interactive Installation",
      "Moving Image",
      "Art Installation"
    ],
    "creativeStyles": [
      "AI Visual Storytelling",
      "Installation",
      "Mixed Media"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "niceaunties__auntieverse",
        "slug": "auntieverse",
        "title": "Auntieverse",
        "year": "2023",
        "description": "Ongoing speculative world-building project with many series exploring auntie culture, ageing and identity.",
        "fullDescription": "Ongoing speculative world-building project with many series exploring auntie culture, ageing and identity.",
        "contentType": "Mixed Media",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.niceaunties.com/projects-3). AI involvement: documented.",
        "credits": "Created by niceaunties (Wenhui Lim). Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.niceaunties.com/projects-3",
        "aspectRatio": "16/9",
        "attribution": "Original work by niceaunties (Wenhui Lim). Verified source: https://www.niceaunties.com/projects-3",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/niceaunties.svg"
      },
      {
        "id": "niceaunties__mirror-into-auntieverse",
        "slug": "mirror-into-auntieverse",
        "title": "Mirror Into Auntieverse",
        "year": "2025",
        "description": "Interactive mirror project combining motion tracking, generative portraits and cultural storytelling.",
        "fullDescription": "Interactive mirror project combining motion tracking, generative portraits and cultural storytelling.",
        "contentType": "Interactive Installation",
        "documentedTech": "Motion Tracking",
        "workflowNotes": "Sourced from official project archive (https://www.niceaunties.com/mirror-into-auntieverse). AI involvement: documented.",
        "credits": "Created by niceaunties (Wenhui Lim). Verified project metadata.",
        "tools": [
          "Motion Tracking"
        ],
        "externalUrl": "https://www.niceaunties.com/mirror-into-auntieverse",
        "aspectRatio": "16/9",
        "attribution": "Original work by niceaunties (Wenhui Lim). Verified source: https://www.niceaunties.com/mirror-into-auntieverse",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/niceaunties.svg"
      },
      {
        "id": "niceaunties__aunties-in-dis-place",
        "slug": "aunties-in-dis-place",
        "title": "Aunties in Dis Place",
        "year": "2024",
        "description": "Artist project listed in the official niceaunties project archive.",
        "fullDescription": "Artist project listed in the official niceaunties project archive.",
        "contentType": "Moving Image",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.niceaunties.com/projects). AI involvement: documented.",
        "credits": "Created by niceaunties (Wenhui Lim). Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.niceaunties.com/projects",
        "aspectRatio": "16/9",
        "attribution": "Original work by niceaunties (Wenhui Lim). Verified source: https://www.niceaunties.com/projects",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/niceaunties.svg"
      },
      {
        "id": "niceaunties__the-beauty-of-longevity",
        "slug": "the-beauty-of-longevity",
        "title": "The Beauty of Longevity",
        "year": "2025",
        "description": "Mixed-media installation and commissioned showcase documented in the artist’s official archive.",
        "fullDescription": "Mixed-media installation and commissioned showcase documented in the artist’s official archive.",
        "contentType": "Art Installation",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.niceaunties.com/projects). AI involvement: documented.",
        "credits": "Created by niceaunties (Wenhui Lim). Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.niceaunties.com/projects",
        "aspectRatio": "16/9",
        "attribution": "Original work by niceaunties (Wenhui Lim). Verified source: https://www.niceaunties.com/projects",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/niceaunties.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI Visual Storytelling",
        "Installation",
        "Mixed Media"
      ],
      "tools": [
        "Motion Tracking"
      ],
      "contentTypes": [
        "Mixed Media",
        "Interactive Installation",
        "Moving Image",
        "Art Installation"
      ],
      "styles": [
        "AI Visual Storytelling",
        "Installation",
        "Mixed Media"
      ]
    }
  },
  {
    "id": "ref-claire-silver",
    "slug": "claire-silver",
    "name": "Claire Silver",
    "location": "USA (Pseudonymous)",
    "specialization": "AI-Collaborative Art · Generative Fashion · Digital Art",
    "headline": "AI-collaborative art and digital collections",
    "bioSummary": "AI-collaborative artist whose publicly documented collections explore visual storytelling, fashion, memory and the relationship between artistic intention and generative tools.",
    "fullBio": "AI-collaborative artist whose publicly documented collections explore visual storytelling, fashion, memory and the relationship between artistic intention and generative tools.",
    "officialWebsite": "https://www.clairesilver.com/",
    "portfolioUrl": "https://www.clairesilver.com/",
    "avatarUrl": "/creator-avatars/claire-silver.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/claire-silver.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://www.clairesilver.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Artbreeder",
      "Midjourney",
      "DALL·E 2"
    ],
    "contentTypes": [
      "Image Collection"
    ],
    "creativeStyles": [
      "AI-Collaborative Art",
      "Generative Fashion",
      "Digital Art"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "claire-silver__ai-art-is-not-art",
        "slug": "ai-art-is-not-art",
        "title": "AI Art is Not Art",
        "year": "2022",
        "description": "AI-collaborative artwork series built with multiple generative approaches and artistic interventions.",
        "fullDescription": "AI-collaborative artwork series built with multiple generative approaches and artistic interventions.",
        "contentType": "Image Collection",
        "documentedTech": "Artbreeder, Midjourney, DALL·E 2",
        "workflowNotes": "Sourced from official project archive (https://www.clairesilver.com/collections). AI involvement: documented.",
        "credits": "Created by Claire Silver. Verified project metadata.",
        "tools": [
          "Artbreeder",
          "Midjourney",
          "DALL·E 2"
        ],
        "externalUrl": "https://www.clairesilver.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Claire Silver. Verified source: https://www.clairesilver.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/claire-silver.svg"
      },
      {
        "id": "claire-silver__corpo-real",
        "slug": "corpo-real",
        "title": "corpo | real",
        "year": "2024",
        "description": "AI-collaborative fashion and embodiment-focused image collection.",
        "fullDescription": "AI-collaborative fashion and embodiment-focused image collection.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.clairesilver.com/corporeal). AI involvement: documented.",
        "credits": "Created by Claire Silver. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.clairesilver.com/corporeal",
        "aspectRatio": "16/9",
        "attribution": "Original work by Claire Silver. Verified source: https://www.clairesilver.com/corporeal",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/claire-silver.svg"
      },
      {
        "id": "claire-silver__genesis",
        "slug": "genesis",
        "title": "Genesis",
        "year": "2020",
        "description": "An early AI image series arranged into a visual narrative.",
        "fullDescription": "An early AI image series arranged into a visual narrative.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.clairesilver.com/collections). AI involvement: documented.",
        "credits": "Created by Claire Silver. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.clairesilver.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Claire Silver. Verified source: https://www.clairesilver.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/claire-silver.svg"
      },
      {
        "id": "claire-silver__in-this-house",
        "slug": "in-this-house",
        "title": "in this house",
        "year": "2025",
        "description": "AI-focused experimental collection exploring recurring dream motifs.",
        "fullDescription": "AI-focused experimental collection exploring recurring dream motifs.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.clairesilver.com/collections). AI involvement: documented.",
        "credits": "Created by Claire Silver. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.clairesilver.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Claire Silver. Verified source: https://www.clairesilver.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/claire-silver.svg"
      },
      {
        "id": "claire-silver__paracosm",
        "slug": "paracosm",
        "title": "paracosm",
        "year": "2023",
        "description": "Generative image collection exploring a personal invented world.",
        "fullDescription": "Generative image collection exploring a personal invented world.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.clairesilver.com/collections). AI involvement: documented.",
        "credits": "Created by Claire Silver. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.clairesilver.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Claire Silver. Verified source: https://www.clairesilver.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/claire-silver.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI-Collaborative Art",
        "Generative Fashion",
        "Digital Art"
      ],
      "tools": [
        "Artbreeder",
        "Midjourney",
        "DALL·E 2"
      ],
      "contentTypes": [
        "Image Collection"
      ],
      "styles": [
        "AI-Collaborative Art",
        "Generative Fashion",
        "Digital Art"
      ]
    }
  },
  {
    "id": "ref-roope-rainisto",
    "slug": "roope-rainisto",
    "name": "Roope Rainisto",
    "location": "Helsinki, Finland",
    "specialization": "AI Photography · Post-Photography · Conceptual Art",
    "headline": "AI post-photography and conceptual imagery",
    "bioSummary": "Helsinki-based artist working in AI-generated post-photography. His collections explore fictional memories and uncanny versions of familiar places and social life.",
    "fullBio": "Helsinki-based artist working in AI-generated post-photography. His collections explore fictional memories and uncanny versions of familiar places and social life.",
    "officialWebsite": "https://www.rooperainisto.com/",
    "portfolioUrl": "https://www.rooperainisto.com/",
    "avatarUrl": "/creator-avatars/roope-rainisto.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/roope-rainisto.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://www.rooperainisto.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "AI Photography",
      "Post-Photography",
      "Conceptual Art"
    ],
    "contentTypes": [
      "Image Collection"
    ],
    "creativeStyles": [
      "AI Photography",
      "Post-Photography",
      "Conceptual Art"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "roope-rainisto__life-in-west-america",
        "slug": "life-in-west-america",
        "title": "Life in West America",
        "year": "2023",
        "description": "AI post-photography series reimagining nostalgic American environments.",
        "fullDescription": "AI post-photography series reimagining nostalgic American environments.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.rooperainisto.com/collections). AI involvement: documented.",
        "credits": "Created by Roope Rainisto. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.rooperainisto.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Roope Rainisto. Verified source: https://www.rooperainisto.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/roope-rainisto.svg"
      },
      {
        "id": "roope-rainisto__reworld",
        "slug": "reworld",
        "title": "REWORLD",
        "year": "2023",
        "description": "Post-photographic collection imagining a shifted social and visual reality.",
        "fullDescription": "Post-photographic collection imagining a shifted social and visual reality.",
        "contentType": "Image Collection",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.rooperainisto.com/collections). AI involvement: documented.",
        "credits": "Created by Roope Rainisto. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.rooperainisto.com/collections",
        "aspectRatio": "16/9",
        "attribution": "Original work by Roope Rainisto. Verified source: https://www.rooperainisto.com/collections",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/roope-rainisto.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI Photography",
        "Post-Photography",
        "Conceptual Art"
      ],
      "tools": [],
      "contentTypes": [
        "Image Collection"
      ],
      "styles": [
        "AI Photography",
        "Post-Photography",
        "Conceptual Art"
      ]
    }
  },
  {
    "id": "ref-sasha-stiles",
    "slug": "sasha-stiles",
    "name": "Sasha Stiles",
    "location": "New York, USA",
    "specialization": "AI Poetry · Generative Typography · Computational Literature",
    "headline": "AI poetry, computational language and media art",
    "bioSummary": "Poet and artist creating hybrid language systems, generative writing and media-rich works that investigate collaboration between human expression and computation.",
    "fullBio": "Poet and artist creating hybrid language systems, generative writing and media-rich works that investigate collaboration between human expression and computation.",
    "officialWebsite": "https://www.sashastiles.com/",
    "portfolioUrl": "https://www.sashastiles.com/",
    "avatarUrl": "/licensed-portraits/sasha-stiles.jpg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/sasha-stiles.svg",
    "isExternalReference": true,
    "portraitLicense": {
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "authorCredit": "Vera de Kok",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Sasha_Stiles_-_Art_Basel_2025_(cropped).jpg"
    },
    "attributionNote": "Sourced from official artist portfolio (https://www.sashastiles.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Generative Code",
      "Custom Text Generator"
    ],
    "contentTypes": [
      "Generative Typography",
      "Multimedia Poetry",
      "Video Poetry",
      "Art Installation"
    ],
    "creativeStyles": [
      "AI Poetry",
      "Generative Typography",
      "Computational Literature"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "sasha-stiles__cursive-binary",
        "slug": "cursive-binary",
        "title": "CURSIVE BINARY",
        "description": "Language-art project combining cursive handwriting with binary notation and poetic forms.",
        "fullDescription": "Language-art project combining cursive handwriting with binary notation and poetic forms.",
        "contentType": "Generative Typography",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.sashastiles.com/cursivebinary). AI involvement: documented.",
        "credits": "Created by Sasha Stiles. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.sashastiles.com/cursivebinary",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sasha Stiles. Verified source: https://www.sashastiles.com/cursivebinary",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sasha-stiles.svg"
      },
      {
        "id": "sasha-stiles__repetae",
        "slug": "repetae",
        "title": "REPETAE",
        "year": "2022",
        "description": "Generative poetry series exploring repetition, recursion and algorithmic language.",
        "fullDescription": "Generative poetry series exploring repetition, recursion and algorithmic language.",
        "contentType": "Multimedia Poetry",
        "documentedTech": "Generative Code",
        "workflowNotes": "Sourced from official project archive (https://www.sashastiles.com/repetae). AI involvement: documented.",
        "credits": "Created by Sasha Stiles. Verified project metadata.",
        "tools": [
          "Generative Code"
        ],
        "externalUrl": "https://www.sashastiles.com/repetae",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sasha Stiles. Verified source: https://www.sashastiles.com/repetae",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sasha-stiles.svg"
      },
      {
        "id": "sasha-stiles__repetae-again-again",
        "slug": "repetae-again-again",
        "title": "REPETAE: Again, Again",
        "year": "2023",
        "description": "Media-rich poem published in partnership with Gucci; official project listing documents a 2:45 video.",
        "fullDescription": "Media-rich poem published in partnership with Gucci; official project listing documents a 2:45 video.",
        "contentType": "Video Poetry",
        "documentedTech": "Custom Text Generator",
        "workflowNotes": "Sourced from official project archive (https://www.sashastiles.com/projects). AI involvement: documented.",
        "credits": "Created by Sasha Stiles. Verified project metadata.",
        "tools": [
          "Custom Text Generator"
        ],
        "externalUrl": "https://www.sashastiles.com/projects",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sasha Stiles. Verified source: https://www.sashastiles.com/projects",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sasha-stiles.svg"
      },
      {
        "id": "sasha-stiles__dear-data",
        "slug": "dear-data",
        "title": "DEAR [DATA]",
        "year": "2025",
        "description": "Real-time generative poem installation using displays and a language system.",
        "fullDescription": "Real-time generative poem installation using displays and a language system.",
        "contentType": "Art Installation",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.sashastiles.com/projects). AI involvement: documented.",
        "credits": "Created by Sasha Stiles. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.sashastiles.com/projects",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sasha Stiles. Verified source: https://www.sashastiles.com/projects",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sasha-stiles.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI Poetry",
        "Generative Typography",
        "Computational Literature"
      ],
      "tools": [
        "Generative Code",
        "Custom Text Generator"
      ],
      "contentTypes": [
        "Generative Typography",
        "Multimedia Poetry",
        "Video Poetry",
        "Art Installation"
      ],
      "styles": [
        "AI Poetry",
        "Generative Typography",
        "Computational Literature"
      ]
    }
  },
  {
    "id": "ref-kris-kashtanova",
    "slug": "kris-kashtanova",
    "name": "Kris Kashtanova",
    "location": "New York, USA",
    "specialization": "AI Illustration · AI Comics · Generative Video",
    "headline": "AI-assisted illustration, comics and video",
    "bioSummary": "AI artist whose official portfolio includes AI-assisted comics, visual experiments and short videos, with individual projects documenting Midjourney, Stable Diffusion and Runway techniques.",
    "fullBio": "AI artist whose official portfolio includes AI-assisted comics, visual experiments and short videos, with individual projects documenting Midjourney, Stable Diffusion and Runway techniques.",
    "officialWebsite": "https://www.kris.art/portfolio-2",
    "portfolioUrl": "https://www.kris.art/portfolio-2",
    "avatarUrl": "/creator-avatars/kris-kashtanova.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/kris-kashtanova.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://www.kris.art/portfolio-2). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Midjourney",
      "Stable Diffusion",
      "Runway Gen-2",
      "Kaiber AI",
      "RunwayML"
    ],
    "contentTypes": [
      "AI Comic & Graphic Art",
      "Image Collection",
      "AI Video"
    ],
    "creativeStyles": [
      "AI Illustration",
      "AI Comics",
      "Generative Video"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "kris-kashtanova__zarya-of-the-dawn",
        "slug": "zarya-of-the-dawn",
        "title": "Zarya of the Dawn",
        "year": "2022",
        "description": "AI-assisted comic project listed in the official artist portfolio.",
        "fullDescription": "AI-assisted comic project listed in the official artist portfolio.",
        "contentType": "AI Comic & Graphic Art",
        "documentedTech": "Midjourney",
        "workflowNotes": "Sourced from official project archive (https://www.kris.art/portfolio-2/project-one-ephnc-jamy8). AI involvement: documented.",
        "credits": "Created by Kris Kashtanova. Verified project metadata.",
        "tools": [
          "Midjourney"
        ],
        "externalUrl": "https://www.kris.art/portfolio-2/project-one-ephnc-jamy8",
        "aspectRatio": "16/9",
        "attribution": "Original work by Kris Kashtanova. Verified source: https://www.kris.art/portfolio-2/project-one-ephnc-jamy8",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/kris-kashtanova.svg"
      },
      {
        "id": "kris-kashtanova__rose-enigma",
        "slug": "rose-enigma",
        "title": "Rose Enigma",
        "year": "2023",
        "description": "Artwork combining human input and AI-assisted image production documented by the artist.",
        "fullDescription": "Artwork combining human input and AI-assisted image production documented by the artist.",
        "contentType": "Image Collection",
        "documentedTech": "Stable Diffusion",
        "workflowNotes": "Sourced from official project archive (https://www.kris.art/portfolio-2/rose-enigma). AI involvement: documented.",
        "credits": "Created by Kris Kashtanova. Verified project metadata.",
        "tools": [
          "Stable Diffusion"
        ],
        "externalUrl": "https://www.kris.art/portfolio-2/rose-enigma",
        "aspectRatio": "16/9",
        "attribution": "Original work by Kris Kashtanova. Verified source: https://www.kris.art/portfolio-2/rose-enigma",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/kris-kashtanova.svg"
      },
      {
        "id": "kris-kashtanova__ai-burning-man",
        "slug": "ai-burning-man",
        "title": "AI Burning Man",
        "year": "2023",
        "description": "Video assembled from Runway Gen-2 clips generated using text prompts, with AI soundtrack.",
        "fullDescription": "Video assembled from Runway Gen-2 clips generated using text prompts, with AI soundtrack.",
        "contentType": "AI Video",
        "documentedTech": "Runway Gen-2",
        "workflowNotes": "Sourced from official project archive (https://www.kris.art/portfolio-2/ai-burning-man-gen2-runwayml). AI involvement: documented.",
        "credits": "Created by Kris Kashtanova. Verified project metadata.",
        "tools": [
          "Runway Gen-2"
        ],
        "externalUrl": "https://www.kris.art/portfolio-2/ai-burning-man-gen2-runwayml",
        "aspectRatio": "16/9",
        "attribution": "Original work by Kris Kashtanova. Verified source: https://www.kris.art/portfolio-2/ai-burning-man-gen2-runwayml",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/kris-kashtanova.svg"
      },
      {
        "id": "kris-kashtanova__kaiber-ai-animations",
        "slug": "kaiber-ai-animations",
        "title": "Kaiber AI Animations",
        "description": "Official portfolio collection of AI animation experiments.",
        "fullDescription": "Official portfolio collection of AI animation experiments.",
        "contentType": "AI Video",
        "documentedTech": "Kaiber AI, RunwayML",
        "workflowNotes": "Sourced from official project archive (https://www.kris.art/portfolio-2/project-four-yjynj-2fnpj). AI involvement: documented.",
        "credits": "Created by Kris Kashtanova. Verified project metadata.",
        "tools": [
          "Kaiber AI",
          "RunwayML"
        ],
        "externalUrl": "https://www.kris.art/portfolio-2/project-four-yjynj-2fnpj",
        "aspectRatio": "16/9",
        "attribution": "Original work by Kris Kashtanova. Verified source: https://www.kris.art/portfolio-2/project-four-yjynj-2fnpj",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/kris-kashtanova.svg"
      }
    ],
    "filters": {
      "specializations": [
        "AI Illustration",
        "AI Comics",
        "Generative Video"
      ],
      "tools": [
        "Midjourney",
        "Stable Diffusion",
        "Runway Gen-2",
        "Kaiber AI",
        "RunwayML"
      ],
      "contentTypes": [
        "AI Comic & Graphic Art",
        "Image Collection",
        "AI Video"
      ],
      "styles": [
        "AI Illustration",
        "AI Comics",
        "Generative Video"
      ]
    }
  },
  {
    "id": "ref-anna-ridler",
    "slug": "anna-ridler",
    "name": "Anna Ridler",
    "location": "London, UK",
    "specialization": "Dataset Art · Machine Learning · Generative Video",
    "headline": "Dataset-based machine-learning art",
    "bioSummary": "Artist working with self-assembled datasets and machine-learning processes, including tulip imagery and generated video installations. Her work emphasizes the labor and provenance of dataset construction.",
    "fullBio": "Artist working with self-assembled datasets and machine-learning processes, including tulip imagery and generated video installations. Her work emphasizes the labor and provenance of dataset construction.",
    "officialWebsite": "https://annaridler.com/",
    "portfolioUrl": "https://annaridler.com/",
    "avatarUrl": "/licensed-portraits/anna-ridler.jpg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/anna-ridler.svg",
    "isExternalReference": true,
    "portraitLicense": {
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "authorCredit": "Nycedit8",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Anna_Ridler_Headshot.jpg"
    },
    "attributionNote": "Sourced from official artist portfolio (https://annaridler.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "GAN"
    ],
    "contentTypes": [
      "Generative Video",
      "Dataset Installation",
      "Generative Art"
    ],
    "creativeStyles": [
      "Dataset Art",
      "Machine Learning",
      "Generative Video"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "anna-ridler__mosaic-virus-2019",
        "slug": "mosaic-virus-2019",
        "title": "Mosaic Virus 2019",
        "year": "2019",
        "description": "Three-screen GAN-based tulip video installation linked conceptually to speculative-market dynamics.",
        "fullDescription": "Three-screen GAN-based tulip video installation linked conceptually to speculative-market dynamics.",
        "contentType": "Generative Video",
        "documentedTech": "GAN",
        "workflowNotes": "Sourced from official project archive (https://annaridler.com/works/mosaic-2019). AI involvement: documented.",
        "credits": "Created by Anna Ridler. Verified project metadata.",
        "tools": [
          "GAN"
        ],
        "externalUrl": "https://annaridler.com/works/mosaic-2019",
        "aspectRatio": "16/9",
        "attribution": "Original work by Anna Ridler. Verified source: https://annaridler.com/works/mosaic-2019",
        "mediaRightsStatus": "artist_hosted_embed",
        "thumbnailUrl": "/licensed-portraits/anna-ridler-mosaic-virus-installation-photo.jpg",
        "fallbackSvg": "/creator-fallbacks/anna-ridler.svg"
      },
      {
        "id": "anna-ridler__myriad-tulips",
        "slug": "myriad-tulips",
        "title": "Myriad (Tulips)",
        "year": "2018",
        "description": "Thousands of hand-labelled tulip photographs presented as artwork and dataset.",
        "fullDescription": "Thousands of hand-labelled tulip photographs presented as artwork and dataset.",
        "contentType": "Dataset Installation",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://annaridler.com/works/myriad-tulips). AI involvement: documented.",
        "credits": "Created by Anna Ridler. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://annaridler.com/works/myriad-tulips",
        "aspectRatio": "16/9",
        "attribution": "Original work by Anna Ridler. Verified source: https://annaridler.com/works/myriad-tulips",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/anna-ridler.svg"
      },
      {
        "id": "anna-ridler__mosaic-virus-2018",
        "slug": "mosaic-virus-2018",
        "title": "Mosaic Virus 2018",
        "year": "2018",
        "description": "GAN-generated visual installation of tulip imagery using an artist-built dataset.",
        "fullDescription": "GAN-generated visual installation of tulip imagery using an artist-built dataset.",
        "contentType": "Generative Video",
        "documentedTech": "GAN",
        "workflowNotes": "Sourced from official project archive (https://annaridler.com/works/mosaic-2018). AI involvement: documented.",
        "credits": "Created by Anna Ridler. Verified project metadata.",
        "tools": [
          "GAN"
        ],
        "externalUrl": "https://annaridler.com/works/mosaic-2018",
        "aspectRatio": "16/9",
        "attribution": "Original work by Anna Ridler. Verified source: https://annaridler.com/works/mosaic-2018",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/anna-ridler.svg"
      },
      {
        "id": "anna-ridler__bloemenveiling",
        "slug": "bloemenveiling",
        "title": "Bloemenveiling",
        "year": "2019",
        "description": "Project listed in the official artist work archive; validate additional media specifics before publishing.",
        "fullDescription": "Project listed in the official artist work archive; validate additional media specifics before publishing.",
        "contentType": "Generative Art",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://annaridler.com/works). AI involvement: documented.",
        "credits": "Created by Anna Ridler. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://annaridler.com/works",
        "aspectRatio": "16/9",
        "attribution": "Original work by Anna Ridler. Verified source: https://annaridler.com/works",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/anna-ridler.svg"
      }
    ],
    "filters": {
      "specializations": [
        "Dataset Art",
        "Machine Learning",
        "Generative Video"
      ],
      "tools": [
        "GAN"
      ],
      "contentTypes": [
        "Generative Video",
        "Dataset Installation",
        "Generative Art"
      ],
      "styles": [
        "Dataset Art",
        "Machine Learning",
        "Generative Video"
      ]
    }
  },
  {
    "id": "ref-sougwen-chung",
    "slug": "sougwen-chung",
    "name": "Sougwen Chung",
    "location": "New York / London",
    "specialization": "Robotic Art · Human-Machine Collaboration · Generative Performance",
    "headline": "Robotic drawing and human-machine creative collaboration",
    "bioSummary": "Artist and researcher known for Drawing Operations, an evolving body of collaborative performances and artworks combining hand drawing, robotics and machine learning.",
    "fullBio": "Artist and researcher known for Drawing Operations, an evolving body of collaborative performances and artworks combining hand drawing, robotics and machine learning.",
    "officialWebsite": "https://sougwen.com/",
    "portfolioUrl": "https://sougwen.com/",
    "avatarUrl": "/licensed-portraits/sougwen-chung.png",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/sougwen-chung.svg",
    "isExternalReference": true,
    "portraitLicense": {
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
      "authorCredit": "World Economic Forum",
      "sourcePage": "https://commons.wikimedia.org/wiki/File:Sougwen_Chung_at_World_Economic_Forum_Annual_Meeting_of_the_New_Champions_2023.png"
    },
    "attributionNote": "Sourced from official artist portfolio (https://sougwen.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Computer Vision",
      "Robotic Arm",
      "Neural Networks",
      "Robotics",
      "Optical Flow",
      "EEG"
    ],
    "contentTypes": [
      "Robotic Performance"
    ],
    "creativeStyles": [
      "Robotic Art",
      "Human-Machine Collaboration",
      "Generative Performance"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "sougwen-chung__mimicry-drawing-operations",
        "slug": "mimicry-drawing-operations",
        "title": "MIMICRY — Drawing Operations",
        "year": "2015",
        "description": "First generation of human-and-robot collaborative drawing, tracking the artist’s gesture in real time.",
        "fullDescription": "First generation of human-and-robot collaborative drawing, tracking the artist’s gesture in real time.",
        "contentType": "Robotic Performance",
        "documentedTech": "Computer Vision, Robotic Arm",
        "workflowNotes": "Sourced from official project archive (https://sougwen.com/work/mimicry-drawing-operations). AI involvement: documented.",
        "credits": "Created by Sougwen Chung. Verified project metadata.",
        "tools": [
          "Computer Vision",
          "Robotic Arm"
        ],
        "externalUrl": "https://sougwen.com/work/mimicry-drawing-operations",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sougwen Chung. Verified source: https://sougwen.com/work/mimicry-drawing-operations",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sougwen-chung.svg"
      },
      {
        "id": "sougwen-chung__memory-drawing-operations",
        "slug": "memory-drawing-operations",
        "title": "MEMORY — Drawing Operations",
        "year": "2017",
        "description": "Second-generation drawing system trained on the artist’s own archived drawings.",
        "fullDescription": "Second-generation drawing system trained on the artist’s own archived drawings.",
        "contentType": "Robotic Performance",
        "documentedTech": "Neural Networks, Robotics",
        "workflowNotes": "Sourced from official project archive (https://sougwen.com/work/memory-drawing-operations). AI involvement: documented.",
        "credits": "Created by Sougwen Chung. Verified project metadata.",
        "tools": [
          "Neural Networks",
          "Robotics"
        ],
        "externalUrl": "https://sougwen.com/work/memory-drawing-operations",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sougwen Chung. Verified source: https://sougwen.com/work/memory-drawing-operations",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sougwen-chung.svg"
      },
      {
        "id": "sougwen-chung__collectivity-omnia-per-omnia",
        "slug": "collectivity-omnia-per-omnia",
        "title": "COLLECTIVITY — Omnia per Omnia",
        "year": "2018",
        "description": "Human-machine drawing performance involving multiple robotic systems and city motion data.",
        "fullDescription": "Human-machine drawing performance involving multiple robotic systems and city motion data.",
        "contentType": "Robotic Performance",
        "documentedTech": "Robotics, Optical Flow",
        "workflowNotes": "Sourced from official project archive (https://sougwen.com/work/collectivity-drawing-operations). AI involvement: documented.",
        "credits": "Created by Sougwen Chung. Verified project metadata.",
        "tools": [
          "Robotics",
          "Optical Flow"
        ],
        "externalUrl": "https://sougwen.com/work/collectivity-drawing-operations",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sougwen Chung. Verified source: https://sougwen.com/work/collectivity-drawing-operations",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sougwen-chung.svg"
      },
      {
        "id": "sougwen-chung__assembly-lines",
        "slug": "assembly-lines",
        "title": "Assembly Lines",
        "year": "2022",
        "description": "Live multi-robotic painting performance using EEG biofeedback and spatial sound.",
        "fullDescription": "Live multi-robotic painting performance using EEG biofeedback and spatial sound.",
        "contentType": "Robotic Performance",
        "documentedTech": "EEG, Robotics",
        "workflowNotes": "Sourced from official project archive (https://sougwen.com/work/assembly-drawing-operations). AI involvement: documented.",
        "credits": "Created by Sougwen Chung. Verified project metadata.",
        "tools": [
          "EEG",
          "Robotics"
        ],
        "externalUrl": "https://sougwen.com/work/assembly-drawing-operations",
        "aspectRatio": "16/9",
        "attribution": "Original work by Sougwen Chung. Verified source: https://sougwen.com/work/assembly-drawing-operations",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/sougwen-chung.svg"
      }
    ],
    "filters": {
      "specializations": [
        "Robotic Art",
        "Human-Machine Collaboration",
        "Generative Performance"
      ],
      "tools": [
        "Computer Vision",
        "Robotic Arm",
        "Neural Networks",
        "Robotics",
        "Optical Flow",
        "EEG"
      ],
      "contentTypes": [
        "Robotic Performance"
      ],
      "styles": [
        "Robotic Art",
        "Human-Machine Collaboration",
        "Generative Performance"
      ]
    }
  },
  {
    "id": "ref-karen-x-cheng",
    "slug": "karen-x-cheng",
    "name": "Karen X. Cheng",
    "location": "San Francisco, California, USA",
    "specialization": "Creative Direction · Commercial Video · Practical VFX",
    "headline": "Creative direction, filmmaking and experimental video",
    "bioSummary": "Director and creative filmmaker known for inventive camera techniques and social video projects. Her public portfolio includes commercial films and experiments; AI involvement must be verified per project rather than assumed.",
    "fullBio": "Director and creative filmmaker known for inventive camera techniques and social video projects. Her public portfolio includes commercial films and experiments; AI involvement must be verified per project rather than assumed.",
    "officialWebsite": "https://www.karenx.com/",
    "portfolioUrl": "https://www.karenx.com/",
    "avatarUrl": "/creator-avatars/karen-x-cheng.svg",
    "coverUrl": null,
    "fallbackCover": "/creator-fallbacks/karen-x-cheng.svg",
    "isExternalReference": true,
    "portraitLicense": null,
    "attributionNote": "Sourced from official artist portfolio (https://www.karenx.com/). Editorial reference only; artists are not registered CreaXa users.",
    "documentedTools": [
      "Creative Direction",
      "Commercial Video",
      "Practical VFX"
    ],
    "contentTypes": [
      "Creative Direction",
      "Commercial Video"
    ],
    "creativeStyles": [
      "Creative Direction",
      "Commercial Video",
      "Practical VFX"
    ],
    "socialLinks": [],
    "featuredWorks": [
      {
        "id": "karen-x-cheng__pass-the-pencil-challenge",
        "slug": "pass-the-pencil-challenge",
        "title": "Pass The Pencil Challenge",
        "description": "Collaborative visual challenge involving sequential pencil handoffs across footage. No AI use established.",
        "fullDescription": "Collaborative visual challenge involving sequential pencil handoffs across footage. No AI use established.",
        "contentType": "Creative Direction",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.karenx.com/pencil). AI involvement: unverified_for_this_project.",
        "credits": "Created by Karen X. Cheng. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.karenx.com/pencil",
        "aspectRatio": "16/9",
        "attribution": "Original work by Karen X. Cheng. Verified source: https://www.karenx.com/pencil",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/karen-x-cheng.svg"
      },
      {
        "id": "karen-x-cheng__puma-shemovesus-video",
        "slug": "puma-shemovesus-video",
        "title": "PUMA — SheMovesUs Video",
        "description": "Commercial campaign documented by the filmmaker; no AI use established on cited page.",
        "fullDescription": "Commercial campaign documented by the filmmaker; no AI use established on cited page.",
        "contentType": "Commercial Video",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.karenx.com/). AI involvement: unverified_for_this_project.",
        "credits": "Created by Karen X. Cheng. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.karenx.com/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Karen X. Cheng. Verified source: https://www.karenx.com/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/karen-x-cheng.svg"
      },
      {
        "id": "karen-x-cheng__lego-rebuild-the-world",
        "slug": "lego-rebuild-the-world",
        "title": "LEGO — Rebuild The World",
        "description": "Creative LEGO brand video project documented by the director; no AI use established on cited page.",
        "fullDescription": "Creative LEGO brand video project documented by the director; no AI use established on cited page.",
        "contentType": "Commercial Video",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.karenx.com/). AI involvement: unverified_for_this_project.",
        "credits": "Created by Karen X. Cheng. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.karenx.com/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Karen X. Cheng. Verified source: https://www.karenx.com/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/karen-x-cheng.svg"
      },
      {
        "id": "karen-x-cheng__creative-fake-drone-video-series",
        "slug": "creative-fake-drone-video-series",
        "title": "Creative Fake Drone Video Series",
        "description": "Practical camera-technique series documented by the filmmaker; do not claim AI generation.",
        "fullDescription": "Practical camera-technique series documented by the filmmaker; do not claim AI generation.",
        "contentType": "Creative Direction",
        "documentedTech": "Documented on official project site",
        "workflowNotes": "Sourced from official project archive (https://www.karenx.com/). AI involvement: unverified_for_this_project.",
        "credits": "Created by Karen X. Cheng. Verified project metadata.",
        "tools": [],
        "externalUrl": "https://www.karenx.com/",
        "aspectRatio": "16/9",
        "attribution": "Original work by Karen X. Cheng. Verified source: https://www.karenx.com/",
        "mediaRightsStatus": "artist_hosted_embed",
        "fallbackSvg": "/creator-fallbacks/karen-x-cheng.svg"
      }
    ],
    "filters": {
      "specializations": [
        "Creative Direction",
        "Commercial Video",
        "Practical VFX"
      ],
      "tools": [],
      "contentTypes": [
        "Creative Direction",
        "Commercial Video"
      ],
      "styles": [
        "Creative Direction",
        "Commercial Video",
        "Practical VFX"
      ]
    }
  }
];
