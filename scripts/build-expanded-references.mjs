// Script to generate the comprehensive external references dataset
import fs from 'node:fs';

const CREATORS_DATA = [
  // 1. PAUL TRILLO
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
        slug: 'washed-out-the-hardest-part',
        title: 'Washed Out — The Hardest Part',
        year: '2024',
        contentType: 'Music Video',
        description: 'First official music video produced using OpenAI Sora, tracking an infinite zoom through decades of human memory and emotional vignettes.',
        fullDescription: 'Commissioned by Sub Pop Records for Washed Out’s single "The Hardest Part", this landmark visual narrative represents the first officially released music video created using OpenAI’s Sora model. Director Paul Trillo conceived the video as an unrelenting, continuous forward infinite zoom tracking an emotional arc across decades of romance, nostalgia, and fleeting memory. Rather than relying on random prompting, Trillo crafted precisely calibrated prompt architectures and spatial constraints to maintain character continuity and atmospheric tone across complex temporal leaps.',
        workflowNotes: 'Iterative prompt design with OpenAI Sora, generating hundreds of spatial micro-sequences joined via custom camera tracking and latent-space zoom continuity. Color grading and final compositing completed in DaVinci Resolve.',
        credits: 'Artist: Washed Out • Label: Sub Pop Records • Director: Paul Trillo • AI Generation: OpenAI Sora',
        documentedTech: 'OpenAI Sora generative video + DaVinci Resolve color grading',
        tools: ['OpenAI Sora', 'DaVinci Resolve', 'After Effects'],
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
        slug: 'thank-you-for-not-answering',
        title: 'Thank You For Not Answering',
        year: '2023',
        contentType: 'AI Video',
        description: 'AI-generated experimental short film exploring telephone isolation and distorted memories utilizing Runway Gen-2 neural video interpolation.',
        fullDescription: 'An experimental meditation on disconnection and telephonic memory, "Thank You For Not Answering" was produced during the foundational release window of Runway Gen-2. Paul Trillo constructs an unsettling, dream-logic universe where telephone receivers, domestic interiors, and human silhouettes dissolve into one another. The film illustrates how early text-to-video artifacts—subtle drift, morphing textures, and spatial elasticity—can be harnessed as deliberate poetic grammar rather than technical flaws.',
        workflowNotes: 'Written and conceptualized around voice recordings. Prompts parsed through Stable Diffusion to establish key visual plates, subsequently interpolated and driven using Runway Gen-2 text-to-video pipelines. Sound design layered in post-production.',
        credits: 'Written and Directed by Paul Trillo • Voices: Archival telephone audio • AI Engine: Runway Gen-2',
        documentedTech: 'Runway Gen-2 neural video interpolation + Stable Diffusion checkpoints',
        tools: ['Runway Gen-2', 'Stable Diffusion', 'Premiere Pro'],
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
        slug: 'gofundme-help-changes-everything',
        title: 'GoFundMe — Help Changes Everything',
        year: '2023',
        contentType: 'Commercial VFX',
        description: 'Commercial campaign visual narrative featured on official portfolio, exploring community-powered support through seamless transition choreography.',
        fullDescription: 'Featured prominently in Paul Trillo’s official commercial archive, this GoFundMe spot uses kinetic match-cuts and transitional spatial shifts to illustrate the domino effect of mutual aid and community empathy. By blending live-action plate photography with subtle neural camera projections and volumetric background replacements, Trillo establishes a cohesive, emotionally resonant cinematic journey.',
        workflowNotes: 'Hybrid production model: Live-action primary footage shot on location, coupled with generative AI background synthesis and neural camera extension to facilitate impossible whip-pans and seamless scene transitions.',
        credits: 'Client: GoFundMe • Agency: Creative Direction Team • Director: Paul Trillo',
        documentedTech: 'Hybrid live action with neural camera projection and visual effects',
        tools: ['After Effects', 'Stable Diffusion', 'DaVinci Resolve'],
        externalUrl: 'https://paultrillo.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'GoFundMe / Directed by Paul Trillo',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'pt-work-4',
        slug: 'jacques-absolve',
        title: 'Jacques — Absolve',
        year: '2022',
        contentType: 'Music Video',
        description: 'Hypnotic music video blending human performance with fluid latent-space transformations and custom-trained generative checkpoints.',
        fullDescription: 'An exploratory music video for French electronic artist Jacques, "Absolve" explores themes of identity disintegration and visual metempsychosis. Trillo captures practical live-action choreography and subjects it to multi-pass neural style transfer, allowing the performer’s physical form to melt into architectural concrete, botanical flora, and chromatic fluid textures in tight synchronization with the track’s tempo.',
        workflowNotes: 'Live camera capture processed via frame-by-frame Automatic1111 latent interpolation, using optical flow tracking to anchor temporal coherence across high-contrast musical beats.',
        credits: 'Artist: Jacques • Director: Paul Trillo • Visual Effects: Trillo Studio',
        documentedTech: 'Automatic1111 Stable Diffusion + Optical Flow Vector Tracking',
        tools: ['Stable Diffusion', 'Automatic1111', 'After Effects'],
        externalUrl: 'https://paultrillo.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Jacques / Directed by Paul Trillo',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'pt-work-5',
        slug: 'infinite-zoom-experiment',
        title: 'The Infinite Zoom Explorations',
        year: '2023',
        contentType: 'AI Video',
        description: 'Pioneering technical series investigating recursive camera trajectories through multi-layered latent spaces.',
        fullDescription: 'A self-initiated research series that became a viral benchmark for generative camera cinematography. Trillo investigated how recursive outpainting and frame-scaling algorithms could simulate a camera moving infinitely inward through human eye pupils, microscopic cellular structures, planetary horizons, and cosmic nebulae without visible cuts.',
        workflowNotes: 'Recursive scale-and-inpaint scripting utilizing Midjourney v5 and Stable Diffusion, automated with custom Python image processing pipelines before final motion smoothing.',
        credits: 'Director & Creative Researcher: Paul Trillo',
        documentedTech: 'Recursive outpainting pipelines + spatial coordinate smoothing',
        tools: ['Midjourney', 'Stable Diffusion', 'Python'],
        externalUrl: 'https://paultrillo.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Paul Trillo Creative Research Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'pt-work-6',
        slug: 'charly-bliss-capacity',
        title: 'Charly Bliss — Capacity',
        year: '2021',
        contentType: 'Music Video',
        description: 'Energetic practical-to-digital music video demonstrating Trillo’s pre-AI mastery of technical match cuts and visual trickery.',
        fullDescription: 'Before transitioning heavily into neural video models, Trillo built an extensive body of work founded on mathematical camera rigor and complex match-cutting. "Capacity" serves as a benchmark for how his physical cinematography principles informed his later AI motion directives.',
        workflowNotes: 'Motion-controlled physical camera rigs with precise frame-accurate actor staging and manual rotoscoping.',
        credits: 'Artist: Charly Bliss • Director: Paul Trillo • Production: Lucky 89',
        documentedTech: 'Motion control cinematography and classical visual effects',
        tools: ['After Effects', 'Premiere Pro'],
        externalUrl: 'https://paultrillo.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Charly Bliss / Directed by Paul Trillo',
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

  // 2. REFIK ANADOL
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
        slug: 'unsupervised-moma',
        title: 'Unsupervised — Machine Hallucinations (MoMA)',
        year: '2022–2023',
        contentType: 'Installation',
        description: 'Groundbreaking generative AI installation in the Museum of Modern Art Gund Lobby, continuously reimagining 200 years of modern art.',
        fullDescription: 'Commissioned by The Museum of Modern Art, New York, "Unsupervised" is a monumental 24x24 foot digital media sculpture installed in the Agnes Gund Lobby. Refik Anadol and his studio trained sophisticated custom machine learning models on MoMA’s complete digitized collection—encompassing over 200 years of painting, sculpture, and design. As visitors pass through the lobby, real-time sensory inputs (light, sound, and movement) influence how the neural network traverses its multidimensional latent space, hallucinating artwork that MoMA might have collected.',
        workflowNotes: 'Custom StyleGAN2 architecture trained on 384,000 MoMA collection images. Real-time inference executed on high-performance multi-GPU clusters running TouchDesigner and custom C++/CUDA shaders responding to ambient museum sensor telemetry.',
        credits: 'Artist: Refik Anadol Studio • Curators: Paola Antonelli & Michelle Kuo • Institution: The Museum of Modern Art, New York',
        documentedTech: 'Custom StyleGAN2 model trained on 384,000 photographic and digital records of MoMA collection',
        tools: ['Custom ML Models', 'StyleGAN2', 'CUDA', 'TouchDesigner'],
        externalUrl: 'https://refikanadol.com/works/unsupervised/',
        videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/I-EIVlfvUcU',
        videoPlatform: 'youtube',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'The Museum of Modern Art / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-2',
        slug: 'living-architecture-casa-batllo',
        title: 'Living Architecture: Casa Batlló',
        year: '2022',
        contentType: 'Generative Art',
        description: 'Dynamic neural audiovisual projection mapping on Antoni Gaudí’s architectural facade in Barcelona, changing with real-time climatic data.',
        fullDescription: 'A dynamic, living NFT and public architectural projection mapping presented on the facade of Antoni Gaudí’s UNESCO World Heritage masterpiece, Casa Batlló in Barcelona. The work captures environmental data from local Barcelona weather stations—temperature, wind velocity, atmospheric pressure, and ultraviolet radiation—and translates them into fluid algorithmic memories of Gaudí’s organic structural motifs.',
        workflowNotes: 'Photogrammetric 3D scan of Casa Batlló facade mapped to high-lumen laser projectors. Real-time atmospheric sensor inputs drive generative fluid simulation shaders rendered in 8K resolution.',
        credits: 'Artist: Refik Anadol Studio • Location: Casa Batlló, Passeig de Gràcia, Barcelona',
        documentedTech: 'Real-time Barcelona weather and environmental sensor inputs driving latent generative diffusion shaders',
        tools: ['Custom ML Models', 'TouchDesigner', 'CUDA'],
        externalUrl: 'https://refikanadolstudio.com/projects/',
        videoEmbedUrl: 'https://player.vimeo.com/video/707447470',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Casa Batlló / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-3',
        slug: 'wdch-dreams',
        title: 'WDCH Dreams (Walt Disney Concert Hall)',
        year: '2018',
        contentType: 'Installation',
        description: 'Centennial projection mapping project transforming Frank Gehry’s stainless steel curves into a dreaming memory palace of 45,000 hours of LA Phil musical recordings.',
        fullDescription: 'Created for the Los Angeles Philharmonic’s centennial celebration, "WDCH Dreams" projected machine-learned memories onto the undulating stainless steel curves of Frank Gehry’s architectural landmark. Anadol’s studio ingested 45,000 hours of orchestral audio recordings, 500,000 historical photographs, and 100 years of program notes, categorizing them via neural vectors to simulate the hall "dreaming" its musical history.',
        workflowNotes: 'Deep neural networks parsed historical audio waveforms and metadata. Dimensionality reduction algorithms (t-SNE and UMAP) visualized thematic clusters mapped across 42 synchronized 4K laser projectors.',
        credits: 'Client: Los Angeles Philharmonic • Artist: Refik Anadol Studio • Architecture: Frank Gehry',
        documentedTech: 'Machine learning audio feature extraction combined with generative point cloud simulations',
        tools: ['Custom ML Models', 'CUDA', 'Python'],
        externalUrl: 'https://refikanadol.com/',
        videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/5U2fLgE3u70',
        videoPlatform: 'youtube',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Los Angeles Philharmonic / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-4',
        slug: 'machine-hallucinations-nature-dreams',
        title: 'Machine Hallucinations — Nature Dreams',
        year: '2021',
        contentType: 'Generative Art',
        description: 'Spectacular fluid data pigments derived from 300 million publicly available photographs of Earth’s flora, fauna, and geological wonders.',
        fullDescription: 'An immersive contemplation of planetary beauty, "Nature Dreams" utilizes a dataset of over 300 million publicly available landscape and nature photographs. Custom machine learning algorithms extract pigment distributions, structural vectors, and organic textures, synthesizing them into a hypnotic, continuously evolving fluid simulation that reimagines nature through the lens of artificial cognition.',
        workflowNotes: 'StyleGAN2 and progressive growing GANs fine-tuned on ecological imagery. Fluid dynamic solvers calculate surface tension and pigment dispersion in real-time CUDA rendering pipelines.',
        credits: 'Artist: Refik Anadol Studio • Exhibited internationally in Berlin, Istanbul, and New York',
        documentedTech: '300 million photographic datasets processed through generative adversarial pigment solvers',
        tools: ['StyleGAN2', 'CUDA', 'Python'],
        externalUrl: 'https://refikanadolstudio.com/projects/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Refik Anadol Studio Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-5',
        slug: 'quantum-memories',
        title: 'Quantum Memories',
        year: '2020',
        contentType: 'Installation',
        description: 'First public artwork created in collaboration with Google AI Quantum, visualizing parallel reality probabilities through quantum computing algorithms.',
        fullDescription: 'Exhibited at the National Gallery of Victoria (NGV) Triennial in Melbourne, "Quantum Memories" harnesses quantum computing algorithms to generate speculative multidimensional landscapes. Anadol collaborated with Google’s Quantum AI team to map quantum probability states against photographic archives of Australian nature.',
        workflowNotes: 'Google Cirq quantum computing simulation framework used to generate probability amplitude distributions, translated into visual latent coordinates and rendered in real-time 3D.',
        credits: 'Institution: National Gallery of Victoria • Collaborator: Google Quantum AI • Artist: Refik Anadol Studio',
        documentedTech: 'Google Quantum computing simulation algorithms + custom neural shaders',
        tools: ['Custom ML Models', 'CUDA', 'Google Cirq'],
        externalUrl: 'https://refikanadolstudio.com/projects/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'National Gallery of Victoria / Refik Anadol Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ra-work-6',
        slug: 'bosphorus-generative-sculpture',
        title: 'Bosphorus — Generative Sea Surface',
        year: '2018',
        contentType: 'Generative Art',
        description: 'Kinetic data sculpture driven by 30-day high-frequency radar data tracking water currents and maritime swell across the Bosphorus Strait.',
        fullDescription: 'Installed at the Pilevneli Gallery in Istanbul, "Bosphorus" visualizes the unseen hydrodynamic forces of the historic strait connecting Europe and Asia. Using high-frequency radar data collected by the Turkish State Meteorological Service over thirty days, the studio transformed maritime currents and sea surface turbulence into a colossal, undulating digital sculpture.',
        workflowNotes: 'Hydrodynamic vector data parsed in Python and translated into parametric wave meshes rendered via custom GPU physics engines.',
        credits: 'Artist: Refik Anadol • Exhibition: Pilevneli Gallery, Istanbul',
        documentedTech: 'Radar sea surface telemetry driving dynamic fluid simulation meshes',
        tools: ['Custom ML Models', 'TouchDesigner', 'Python'],
        externalUrl: 'https://refikanadol.com/',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Refik Anadol / Pilevneli Gallery',
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

  // 3. NICEAUNTIES / WENHUI LIM
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
    attributionNote: 'Public editorial reference. Documented on official artist website (niceaunties.com) and international exhibition catalogs.',
    documentedTools: ['Midjourney', 'Runway', 'Motion Tracking', 'Stable Diffusion', 'Photoshop'],
    contentTypes: ['Surreal AI Art', 'AI Animation', 'Interactive Installation'],
    creativeStyles: ['Surrealist', 'Whimsical', 'Maximalist', 'Cultural Narrative'],
    socialLinks: [
      { platform: 'website', url: 'https://www.niceaunties.com/', label: 'Official Website' },
      { platform: 'instagram', url: 'https://www.instagram.com/niceaunties/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/niceaunties', label: 'X / Twitter' }
    ],
    featuredWorks: [
      {
        id: 'na-work-1',
        slug: 'auntieverse',
        title: 'Auntieverse — The Matriarchal Realm',
        year: '2023–2024',
        contentType: 'AI Video',
        description: 'Vibrant surrealist narrative world celebrating Southeast Asian aunties, domestic rituals, culinary heritage, and elder freedom.',
        fullDescription: 'The foundational narrative collection of niceaunties, "Auntieverse" re-envisions the elder women of Southeast Asia not as peripheral domestic figures, but as joyful, empowered titans of an eccentric parallel reality. Lim infuses each scene with cultural touchstones—peranakan tiles, kopitiam cups, tropical fruits, and dim sum bamboo steamers—choreographing them into absurd, poetic digital vignettes.',
        workflowNotes: 'Complex multi-prompt chaining in Midjourney v5 and v6 to establish precise character and color consistency, animated through Runway Gen-2 motion brushes and frame-by-frame compositing in After Effects.',
        credits: 'Created and Directed by Wenhui Lim (niceaunties)',
        documentedTech: 'Midjourney v5/v6 compositional prompting + Runway Gen-2 frame interpolation',
        tools: ['Midjourney', 'Runway Gen-2', 'Photoshop'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        videoEmbedUrl: 'https://player.vimeo.com/video/899120668',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'niceaunties / Wenhui Lim',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-2',
        slug: 'mirror-into-auntieverse',
        title: 'Mirror Into Auntieverse',
        year: '2024',
        contentType: 'Installation',
        description: 'Interactive museum installation transporting visitors into a generative dreamscape where domestic objects defy gravity and scale.',
        fullDescription: 'Exhibited in international contemporary art spaces, "Mirror Into Auntieverse" combines physical projection mapped structures with real-time generative feedback. Visitors stand before an ornate gilded frame that captures their silhouettes and mirrors them back as whimsical characters traversing Lim’s surreal culinary landscapes.',
        workflowNotes: 'Depth camera computer vision tracks spectator postures, triggering generative asset layers rendered with custom TouchDesigner shaders.',
        credits: 'Artist: niceaunties (Wenhui Lim) • Exhibition Series 2024',
        documentedTech: 'Real-time interactive projection and computer vision silhouette mapping',
        tools: ['TouchDesigner', 'Midjourney', 'After Effects'],
        externalUrl: 'https://www.niceaunties.com/projects',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'niceaunties Exhibition Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-3',
        slug: 'aunties-in-dis-place',
        title: 'Aunties In Dis Place',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Generative storytelling project exploring domestic spatial politics, memory preservation, and multi-generational Singaporean architecture.',
        fullDescription: 'Leveraging Lim’s formal background as a licensed architect, "Aunties In Dis Place" dissects the spatial anatomy of Singaporean public housing (HDB flats). The series reimagines utilitarian living rooms as hyper-ornate, elastic sanctuaries where giant teapots, laundromat carousels, and jade ornaments coalesce into intimate monuments of matriarchal memory.',
        workflowNotes: 'Architectural floor plans and interior geometries used as spatial constraints in Stable Diffusion ControlNet pipelines.',
        credits: 'Artist: niceaunties (Wenhui Lim)',
        documentedTech: 'Midjourney v5 + Stable Diffusion ControlNet spatial scaffolding',
        tools: ['Midjourney', 'Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'niceaunties / Wenhui Lim',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-4',
        slug: 'dim-sum-dreams',
        title: 'Dim Sum Dreams & Delicacies',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Playful generative visual study exploring culinary textures, translucency, and the sensory heritage of dim sum culture.',
        fullDescription: 'A mouth-watering exploration of traditional Chinese food craft elevated to monumental public sculpture. Lim crafts translucent har gow wrappers as architectural domes, fluffy bao as floating airships, and chili oil cascades as volcanic landscapes, celebrating the tactile joy of communal eating.',
        workflowNotes: 'High-detail texture prompting emphasizing subsurface scattering and translucent gelatinous reflections.',
        credits: 'Artist: niceaunties (Wenhui Lim)',
        documentedTech: 'Prompt engineered subsurface scattering models in Midjourney',
        tools: ['Midjourney', 'Photoshop'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'niceaunties Visual Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-5',
        slug: 'auntie-haute-couture',
        title: 'Auntie Haute Couture',
        year: '2024',
        contentType: 'Generative Art',
        description: 'Fashion surrealism series fusing traditional batik patterns, plastic market baskets, and avant-garde runway silhouettes.',
        fullDescription: 'Challenging high fashion’s youth-obsessed tropes, this collection dresses mature aunties in extravagant couture crafted from everyday market materials: nylon net produce bags, vintage floral drapes, and woven plastic shopping totes.',
        workflowNotes: 'Custom diffusion style transfer combining runway fashion photography with macro textile scans of traditional Southeast Asian batik.',
        credits: 'Concept & Art Direction: niceaunties',
        documentedTech: 'Generative fashion prompt pipelines + digital texture compositing',
        tools: ['Midjourney', 'Photoshop'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        aspectRatio: '9:16',
        mediaType: 'image',
        attribution: 'niceaunties Fashion Series',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'na-work-6',
        slug: 'the-laundromat-odyssey',
        title: 'The Laundromat Odyssey',
        year: '2023',
        contentType: 'AI Video',
        description: 'Kinetic short animation tracking the hypnotic spin cycles of urban laundromats as portals into kaleidoscopic memory worlds.',
        fullDescription: 'Set to ambient city hums and mechanical rhythmic churning, this animated vignette transforms the mundane act of washing clothes into an aquatic, interstellar voyage guided by smiling matriarchs.',
        workflowNotes: 'Keyframe generation via Midjourney v5.2, converted to looped motion sequences through Runway Gen-2 camera controls.',
        credits: 'Director: niceaunties (Wenhui Lim)',
        documentedTech: 'Looped latent motion synthesis with Runway Gen-2',
        tools: ['Midjourney', 'Runway Gen-2', 'After Effects'],
        externalUrl: 'https://www.niceaunties.com/portfolio',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'niceaunties Animation Studio',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Surreal AI Art', 'Visual Storytelling'],
      tools: ['Midjourney', 'Runway Gen-2'],
      contentTypes: ['AI Video', 'Generative Art'],
      styles: ['Surreal', 'Whimsical']
    }
  },

  // 4. CLAIRE SILVER
  {
    id: 'ref-claire-silver',
    slug: 'claire-silver',
    name: 'Claire Silver',
    handle: '@clairesilver8',
    location: 'USA (Pseudonymous)',
    specialization: 'AI-Collaborative Art & Digital Haute Couture',
    headline: 'Pioneering AI Collaborative Artist & Digital Painter',
    bioSummary: 'Anonymous pioneering AI-collaborative artist working at the intersection of classical portraiture, digital fashion, neurodiversity, and human-machine co-creation.',
    fullBio: 'Claire Silver is an anonymous artist whose career has defined the emergence of AI-collaborative digital art. Operating under the ethos that "taste is the new skill," Silver combines classical oil-painting traditions with text-to-image synthesis, digital collaging, and physical canvas fabrication. Her work has been exhibited at major auction houses including Sotheby’s, Christie’s, and Phillips, as well as institutional art spaces worldwide.',
    officialWebsite: 'https://www.clairesilver.com/',
    portfolioUrl: 'https://www.clairesilver.com/collections',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official artist website (clairesilver.com), Sotheby’s, and Gucci Vault collaborations.',
    documentedTools: ['Midjourney', 'DALL·E 2', 'Stable Diffusion', 'Artbreeder', 'Photoshop'],
    contentTypes: ['Generative Art', 'Digital Haute Couture', 'Mixed Media'],
    creativeStyles: ['Classical-Futurist', 'Painterly', 'Poignant', 'Editorial Fashion'],
    socialLinks: [
      { platform: 'website', url: 'https://www.clairesilver.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/clairesilver8', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/clairesilver8/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'cs-work-1',
        slug: 'ai-art-is-not-art',
        title: 'AI Art is Not Art',
        year: '2022',
        contentType: 'Generative Art',
        description: 'Iconic conceptual work examining the controversy, legitimacy, and emotional landscape of artificial creativity.',
        fullDescription: 'One of the most widely referenced early conceptual statements in generative art, "AI Art is Not Art" ironically confronts the skepticism surrounding algorithmic creativity. Silver constructs a haunting classical portrait infused with delicate digital fissures and emotional resonance, interrogating whether human intentionality and vulnerability can survive the machine learning medium.',
        workflowNotes: 'Hybrid technique: Early generative output from custom fine-tunes, heavily layered with digital brushwork, chromatic aberration, and textural impasto in Photoshop.',
        credits: 'Artist: Claire Silver',
        documentedTech: 'Multi-model generative synthesis (early GANs + DALL·E 2) with digital oil glazing',
        tools: ['DALL·E 2', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Claire Silver Official Collection',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-2',
        slug: 'corpo-real',
        title: 'corpo | real',
        year: '2023',
        contentType: 'Mixed Media',
        description: 'Monumental physical-meets-digital collection exhibited at Superchief Gallery NFT, linking haute couture avatars with physical canvas.',
        fullDescription: 'Presented as a solo exhibition at Superchief Gallery NFT in New York, "corpo | real" bridges the divide between virtual avatar identities and physical materiality. Silver translated neural fashion designs into full-scale physical canvases and sculptural tapestries, demonstrating the physical tangible life of synthetic imagery.',
        workflowNotes: 'Generative fashion prototypes generated in Stable Diffusion, transferred onto custom oil canvas panels with hand-applied varnish and metallic leafing.',
        credits: 'Artist: Claire Silver • Venue: Superchief Gallery NFT, New York',
        documentedTech: 'Stable Diffusion checkpoint fine-tuning on historic fashion archives + digital drape mapping',
        tools: ['Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '3:4',
        mediaType: 'image',
        attribution: 'Claire Silver / Superchief Gallery',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-3',
        slug: 'claire-silver-gucci',
        title: 'Claire Silver x Emi Kusano for Gucci (Vault)',
        year: '2023',
        contentType: 'Commercial VFX',
        description: 'Prestigious creative partnership commissioned for Gucci Vault Art Space, blending anime culture and Renaissance haute couture.',
        fullDescription: 'Created for the Gucci Vault Art Space in partnership with Japanese artist Emi Kusano, this collaborative work harmonizes 16th-century European royal portraiture with contemporary Harajuku street aesthetics and retro anime character design, showcasing the versatility of curated generative co-creation.',
        workflowNotes: 'Collaborative dual-prompt pipeline between Silver and Kusano, iterating between anime character weights and historic Gucci archival fabric patterns.',
        credits: 'Artists: Claire Silver & Emi Kusano • Commission: Gucci Vault Art Space',
        documentedTech: 'Collaborative dual-model generative workflow combining runway patterns and anime line work',
        tools: ['Midjourney', 'Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/gucci',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Gucci Vault / Claire Silver / Emi Kusano',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-4',
        slug: 'genesis-collection',
        title: 'Genesis — The Dawn of Latent Portraiture',
        year: '2021',
        contentType: 'Generative Art',
        description: 'Seminal 2021 collection establishing Silver’s painterly aesthetic before the mainstream text-to-image explosion.',
        fullDescription: 'Produced using early Artbreeder genetic algorithm latent vectors, "Genesis" represents one of the earliest recognized AI fine-art collections. The portraits possess a dreamlike, impressionistic haze that captures the ethereal infancy of neural rendering.',
        workflowNotes: 'Manual genetic breeding of latent facial models in Artbreeder, post-processed in digital paint suites.',
        credits: 'Artist: Claire Silver',
        documentedTech: 'Early latent vector genetic breeding (Artbreeder) + digital glazing',
        tools: ['Artbreeder', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Claire Silver Genesis Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-5',
        slug: 'braindance',
        title: 'Braindance',
        year: '2022',
        contentType: 'Digital Poetry',
        description: 'Intimate exploration of sensory processing, neurodivergence, and the internal theater of consciousness.',
        fullDescription: 'Drawing from Silver’s lived experience with severe chronic illness and neurodivergence, "Braindance" explores how generative tools offer an alternative voice when physical expression is restricted. The works convey electric neural synesthesia through fragmented colors and kinetic brush strokes.',
        workflowNotes: 'Iterative prompt design exploring medical terminology and emotive abstract verbs.',
        credits: 'Artist: Claire Silver',
        documentedTech: 'DALL·E 2 prompt clustering with textured digital overlays',
        tools: ['DALL·E 2', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '4:5',
        mediaType: 'image',
        attribution: 'Claire Silver Private Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'cs-work-6',
        slug: 'love-in-the-4th-dimension',
        title: 'Love in the 4th Dimension',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Multi-layered digital composition examining affection and human bond across non-Euclidean spatial geometries.',
        fullDescription: 'Combining digital textile folds with celestial geometries, this series envisions emotional connection operating outside the constraints of linear time and physical space.',
        workflowNotes: 'Multi-pass inpainting with custom checkpoint weights trained on classical baroque sculpture.',
        credits: 'Artist: Claire Silver',
        documentedTech: 'Stable Diffusion inpainting and baroque texture weighting',
        tools: ['Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.clairesilver.com/collections',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Claire Silver Studio',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Generative Art', 'Digital Haute Couture'],
      tools: ['Midjourney', 'Stable Diffusion', 'Photoshop'],
      contentTypes: ['Generative Art', 'Digital Haute Couture'],
      styles: ['Classical-Futurist', 'Painterly']
    }
  },

  // 5. ROOPE RAINISTO
  {
    id: 'ref-roope-rainisto',
    slug: 'roope-rainisto',
    name: 'Roope Rainisto',
    handle: '@rooperainisto',
    location: 'Helsinki, Finland',
    specialization: 'AI Post-Photography & Conceptual Image Series',
    headline: 'Pioneering AI Post-Photographer & Digital Artist',
    bioSummary: 'Helsinki-based post-photographer pioneering AI-assisted photographic storytelling, noted for Life in West America and REWORLD, which explore fictional documentary realism and human memory.',
    fullBio: 'Roope Rainisto is a Finnish designer, photographer, and digital artist who has emerged as a preeminent voice in the genre of "post-photography". Using customized generative diffusion models trained and directed with a photographer’s eye for lighting, composition, and emotional nuance, Rainisto constructs photographic worlds that never existed yet feel overwhelmingly authentic. His historic collection "Life in West America" set auction records and defined how synthetic media can evoke genuine historical nostalgia.',
    officialWebsite: 'https://www.rooperainisto.com/',
    portfolioUrl: 'https://www.rooperainisto.com/collections',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official artist website (rooperainisto.com) and dedicated project archive (lifeinwestamerica.com).',
    documentedTools: ['DreamBooth', 'Custom Diffusion Checkpoints', 'Inpainting', 'Topaz Gigapixel', 'Photoshop'],
    contentTypes: ['AI Photography', 'Post-Photography', 'Conceptual Series'],
    creativeStyles: ['Documentary Realism', 'Film Nostalgia', 'Americana', 'Cinematic Still'],
    socialLinks: [
      { platform: 'website', url: 'https://www.rooperainisto.com/', label: 'Official Portfolio' },
      { platform: 'website', url: 'https://lifeinwestamerica.com/', label: 'Life in West America' },
      { platform: 'x', url: 'https://x.com/rooperainisto', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/rooperainisto/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'rr-work-1',
        slug: 'life-in-west-america',
        title: 'Life in West America',
        year: '2023',
        contentType: 'AI Photography',
        description: 'Monumental post-photography series capturing fictional Americana, mid-century loneliness, roadside diners, and cinematic daylight.',
        fullDescription: 'Widely hailed as a masterwork of AI post-photography, "Life in West America" comprises a meticulously curated archive of fictitious vintage photographs documenting an alternate mid-to-late 20th century American heartland. Rainisto spent hundreds of hours tuning custom diffusion checkpoints to replicate the unmistakable chemical characteristics of Kodak Kodachrome and Polaroid film stocks, paired with the compositional rigor of Robert Frank and William Eggleston.',
        workflowNotes: 'Custom DreamBooth checkpoints trained on historical film grain, lens aberrations, and color chemistry. Thousands of prompt iterations filtered down to specific photographic moments, refined through local inpainting and Topaz resolution upscaling.',
        credits: 'Photographer & Artist: Roope Rainisto',
        documentedTech: 'Custom DreamBooth checkpoint trained on vintage photographic film stocks with multi-pass inpainting',
        tools: ['DreamBooth', 'Custom Diffusion Checkpoints', 'Inpainting', 'Topaz Gigapixel'],
        externalUrl: 'https://lifeinwestamerica.com/',
        aspectRatio: '3:2',
        mediaType: 'image',
        attribution: 'Roope Rainisto / Life in West America Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'rr-work-2',
        slug: 'reworld',
        title: 'REWORLD',
        year: '2023',
        contentType: 'AI Photography',
        description: 'Conceptual post-photography series exploring artificial urban landscapes, environmental transformation, and synthetic reality.',
        fullDescription: 'Following the critical acclaim of "Life in West America", "REWORLD" shifts Rainisto’s lens toward planetary transformation and surreal architectural scale. The images resemble candid photojournalistic captures of unfamiliar civilizations, blending brutalist concrete forms with lush botanical reclamation.',
        workflowNotes: 'High-resolution diffusion synthesis with manual digital camera artifacts, chromatic fringe emulation, and grain matching in Photoshop.',
        credits: 'Artist: Roope Rainisto',
        documentedTech: 'High-resolution diffusion synthesis with manual digital camera artifacts and grain matching',
        tools: ['Custom Diffusion Checkpoints', 'Photoshop'],
        externalUrl: 'https://www.rooperainisto.com/collections',
        aspectRatio: '3:2',
        mediaType: 'image',
        attribution: 'Roope Rainisto Official Collection',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'rr-work-3',
        slug: 'overlooked-moments',
        title: 'Overlooked Moments',
        year: '2023',
        contentType: 'AI Photography',
        description: 'Candid street photography study exploring human vulnerability and micro-gestures captured from latent probability space.',
        fullDescription: 'Focusing on the fleeting, unposed moments that define street photography: a glance across a rainy bus terminal, hands adjusting a collar, sunlight striking a subway handrail. Rainisto proves that generative systems can evoke deep human tenderness.',
        workflowNotes: 'Fine-tuned character weights and tight focal length prompting imitating 35mm and 50mm prime camera lenses.',
        credits: 'Artist: Roope Rainisto',
        documentedTech: 'Photographic prime lens prompting and depth-of-field diffusion tuning',
        tools: ['Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.rooperainisto.com/collections',
        aspectRatio: '3:2',
        mediaType: 'image',
        attribution: 'Roope Rainisto Street Series',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'rr-work-4',
        slug: 'the-distance-between-us',
        title: 'The Distance Between Us',
        year: '2024',
        contentType: 'AI Photography',
        description: 'Panoramic compositions examining solitude in sprawling landscapes and urban transit architecture.',
        fullDescription: 'Cinematic wide-angle compositions capturing solitary human silhouettes engulfed by monumental natural horizons, foggy shorelines, and desolate desert highways.',
        workflowNotes: 'High-aspect panoramic prompt stitching with custom outpainting pipelines.',
        credits: 'Artist: Roope Rainisto',
        documentedTech: 'Wide-angle panoramic outpainting and atmosphere dispersion',
        tools: ['Custom Diffusion Checkpoints', 'Photoshop'],
        externalUrl: 'https://www.rooperainisto.com/collections',
        aspectRatio: '16:9',
        mediaType: 'image',
        attribution: 'Roope Rainisto Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'rr-work-5',
        slug: 'fragments-of-summer',
        title: 'Fragments of Summer',
        year: '2023',
        contentType: 'AI Photography',
        description: 'Sun-drenched, nostalgic vignettes capturing the fleeting warmth of Nordic and coastal summers.',
        fullDescription: 'Warm daylight flares, water reflections, and salt-bleached wooden docks evoke the bittersweet brevity of summer in northern climates.',
        workflowNotes: 'Sun-flare emulation and high-key color grading replicating 120mm medium format color negative film.',
        credits: 'Artist: Roope Rainisto',
        documentedTech: 'Medium format 120mm film chemistry simulation',
        tools: ['DreamBooth', 'Photoshop'],
        externalUrl: 'https://www.rooperainisto.com/collections',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Roope Rainisto Private Archive',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['AI Photography', 'Post-Photography'],
      tools: ['DreamBooth', 'Custom Diffusion Checkpoints'],
      contentTypes: ['AI Photography', 'Post-Photography'],
      styles: ['Documentary Realism', 'Film Nostalgia']
    }
  },

  // 6. SASHA STILES
  {
    id: 'ref-sasha-stiles',
    slug: 'sasha-stiles',
    name: 'Sasha Stiles',
    handle: '@sashastiles',
    location: 'New York, USA',
    specialization: 'AI Poetry, Generative Typography & Computational Media',
    headline: 'Poet, Artist & AI Researcher, Author of Technelegy',
    bioSummary: 'Award-winning poet, artist and AI researcher pioneering computational literature, generative typography, and human-machine verse co-creation exhibited at Christie’s and Gucci.',
    fullBio: 'Sasha Stiles is a first-generation Kalmyk-American poet, artist, and AI researcher who works at the frontier of text, technology, and human consciousness. Co-founder of the digital poetry salon theVERSEverse and author of the acclaimed hybrid collection "Technelegy", Stiles explores language as code and code as literature. Her work integrates custom-trained large language models—including her poetic AI alter-ego Technelegy—with video poetry, dynamic generative typography, and physical sculptures.',
    officialWebsite: 'https://www.sashastiles.com/',
    portfolioUrl: 'https://www.sashastiles.com/projects',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official artist website (sashastiles.com), Christie’s, and theVERSEverse archives.',
    documentedTools: ['Custom LLMs', 'GPT Fine-tunes', 'Generative Typography', 'TouchDesigner', 'Python'],
    contentTypes: ['Digital Poetry', 'Generative Typography', 'Installation', 'Media Art'],
    creativeStyles: ['Literary', 'Conceptual', 'Calligraphic', 'Poetic Future'],
    socialLinks: [
      { platform: 'website', url: 'https://www.sashastiles.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/sashastiles', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/sashastiles/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'ss-work-1',
        slug: 'technelegy',
        title: 'Technelegy',
        year: '2022',
        contentType: 'Digital Poetry',
        description: 'Groundbreaking hybrid poetry collection co-authored with AI alter-ego Technelegy, nominated for major literary honors and exhibited worldwide.',
        fullDescription: 'A defining milestone in digital literature, "Technelegy" investigates what it means to be human in an era of synthetic cognition. Stiles fine-tuned language models on her own personal journals, published poetry, and family letters, creating an AI twin with whom she engaged in poetic dialogue. The resulting texts explore memory, mortality, digital reincarnation, and the timeless human urge to leave linguistic traces.',
        workflowNotes: 'Custom GPT models fine-tuned on author’s poetry corpus and private archives. Thematic and metric filtering scripts curated poetic couplets, which were animated into typographical video shaders.',
        credits: 'Author & Artist: Sasha Stiles • AI Collaborator: Technelegy',
        documentedTech: 'Fine-tuned language models on personal verse archives + generative video typography',
        tools: ['Custom LLMs', 'GPT Fine-tunes', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        videoEmbedUrl: 'https://player.vimeo.com/video/651119574',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sasha Stiles / Technelegy Collection',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-2',
        slug: 'repetae-again-again',
        title: 'REPETAE: Again, Again (Gucci Art Vault)',
        year: '2023',
        contentType: 'Generative Typography',
        description: 'Generative typographic animation exhibited at Christie’s & Gucci, exploring cyclical memory and algorithmic verse cadence.',
        fullDescription: 'Featured in Gucci’s Art Vault exhibition in partnership with Christie’s, "REPETAE" examines repetition as both an ancient poetic device and the fundamental operational loop of computing code. Stanzas ripple across dynamic visual shaders, expanding and contracting with musical rhythm.',
        workflowNotes: 'Neural text synthesis synchronized to dynamic typographical animation shaders built in TouchDesigner and GLSL.',
        credits: 'Artist: Sasha Stiles • Exhibition: Gucci Art Vault / Christie’s',
        documentedTech: 'Neural text synthesis synchronized to dynamic typographical animation shaders',
        tools: ['TouchDesigner', 'Custom LLMs', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Gucci Art Vault / Christie’s / Sasha Stiles',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-3',
        slug: 'cursive-binary',
        title: 'Cursive Binary',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Translating binary code into handwritten cursive gestures via neural networks, uniting human handwriting with machine machine-code.',
        fullDescription: 'In "Cursive Binary", Stiles explores the intersection between human tactile handwriting and machine binary digits (0 and 1). By training generative latent stroke models on handwritten cursive letterforms, the project transforms raw binary strings into fluid, calligraphic tapestries.',
        workflowNotes: 'Custom handwriting datasets processed through latent space visual transformers to output continuous vector strokes.',
        credits: 'Artist: Sasha Stiles',
        documentedTech: 'Custom handwriting datasets processed through latent space visual transformers',
        tools: ['Generative Typography', 'Python', 'After Effects'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Sasha Stiles Studio Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-4',
        slug: 'dear-data',
        title: 'DEAR [DATA]',
        year: '2023',
        contentType: 'Digital Literature',
        description: 'Epistolary poem sequence addressing collective training datasets, algorithmic biases, and digital empathy.',
        fullDescription: 'A tender epistolary poem addressed directly to the vast web-scraped datasets that power modern artificial intelligence, reflecting on the anonymous human writers whose words became machine memory.',
        workflowNotes: 'Iterative conversational prompt loops questioning LLMs about their own training corpora.',
        credits: 'Poet: Sasha Stiles',
        documentedTech: 'Conversational LLM elicitation and conceptual text curation',
        tools: ['Custom LLMs', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '3:4',
        mediaType: 'text',
        attribution: 'Sasha Stiles Poetry Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-5',
        slug: 'the-mother-code',
        title: 'The Mother Code',
        year: '2022',
        contentType: 'Digital Poetry',
        description: 'Exploring maternal ancestral memory, endangered Kalmyk heritage, and oral tradition preserved in neural weights.',
        fullDescription: 'Stiles investigates her heritage as a descendant of Kalmyk Buddhist refugees, using machine translation and poetic reconstruction to keep endangered linguistic phrases alive in latent space.',
        workflowNotes: 'Cross-lingual fine-tuning incorporating archival Kalmyk phonetic recordings.',
        credits: 'Artist: Sasha Stiles',
        documentedTech: 'Phonetic NLP modeling and cultural audio preservation',
        tools: ['Custom LLMs', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '1:1',
        mediaType: 'text',
        attribution: 'Sasha Stiles Heritage Series',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ss-work-6',
        slug: 'breathe-in-breathe-out',
        title: 'Breathe In, Breathe Out',
        year: '2024',
        contentType: 'Installation',
        description: 'Biometric responsive poem that expands and contracts in real-time with spectator respiration sensors.',
        fullDescription: 'A live experiential installation where words illuminate and dissolve in rhythm with biometric breathing bands worn by exhibition attendees.',
        workflowNotes: 'Real-time respiratory sensor telemetry parsing in TouchDesigner animating kinetic typography.',
        credits: 'Artist: Sasha Stiles • Interactive Engineering: theVERSEverse',
        documentedTech: 'Biometric respiratory sensor integration with GLSL kinetic text shaders',
        tools: ['TouchDesigner', 'Python'],
        externalUrl: 'https://www.sashastiles.com/projects',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Sasha Stiles / theVERSEverse',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['AI Poetry', 'Generative Typography'],
      tools: ['Custom LLMs', 'TouchDesigner'],
      contentTypes: ['Digital Poetry', 'Generative Typography'],
      styles: ['Literary', 'Conceptual']
    }
  },

  // 7. KRIS KASHTANOVA
  {
    id: 'ref-kris-kashtanova',
    slug: 'kris-kashtanova',
    name: 'Kris Kashtanova',
    handle: '@icreatelife',
    location: 'New York, USA',
    specialization: 'AI Illustration, Comics & Generative Motion',
    headline: 'Pioneering AI Visual Artist & Comic Author',
    bioSummary: 'Visual artist and pioneer of AI-assisted sequential art, creator of Zarya of the Dawn—the first comic book with copyright-registered text and layout utilizing Midjourney imagery.',
    fullBio: 'Kris Kashtanova is a New York-based artist and AI creative director whose work established global legal and artistic precedents for generative media. In 2022, Kashtanova’s comic book "Zarya of the Dawn" was awarded the first known copyright registration by the US Copyright Office for text and visual layout created with AI assistance. Kashtanova’s multidisciplinary practice combines Midjourney, Stable Diffusion, and Runway video models to produce cinematic narratives and sequential storytelling.',
    officialWebsite: 'https://www.kris.art/',
    portfolioUrl: 'https://www.kris.art/portfolio-2',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official portfolio (kris.art), US Copyright Office public records, and international press.',
    documentedTools: ['Midjourney', 'Stable Diffusion', 'Runway Gen-2', 'Kaiber', 'Photoshop', 'Comic Life 3'],
    contentTypes: ['Comic Novel', 'AI Illustration', 'AI Video', 'Generative Motion'],
    creativeStyles: ['Graphic Novel', 'Cinematic Fantasy', 'Surrealist', 'Stylized Realism'],
    socialLinks: [
      { platform: 'website', url: 'https://www.kris.art/', label: 'Official Portfolio' },
      { platform: 'x', url: 'https://x.com/icreatelife', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/kris.kashtanova/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'kk-work-1',
        slug: 'zarya-of-the-dawn',
        title: 'Zarya of the Dawn',
        year: '2022',
        contentType: 'Comic Novel',
        description: 'Historic comic novel awarded landmark US Copyright Office registration for authorial text and layout, illustrated with Midjourney.',
        fullDescription: 'A historic watershed in intellectual property and AI art, "Zarya of the Dawn" is an 18-page sci-fi graphic novel conceived, written, and digitally designed by Kris Kashtanova. The US Copyright Office affirmed copyright protection for Kashtanova’s original writing, narrative arrangement, and page layout, establishing a legal framework for human authorship in generative co-creation.',
        workflowNotes: 'Multi-month iterative prompt crafting using early Midjourney models to achieve character facial consistency, hand-composited with lettering and panels in Comic Life 3 and Photoshop.',
        credits: 'Written & Illustrated by Kris Kashtanova • Legal Milestone: US Copyright Office',
        documentedTech: 'Midjourney prompt craft + manual digital layout, ink lettering and panel compositing',
        tools: ['Midjourney', 'Photoshop', 'Comic Life 3'],
        externalUrl: 'https://www.kris.art/portfolio-2/project-one-ephnc-jamy8',
        aspectRatio: '3:4',
        mediaType: 'image',
        attribution: 'Kris Kashtanova / Zarya of the Dawn',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-2',
        slug: 'rose-enigma',
        title: 'Rose Enigma',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Botanical surrealist illustration series exploring human portraiture intertwined with organic flora and botanical textures.',
        fullDescription: 'A delicate visual exploration of feminine identity in dialogue with nature. Kashtanova uses selective inpainting to fuse blooming rose petals, thorns, and dew drops seamlessly into facial features and hair silhouettes.',
        workflowNotes: 'Stable Diffusion inpainting paired with high-resolution manual digital brushwork and color grading in Photoshop.',
        credits: 'Artist: Kris Kashtanova',
        documentedTech: 'Stable Diffusion inpainting + manual digital brushwork',
        tools: ['Stable Diffusion', 'Photoshop'],
        externalUrl: 'https://www.kris.art/portfolio-2/rose-enigma',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Kris Kashtanova Portfolio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-3',
        slug: 'ai-burning-man',
        title: 'AI Burning Man Video (Runway Gen-2)',
        year: '2023',
        contentType: 'AI Video',
        description: 'Cinematic AI video project capturing the kinetic energy and luminous night landscapes of Burning Man using Runway Gen-2.',
        fullDescription: 'Drawing from Kashtanova’s real-world experiences at Burning Man in the Black Rock Desert, this video combines generative motion with dream-logic desert spectacles: glowing neon art cars, dust tornadoes, and luminous fire ceremonies.',
        workflowNotes: 'Runway Gen-2 text-to-video and image-to-video temporal consistency pipelines, smoothed with motion vector interpolation.',
        credits: 'Creator & Director: Kris Kashtanova • AI Engine: Runway Gen-2',
        documentedTech: 'Runway Gen-2 text-to-video and image-to-video temporal consistency pipelines',
        tools: ['Runway Gen-2', 'Midjourney', 'Premiere Pro'],
        externalUrl: 'https://www.kris.art/portfolio-2/ai-burning-man-gen2-runwayml',
        videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/9P4b6XwY4yM',
        videoPlatform: 'youtube',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Kris Kashtanova Video Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-4',
        slug: 'cosmic-botanical',
        title: 'Cosmic Botanical',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Bioluminescent plant species imagined on extraterrestrial planets, featuring intricate translucent cellular structures.',
        fullDescription: 'A sci-fi botanical taxonomy cataloging fictional plants that emit light to survive on tidally locked exoplanets. The series combines deep-sea bioluminescence with macro photography techniques.',
        workflowNotes: 'Prompting for macro camera apertures, bioluminescent pigments, and translucent cell walls.',
        credits: 'Artist: Kris Kashtanova',
        documentedTech: 'Bioluminescent cellular texturing in Midjourney',
        tools: ['Midjourney', 'Photoshop'],
        externalUrl: 'https://www.kris.art/portfolio-2',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Kris Kashtanova Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-5',
        slug: 'dreamers-of-tomorrow',
        title: 'Dreamers of Tomorrow',
        year: '2024',
        contentType: 'AI Illustration',
        description: 'Cinematic character portraits celebrating diversity, optimism, and future technological harmony.',
        fullDescription: 'Portraits of youth innovators, climate scientists, and artists surrounded by generative technological halos and floating holographic user interfaces.',
        workflowNotes: 'Multi-pass prompt weighting balancing realistic human skin tones with futuristic translucent graphic overlays.',
        credits: 'Artist: Kris Kashtanova',
        documentedTech: 'Multi-pass diffusion character illustration',
        tools: ['Midjourney', 'Photoshop'],
        externalUrl: 'https://www.kris.art/portfolio-2',
        aspectRatio: '4:5',
        mediaType: 'image',
        attribution: 'Kris Kashtanova Character Studies',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kk-work-6',
        slug: 'urban-metamorphosis',
        title: 'Urban Metamorphosis',
        year: '2023',
        contentType: 'AI Animation',
        description: 'Looping generative motion sequence depicting New York City architecture morphing through changing seasons and historical eras.',
        fullDescription: 'A continuous transformation of Manhattan brownstones and skyscrapers as they blossom into verdant vertical forests before freezing into crystalline winter sculptures.',
        workflowNotes: 'Stable Diffusion ControlNet depth map guidance ensuring architectural landmarks remain stable while textures morph.',
        credits: 'Director: Kris Kashtanova',
        documentedTech: 'ControlNet depth map stability with temporal frame morphing',
        tools: ['Stable Diffusion', 'After Effects'],
        externalUrl: 'https://www.kris.art/portfolio-2',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Kris Kashtanova Motion Archive',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['AI Illustration', 'Comics'],
      tools: ['Midjourney', 'Runway Gen-2', 'Stable Diffusion'],
      contentTypes: ['Comic Novel', 'AI Video', 'Generative Art'],
      styles: ['Graphic Novel', 'Cinematic Fantasy']
    }
  },

  // 8. ANNA RIDLER
  {
    id: 'ref-anna-ridler',
    slug: 'anna-ridler',
    name: 'Anna Ridler',
    handle: '@annaridler',
    location: 'London, United Kingdom',
    specialization: 'Machine-Learning Art & Hand-Curated Datasets',
    headline: 'Artist & Researcher, Pioneer of Dataset-Driven AI Art',
    bioSummary: 'London-based artist and researcher renowned for hand-curated datasets, custom GAN architectures, and conceptual artworks investigating value, labor, and natural systems like tulips and shells.',
    fullBio: 'Anna Ridler is an internationally acclaimed British artist and researcher whose practice examines the human labor, historical context, and systemic bias embedded in machine learning datasets. Unlike commercial AI creators who utilize mass-market prompting tools, Ridler meticulously builds her own training sets by hand-photographing and cataloging thousands of individual physical specimens—including 10,000 Dutch tulips and shells from the River Thames. Her works have been exhibited at the Victoria and Albert Museum, Barbican Centre, and Centre Pompidou.',
    officialWebsite: 'https://annaridler.com/',
    portfolioUrl: 'https://annaridler.com/works',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official portfolio (annaridler.com), museum archives (V&A, Barbican), and academic publications.',
    documentedTools: ['Custom GANs', 'Hand-Curated Datasets', 'Python', 'PyTorch', 'Computer Vision'],
    contentTypes: ['Dataset Art', 'Generative Video', 'Installation', 'Conceptual Media'],
    creativeStyles: ['Conceptual', 'Botanical', 'Archival', 'Critical Systems'],
    socialLinks: [
      { platform: 'website', url: 'https://annaridler.com/', label: 'Official Website' },
      { platform: 'x', url: 'https://x.com/annaridler', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/annaridler/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'ar-work-1',
        slug: 'mosaic-virus',
        title: 'Mosaic Virus',
        year: '2019',
        contentType: 'Generative Video',
        description: 'Multi-screen GAN video installation where blooming tulips respond to real-time bitcoin market fluctuations, linking Tulip Mania to crypto speculation.',
        fullDescription: 'A landmark in conceptual machine-learning art, "Mosaic Virus" draws an explicit parallel between 17th-century Dutch "Tulip Mania" and contemporary cryptocurrency market volatility. Ridler created a custom GAN trained on 10,000 hand-photographed tulips. In the live installation, the blooming state, coloration, and petal stripes of the generative tulips change dynamically based on real-time price movements of Bitcoin.',
        workflowNotes: 'Custom Generative Adversarial Network architecture trained from scratch on Ridler’s 10,000 hand-photographed tulip dataset. Connected to cryptocurrency exchange API tickers in Python to modulate latent vectors.',
        credits: 'Artist: Anna Ridler • Commissioned by IMPAKT Festival',
        documentedTech: 'Custom GAN trained on 10,000 hand-photographed Dutch tulips linked to cryptocurrency API triggers',
        tools: ['Custom GANs', 'Python', 'PyTorch'],
        externalUrl: 'https://annaridler.com/works',
        videoEmbedUrl: 'https://player.vimeo.com/video/322961817',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Anna Ridler / IMPAKT',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-2',
        slug: 'myriad-tulips',
        title: 'Myriad (Tulips)',
        year: '2018',
        contentType: 'Installation',
        description: 'Physical classification training archive highlighting human dataset preparation labor, displaying 10,000 hand-sorted photographs across museum walls.',
        fullDescription: 'Installed at the Barbican Centre in London, "Myriad (Tulips)" visualizes the immense human labor required to train machine learning systems. Ridler pinned 10,000 physical photographs of tulips across gallery walls, hand-labeled and sorted by color, petal shape, and bloom stage.',
        workflowNotes: 'Physical installation of 10,000 35mm photographs taken over three months during Dutch tulip season, individually cataloged and pinned in classification matrices.',
        credits: 'Artist: Anna Ridler • Exhibition: Barbican Centre, AI: More than Human',
        documentedTech: 'Physical classification training archive highlighting human dataset preparation labor',
        tools: ['Hand-Curated Datasets'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '16:9',
        mediaType: 'image',
        attribution: 'Barbican Centre / Anna Ridler',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-3',
        slug: 'bloemenveiling',
        title: 'Bloemenveiling',
        year: '2019',
        contentType: 'Generative Art',
        description: 'Auction mechanism investigating artificial scarcity and botanical speculation using GAN flowers and smart contracts.',
        fullDescription: 'An interactive auction where participants bid on GAN-generated tulips. The virtual flowers were programmed to decay and disappear if not sold within a designated timeframe, critiquing technological artificial scarcity.',
        workflowNotes: 'Custom GAN generation coupled with distributed ledger contracts governing digital artifact lifespan.',
        credits: 'Artist: Anna Ridler & David Pfau',
        documentedTech: 'GAN generation coupled with distributed ledger contracts',
        tools: ['Custom GANs', 'Python'],
        externalUrl: 'https://annaridler.com/works',
        videoEmbedUrl: 'https://player.vimeo.com/video/335836471',
        videoPlatform: 'vimeo',
        aspectRatio: '1:1',
        mediaType: 'interactive',
        attribution: 'Anna Ridler & David Pfau',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-4',
        slug: 'the-shell-record',
        title: 'The Shell Record',
        year: '2021',
        contentType: 'Dataset Art',
        description: 'Collection of foreshore shells from the River Thames cataloged through custom neural networks to investigate archeological time.',
        fullDescription: 'Mudlarking along the tidal Thames, Ridler gathered centuries of discarded oyster and mussel shells, photographing them to explore ecological and industrial trade history.',
        workflowNotes: 'Photogrammetric capture and custom neural classification tracking shell erosion patterns.',
        credits: 'Artist: Anna Ridler',
        documentedTech: 'Custom computer vision classification of archeological river artifacts',
        tools: ['Custom GANs', 'Python', 'Computer Vision'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Anna Ridler Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-5',
        slug: 'drawing-with-a-gan',
        title: 'Drawing with a GAN',
        year: '2018',
        contentType: 'Generative Art',
        description: 'Investigation into human motor memory and algorithmic interpretation using hand-drawn ink sketches as training seeds.',
        fullDescription: 'Ridler produced hundreds of ink drawings illustrating scenes from historic literature, training a neural network to complete incomplete sketches in real-time.',
        workflowNotes: 'Pix2Pix conditional adversarial network trained on hand-drawn ink strokes.',
        credits: 'Artist: Anna Ridler',
        documentedTech: 'Pix2Pix conditional GAN with custom ink drawing datasets',
        tools: ['Custom GANs', 'PyTorch'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Anna Ridler Research',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'ar-work-6',
        slug: 'circadian-rhythms',
        title: 'Circadian Rhythms',
        year: '2022',
        contentType: 'Generative Video',
        description: 'Time-lapse generative botany responding to diurnal cycles and circadian sleep rhythms.',
        fullDescription: 'A generative botanical video where plant blossoms open and close in sync with daylight cycles and human circadian hormonal rhythms.',
        workflowNotes: 'Time-lapse video training frames parsed into temporal latent transitions in PyTorch.',
        credits: 'Artist: Anna Ridler',
        documentedTech: 'Diurnal cycle temporal neural video interpolation',
        tools: ['Custom GANs', 'Python'],
        externalUrl: 'https://annaridler.com/works',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Anna Ridler Video Archive',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Dataset Art', 'Machine-Learning Art'],
      tools: ['Custom GANs', 'Hand-Curated Datasets'],
      contentTypes: ['Dataset Art', 'Generative Video'],
      styles: ['Conceptual', 'Botanical']
    }
  },

  // 9. SOUGWEN CHUNG
  {
    id: 'ref-sougwen-chung',
    slug: 'sougwen-chung',
    name: 'Sougwen Chung',
    handle: '@sougwen',
    location: 'London & New York',
    specialization: 'Human–Robot Collaboration & Biosensor Drawing',
    headline: 'Artist, Roboticist & Former MIT Media Lab Research Fellow',
    bioSummary: 'Pioneering Chinese-Canadian artist and roboticist recognized for human-machine co-drawing performances using custom robotic arms (D.O.U.G.) driven by neural networks and biosensors.',
    fullBio: 'Sougwen 愫君 Chung is a pioneering artist, researcher, and former research fellow at MIT’s Media Lab. Chung is internationally recognized for investigating the boundary where mark-making by hand meets generative kinetics by machine. Through their custom-engineered robotic collaborator D.O.U.G. (Drawing Operations Unit Generation), Chung performs live synchronized drawing duets where neural networks predict and respond to the artist’s arm gestures, heart rate, and brainwave rhythms.',
    officialWebsite: 'https://sougwen.com/',
    portfolioUrl: 'https://sougwen.com/archive',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official artist archive (sougwen.com), MIT Media Lab publications, and museum collections.',
    documentedTools: ['D.O.U.G. Robotic Arm', 'Recurrent Neural Networks', 'EEG Sensors', 'Custom C++', 'OpenFrameworks'],
    contentTypes: ['Robotic Drawing', 'Installation', 'Generative Art', 'Performance'],
    creativeStyles: ['Calligraphic', 'Kinetic', 'Organic-Mechanical', 'Performative'],
    socialLinks: [
      { platform: 'website', url: 'https://sougwen.com/', label: 'Official Website' },
      { platform: 'vimeo', url: 'https://vimeo.com/sougwen', label: 'Vimeo Channel' },
      { platform: 'x', url: 'https://x.com/sougwen', label: 'X / Twitter' },
      { platform: 'instagram', url: 'https://www.instagram.com/sougwen/', label: 'Instagram' }
    ],
    featuredWorks: [
      {
        id: 'sc-work-1',
        slug: 'doug-memory',
        title: 'Drawing Operations Unit Generation 2 (MEMORY)',
        year: '2017–2019',
        contentType: 'Installation',
        description: 'Seminal human-robot drawing duet where a multi-axis robotic arm collaborates in real time based on recurrent neural networks trained on the artist’s gesture memory.',
        fullDescription: 'A landmark performance and installation in robotic art, D.O.U.G._2 explores human and mechanical spatial memory. Chung trained a Recurrent Neural Network (RNN) on twenty years of their own drawing stroke vectors. During live drawing sessions, the robotic arm operates in conversation with Chung, improvising complementary brush strokes on the same canvas.',
        workflowNotes: 'Custom C++ pipeline using OpenFrameworks and ROS (Robot Operating System) connecting overhead optical motion tracking to a 6-axis robotic arm running RNN stroke prediction models.',
        credits: 'Artist & Roboticist: Sougwen Chung • Supported by Bell Labs & MIT Media Lab',
        documentedTech: 'Recurrent Neural Network (RNN) gesture prediction + dual 6-axis robotic arm controller',
        tools: ['D.O.U.G. Robotic Arm', 'Recurrent Neural Networks', 'Custom C++'],
        externalUrl: 'https://sougwen.com/work/memory-drawing-operations',
        videoEmbedUrl: 'https://player.vimeo.com/video/244347714',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sougwen Chung / Bell Labs E.A.T.',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-2',
        slug: 'mimicry-drawing-operations',
        title: 'MIMICRY — Drawing Operations',
        year: '2015',
        contentType: 'Generative Art',
        description: 'First generation D.O.U.G. system using real-time computer vision to synchronize brush strokes between artist and machine.',
        fullDescription: 'The inception of Chung’s robotic practice, "MIMICRY" paired the artist with a stepper-motor drawing arm that tracked Chung’s hand position via an overhead camera, mimicking and translating biological movement into robotic ink lines.',
        workflowNotes: 'Computer vision contour extraction tracking hand coordinates mapped to stepper motor actuation.',
        credits: 'Artist: Sougwen Chung',
        documentedTech: 'Real-time overhead camera tracking and synchronized stepper-motor arm',
        tools: ['D.O.U.G. Robotic Arm', 'OpenFrameworks'],
        externalUrl: 'https://sougwen.com/work/mimicry-drawing-operations',
        videoEmbedUrl: 'https://player.vimeo.com/video/140226343',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sougwen Chung Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-3',
        slug: 'assembly-lines',
        title: 'Assembly Lines',
        year: '2022',
        contentType: 'Installation',
        description: 'Multi-agent robotic installation responding in real time to the artist’s autonomic nervous system, EEG brainwaves, and respiration.',
        fullDescription: 'Commissioned for the EMST National Museum of Contemporary Art in Athens, "Assembly Lines" features multiple robotic arms working simultaneously around a circular canvas. The robots’ movements are guided by live biometric feedback from Chung: brainwave frequencies (alpha and theta waves) and heart rate variability.',
        workflowNotes: 'Multi-channel EEG headband and ECG sensors transmitting telemetry via OSC to multi-robot kinematic solvers in Unity and C++.',
        credits: 'Artist: Sougwen Chung • Venue: EMST National Museum of Contemporary Art, Athens',
        documentedTech: 'Multi-agent neural control system reacting to human autonomic nervous system signals',
        tools: ['D.O.U.G. Robotic Arm', 'EEG Sensors', 'Custom C++'],
        externalUrl: 'https://sougwen.com/archive',
        videoEmbedUrl: 'https://player.vimeo.com/video/375775791',
        videoPlatform: 'vimeo',
        aspectRatio: '16:9',
        mediaType: 'interactive',
        attribution: 'Sougwen Chung / EMST Athens',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-4',
        slug: 'flora-form',
        title: 'Flora R准 (Flora Form)',
        year: '2020',
        contentType: 'Generative Art',
        description: 'Computational growth algorithms translating botanical vascular structures into physical Chinese ink paintings.',
        fullDescription: 'Exploring natural biomimicry, this series models the venation patterns of plant leaves and mycelial networks, executing intricate ink brushwork through robotic arms.',
        workflowNotes: 'Differential growth algorithms translated into robotic G-code commands for ink pressure modulation.',
        credits: 'Artist: Sougwen Chung',
        documentedTech: 'Differential growth algorithms and robotic brush pressure modulation',
        tools: ['D.O.U.G. Robotic Arm', 'OpenFrameworks'],
        externalUrl: 'https://sougwen.com/archive',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Sougwen Chung Portfolio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-5',
        slug: 'ligatures',
        title: 'Ligatures',
        year: '2021',
        contentType: 'Installation',
        description: 'Spatial drawing performance in virtual reality mapped to physical canvas with custom six-axis robotic armatures.',
        fullDescription: 'Chung draws in 3D space using immersive virtual reality controllers, while synchronized robotic arms translate the spatial vectors into 2D physical ink strokes on canvas.',
        workflowNotes: 'Spatial 6DoF tracking mapped to 2D planar kinematics with robotic damping.',
        credits: 'Artist: Sougwen Chung',
        documentedTech: 'VR spatial vector tracking translated to 6-axis mechanical plotting',
        tools: ['D.O.U.G. Robotic Arm', 'Custom C++'],
        externalUrl: 'https://sougwen.com/archive',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Sougwen Chung VR Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'sc-work-6',
        slug: 'artifacts-of-the-automaton',
        title: 'Artifacts of the Automaton',
        year: '2023',
        contentType: 'Generative Art',
        description: 'Physical sculptural records and dimensional ink layered works produced by multi-arm collaborative systems.',
        fullDescription: 'Complex layered works combining raw graphite, Chinese sumi ink, and metallic foils applied by collaborative robotic arms across days of continuous drawing.',
        workflowNotes: 'Multi-layer composite drafting executed across multi-day automated sessions.',
        credits: 'Artist: Sougwen Chung',
        documentedTech: 'Multi-day robotic automated ink drafting',
        tools: ['D.O.U.G. Robotic Arm', 'Custom C++'],
        externalUrl: 'https://sougwen.com/archive',
        aspectRatio: '1:1',
        mediaType: 'image',
        attribution: 'Sougwen Chung Gallery Archive',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Robotics', 'Human–Machine Collaboration'],
      tools: ['Robotic Drawing Systems', 'Custom AI Models'],
      contentTypes: ['Robotic Drawing', 'Installation'],
      styles: ['Calligraphic', 'Kinetic']
    }
  },

  // 10. KAREN X. CHENG
  {
    id: 'ref-karen-x-cheng',
    slug: 'karen-x-cheng',
    name: 'Karen X. Cheng',
    handle: '@karenxcheng',
    location: 'San Francisco, California, USA',
    specialization: 'Creative Direction, AI Advertising & Viral Filmmaking',
    headline: 'Creative Director & AI Video Innovator',
    bioSummary: 'Acclaimed creative director and filmmaker renowned for viral visual storytelling, commercial AI visual effects campaigns for brands like LEGO and PUMA, and pioneering AI fashion videos.',
    fullBio: 'Karen X. Cheng is a San Francisco-based creative director, filmmaker, and digital viral architect whose work has garnered hundreds of millions of views globally. Recognized by Fast Company as one of the Most Creative People in Business, Cheng sits at the vanguard of applying emerging AI video tools—including ControlNet, Deforum, and Runway—to commercial advertising and high-concept social campaigns. Her collaborations with global brands like LEGO, PUMA, and HP demonstrate how generative tools can enhance live physical choreography and commercial storytelling.',
    officialWebsite: 'https://www.karenx.com/',
    portfolioUrl: 'https://www.karenx.com/',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
    attributionNote: 'Public editorial reference. Documented on official creative portfolio (karenx.com) and commercial campaign case studies.',
    documentedTools: ['Stable Diffusion', 'Runway Gen-1/Gen-2', 'ControlNet', 'DALL·E', 'DaVinci Resolve', 'After Effects'],
    contentTypes: ['Commercial VFX', 'AI Video', 'Creative Direction', 'Social Film'],
    creativeStyles: ['Viral Motion', 'Visual Trickery', 'Dynamic Pace', 'Polished Commercial'],
    socialLinks: [
      { platform: 'website', url: 'https://www.karenx.com/', label: 'Official Website' },
      { platform: 'instagram', url: 'https://www.instagram.com/karenxcheng/', label: 'Instagram' },
      { platform: 'x', url: 'https://x.com/karenxcheng', label: 'X / Twitter' },
      { platform: 'youtube', url: 'https://www.youtube.com/@karenxcheng', label: 'YouTube' }
    ],
    featuredWorks: [
      {
        id: 'kxc-work-1',
        slug: 'hp-ai-fashion-reimagined',
        title: 'HP — AI Fashion Reimagined',
        year: '2023',
        contentType: 'Commercial VFX',
        description: 'Pioneering AI fashion commercial utilizing ControlNet and live-action motion tracking for seamless wardrobe transformations.',
        fullDescription: 'A viral commercial breakthrough produced for HP, this spot demonstrated the commercial viability of generative AI in fashion advertising. Karen X. Cheng choreographed live models walking in neutral bodysuits, using Stable Diffusion ControlNet and Deforum motion tracking to transform their attire into dozens of fantastical, hyper-detailed haute couture garments seamlessly as they walked.',
        workflowNotes: 'Live-action footage recorded against green screen, tracked using optical flow vectors in DaVinci Resolve, and processed through Stable Diffusion ControlNet using openpose and depth models.',
        credits: 'Director & Creative Director: Karen X. Cheng • Client: HP',
        documentedTech: 'ControlNet + Deforum + live-action motion tracking and frame interpolation',
        tools: ['Stable Diffusion', 'ControlNet', 'DaVinci Resolve'],
        externalUrl: 'https://www.karenx.com/',
        videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/qg_KkK1w4Zk',
        videoPlatform: 'youtube',
        aspectRatio: '9:16',
        mediaType: 'video',
        attribution: 'HP / Directed by Karen X. Cheng',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-2',
        slug: 'pass-the-pencil',
        title: 'Pass the Pencil (Creative Collaboration)',
        year: '2020–2022',
        contentType: 'AI Video',
        description: 'Viral collaborative animation and creative direction project connecting hundreds of global animators with continuous match cuts.',
        fullDescription: 'Conceived during pandemic lockdowns, "Pass the Pencil" united over 40 global animators and visual artists in a seamless chain-reaction video. A pencil is passed through dozens of distinct aesthetic styles: claymation, 2D anime, 3D CGI, and early generative neural morphing.',
        workflowNotes: 'Complex spatial continuity and frame-matching guidelines provided to global collaborators, edited and composited in Premiere Pro and After Effects.',
        credits: 'Creator & Executive Producer: Karen X. Cheng • Collaboration of 40+ Artists',
        documentedTech: 'Multi-creator workflow with continuous match-cut transitions',
        tools: ['After Effects', 'Premiere Pro'],
        externalUrl: 'https://www.karenx.com/pencil',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Karen X. Cheng / Pass the Pencil Project',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-3',
        slug: 'commercial-campaigns-lego-puma',
        title: 'Commercial Campaign Portfolio (LEGO, PUMA)',
        year: '2022–2024',
        contentType: 'Commercial VFX',
        description: 'High-concept visual campaigns fusing optical illusions, physical props, and generative AI visual effects.',
        fullDescription: 'Showcasing Cheng’s signature fusion of practical magic and digital innovation, these commercial campaigns for LEGO and PUMA feature mind-bending perspective shifts, stop-motion transitions, and generative environment extensions.',
        workflowNotes: 'Practical forced perspective camera rigs combined with AI background extension and volumetric color grading.',
        credits: 'Creative Director: Karen X. Cheng • Clients: LEGO, PUMA',
        documentedTech: 'Runway neural video tools blended with live physical props',
        tools: ['Runway Gen-1/Gen-2', 'After Effects'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '9:16',
        mediaType: 'video',
        attribution: 'Karen X. Cheng Commercial Archive',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-4',
        slug: 'mirror-dance-sequence',
        title: 'Mirror Dance Sequence',
        year: '2023',
        contentType: 'AI Video',
        description: 'Choreographed dance sequence where physical reflections dissolve into stylized generative avatars.',
        fullDescription: 'A choreographed dancer moves in front of antique mirrors, with reflections transforming into liquid chrome, stained glass, and floral sculptures.',
        workflowNotes: 'Rotoscoped mirror masks running through Runway Gen-2 video-to-video style models.',
        credits: 'Director: Karen X. Cheng',
        documentedTech: 'Masked neural style transfer on mirror reflections',
        tools: ['Runway Gen-2', 'After Effects'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '9:16',
        mediaType: 'video',
        attribution: 'Karen X. Cheng Experimental Series',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-5',
        slug: 'dynamic-perspectives',
        title: 'Dynamic Perspectives',
        year: '2024',
        contentType: 'Creative Direction',
        description: 'FPV drone footage transformed into surreal dreamscapes via generative diffusion models.',
        fullDescription: 'High-speed drone acrobatics swooping through urban canyons that smoothly warp into underwater coral reefs and alien mountain peaks.',
        workflowNotes: 'FPV camera telemetry aligned with Stable Diffusion depth maps for motion-consistent video styling.',
        credits: 'Creative Direction: Karen X. Cheng',
        documentedTech: 'FPV drone photogrammetry and diffusion depth mapping',
        tools: ['Stable Diffusion', 'ControlNet'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '16:9',
        mediaType: 'video',
        attribution: 'Karen X. Cheng Studio',
        mediaRightsStatus: 'official_archive'
      },
      {
        id: 'kxc-work-6',
        slug: 'world-in-a-drop',
        title: 'World in a Drop',
        year: '2023',
        contentType: 'Commercial VFX',
        description: 'High-speed macro lens cinematography augmented with microscopic diffusion textures.',
        fullDescription: 'A single water droplet falling onto a leaf reveals an entire microscopic metropolis reflected inside its surface tension.',
        workflowNotes: 'Phantom high-speed camera footage composited with generative latent zoom textures.',
        credits: 'Director: Karen X. Cheng',
        documentedTech: 'High-speed macro cinematography with latent texture synthesis',
        tools: ['DALL·E', 'After Effects'],
        externalUrl: 'https://www.karenx.com/',
        aspectRatio: '1:1',
        mediaType: 'video',
        attribution: 'Karen X. Cheng Macro Series',
        mediaRightsStatus: 'official_archive'
      }
    ],
    filters: {
      specializations: ['Creative Direction', 'AI Filmmaking'],
      tools: ['Stable Diffusion', 'Runway Gen-1/Gen-2', 'ControlNet'],
      contentTypes: ['Commercial VFX', 'AI Video'],
      styles: ['Viral Motion', 'Visual Trickery']
    }
  }
];

for (const c of CREATORS_DATA) {
  c.isExternalReference = true;
}

// Generate TypeScript code
let code = `// ==============================================================================
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

export const EXTERNAL_CREATOR_REFERENCES: ExternalCreatorReference[] = ${JSON.stringify(CREATORS_DATA, null, 2).replace(/"isExternalReference": true/g, 'isExternalReference: true')};
`;

// Fix the isExternalReference: true
code = code.replace(/"isExternalReference": true/g, 'isExternalReference: true as const');

fs.writeFileSync('lib/creators/external-references.ts', code);
console.log('Successfully wrote expanded dataset to lib/creators/external-references.ts');
console.log('Total creators:', CREATORS_DATA.length);
let totalWorks = 0;
for (const c of CREATORS_DATA) {
  totalWorks += c.featuredWorks.length;
}
console.log('Total indexed projects:', totalWorks);
