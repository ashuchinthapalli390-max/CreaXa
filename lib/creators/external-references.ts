// ==============================================================================
// CREAXA — 10 GENUINE AI CREATORS & EDITORIAL REFERENCE DIRECTORY
// ==============================================================================
// These are real artists and directors whose AI work is publicly documented.
// IMPORTANT LEGAL & PLATFORM INTEGRITY RULES:
// 1. These are external editorial reference profiles for discovery, benchmarking and tool research.
// 2. They are NOT registered CreaXa marketplace accounts.
// 3. No fake email addresses, Firebase UIDs, or marketplace rates are fabricated.
// 4. In-app invitations are disabled; visitors are directed to official portfolio URLs.
// ==============================================================================

export interface ExternalCreatorReference {
  id: string;
  slug: string;
  name: string;
  handle?: string;
  location?: string;
  specialization: string;
  bioSummary: string;
  officialWebsite: string;
  portfolioUrl: string;
  avatarUrl?: string;
  isExternalReference: true;
  attributionNote: string;
  documentedTools: string[];
  contentTypes: string[];
  creativeStyles: string[];
  featuredWorks: {
    title: string;
    year?: string;
    description: string;
    documentedTech: string;
    externalUrl: string;
    aspectRatio?: string;
  }[];
  filters: {
    specializations: string[];
    tools: string[];
    contentTypes: string[];
    styles: string[];
  };
}

