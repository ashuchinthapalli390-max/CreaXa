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
  DollarSign,
  Play,
  Film,
  ExternalLink
} from 'lucide-react';
import { RevealHeadline } from '../components/motion/RevealHeadline';
import { ScrollSection } from '../components/motion/ScrollSection';
import { ImageWipe } from '../components/motion/ImageWipe';
import { WorkflowStory } from '../components/marketing/workflow-story';
import { AnimatedCounter } from '../components/ui/animated-counter';
import { CinematicIntro } from '../components/marketing/cinematic-intro';
import { CinematicHero } from '../components/marketing/cinematic-hero';
import { CreatorCoverMedia, CreatorAvatar } from '../components/ui/creator-media-card';
import { EXTERNAL_CREATOR_REFERENCES } from '../lib/creators/external-references';
import { VideoEmbed } from '../components/ui/video-embed';
import { WorkMediaFallback } from '../components/ui/work-card';

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

  // Featured Showcase of all 10 Genuine AI Creators (Mandatory Phase 2 requirement)
  const ALL_10_ARTIST_SHOWCASE = EXTERNAL_CREATOR_REFERENCES.map((artist) => {
    const primaryWork = artist.featuredWorks[0];
    return {
      artistName: artist.name,
      artistSlug: artist.slug,
      artistAvatar: artist.avatarUrl,
      artistHeadline: artist.headline,
      artistSpecialization: artist.specialization,
      workId: primaryWork.id,
      workSlug: primaryWork.slug,
      title: primaryWork.title,
      year: primaryWork.year,
      contentType: primaryWork.contentType,
      tools: primaryWork.tools || [primaryWork.documentedTech],
      description: primaryWork.description,
      workflowNotes: primaryWork.workflowNotes,
      aspectRatio: primaryWork.aspectRatio || '16:9',
      videoEmbedUrl: primaryWork.videoEmbedUrl,
      videoPlatform: primaryWork.videoPlatform,
      externalUrl: primaryWork.externalUrl,
      attribution: primaryWork.attribution,
      mediaType: primaryWork.mediaType,
      caseStudyUrl: `/creators/${artist.slug}/works/${primaryWork.slug}`,
      profileUrl: `/creators/${artist.slug}`
    };
  });

  const scrollCarousel = (direction: 'next' | 'prev') => {
    let nextIdx = direction === 'next' ? activeProjectIdx + 1 : activeProjectIdx - 1;
    if (nextIdx < 0) nextIdx = ALL_10_ARTIST_SHOWCASE.length - 1;
    if (nextIdx >= ALL_10_ARTIST_SHOWCASE.length) nextIdx = 0;
    setActiveProjectIdx(nextIdx);

    if (galleryTrackRef.current) {
      const card = galleryTrackRef.current.children[nextIdx] as HTMLElement;
      if (card) {
        galleryTrackRef.current.scrollTo({
          left: card.offsetLeft - 24,
          behavior: 'smooth'
        });
      }
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

        {/* Curated Creators Grid (Registered Marketplace Creators + All 10 Featured AI Artists) */}
        <div className="curated-creators-grid">
          {creatorsLoading ? (
            <div className="directory-loading-skeleton">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : (
            <>
              {/* 1. Authentic Registered Marketplace Creators (Active Accounts with Direct Inquiry) */}
              {(creators || []).filter((c: any) => {
                if (selectedDiscipline === 'All') return true;
                const disc = selectedDiscipline.toLowerCase();
                const d = c.data || {};
                return (
                  (Array.isArray(d.specializations) && d.specializations.some((s: string) => s.toLowerCase().includes(disc))) ||
                  (Array.isArray(d.tools) && d.tools.some((t: string) => t.toLowerCase().includes(disc)))
                );
              }).map((c: any) => {
                const d = c.data || {};
                const rateDisplay = d.rate > 0 
                  ? `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: d.currency || 'INR', maximumFractionDigits: 0 }).format(d.rate)} / starting`
                  : 'Rate on request';
                const coverSrc = d.cover ? (d.cover.startsWith('http') ? d.cover : `/api/files/${d.cover}`) : undefined;
                const avatarSrc = d.avatar ? (d.avatar.startsWith('http') ? d.avatar : `/api/files/${d.avatar}`) : undefined;
                return (
                  <article key={c.id || c.slug} className="creator-editorial-card">
                    <a href={`/creators/${c.slug}`} className="card-cover-media">
                      <CreatorCoverMedia
                        coverUrl={coverSrc}
                        name={d.name || 'AI Creator'}
                        specialization={Array.isArray(d.specializations) ? d.specializations[0] : 'AI Creative'}
                      />
                      <div className="card-rate-pill">
                        {rateDisplay}
                      </div>
                      <span className="card-hover-arrow">
                        <ArrowUpRight size={19} />
                      </span>
                    </a>

                    <div className="card-body">
                      <div className="card-author-line">
                        <CreatorAvatar
                          avatarUrl={avatarSrc}
                          name={d.name || 'Creator'}
                          className="author-avatar"
                        />
                        <div>
                          <a href={`/creators/${c.slug}`}>
                            <h4>{d.name || 'AI Creator'}</h4>
                          </a>
                          <span className="author-headline">{d.headline || 'Generative Specialist'}</span>
                        </div>
                      </div>

                      {d.bio && (
                        <p className="author-bio-snippet" style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {d.bio}
                        </p>
                      )}

                      <div className="author-tags-strip">
                        {(Array.isArray(d.tools) && d.tools.length > 0 ? d.tools : ['Runway', 'Midjourney', 'ComfyUI']).slice(0, 3).map((t: string) => (
                          <span key={t} className="tool-pill">{t}</span>
                        ))}
                      </div>

                      <div className="card-foot-meta">
                        <span className="status-label">
                          <span className={`status-dot ${d.availability === 'Available' ? 'available' : ''}`} />
                          {d.availability || 'Direct inquiry'}
                        </span>
                        <a href={`/creators/${c.slug}`} className="view-profile-link">
                          View Portfolio →
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* 2. All 10 Genuine Featured AI Artists (Complete Editorial Reference Showcase) */}
              {EXTERNAL_CREATOR_REFERENCES.filter((artist) => {
                if (selectedDiscipline === 'All') return true;
                const disc = selectedDiscipline.toLowerCase();
                return (
                  artist.specialization.toLowerCase().includes(disc) ||
                  artist.documentedTools.some(t => t.toLowerCase().includes(disc)) ||
                  artist.creativeStyles.some(s => s.toLowerCase().includes(disc))
                );
              }).map((artist) => {
                const primaryWork = artist.featuredWorks[0];
                return (
                  <article key={artist.slug} className="creator-editorial-card">
                    <a href={`/creators/${artist.slug}`} className="card-cover-media">
                      <img
                        src={artist.fallbackCover || `/creator-fallbacks/${artist.slug}.svg`}
                        alt=""
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="card-rate-pill" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', color: 'var(--accent)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        Editorial Reference
                      </div>
                      <span className="card-hover-arrow"><ArrowUpRight size={19} /></span>
                    </a>
                    <div className="card-body">
                      <div className="card-author-line">
                        <CreatorAvatar
                          avatarUrl={artist.avatarUrl}
                          name={artist.name}
                          className="author-avatar"
                        />
                        <div>
                          <a href={`/creators/${artist.slug}`}><h4>{artist.name}</h4></a>
                          <span className="author-headline">{artist.specialization}</span>
                        </div>
                      </div>

                      <p className="author-bio-snippet" style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {artist.bioSummary}
                      </p>

                      <div className="author-tags-strip">
                        {artist.documentedTools.slice(0, 3).map((t) => (
                          <span key={t} className="tool-pill">{t}</span>
                        ))}
                      </div>

                      {primaryWork && (
                        <div style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--raised)', padding: '6px 10px', borderRadius: 4, marginBottom: 14 }}>
                          Featured Work: <strong style={{ color: 'var(--text)' }}>{primaryWork.title}</strong>
                        </div>
                      )}

                      <div className="card-foot-meta">
                        <span className="status-label">
                          <Globe size={13} style={{ color: 'var(--accent)' }} />
                          {artist.featuredWorks.length} Original Works
                        </span>
                        <a href={`/creators/${artist.slug}`} className="view-profile-link">Explore Works →</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </>
          )}
        </div>
      </ScrollSection>

      {/* =========================================================================
          SECTION 05 — ALL 10 GENUINE AI ARTISTS SHOWCASE (THE PROOF OF WORK)
          Preserves heading: "THE CRAFT BEHIND THE GENERATION."
          Complete 4-Layer Architecture:
          Layer 1: 10-Artist Navigation Rail / Selector
          Layer 2: Featured Original Work Cards with Playable Video Embeds / Fallbacks
          Layer 3: "Explore All Works" CTA (/work)
          Layer 4: "Explore Featured Artists" CTA (/discover)
          ========================================================================= */}
      <ScrollSection id="work-gallery" className="story-section section-portfolio-gallery">
        <div className="gallery-header-bar">
          <div>
            <span className="section-eyebrow">05 / THE PROOF OF WORK</span>
            <RevealHeadline
              as="h2"
              lines={['THE CRAFT BEHIND', 'THE <em>GENERATION.</em>']}
              subtitle="Explore authentic published projects from all ten researched AI artists with exposed model architectures, documented pipelines, and verified original media."
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

        {/* Layer 1: Accessible Horizontal Artist Navigation Rail across all 10 Genuine Artists */}
        <div className="artist-showcase-nav-rail" role="tablist" aria-label="10 Featured AI Artists Selector">
          {ALL_10_ARTIST_SHOWCASE.map((item, idx) => (
            <button
              key={item.artistSlug}
              type="button"
              role="tab"
              aria-selected={activeProjectIdx === idx}
              className={`artist-nav-chip ${activeProjectIdx === idx ? 'active' : ''}`}
              onClick={() => {
                setActiveProjectIdx(idx);
                if (galleryTrackRef.current) {
                  const card = galleryTrackRef.current.children[idx] as HTMLElement;
                  if (card) {
                    galleryTrackRef.current.scrollTo({
                      left: card.offsetLeft - 24,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              <CreatorAvatar
                avatarUrl={item.artistAvatar}
                name={item.artistName}
                style={{ width: 22, height: 22, borderRadius: '50%' }}
              />
              <span className="artist-chip-name">{item.artistName}</span>
              {item.videoEmbedUrl && <Play size={10} fill="currentColor" style={{ color: 'var(--accent)', marginLeft: 2 }} />}
            </button>
          ))}
        </div>

        {/* Layer 2: Horizontal Project Showcase Carousel (One Clean Scroll Region, No Nested Vertical Scrollbars) */}
        <div className="portfolio-track-wrap" ref={galleryTrackRef} tabIndex={0} aria-label="Projects carousel track">
          {ALL_10_ARTIST_SHOWCASE.map((item) => (
            <article key={item.workId || item.title} className="gallery-project-card unified-showcase-card">
              {/* Media Region */}
              <div className="project-media-wrap">
                {item.videoEmbedUrl ? (
                  <VideoEmbed
                    title={item.title}
                    videoEmbedUrl={item.videoEmbedUrl}
                    videoPlatform={item.videoPlatform}
                    externalUrl={item.externalUrl}
                    aspectRatio="16/10"
                    attribution={item.attribution}
                  />
                ) : (
                  <a href={item.caseStudyUrl} style={{ display: 'block', textDecoration: 'none' }}>
                    <WorkMediaFallback
                      title={item.title}
                      contentType={item.contentType}
                      creatorName={item.artistName}
                      year={item.year}
                      aspectRatio="16/10"
                    />
                  </a>
                )}
              </div>

              {/* Project Information */}
              <div className="project-info-block" style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div className="project-category-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="category-label badge" style={{ fontSize: 10 }}>{item.contentType}</span>
                    <a href={item.profileUrl} className="author-label" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
                      by <strong style={{ color: 'var(--text)' }}>{item.artistName}</strong>
                    </a>
                  </div>
                  <h3 style={{ fontSize: 17, margin: '6px 0 8px', lineHeight: 1.3 }}>
                    <a href={item.caseStudyUrl} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                      {item.title}
                    </a>
                  </h3>
                  <div className="project-tools-row" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {item.tools.slice(0, 3).map((t: string) => (
                      <span key={t} className="tool-pill" style={{ fontSize: 10 }}>{t}</span>
                    ))}
                  </div>
                  <p className="project-workflow-snippet" style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.workflowNotes || item.description}
                  </p>
                </div>

                {/* Footer Attribution & Action Links */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="micro" style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {item.year || 'Documented Work'}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={item.caseStudyUrl} className="button secondary" style={{ fontSize: 11, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Case Study <ArrowUpRight size={12} />
                    </a>
                    <a href={item.profileUrl} className="button" style={{ fontSize: 11, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Artist Archive <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Layer 3 & 4: Clear CTAs to Explore All Works and Explore Featured Artists */}
        <div className="gallery-section-ctas" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <a href="/work" className="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px' }}>
            <span>Explore All Works (The Workroom)</span>
            <ArrowRight size={16} />
          </a>
          <a href="/discover" className="button secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 24px' }}>
            <span>Explore Featured Artists (Editorial Directory)</span>
            <ArrowUpRight size={16} />
          </a>
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
