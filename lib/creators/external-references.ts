// ==============================================================================
// CREAXA — 10 GENUINE AI CREATORS & EDITORIAL REFERENCE DIRECTORY
// ==============================================================================
// These are real artists and directors whose AI work is publicly documented.
// IMPORTANT LEGAL & PLATFORM INTEGRITY RULES:
// 1. These are external editorial reference profiles for discovery, benchmarking and tool research.
// 2. They are NOT registered CreaXa marketplace accounts.
// 3. No fake email addresses, Firebase UIDs, or marketplace rates are fabricated.
// 4. In-app invitations are disabled; visitors are directed to official portfolio URLs.
// 5. Original video embeds (Vimeo / YouTube) are used with permission / standard player parameters.
// ==============================================================================

export interface ExternalCreatorWork {
  id: string;
  title: string;
  year?: string;
  description: string;
  contentType: 'AI Video' | 'Music Video' | 'Generative Art' | 'AI Photography' | 'Installation' | 'Digital Poetry' | 'Comic Novel' | 'Commercial VFX';
  documentedTech: string;
  tools: string[];
  externalUrl: string;
  videoEmbedUrl?: string;
  videoPlatform?: 'vimeo' | 'youtube';
  aspectRatio?: string;
  mediaType: 'video' | 'interactive' | 'image' | 'text';
  attribution: string;
  mediaRightsStatus: 'public_editorial_reference' | 'artist_hosted_embed' | 'official_archive';
  thumbnailUrl?: string;
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
  // ----------------------------------------------------------------------------
  // 1. PAUL TRILLO
  // ----------------------------------------------------------------------------
  {
    id: 'ref-paul-trillo',
    slug: 'paul-trillo',
    name: 'Paul Trillo',
    handle: '@paultrillo',
    location: 'Los Angeles, California, USA',
    specialization: 'AI Filmmaking & Experimental Direction',
    headline: 'Pioneering AI Director & Multidisciplinary Filmmaker',
    bioSummary: 'Director and multidisciplinary artist recognized for pioneering narrative AI filmmaking, seamless camera transitions, and technical experimentation across music videos and commercial films.',
    fullBio: 'Paul Trillo is a Los Angeles-based director and multi-disciplinary artist renowned for pushing the boundaries of moving image technology. His work challenges conventional filmmaking by integrating cutting-edge machine learning tools—including early access collaborations with OpenAI Sora and Runway Gen-2—with classical cinematography and rigorous visual effects. Trillo has directed landmark AI projects including the official Washed Out music video "The Hardest Part", the experimental short "Thank You For Not Answering", and commercial campaigns for global brands, establishing him as one of the foremost cinematic voices in generative video production.',
    officialWebsite: 'https://paultrillo.com/',
    portfolioUrl: 'https://paultrillo.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented through official portfolio (paultrillo.com), Vimeo channel, and press releases.',
    documentedTools: ['Sora', 'Runway Gen-2', 'Stable Diffusion', 'DALL·E 2', 'Automatic1111', 'After Effects'],
    contentTypes: ['AI Video', 'Music Video', 'Experimental Film', 'Commercial VFX'],
    creativeStyles: ['Cinematic', 'Surreal', 'Experimental', 'Seamless Motion'],
    socialLinks: [
      { platform: 'website', url: 'https://paultrillo.com/', label: 'Official Portfolio' },
      { platform: 'vimeo', url: 'https://vimeo.com/paultrillo', label: 'Vimeo Channel' },
      { platform: 'instagram', url: 'https://www.instagram.com/paultrillo/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/paultrillo', label: 'X / Twitter' }
    ],
    featuredWorks: [
      {
        id: 'pt-work-1',
        title: 'Washed Out — The Hardest Part',
        year: '2024',
        description: 'First official music video produced using OpenAI Sora, tracking an infinite zoom through decades of human memory and emotional vignettes.',
        contentType: 'Music Video',
        documentedTech: 'OpenAI Sora generative video + DaVinci Resolve color grading',
        tools: ['OpenAI Sora', 'DaVinci Resolve'],
        externalUrl: 'https://paultrillo.com/',
        videoEmbedUrl: 'https://player.vimeo.com/video/941713443',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Washed Out / Sub Pop Records / Directed by Paul Trillo using OpenAI Sora',
        mediaRightsStatus: 'artist_hosted_embed'
      },
      {
        id: 'pt-work-2',
        title: 'Thank You For Not Answering',
        year: '2023',
        description: 'AI-generated experimental short film exploring telephone isolation and distorted memories utilizing Runway Gen-2 neural video interpolation.',
        contentType: 'AI Video',
        documentedTech: 'Runway Gen-2 neural video interpolation + Stable Diffusion checkpoints',
        tools: ['Runway Gen-2', 'Stable Diffusion'],
        externalUrl: 'https://paultrillo.com/',
        videoEmbedUrl: 'https://player.vimeo.com/video/821101511',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Written and Directed by Paul Trillo',
        mediaRightsStatus: 'artist_hosted_embed'
      },
      {
        id: 'pt-work-3',
        title: 'GoFundMe — Help Changes Everything',
        year: '2023',
        description: 'Commercial campaign visual narrative featured on official portfolio, exploring community-powered support through seamless transition choreography.',
        contentType: 'Commercial VFX',
        documentedTech: 'Hybrid live action with neural camera projection and visual effects',
        tools: ['After Effects', 'Stable Diffusion', 'DaVinci Resolve'],
        externalUrl: 'https://paultrillo.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'GoFundMe / Directed by Paul Trillo',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['AI Filmmaking', 'Creative Direction'],
      tools: ['Sora', 'Runway Gen-2', 'Stable Diffusion'],
      contentTypes: ['AI Video', 'Music Video'],
      styles: ['Cinematic', 'Experimental']
    }
  },

  // ----------------------------------------------------------------------------
  // 2. REFIK ANADOL
  // ----------------------------------------------------------------------------
  {
    id: 'ref-refik-anadol',
    slug: 'refik-anadol',
    name: 'Refik Anadol',
    handle: '@refikanadol',
    location: 'Los Angeles, California, USA',
    specialization: 'Generative Media Art & Immersive ML Installations',
    headline: 'Media Artist & Director of Refik Anadol Studio (RAS)',
    bioSummary: 'Media artist and director of Refik Anadol Studio, pioneering generative data environments, latent-space navigation, and architectural AI sculptures displayed at MoMA and Casa Batlló.',
    fullBio: 'Refik Anadol is a pioneer in the aesthetics of machine intelligence. As director of Refik Anadol Studio (RAS) in Los Angeles, he treats public architectural facades and museum galleries as canvases for fluid data sculptures. By embedding vast datasets—from MoMA’s public collection to global environmental sensor archives—into custom machine-learning models, Anadol visualizes how algorithms interpret, remember, and dream human experiences.',
    officialWebsite: 'https://refikanadol.com/',
    portfolioUrl: 'https://refikanadolstudio.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented through institutional museum exhibitions (MoMA, Casa Batlló) and official studio archives.',
    documentedTools: ['StyleGAN2', 'Custom ML Models', 'Latent Space Tools', 'CUDA', 'TouchDesigner', 'Python'],
    contentTypes: ['Generative Art', 'Installation', 'Architectural Visualization'],
    creativeStyles: ['Monumental', 'Fluid Dynamics', 'Data-driven', 'Abstract'],
    socialLinks: [
      { platform: 'website', url: 'https://refikanadol.com/', label: 'Artist Website' },
      { platform: 'website', url: 'https://refikanadolstudio.com/', label: 'Studio Portfolio' },
      { platform: 'instagram', url: 'https://www.instagram.com/refikanadol/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/refikanadol', label: 'X / Twitter' }
    ],
    featuredWorks: [
      {
        id: 'ra-work-1',
        title: 'Unsupervised — Machine Hallucinations (MoMA)',
        year: '2022–2023',
        description: 'Groundbreaking generative AI installation in the Museum of Modern Art Gund Lobby, continuously reimagining 200 years of modern art.',
        contentType: 'Installation',
        documentedTech: 'Custom StyleGAN2 model trained on 384,000 photographic and digital records of MoMA collection',
        tools: ['Custom ML Models', 'StyleGAN2', 'CUDA'],
        externalUrl: 'https://refikanadol.com/works/unsupervised/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'The Museum of Modern Art / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-2',
        title: 'Living Architecture: Casa Batlló',
        year: '2022',
        description: 'Dynamic neural audiovisual projection mapping on Antoni Gaudí’s architectural facade in Barcelona, changing with real-time climatic data.',
        contentType: 'Generative Art',
        documentedTech: 'Real-time Barcelona weather and environmental sensor inputs driving latent generative diffusion shaders',
        tools: ['Custom ML Models', 'TouchDesigner'],
        externalUrl: 'https://refikanadolstudio.com/projects/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Casa Batlló / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-3',
        title: 'WDCH Dreams (Walt Disney Concert Hall)',
        year: '2018',
        description: 'Centennial projection mapping project transforming Frank Gehry’s stainless steel curves into a dreaming memory palace of 45,000 hours of LA Phil musical recordings.',
        contentType: 'Installation',
        documentedTech: 'Machine learning audio feature extraction combined with generative point cloud simulations',
        tools: ['Custom ML Models', 'CUDA'],
        externalUrl: 'https://refikanadol.com/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Los Angeles Philharmonic / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Installation Design'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'Digital Art'],
      styles: ['Abstract', 'Monumental']
    }
  },

  // ----------------------------------------------------------------------------
  // 3. NICEAUNTIES / WENHUI LIM
  // ----------------------------------------------------------------------------
  {
    id: 'ref-niceaunties',
    slug: 'niceaunties',
    name: 'niceaunties (Wenhui Lim)',
    handle: '@niceaunties',
    location: 'Singapore',
    specialization: 'Surreal AI Visual Storytelling & World-Building',
    headline: 'Architect & AI World-Builder, Creator of the Auntieverse',
    bioSummary: 'Architect turned AI surrealist world-builder, celebrated for the Auntieverse—a vibrant matriarchal fantasy ecosystem exploring aging, care, food culture, and multi-generational Asian domestic life.',
    fullBio: 'Wenhui Lim, practicing under the moniker niceaunties, is an award-winning Singaporean architect and digital artist whose work has captured international acclaim. Drawing inspiration from Asian maternal and elder domestic rituals, Lim created the "Auntieverse"—a colorful, surreal realm where endearing matriarchs engage with oversized pastries, mechanical appliances, and whimsical architecture. Her practice bridges Midjourney prompting precision with temporal animation and physical installations.',
    officialWebsite: 'https://www.niceaunties.com/',
    portfolioUrl: 'https://www.niceaunties.com/portfolio',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented on official artist website (niceaunties.com) and international exhibition catalogs.',
    documentedTools: ['Midjourney', 'Runway', 'Motion Tracking', 'Stable Diffusion', 'Photoshop'],
    contentTypes: ['Generative Art', 'AI Animation', 'Installation'],
    creativeStyles: ['Surreal', 'Vibrant', 'Whimsical', 'Narrative-Rich'],
    socialLinks: [
      { platform: 'website', url: 'https://www.niceaunties.com/', label: 'Official Website' },
      { platform: 'instagram', url: 'https://www.instagram.com/niceaunties/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/niceaunties', label: 'X / Twitter' }
    ],
    featuredWorks: [
      {
        id: 'na-work-1',
        title: 'The Auntieverse',
        year: '2023–2024',
        description: 'Ongoing visual universe exploring aging, family roles, and Southeast Asian maternal culture through hyper-detailed culinary and fashion environments.',
        contentType: 'Generative Art',
        documentedTech: 'Midjourney prompt craft + Stable Diffusion detail refinement + motion mapping',
        tools: ['Midjourney', 'Stable Diffusion'],
        externalUrl: 'https://www.niceaunties.com/projects',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'niceaunties (Wenhui Lim)',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-2',
        title: 'Mirror Into Auntieverse',
        year: '2024',
        description: 'Interactive installation combining surreal generative portraiture with live participant interaction and digital tapestry.',
        contentType: 'Installation',
        documentedTech: 'Generative diffusion pipelines integrated with interactive physical sensor displays',
        tools: ['Midjourney', 'Runway'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'niceaunties (Wenhui Lim)',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-3',
        title: 'Aunties In Dis Place',
        year: '2023',
        description: 'Narrative series set in speculative domestic spaces where elder women navigate architectural labyrinths of noodles, dim sum, and textiles.',
        contentType: 'Generative Art',
        documentedTech: 'Complex multi-prompt architectural framing and character coherence',
        tools: ['Midjourney', 'Photoshop'],
        externalUrl: 'https://www.niceaunties.com/projects',
        aspectRatio: '4:5',
        mediaType: 'image',
        attribution: 'niceaunties (Wenhui Lim)',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Visual Storytelling', 'Generative Art'],
      tools: ['Midjourney', 'Runway'],
      contentTypes: ['AI Animation', 'Digital Art'],
      styles: ['Surreal', 'Playful']
    }
  },

  // ----------------------------------------------------------------------------
  // 4. CLAIRE SILVER
  // ----------------------------------------------------------------------------
  {
    id: 'ref-claire-silver',
    slug: 'claire-silver',
    name: 'Claire Silver',
    handle: '@ClaireSilver12',
    location: 'USA',
    specialization: 'AI-Collaborative Digital Art & Haute Couture',
    headline: 'Pioneering Anonymous AI Collaborative Artist & Fashion Innovator',
    bioSummary: 'Pioneering anonymous AI collaborative artist exploring the human condition, vulnerability, and generative fashion through human-in-the-loop aesthetics and historic partnerships with Christie’s and Gucci.',
    fullBio: 'Claire Silver is an anonymous digital artist considered one of the defining pioneers of AI-collaborative artwork. Guided by the motto "Taste is the new skill", her practice focuses on human-in-the-loop aesthetics, combining classical painterly sensibilities with deep learning models. Her work has been exhibited at Christie’s London, Sotheby’s, SuperRare, and featured in a landmark collaboration with Gucci and Emi Kusano, bridging computational art with luxury fashion.',
    officialWebsite: 'https://www.clairesilver.com/',
    portfolioUrl: 'https://www.clairesilver.com/collections',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented on official website (clairesilver.com) and institutional auctions (Christie’s, Sotheby’s).',
    documentedTools: ['Midjourney', 'DALL·E 2', 'Stable Diffusion', 'Artbreeder', 'Photoshop'],
    contentTypes: ['Generative Art', 'Digital Art', 'Commercial VFX'],
    creativeStyles: ['Classical-Modern', 'Surreal', 'Editorial', 'Emotional'],
    socialLinks: [
      { platform: 'website', url: 'https://www.clairesilver.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/ClaireSilver12', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/clairesilver_art/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'cs-work-1',
        title: 'AI Art is Not Art',
        year: '2022',
        description: 'Seminal genesis collection juxtaposing classical oil painting textures with modern latent diffusion motifs and self-referential poetic titles.',
        contentType: 'Generative Art',
        documentedTech: 'Multi-model collage: Artbreeder latent seeds, Midjourney synthesis, Photoshop finishing',
        tools: ['Artbreeder', 'Midjourney', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Claire Silver',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-2',
        title: 'corpo | real',
        year: '2023',
        description: 'Generative digital couture collection exploring physical textiles, bodily vulnerability, and speculative wearable AI garment architecture.',
        contentType: 'Generative Art',
        documentedTech: 'Stable Diffusion checkpoint fine-tuning on historic fashion archives + digital drape mapping',
        tools: ['Stable Diffusion'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '4:5',
        mediaType: 'image',
        attribution: 'Claire Silver',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-3',
        title: 'Claire Silver x Emi Kusano for Gucci (Vault)',
        year: '2023',
        description: 'Historic collaboration with Gucci and artist Emi Kusano, reimagining heritage luxury patterns through generative anime-inspired digital couture.',
        contentType: 'Commercial VFX',
        documentedTech: 'Collaborative dual-model generative workflow combining runway patterns and anime line work',
        tools: ['Midjourney', 'Stable Diffusion'],
        externalUrl: 'https://www.clairesilver.com/gucci',
        aspectRatio: '16:9',
        mediaType: 'image',
        attribution: 'Gucci Art Vault / Claire Silver / Emi Kusano',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Digital Art'],
      tools: ['Midjourney', 'Stable Diffusion'],
      contentTypes: ['Digital Art', 'Generative Art'],
      styles: ['Luxury', 'Surreal']
    }
  },

  // ----------------------------------------------------------------------------
  // 5. ROOPE RAINISTO
  // ----------------------------------------------------------------------------
  {
    id: 'ref-roope-rainisto',
    slug: 'roope-rainisto',
    name: 'Roope Rainisto',
    handle: '@rooperainisto',
    location: 'Helsinki, Finland',
    specialization: 'AI Post-Photography & Conceptual Image Series',
    headline: 'Pioneer of AI Post-Photography & Synthetic Realism',
    bioSummary: 'Finnish designer, photographer, and artist considered the foremost pioneer of post-photography, training custom diffusion models on unique analog film stocks and mid-century Americana.',
    fullBio: 'Roope Rainisto is a Finnish artist and designer with decades of experience in user experience and digital imagery. He pioneered the genre of "post-photography"—photographic works that never occurred in the physical world but bear the hallmarks of genuine celluloid light, emulsion flaws, and candid human timing. His breakthrough series "Life in West America" set records in the digital art world and is celebrated for its deep emotional resonance and visual authenticity.',
    officialWebsite: 'https://www.rooperainisto.com/',
    portfolioUrl: 'https://www.rooperainisto.com/collections',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Known for "Life in West America" and featured in major photographic art publications.',
    documentedTools: ['DreamBooth', 'Custom Diffusion Checkpoints', 'Inpainting', 'Topaz Gigapixel', 'Photoshop'],
    contentTypes: ['AI Photography', 'Generative Art'],
    creativeStyles: ['Post-Photographic', 'Cinematic', 'Americana', 'Analog Film Grain'],
    socialLinks: [
      { platform: 'website', url: 'https://www.rooperainisto.com/', label: 'Official Website' },
      { platform: 'website', url: 'https://lifeinwestamerica.com/', label: 'Life in West America' },
      { platform: 'x', url: 'https://x.com/rooperainisto', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/rooperainisto/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'rr-work-1',
        title: 'Life in West America',
        year: '2023',
        description: 'Landmark post-photography series depicting an evocative, bittersweet mid-century American road trip that never happened, rendered with stunning film realism.',
        contentType: 'AI Photography',
        documentedTech: 'Custom DreamBooth checkpoint trained on vintage photographic film stocks with multi-pass inpainting',
        tools: ['DreamBooth', 'Custom Diffusion Checkpoints', 'Inpainting'],
        externalUrl: 'https://lifeinwestamerica.com/',
        aspectRatio: '3:2',
        mediaType: 'image',
        attribution: 'Roope Rainisto',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'rr-work-2',
        title: 'REWORLD',
        year: '2023',
        description: 'Post-photographic journey exploring alternate metropolitan narratives, memory degradation, and human emotion in synthetic urban landscapes.',
        contentType: 'AI Photography',
        documentedTech: 'High-resolution diffusion synthesis with manual digital camera artifacts and grain matching',
        tools: ['Custom Diffusion Checkpoints', 'Photoshop'],
        externalUrl: 'https://www.rooperainisto.com/collections',
        aspectRatio: '3:2',
        mediaType: 'image',
        attribution: 'Roope Rainisto',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['AI Photography', 'Digital Art'],
      tools: ['Custom AI Models'],
      contentTypes: ['AI Photography', 'Digital Art'],
      styles: ['Cinematic', 'Photorealistic']
    }
  },

  // ----------------------------------------------------------------------------
  // 6. SASHA STILES
  // ----------------------------------------------------------------------------
  {
    id: 'ref-sasha-stiles',
    slug: 'sasha-stiles',
    name: 'Sasha Stiles',
    handle: '@sashastiles',
    location: 'New York, USA',
    specialization: 'AI Poetry, Generative Typography & Computational Media',
    headline: 'Poet, Artist & AI Researcher, Co-Founder of the B{R}EATH Collective',
    bioSummary: 'First generation AI poet, artist, and researcher exploring human-machine poetics, computational language models, and transhumanist literary archives.',
    fullBio: 'Sasha Stiles is an internationally acclaimed poet, artist, and AI researcher who bridges literature and machine intelligence. Working alongside custom AI alter-ego models like Technelegy, Stiles investigates how language evolves when co-created by algorithms. Her poetry collections and generative visual installations have been auctioned at Christie’s, exhibited at MoMA and Art Basel, and archived by Gucci.',
    officialWebsite: 'https://www.sashastiles.com/',
    portfolioUrl: 'https://www.sashastiles.com/projects',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Featured by Christie’s, MoMA, and the Forward Arts Foundation.',
    documentedTools: ['Custom LLMs', 'GPT Fine-tunes', 'Generative Typography', 'TouchDesigner', 'Python'],
    contentTypes: ['Digital Poetry', 'Generative Art', 'Installation'],
    creativeStyles: ['Typographic', 'Literary', 'Conceptual', 'Reflective'],
    socialLinks: [
      { platform: 'website', url: 'https://www.sashastiles.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/sashastiles', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/sashastiles/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'ss-work-1',
        title: 'Technelegy',
        year: '2022',
        description: 'Groundbreaking book and computational poetry series written in continuous dialogue between Stiles and custom-trained language models.',
        contentType: 'Digital Poetry',
        documentedTech: 'Fine-tuned language models on personal verse archives + generative video typography',
        tools: ['Custom LLMs', 'GPT Fine-tunes'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '1:1',
        mediaType: 'text',
        attribution: 'Sasha Stiles',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-2',
        title: 'REPETAE: Again, Again (Gucci Art Vault)',
        year: '2023',
        description: 'Audiovisual generative poetry installation featured as part of Gucci’s permanent digital art archive, interrogating algorithmic repetition.',
        contentType: 'Installation',
        documentedTech: 'Neural text synthesis synchronized to dynamic typographical animation shaders',
        tools: ['Custom LLMs', 'TouchDesigner'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Gucci Art Vault / Sasha Stiles',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-3',
        title: 'Cursive Binary',
        year: '2023',
        description: 'Exploration of handwritten cursive script transcribed into binary machine code and reimagined via generative neural rendering.',
        contentType: 'Generative Art',
        documentedTech: 'Custom handwriting datasets processed through latent space visual transformers',
        tools: ['Custom LLMs', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '4:5',
        mediaType: 'image',
        attribution: 'Sasha Stiles',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Creative Direction', 'Typography'],
      tools: ['Custom AI Models'],
      contentTypes: ['Digital Art', 'Generative Art'],
      styles: ['Minimalist', 'Conceptual']
    }
  },

  // ----------------------------------------------------------------------------
  // 7. KRIS KASHTANOVA
  // ----------------------------------------------------------------------------
  {
    id: 'ref-kris-kashtanova',
    slug: 'kris-kashtanova',
    name: 'Kris Kashtanova',
    handle: '@icreatelife',
    location: 'New York, USA',
    specialization: 'AI Illustration, Comics & Generative Motion',
    headline: 'Pioneering AI Storyteller, Comic Creator & Educator',
    bioSummary: 'AI artist, educator, and researcher known for creating the first US Copyright Office-reviewed AI-illustrated graphic novel Zarya of the Dawn and pioneering generative motion experiments.',
    fullBio: 'Kris Kashtanova is an AI artist and educator whose work sparked historic legal and cultural discussions surrounding artificial intelligence and copyright law. Their graphic novel "Zarya of the Dawn" achieved international notoriety during its review by the United States Copyright Office, establishing foundational benchmarks for human authorship in generative workflows. Kashtanova teaches ethical AI production and creates motion narratives using Runway Gen-2 and Midjourney.',
    officialWebsite: 'https://www.kris.art/',
    portfolioUrl: 'https://www.kris.art/portfolio-2',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Creator of "Zarya of the Dawn" and recognized AI educator.',
    documentedTools: ['Midjourney', 'Stable Diffusion', 'Runway Gen-2', 'Kaiber', 'Photoshop', 'Comic Life 3'],
    contentTypes: ['Comic Novel', 'AI Video', 'Generative Art'],
    creativeStyles: ['Graphic Novel', 'Cinematic', 'Fantasy', 'Vibrant'],
    socialLinks: [
      { platform: 'website', url: 'https://www.kris.art/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/icreatelife', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/kris.kashtanova/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'kk-work-1',
        title: 'Zarya of the Dawn',
        year: '2022',
        description: 'First graphic novel illustrated with Midjourney, recognized for setting legal precedent regarding human curation and text-to-image synthesis.',
        contentType: 'Comic Novel',
        documentedTech: 'Midjourney prompt craft + manual digital layout, ink lettering and panel compositing',
        tools: ['Midjourney', 'Photoshop', 'Comic Life 3'],
        externalUrl: 'https://www.kris.art/portfolio-2/project-one-ephnc-jamy8',
        aspectRatio: '3:4',
        mediaType: 'image',
        attribution: 'Kris Kashtanova',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-2',
        title: 'Rose Enigma',
        year: '2023',
        description: 'Intricate visual artwork exploring human creative intervention, combining hand-painted references with generative diffusion upscaling.',
        contentType: 'Generative Art',
        documentedTech: 'Stable Diffusion inpainting + manual digital brushwork',
        tools: ['Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.kris.art/portfolio-2/rose-enigma',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Kris Kashtanova',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-3',
        title: 'AI Burning Man Video (Runway Gen-2)',
        year: '2023',
        description: 'Surreal cinematic short video depicting ethereal desert dust sculptures and kinetic fire dancers generated via Runway Gen-2 neural video synthesis.',
        contentType: 'AI Video',
        documentedTech: 'Runway Gen-2 text-to-video and image-to-video temporal consistency pipelines',
        tools: ['Runway Gen-2', 'Kaiber'],
        externalUrl: 'https://www.kris.art/portfolio-2/ai-burning-man-gen2-runwayml',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Kris Kashtanova using Runway Gen-2',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Illustration', 'AI Filmmaking'],
      tools: ['Midjourney', 'Runway Gen-2', 'Stable Diffusion'],
      contentTypes: ['AI Video', 'Digital Art'],
      styles: ['Cinematic', 'Experimental']
    }
  },

  // ----------------------------------------------------------------------------
  // 8. ANNA RIDLER
  // ----------------------------------------------------------------------------
  {
    id: 'ref-anna-ridler',
    slug: 'anna-ridler',
    name: 'Anna Ridler',
    handle: '@annaridler',
    location: 'London, United Kingdom',
    specialization: 'Machine-Learning Art & Hand-Curated Datasets',
    headline: 'Artist & Researcher Investigating Data Systems, Bias & Natural Cycles',
    bioSummary: 'British artist and researcher exploring data collection, human labor, and GANs through labor-intensive physical-to-digital botanical datasets exhibited at the V&A and Barbican.',
    fullBio: 'Anna Ridler is a London-based artist and researcher who works with systems of knowledge and how technologies like machine learning reshape natural phenomena. Rather than using off-the-shelf generative models, Ridler manually photographs, categorizes, and labels tens of thousands of natural specimens—such as Dutch tulips—to train custom generative adversarial networks (GANs). Her work has been shown at the Victoria and Albert Museum, the Barbican Centre, and the Centre Pompidou.',
    officialWebsite: 'https://annaridler.com/',
    portfolioUrl: 'https://annaridler.com/works',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171ddc9551a?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Exhibited at the V&A, Barbican Centre, and Ars Electronica.',
    documentedTools: ['Custom GANs', 'Hand-Curated Datasets', 'Python', 'PyTorch', 'Computer Vision'],
    contentTypes: ['AI Video', 'Generative Art', 'Installation'],
    creativeStyles: ['Botanical', 'Conceptual', 'Historical', 'Labor-Intensive'],
    socialLinks: [
      { platform: 'website', url: 'https://annaridler.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/annaridler', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/annaridler/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'ar-work-1',
        title: 'Mosaic Virus',
        year: '2019',
        description: 'Generative video installation where blooming tulips evolve in real time based on the volatile price fluctuations of Bitcoin, drawing parallels to Dutch Tulip Mania.',
        contentType: 'AI Video',
        documentedTech: 'Custom GAN trained on 10,000 hand-photographed Dutch tulips linked to cryptocurrency API triggers',
        tools: ['Custom GANs', 'PyTorch', 'Python'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Anna Ridler / Commissioned by Impakt Festival',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-2',
        title: 'Myriad (Tulips)',
        year: '2018',
        description: 'Physical museum wall installation featuring 10,000 individual photographs of tulips hand-classified by color, stripe, and bloom stage.',
        contentType: 'Installation',
        documentedTech: 'Physical classification training archive highlighting human dataset preparation labor',
        tools: ['Hand-Curated Datasets'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '16:9',
        mediaType: 'image',
        attribution: 'Anna Ridler',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-3',
        title: 'Bloemenveiling',
        year: '2019',
        description: 'Auction-based algorithmic film work deploying smart contracts and short-lived generative blooms that decay if unpurchased.',
        contentType: 'Generative Art',
        documentedTech: 'GAN generation coupled with distributed ledger contracts',
        tools: ['Custom GANs', 'Python'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '1:1',
        mediaType: 'interactive',
        attribution: 'Anna Ridler',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Installation Design'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'AI Video'],
      styles: ['Minimalist', 'Historical']
    }
  },

  // ----------------------------------------------------------------------------
  // 9. SOUGWEN CHUNG
  // ----------------------------------------------------------------------------
  {
    id: 'ref-sougwen-chung',
    slug: 'sougwen-chung',
    name: 'Sougwen Chung',
    handle: '@sougwen',
    location: 'London & New York',
    specialization: 'Human–Robot Collaboration & Biosensor Drawing',
    headline: 'Artist-Researcher, Director of SCILICET Studio & MIT Media Lab Fellow',
    bioSummary: 'Former MIT Media Lab fellow pioneering co-creation between the human hand and robotic drawing arms guided by neural networks, biosensors, and kinetic memory.',
    fullBio: 'Sougwen Chung is a Chinese-Canadian artist and researcher based in London and New York. Founder of studio SCILICET and former research fellow at MIT Media Lab, Chung investigates mark-making by hand alongside custom robotic assistants named D.O.U.G. (Drawing Operations Unit Generation). Her systems learn from her biometric data, brainwaves, and historic stroke archives to collaborate in real time on sprawling canvas installations.',
    officialWebsite: 'https://sougwen.com/',
    portfolioUrl: 'https://sougwen.com/archive',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Exhibited worldwide at National Art Center Tokyo and MIT.',
    documentedTools: ['D.O.U.G. Robotic Arm', 'Recurrent Neural Networks', 'EEG Sensors', 'Custom C++', 'OpenFrameworks'],
    contentTypes: ['Installation', 'Generative Art', 'AI Video'],
    creativeStyles: ['Gestural', 'Organic', 'Kinetic', 'Robotic-Human'],
    socialLinks: [
      { platform: 'website', url: 'https://sougwen.com/', label: 'Official Website' },
      { platform: 'vimeo', url: 'https://vimeo.com/sougwen', label: 'Vimeo Channel' },
      { platform: 'x', url: 'https://x.com/sougwen', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/sougwen/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'sc-work-1',
        title: 'Drawing Operations Unit Generation 2 (MEMORY)',
        year: '2017–2019',
        description: 'Robotic drawing apparatus mimicking and responding to the artist’s live brushstrokes using recurrent neural networks trained on two decades of drawings.',
        contentType: 'Installation',
        documentedTech: 'Recurrent Neural Network (RNN) gesture prediction + dual 6-axis robotic arm controller',
        tools: ['D.O.U.G. Robotic Arm', 'Recurrent Neural Networks', 'Custom C++'],
        externalUrl: 'https://sougwen.com/work/memory-drawing-operations',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sougwen Chung / SCILICET Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-2',
        title: 'MIMICRY — Drawing Operations',
        year: '2015',
        description: 'Genesis collaboration between artist and computer vision robotic arm following real-time human pen strokes on paper.',
        contentType: 'Generative Art',
        documentedTech: 'Real-time overhead camera tracking and synchronized stepper-motor arm',
        tools: ['D.O.U.G. Robotic Arm', 'OpenFrameworks'],
        externalUrl: 'https://sougwen.com/work/mimicry-drawing-operations',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sougwen Chung',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-3',
        title: 'Assembly Lines',
        year: '2022',
        description: 'Kinetic meditation featuring multiple robotic arms drawing in unison with the artist, driven by live biometric EEG and respiratory monitors.',
        contentType: 'Installation',
        documentedTech: 'Multi-agent neural control system reacting to human autonomic nervous system signals',
        tools: ['EEG Sensors', 'D.O.U.G. Robotic Arm'],
        externalUrl: 'https://sougwen.com/archive',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Sougwen Chung',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Visual Storytelling'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'Digital Art'],
      styles: ['Organic', 'Minimalist']
    }
  },

  // ----------------------------------------------------------------------------
  // 10. KAREN X. CHENG
  // ----------------------------------------------------------------------------
  {
    id: 'ref-karen-x-cheng',
    slug: 'karen-x-cheng',
    name: 'Karen X. Cheng',
    handle: '@karenxcheng',
    location: 'San Francisco, California, USA',
    specialization: 'Creative Direction, AI Advertising & Viral Filmmaking',
    headline: 'Creative Director & Founder of Karen X Studio',
    bioSummary: 'Award-winning creative director and visual effects pioneer producing viral commercial campaigns for HP, Beats, PUMA, and LEGO with generative AI and optical illusion choreography.',
    fullBio: 'Karen X. Cheng is a world-renowned creative director, filmmaker, and founder of Karen X Studio in San Francisco. With over 500 million views across her commercial productions, Cheng is celebrated for inventing breakthrough visual techniques that fuse practical camera trickery with generative neural diffusion. She has led campaigns for Apple, Beats by Dre, LEGO, and HP, showing how generative AI can transform high-end brand advertising.',
    officialWebsite: 'https://www.karenx.com/',
    portfolioUrl: 'https://www.karenx.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Featured by Fast Company, Forbes 30 Under 30, and Adweek.',
    documentedTools: ['Stable Diffusion', 'Runway Gen-1/Gen-2', 'ControlNet', 'DALL·E', 'DaVinci Resolve', 'After Effects'],
    contentTypes: ['AI Video', 'Commercial VFX', 'Social Video'],
    creativeStyles: ['Commercial', 'Dynamic', 'Viral', 'Optical Illusion'],
    socialLinks: [
      { platform: 'website', url: 'https://www.karenx.com/', label: 'Official Website' },
      { platform: 'instagram', url: 'https://www.instagram.com/karenxcheng/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/karenxcheng', label: 'X / Twitter' },
      { platform: 'youtube', url: 'https://www.youtube.com/@karenxcheng', label: 'YouTube' }
    ],
    featuredWorks: [
      {
        id: 'kxc-work-1',
        title: 'HP — AI Fashion Reimagined',
        year: '2023',
        description: 'Breakthrough commercial film utilizing Stable Diffusion ControlNet to transform everyday street apparel into futuristic haute couture in real time.',
        contentType: 'Commercial VFX',
        documentedTech: 'ControlNet + Deforum + live-action motion tracking and frame interpolation',
        tools: ['ControlNet', 'Stable Diffusion', 'After Effects'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '9:16',
        mediaType: 'video',
        attribution: 'HP / Directed by Karen X. Cheng',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-2',
        title: 'Pass the Pencil (Creative Collaboration)',
        year: '2020–2022',
        description: 'Global viral animation chain project bringing together 50+ international visual creators to pass an animated pencil across distinct artistic worlds.',
        contentType: 'AI Video',
        documentedTech: 'Multi-creator workflow with continuous match-cut transitions',
        tools: ['After Effects', 'DaVinci Resolve'],
        externalUrl: 'https://www.karenx.com/pencil',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Directed by Karen X. Cheng',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-3',
        title: 'Commercial Campaign Portfolio (LEGO, PUMA)',
        year: '2022–2024',
        description: 'Viral social video campaigns integrating optical camera choreography, neural inpainting, and product motion dynamics.',
        contentType: 'Commercial VFX',
        documentedTech: 'Runway neural video tools blended with live physical props',
        tools: ['Runway Gen-2', 'DaVinci Resolve'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '9:16',
        mediaType: 'video',
        attribution: 'Karen X Studio',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Creative Direction', 'AI Filmmaking'],
      tools: ['Stable Diffusion', 'Runway Gen-2'],
      contentTypes: ['AI Video', 'Commercial VFX'],
      styles: ['Commercial', 'Cinematic']
    }
  }
];

export function getExternalCreatorBySlug(slug: string): ExternalCreatorReference | undefined {
  return EXTERNAL_CREATOR_REFERENCES.find(c => c.slug === slug);
}
