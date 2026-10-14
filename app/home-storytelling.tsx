'use client';
import React, { useState, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Layers,
  Shield,
  FileText,
  Sliders,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  Cpu,
  Clock,
  Compass,
  DollarSign
} from 'lucide-react';
import { RevealHeadline } from '../components/motion/RevealHeadline';
import { ScrollSection } from '../components/motion/ScrollSection';
import { ImageWipe } from '../components/motion/ImageWipe';
import { WorkflowStory } from '../components/marketing/workflow-story';
import { AnimatedCounter } from '../components/ui/animated-counter';
import { CinematicIntro } from '../components/marketing/cinematic-intro';
import { CinematicHero } from '../components/marketing/cinematic-hero';

interface HomeStorytellingProps {
  creators: any[];
  creatorsLoading: boolean;
}

export function HomeStorytelling({ creators, creatorsLoading }: HomeStorytellingProps) {
  // Gallery carousel state
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  // Selected filter showcase
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');

  // Featured Portfolio Items for Section 05 (10 Genuine AI Creators)
  const PORTFOLIO_SHOWCASE = [
    {
      title: 'Washed Out — The Hardest Part',
      creator: 'Paul Trillo',
      creatorSlug: 'paul-trillo',
      discipline: 'AI Filmmaking',
      tools: 'OpenAI Sora • DaVinci Resolve',
      aspectRatio: '16:9 Cinema',
      workflow: 'First official music video created with OpenAI Sora, tracking an infinite zoom through decades of human memory.',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      link: '/creators/paul-trillo'
    },
    {
      title: 'Unsupervised — Machine Hallucinations',
      creator: 'Refik Anadol',
      creatorSlug: 'refik-anadol',
      discipline: 'Generative Art',
      tools: 'Custom StyleGAN2 • CUDA',
      aspectRatio: '16:9 Installation',
      workflow: 'Trained on 384,000 public artworks from MoMA collection, interpreting modern art through fluid latent dynamics.',
      cover: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      link: '/creators/refik-anadol'
    },
    {
      title: 'The Auntieverse',
      creator: 'niceaunties (Wenhui Lim)',
      creatorSlug: 'niceaunties',
      discipline: 'Surreal Visual Storytelling',
      tools: 'Midjourney • Runway • Motion Tracking',
      aspectRatio: '1:1 Square',
      workflow: 'Surreal matriarchal world-building blending architectural drafting, food culture, and neural animation.',
      cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      link: '/creators/niceaunties'
    },
    {
      title: 'corpo | real',
      creator: 'Claire Silver',
      creatorSlug: 'claire-silver',
      discipline: 'Digital Couture & AI Art',
      tools: 'Stable Diffusion • Artbreeder • Photoshop',
      aspectRatio: '4:5 Editorial',
      workflow: 'Exploration of physical textiles, bodily vulnerability, and generative couture fine-tuned on historical archives.',
      cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      link: '/creators/claire-silver'
    }
  ];

  const scrollCarousel = (direction: 'next' | 'prev') => {
    let nextIdx = direction === 'next' ? activeProjectIdx + 1 : activeProjectIdx - 1;
    if (nextIdx < 0) nextIdx = PORTFOLIO_SHOWCASE.length - 1;
    if (nextIdx >= PORTFOLIO_SHOWCASE.length) nextIdx = 0;
    setActiveProjectIdx(nextIdx);

    if (galleryTrackRef.current) {
      const cardWidth = 420;
      galleryTrackRef.current.scrollTo({
        left: nextIdx * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-storytelling-root">
      {/* Cinematic 5-Second 2D Opening Sequence (Session-aware / Skippable) */}
      <CinematicIntro />

      {/* =========================================================================
          SECTION 01 — EDITORIAL HERO (NO THREE.JS / 100% 2D HIGH-PERFORMANCE)
          ========================================================================= */}
      {/* =========================================================================
          SECTION 01 — CINEMATIC DARK-LIME HERO (EDITORIAL MARKETPLACE)
          Inspired by high-end design reference with layered 3D collage,
          magnetic-ready parallax, continuous orbital paths, and infinite marquee
          ========================================================================= */}
      <CinematicHero creatorCount={creators?.length || 10} />

      {/* =========================================================================
          SECTION 02 — THE DISCOVERY PROBLEM
          ========================================================================= */}
      <ScrollSection id="discovery-problem" className="story-section section-problem">
        <div className="section-head-editorial">
          <span className="section-eyebrow">02 / THE CORE BOTTLENECK</span>
          <RevealHeadline
            as="h2"
            lines={['THE TALENT EXISTS.', 'THE DISCOVERY IS <em>BROKEN.</em>']}
            subtitle="Hiring AI artists through standard freelance boards or Discord chats leads to catastrophic project delays, vague rights licensing, and unverifiable prompt outputs."
          />
        </div>

        <div className="problem-cards-grid">
          <article className="problem-card">
            <div className="card-topline">
              <span className="problem-num">01</span>
              <Compass size={22} className="card-icon" />
            </div>
            <h3>Fragmented Discovery</h3>
            <p>
              Generative pioneers are scattered across closed Discord guilds, Reddit, and social feeds with no standardized rates, verified turnaround times, or searchable skill tags.
            </p>
            <div className="card-accent-line" />
          </article>

          <article className="problem-card">
            <div className="card-topline">
              <span className="problem-num">02</span>
              <Cpu size={22} className="card-icon" />
            </div>
            <h3>Unclear AI Capabilities</h3>
            <p>
              A single lucky prompt is not production readiness. Brands cannot discern between hobbyist dabblers and specialists who engineer robust custom LoRAs and ControlNets.
            </p>
            <div className="card-accent-line" />
          </article>

          <article className="problem-card">
            <div className="card-topline">
              <span className="problem-num">03</span>
              <Layers size={22} className="card-icon" />
            </div>
            <h3>Missing Workflow Proof</h3>
            <p>
              Most portfolios hide how the image was generated. Without model audit trails and seed consistency evidence, clients face unpredictability when requesting edits.
            </p>
            <div className="card-accent-line" />
          </article>

          <article className="problem-card">
            <div className="card-topline">
              <span className="problem-num">04</span>
              <Shield size={22} className="card-icon" />
            </div>
            <h3>Collaboration Chaos</h3>
            <p>
              Traditional contracts fail with AI assets. Unclear revision thresholds, missing third-party tool disclosures, and ambiguous commercial licensing derail deliverables.
            </p>
            <div className="card-accent-line" />
          </article>
        </div>
      </ScrollSection>

      {/* =========================================================================
          SECTION 03 — AI BRIEF BUILDER (IDEA TO DIRECTION)
          ========================================================================= */}
      <ScrollSection id="brief-builder" className="story-section section-brief-builder">
        <div className="section-head-editorial">
          <span className="section-eyebrow">03 / INTELLIGENT SPECIFICATION</span>
          <RevealHeadline
            as="h2"
            lines={['TURN RAW IDEAS INTO', 'CREATIVE <em>DIRECTION.</em>']}
            subtitle="CreaXa's AI brief assistant analyzes conceptual inputs and generates production-ready parameters: formats, tools, aspect ratios, budgets and commercial usage."
          />
        </div>

        <WorkflowStory creators={creators} />
      </ScrollSection>

      {/* =========================================================================
          SECTION 04 — CREATOR DISCOVERY
          ========================================================================= */}
      <ScrollSection id="creator-discovery" className="story-section section-discovery">
        <div className="discovery-header-wrap">
          <div>
            <span className="section-eyebrow">04 / THE TALENT DIRECTORY</span>
            <RevealHeadline
              as="h2"
              lines={['FIND THE RIGHT', '<em>CREATIVE PARTNER.</em>']}
              subtitle="Inspect transparent profiles with verified AI models, authentic workflow breakdowns, declared commercial turnaround, and peer reviews."
            />
          </div>
          <a href="/discover" className="button secondary directory-view-all">
            <span>Explore All Creators</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Filter Showcase Chips */}
        <div className="discipline-chips-row">
          {['All', 'AI Filmmaking', 'Generative Art', 'Runway Gen-3', 'Midjourney', 'ComfyUI'].map((disc) => (
            <button
              key={disc}
              className={`filter-chip ${selectedDiscipline === disc ? 'active' : ''}`}
              onClick={() => setSelectedDiscipline(disc)}
            >
              {disc}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        <div className="curated-creators-grid">
          {creatorsLoading ? (
            <div className="directory-loading-skeleton">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : creators && creators.length > 0 ? (
            creators.slice(0, 3).map((c: any) => {
              const d = c.data || {};
              return (
                <article key={c.id || c.slug} className="creator-editorial-card">
                  <a href={`/creators/${c.slug}`} className="card-cover-media">
                    <img
                      src={d.cover ? `/api/files/${d.cover}` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80'}
                      alt={`${d.name || 'Creator'} cover`}
                      loading="lazy"
                    />
                    <div className="card-rate-pill">
                      ${d.rate || '600'} / proj
                    </div>
                    <span className="card-hover-arrow">
                      <ArrowUpRight size={19} />
                    </span>
                  </a>

                  <div className="card-body">
                    <div className="card-author-line">
                      <div className="author-avatar">
                        {d.avatar ? (
                          <img src={`/api/files/${d.avatar}`} alt="" />
                        ) : (
                          (d.name || 'C').slice(0, 1)
                        )}
                      </div>
                      <div>
                        <a href={`/creators/${c.slug}`}>
                          <h4>{d.name || 'AI Creator'}</h4>
                        </a>
                        <span className="author-headline">{d.headline || 'Generative Specialist'}</span>
                      </div>
                    </div>

                    <div className="author-tags-strip">
                      {(Array.isArray(d.tools) ? d.tools : ['Runway', 'Midjourney', 'ComfyUI']).slice(0, 3).map((t: string) => (
                        <span key={t} className="tool-pill">{t}</span>
                      ))}
                    </div>

                    <div className="card-foot-meta">
                      <span className="status-label">
                        <span className="status-dot available" />
                        Available for Work
                      </span>
                      <a href={`/creators/${c.slug}`} className="view-profile-link">
                        View Portfolio →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            /* Fallback Sample Creator Card if database is empty */
            <article className="creator-editorial-card">
              <a href="/creators/alice-wonder" className="card-cover-media">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80"
                  alt="Alice Wonder cover"
                  loading="lazy"
                />
                <div className="card-rate-pill">$600 / starting</div>
                <span className="card-hover-arrow"><ArrowUpRight size={19} /></span>
              </a>
              <div className="card-body">
                <div className="card-author-line">
                  <div className="author-avatar">A</div>
                  <div>
                    <a href="/creators/alice-wonder"><h4>Alice Wonder</h4></a>
                    <span className="author-headline">Senior AI Filmmaker & Visual Storyteller</span>
                  </div>
                </div>
                <div className="author-tags-strip">
                  <span className="tool-pill">Runway Gen-3</span>
                  <span className="tool-pill">Midjourney v7</span>
                  <span className="tool-pill">DaVinci</span>
                </div>
                <div className="card-foot-meta">
                  <span className="status-label"><span className="status-dot available" />Available</span>
                  <a href="/creators/alice-wonder" className="view-profile-link">View Portfolio →</a>
                </div>
              </div>
            </article>
          )}
        </div>
      </ScrollSection>

      {/* =========================================================================
          SECTION 05 — AI PORTFOLIO GALLERY (THE WORK BEHIND THE WORK)
          ========================================================================= */}
      <ScrollSection id="work-gallery" className="story-section section-portfolio-gallery">
        <div className="gallery-header-bar">
          <div>
            <span className="section-eyebrow">05 / THE PROOF OF WORK</span>
            <RevealHeadline
              as="h2"
              lines={['THE CRAFT BEHIND', 'THE <em>GENERATION.</em>']}
              subtitle="Explore authentic published projects with exposed model architectures, prompt parameters, and workflow blueprints."
            />
          </div>
          <div className="carousel-nav-controls">
            <button
              onClick={() => scrollCarousel('prev')}
              className="icon-btn carousel-arrow-btn"
              aria-label="Previous project"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scrollCarousel('next')}
              className="icon-btn carousel-arrow-btn"
              aria-label="Next project"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Horizontal Editorial Track (Safe scroll that never traps vertical page scrolling) */}
        <div className="portfolio-track-wrap" ref={galleryTrackRef}>
          {PORTFOLIO_SHOWCASE.map((item, idx) => (
            <article key={item.title} className="gallery-project-card">
              <a href={item.link} className="project-media-wrap">
                <img src={item.cover} alt={item.title} loading="lazy" />
                <span className="aspect-badge">{item.aspectRatio}</span>
                <div className="project-hover-curtain">
                  <span>View Project Case Study</span>
                  <ArrowUpRight size={18} />
                </div>
              </a>

              <div className="project-info-block">
                <div className="project-category-row">
                  <span className="category-label">{item.discipline}</span>
                  <span className="author-label">by {item.creator}</span>
                </div>
                <h3>{item.title}</h3>
                <div className="project-tools-row">
                  <span className="tools-lead">Pipeline:</span>
                  <strong>{item.tools}</strong>
                </div>
                <p className="project-workflow-snippet">{item.workflow}</p>
              </div>
            </article>
          ))}
        </div>
      </ScrollSection>

      {/* =========================================================================
          SECTION 06 — COLLABORATION WORKFLOW (INVITE TO DELIVERY)
          ========================================================================= */}
      <ScrollSection id="collaboration-pipeline" className="story-section section-collaboration">
        <div className="section-head-editorial">
          <span className="section-eyebrow">06 / END-TO-END PIPELINE</span>
          <RevealHeadline
            as="h2"
            lines={['FROM FIRST INVITATION.', 'TO FINAL <em>DELIVERY.</em>']}
            subtitle="One connected workspace where brands and creators define milestones, submit versioned renders, iterate with revision controls, and verify release files."
          />
        </div>

        <div className="pipeline-steps-grid">
          {[
            {
              step: '01',
              title: 'Campaign Invitation',
              desc: 'Brand invites creator with locked brief, scope, budget, and response deadline.',
              icon: Compass
            },
            {
              step: '02',
              title: 'Mutual Acceptance',
              desc: 'Creator reviews commercial terms, accepts, and unlocks the real-time project workspace.',
              icon: Sliders
            },
            {
              step: '03',
              title: 'Versioned Submissions',
              desc: 'Creator uploads deliverables with model notes, source stems, and preview cuts.',
              icon: Layers
            },
            {
              step: '04',
              title: 'Pinpoint Revisions',
              desc: 'Structured feedback requests bounded by declared revision limits and timeline checks.',
              icon: Clock
            },
            {
              step: '05',
              title: 'Milestone Approval',
              desc: 'Brand signs off on the finished cuts with cryptographic audit timestamps.',
              icon: CheckCircle2
            },
            {
              step: '06',
              title: 'Deliverable Release',
              desc: 'High-res master deliverables unlocked with complete commercial licensing deeds.',
              icon: Shield
            }
          ].map((item, idx) => (
            <div key={item.step} className="pipeline-step-card">
              <div className="step-header">
                <span className="step-number">{item.step}</span>
                <item.icon size={22} className="step-icon" />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <div className="step-connecting-bar" />
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* =========================================================================
          SECTION 07 — FINAL CTA & MARKETPLACE LAUNCH
          ========================================================================= */}
      <ScrollSection id="final-cta" className="story-section section-final-cta">
        <div className="final-cta-container">
          <span className="section-eyebrow">07 / GET STARTED TODAY</span>
          <RevealHeadline
            as="h2"
            lines={['MAKE SOMETHING', '<em>EXTRAORDINARY.</em>']}
            subtitle="Join top creative directors, marketing leaders, and the world's most capable AI filmmakers and artists shaping the next era of visual media."
          />

          <div className="final-action-trio">
            <a href="/discover" className="button final-cta-btn primary">
              <span>Discover Creators</span>
              <ArrowUpRight size={18} />
            </a>
            <a href="/app/brand/campaigns/new" className="button final-cta-btn secondary">
              <span>Start a Campaign</span>
              <ArrowRight size={18} />
            </a>
            <a href="/signup" className="button final-cta-btn tertiary">
              <span>Join as a Creator</span>
              <Sparkles size={16} />
            </a>
          </div>

          <div className="final-trust-badges">
            <span>✓ Zero Platform Cut on Direct Deals</span>
            <span className="dot-sep">•</span>
            <span>✓ Verified Model Workflows</span>
            <span className="dot-sep">•</span>
            <span>✓ 10 Curated Editorial Themes</span>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
}