export const EXTERNAL_CREATOR_REFERENCES: ExternalCreatorReference[] = [
  {
    id: 'ref-paul-trillo',
    slug: 'paul-trillo',
    name: 'Paul Trillo',
    location: 'Los Angeles, USA',
    specialization: 'AI Filmmaking & Experimental Direction',
    bioSummary: 'Director and multidisciplinary artist recognized for pioneering narrative AI filmmaking and technical experimentation across music videos and commercial films.',
    officialWebsite: 'https://paultrillo.com/',
    portfolioUrl: 'https://paultrillo.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented through official portfolio and verified press releases.',
    documentedTools: ['Sora', 'Runway Gen-2', 'Stable Diffusion', 'DALL·E 2', 'Automatic1111'],
    contentTypes: ['AI Video', 'Music Video', 'Experimental Film'],
    creativeStyles: ['Cinematic', 'Surreal', 'Experimental'],
    featuredWorks: [
      {
        title: 'Washed Out — The Hardest Part',
        year: '2024',
        description: 'First official music video produced using OpenAI Sora, tracking an infinite zoom through decades of human memory.',
        documentedTech: 'OpenAI Sora + post-production color grading',
        externalUrl: 'https://paultrillo.com/'
      },
      {
        title: 'Thank You For Not Answering',
        year: '2023',
        description: 'AI-generated experimental short film utilizing Runway Gen-2 neural video interpolation.',
        documentedTech: 'Runway Gen-2 + Stable Diffusion',
        externalUrl: 'https://paultrillo.com/'
      }
    ],
    filters: {
      specializations: ['AI Filmmaking', 'Creative Direction'],
      tools: ['Runway Gen-2', 'Stable Diffusion'],
      contentTypes: ['AI Video', 'Music Video'],
      styles: ['Cinematic', 'Experimental']
    }
  },
  {
    id: 'ref-refik-anadol',
    slug: 'refik-anadol',
    name: 'Refik Anadol',
    location: 'Los Angeles, USA',
    specialization: 'Machine-Learning Art & Architectural Data Installations',
    bioSummary: 'Media artist and director of Refik Anadol Studio, pioneering generative data environments, latent-space navigation, and architectural AI sculptures.',
    officialWebsite: 'https://refikanadol.com/',
    portfolioUrl: 'https://refikanadolstudio.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented through institutional museum exhibitions (MoMA, Casa Batlló).',
    documentedTools: ['StyleGAN2', 'Custom ML Models', 'Latent Space Tools', 'CUDA'],
    contentTypes: ['Generative Art', 'Interactive Installation', 'Architectural Visualization'],
    creativeStyles: ['Abstract', 'Monumental', 'Data-driven'],
    featuredWorks: [
      {
        title: 'Unsupervised — Machine Hallucinations (MoMA)',
        year: '2022',
        description: 'Generative AI artwork trained on 200 years of MoMA public collection data, running live in the Gund Lobby.',
        documentedTech: 'Custom StyleGAN2 architecture on 384,000 MoMA records',
        externalUrl: 'https://refikanadol.com/'
      },
      {
        title: 'Living Architecture: Casa Batlló',
        year: '2022',
        description: 'Dynamic neural audiovisual projection mapping on Antoni Gaudí’s architectural facade in Barcelona.',
        documentedTech: 'Real-time environmental sensor data + latent diffusion',
        externalUrl: 'https://refikanadol.com/'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Installation Design'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'Digital Art'],
      styles: ['Abstract', 'Futuristic']
    }
  },
  {
    id: 'ref-niceaunties',
    slug: 'niceaunties',
    name: 'niceaunties (Wenhui Lim)',
    location: 'Singapore',
    specialization: 'AI Visual Storytelling & Surreal World-Building',
    bioSummary: 'Architect turned AI surrealist world-builder, celebrated for the Auntieverse—a vibrant matriarchal fantasy ecosystem exploring aging, care, and food culture.',
    officialWebsite: 'https://www.niceaunties.com/',
    portfolioUrl: 'https://www.niceaunties.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Documented on official artist archive and international exhibitions.',
    documentedTools: ['Midjourney', 'Runway', 'Motion Tracking', 'Stable Diffusion'],
    contentTypes: ['Generative Art', 'AI Animation', 'Interactive Art'],
    creativeStyles: ['Surreal', 'Colorful', 'Whimsical'],
    featuredWorks: [
      {
        title: 'The Auntieverse',
        year: '2023–2024',
        description: 'Ongoing visual universe chronicling surreal Asian elder matriarchs in hyper-detailed culinary and fashion environments.',
        documentedTech: 'Diffusion imagery + frame-by-frame neural animation',
        externalUrl: 'https://www.niceaunties.com/'
      },
      {
        title: 'Mirror Into Auntieverse',
        year: '2024',
        description: 'Interactive exhibition installation combining generative portraits with real-time audience motion capture.',
        documentedTech: 'Neural image synthesis + real-time computer vision',
        externalUrl: 'https://www.niceaunties.com/'
      }
    ],
    filters: {
      specializations: ['Visual Storytelling', 'Generative Art'],
      tools: ['Midjourney', 'Runway Gen-3'],
      contentTypes: ['AI Animation', 'Digital Art'],
      styles: ['Surreal', 'Playful']
    }
  },
  {
    id: 'ref-claire-silver',
    slug: 'claire-silver',
    name: 'Claire Silver',
    location: 'USA',
    specialization: 'AI-Collaborative Digital Art & Haute Couture',
    bioSummary: 'Pioneering anonymous AI collaborative artist exploring the human condition, vulnerability, and generative fashion through human-in-the-loop aesthetics.',
    officialWebsite: 'https://www.clairesilver.com/',
    portfolioUrl: 'https://www.clairesilver.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Exhibited at Sotheby’s, Christie’s and SuperRare.',
    documentedTools: ['Midjourney', 'DALL·E 2', 'Stable Diffusion', 'Artbreeder', 'Photoshop'],
    contentTypes: ['Generative Art', 'Digital Art', 'Fashion Design'],
    creativeStyles: ['Classical-Modern', 'Surreal', 'Editorial'],
    featuredWorks: [
      {
        title: 'AI Art is Not Art',
        year: '2022',
        description: 'Influential solo collection juxtaposing classical oil painting aesthetics with modern latent diffusion motifs.',
        documentedTech: 'Multi-model collage: Artbreeder, Midjourney, Photoshop compositing',
        externalUrl: 'https://www.clairesilver.com/'
      },
      {
        title: 'corpo | real',
        year: '2023',
        description: 'Generative digital couture collection exploring bodily form, virtual textiles, and wearable AI design.',
        documentedTech: 'Stable Diffusion + custom aesthetic fine-tunes',
        externalUrl: 'https://www.clairesilver.com/'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Digital Art'],
      tools: ['Midjourney', 'Stable Diffusion'],
      contentTypes: ['Digital Art', 'Generative Art'],
      styles: ['Luxury', 'Surreal']
    }
  },
  {
    id: 'ref-roope-rainisto',
    slug: 'roope-rainisto',
    name: 'Roope Rainisto',
    location: 'Helsinki, Finland',
    specialization: 'AI Photography & Post-Photography',
    bioSummary: 'Finnish designer and artist considered one of the foremost pioneers of post-photography, training custom diffusion LoRAs on unique photographic film stocks.',
    officialWebsite: 'https://www.rooperainisto.com/',
    portfolioUrl: 'https://www.rooperainisto.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Known for the groundbreaking "Life in West America" series.',
    documentedTools: ['DreamBooth', 'Custom Diffusion Models', 'Inpainting', 'Upscaling'],
    contentTypes: ['AI Photography', 'Generative Art'],
    creativeStyles: ['Photorealistic', 'Cinematic', 'Americana'],
    featuredWorks: [
      {
        title: 'Life in West America',
        year: '2023',
        description: 'Celebrated 1-of-1 series depicting an imagined, evocative mid-century American landscape through synthetic film grain.',
        documentedTech: 'Custom-trained DreamBooth checkpoint + analog grading',
        externalUrl: 'https://lifeinwestamerica.com/'
      },
      {
        title: 'REWORLD',
        year: '2023',
        description: 'Post-photographic journey through alternate urban realities and subtle emotional narrative scenes.',
        documentedTech: 'Multi-pass inpainting with custom checkpoint weights',
        externalUrl: 'https://www.rooperainisto.com/'
      }
    ],
    filters: {
      specializations: ['AI Photography', 'Digital Art'],
      tools: ['Custom AI Models'],
      contentTypes: ['AI Photography', 'Digital Art'],
      styles: ['Cinematic', 'Photorealistic']
    }
  },
  {
    id: 'ref-sasha-stiles',
    slug: 'sasha-stiles',
    name: 'Sasha Stiles',
    location: 'New York, USA',
    specialization: 'AI Poetry, Generative Typography & Computational Media',
    bioSummary: 'Poet, artist, and AI researcher co-founder of the B{R}EATH collective, exploring human-machine poetics and language modeling.',
    officialWebsite: 'https://www.sashastiles.com/',
    portfolioUrl: 'https://www.sashastiles.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Featured by Christie’s, MoMA and Gucci Art Vault.',
    documentedTools: ['Custom LLMs', 'GPT Fine-tunes', 'Generative Typography', 'TouchDesigner'],
    contentTypes: ['Generative Text', 'Multimedia', 'Visual Poetry'],
    creativeStyles: ['Typographic', 'Conceptual', 'Literary'],
    featuredWorks: [
      {
        title: 'Technelegy',
        year: '2022',
        description: 'Seminal book and computational poetry collection co-authored with custom AI language models.',
        documentedTech: 'Fine-tuned language models on personal verse archives',
        externalUrl: 'https://www.sashastiles.com/'
      },
      {
        title: 'REPETAE: Again, Again (Gucci Partnership)',
        year: '2023',
        description: 'Audiovisual generative poetry installation featured as part of Gucci’s permanent digital art archive.',
        documentedTech: 'Neural text synthesis + animated typographical video',
        externalUrl: 'https://www.sashastiles.com/'
      }
    ],
    filters: {
      specializations: ['Creative Direction', 'Typography'],
      tools: ['Custom AI Models'],
      contentTypes: ['Multimedia', 'Digital Art'],
      styles: ['Minimalist', 'Conceptual']
    }
  },
  {
    id: 'ref-kris-kashtanova',
    slug: 'kris-kashtanova',
    name: 'Kris Kashtanova',
    location: 'New York, USA',
    specialization: 'AI Illustration, Comics & Generative Motion',
    bioSummary: 'AI artist, educator and researcher known for creating the first registered AI-illustrated graphic novel and teaching ethical AI workflows.',
    officialWebsite: 'https://www.kris.art/',
    portfolioUrl: 'https://www.kris.art/portfolio-2',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Author of Zarya of the Dawn.',
    documentedTools: ['Midjourney', 'Stable Diffusion', 'Runway Gen-2', 'Kaiber', 'Comic Life 3'],
    contentTypes: ['AI Comics', 'Illustration', 'AI Video'],
    creativeStyles: ['Graphic Novel', 'Cinematic', 'Fantasy'],
    featuredWorks: [
      {
        title: 'Zarya of the Dawn',
        year: '2022',
        description: 'First graphic novel created using Midjourney text-to-image synthesis, setting legal precedents for AI human authorship.',
        documentedTech: 'Midjourney + digital ink lettering and layout',
        externalUrl: 'https://www.kris.art/portfolio-2'
      },
      {
        title: 'Rose Enigma',
        year: '2023',
        description: 'Exploration of human creative intervention, combining hand-painted references with generative diffusion upscaling.',
        documentedTech: 'Stable Diffusion inpainting + manual digital painting',
        externalUrl: 'https://www.kris.art/portfolio-2'
      }
    ],
    filters: {
      specializations: ['Illustration', 'AI Filmmaking'],
      tools: ['Midjourney', 'Runway Gen-2', 'Stable Diffusion'],
      contentTypes: ['AI Video', 'Digital Art'],
      styles: ['Cinematic', 'Experimental']
    }
  },
  {
    id: 'ref-anna-ridler',
    slug: 'anna-ridler',
    name: 'Anna Ridler',
    location: 'London, United Kingdom',
    specialization: 'Machine-Learning Art & Hand-Curated Datasets',
    bioSummary: 'British artist and researcher exploring data collection, human bias, and GANs through labor-intensive physical-to-digital botanical datasets.',
    officialWebsite: 'https://annaridler.com/',
    portfolioUrl: 'https://annaridler.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171ddc9551a?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Exhibited at the V&A, Barbican Centre and Ars Electronica.',
    documentedTools: ['Custom GANs', 'Hand-Curated Datasets', 'Python', 'PyTorch'],
    contentTypes: ['Generative Video', 'Conceptual Art', 'Installation'],
    creativeStyles: ['Botanical', 'Conceptual', 'Historical'],
    featuredWorks: [
      {
        title: 'Mosaic Virus',
        year: '2019',
        description: 'Generative video installation where blooming tulips evolve dynamically in real time according to Bitcoin market price movements.',
        documentedTech: 'Custom GAN architecture trained on 10,000 hand-photographed Dutch tulips',
        externalUrl: 'https://annaridler.com/'
      },
      {
        title: 'Myriad (Tulips)',
        year: '2018',
        description: 'Wall-scale physical archive of 10,000 individually classified and pinned tulip photographs used as a training dataset.',
        documentedTech: 'Physical classification archive + computer vision training set',
        externalUrl: 'https://annaridler.com/'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Installation Design'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'AI Video'],
      styles: ['Minimalist', 'Historical']
    }
  },
  {
    id: 'ref-sougwen-chung',
    slug: 'sougwen-chung',
    name: 'Sougwen Chung',
    location: 'London & New York',
    specialization: 'Human–Robot Collaboration & Sensor-Driven Art',
    bioSummary: 'Former MIT Media Lab fellow pioneering co-creation between the human hand and robotic drawing arms guided by neural networks and biosensors.',
    officialWebsite: 'https://sougwen.com/',
    portfolioUrl: 'https://sougwen.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Exhibited worldwide at National Art Center Tokyo and MIT.',
    documentedTools: ['D.O.U.G. Robotic Arm', 'Neural Networks', 'EEG Sensors', 'Custom C++'],
    contentTypes: ['Robotic Art', 'Performance Art', 'Generative Installation'],
    creativeStyles: ['Gestural', 'Organic', 'Kinetic'],
    featuredWorks: [
      {
        title: 'Drawing Operations Unit Generation 2 (MEMORY)',
        year: '2017–2019',
        description: 'Robotic drawing apparatus mimicking and responding to the artist’s live brushstrokes using recurrent neural networks.',
        documentedTech: 'Custom RNN model trained on 20 years of artist’s drawing archives',
        externalUrl: 'https://sougwen.com/'
      },
      {
        title: 'Assembly Lines',
        year: '2022',
        description: 'Multi-robotic meditation on kinetic manufacturing, drawing in real time alongside human respiratory rhythm sensors.',
        documentedTech: 'Biosensing hardware + multi-agent neural control system',
        externalUrl: 'https://sougwen.com/'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Visual Storytelling'],
      tools: ['Custom AI Models'],
      contentTypes: ['Generative Art', 'Digital Art'],
      styles: ['Organic', 'Minimalist']
    }
  },
  {
    id: 'ref-karen-x-cheng',
    slug: 'karen-x-cheng',
    name: 'Karen X. Cheng',
    location: 'San Francisco, USA',
    specialization: 'Creative Direction, AI Advertising & Viral Video',
    bioSummary: 'Award-winning creative director and visual effects pioneer creating breakthrough commercial campaigns for HP, Beats, and LEGO with generative AI.',
    officialWebsite: 'https://www.karenx.com/',
    portfolioUrl: 'https://www.karenx.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    isExternalReference: true,
    attributionNote: 'Public editorial reference. Featured by Fast Company and Forbes 30 Under 30.',
    documentedTools: ['Stable Diffusion', 'Runway Gen-1/Gen-2', 'DALL·E', 'DaVinci Resolve', 'After Effects'],
    contentTypes: ['Social Video', 'Commercial Advertising', 'Fashion Video'],
    creativeStyles: ['Commercial', 'Dynamic', 'Viral'],
    featuredWorks: [
      {
        title: 'HP — AI Fashion Reimagined',
        year: '2023',
        description: 'Commercial film production utilizing Stable Diffusion control maps to transform everyday apparel into haute couture.',
        documentedTech: 'ControlNet + Deforum + live-action motion tracking',
        externalUrl: 'https://www.karenx.com/'
      },
      {
        title: 'Commercial Campaign Portfolio (LEGO, PUMA)',
        year: '2022–2024',
        description: 'Viral social video campaigns integrating optical illusions, mirror moves, and neural inpainting.',
        documentedTech: 'Runway Gen-2 + compositing workflows',
        externalUrl: 'https://www.karenx.com/'
      }
    ],
    filters: {
      specializations: ['Creative Direction', 'AI Filmmaking'],
      tools: ['Stable Diffusion', 'Runway Gen-3'],
      contentTypes: ['AI Video', 'Social Content'],
      styles: ['Commercial', 'Cinematic']
    }
  }
];

export function getExternalCreatorBySlug(slug: string): ExternalCreatorReference | undefined {
  return EXTERNAL_CREATOR_REFERENCES.find(c => c.slug === slug);
}
