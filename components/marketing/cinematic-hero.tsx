'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Sparkles,
  Star,
  Film,
  Layers,
  Shield,
  Play,
  Sliders,
  CheckCircle2,
  Zap,
  Box,
  Compass,
  Cpu
} from 'lucide-react';

// ==============================================================================
// 1. HOOK: useHeroParallax
// Provides smooth, spring-damped mouse parallax coordinates
// ==============================================================================
function useHeroParallax() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalize between -1 and 1
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
    setCoords({ x: normX, y: normY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoords({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Check prefers-reduced-motion
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { containerRef, coords };
}

// ==============================================================================
// 2. COMPONENT: HeroMarquee
// Seamless infinite ticker with creator specializations and glowing diamonds
// ==============================================================================
const MARQUEE_ITEMS = [
  'AI Filmmaking',
  'Generative Media Art',
  'Surreal Visual Storytelling',
  'AI Animation',
  'Computational Typography',
  'Robotic Drawing',
  'Digital Haute Couture',
  'Dataset Art',
  'Commercial VFX',
  'Post-Photography',
  'Prompt Direction',
  'Synthetic Cinematic Worlds'
];

export function HeroMarquee() {
  return (
    <div className="hero-marquee-wrapper" aria-label="Creator Disciplines">
      <div className="hero-marquee-track">
        {/* Render twice for continuous loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={`${item}-${idx}`} className="hero-marquee-item">
            <span className="marquee-diamond">◆</span>
            <span className="marquee-text">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 3. COMPONENT: HeroVisualCollage
// The iconic 4-layer floating creative showcase cluster inspired by reference
// ==============================================================================
interface HeroVisualCollageProps {
  coords: { x: number; y: number };
  activeSlide: number;
  onSelectSlide: (idx: number) => void;
}

export function HeroVisualCollage({ coords, activeSlide, onSelectSlide }: HeroVisualCollageProps) {
  // Featured creators data to cycle when dots clicked
  const SHOWCASE_CARDS = [
    {
      name: 'Paul Trillo',
      handle: '@paultrillo',
      role: 'AI Filmmaking & Sora Director',
      rating: '5.0',
      matchScore: '98%',
      avatar: '/creator-fallbacks/paul-trillo.svg',
      slug: 'paul-trillo',
      tag: 'DIRECTOR / SORA'
    },
    {
      name: 'Refik Anadol',
      handle: '@refikanadol',
      role: 'Generative Media & MoMA ML Artist',
      rating: '5.0',
      matchScore: '99%',
      avatar: '/licensed-portraits/refik-anadol.png',
      slug: 'refik-anadol',
      tag: 'DATA SCULPTOR'
    },
    {
      name: 'niceaunties',
      handle: '@niceaunties',
      role: 'Surreal AI World-Builder',
      rating: '4.9',
      matchScore: '96%',
      avatar: '/creator-fallbacks/niceaunties.svg',
      slug: 'niceaunties',
      tag: 'AUNTIEVERSE'
    },
    {
      name: 'Claire Silver',
      handle: '@clairesilver8',
      role: 'AI Digital Haute Couture',
      rating: '5.0',
      matchScore: '97%',
      avatar: '/creator-fallbacks/claire-silver.svg',
      slug: 'claire-silver',
      tag: 'GUCCI VAULT'
    }
  ];

  const current = SHOWCASE_CARDS[activeSlide % SHOWCASE_CARDS.length];

  return (
    <div className="hero-collage-container">
      {/* Background radial spotlight glow */}
      <div className="hero-radial-glow" />

      {/* Futuristic thin vector orbital ellipse line */}
      <svg
        className="hero-orbital-svg"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${coords.x * 12}px, ${coords.y * 12}px)`
        }}
      >
        <ellipse
          cx="300"
          cy="280"
          rx="260"
          ry="170"
          transform="rotate(-18 300 280)"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          className="orbital-path-ellipse"
        />
        <circle cx="160" cy="180" r="4" fill="var(--accent)" className="orbital-dot-pulse" />
        <circle cx="480" cy="360" r="3" fill="var(--accent)" className="orbital-dot-pulse-slow" />
      </svg>

      {/* Floating mini tool/sparkle pill */}
      <div
        className="hero-floating-tool-pill"
        style={{
          transform: `translate(${coords.x * -16}px, ${coords.y * -16}px)`
        }}
      >
        <Sparkles size={13} className="pill-accent-icon" />
        <span>AI MATCHED</span>
      </div>

      {/* ===================================================================
          CARD 2: TOP-MIDGROUND 3D ABSTRACT FLUID GRADIENT SCULPTURE
          =================================================================== */}
      <div
        className="hero-subcard hero-subcard-fluid"
        style={{
          transform: `translate(${coords.x * -18}px, ${coords.y * -18}px) rotate(${coords.x * -3}deg)`
        }}
      >
        <div className="fluid-art-canvas">
          {/* S-curve 3D fluid gradient representation */}
          <div className="fluid-gradient-mesh" />
          <div className="fluid-art-tag">
            <span>SYNTHETIC 3D</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          CARD 3: BOTTOM-LEFT CINEMATIC FILMMAKER PORTRAIT
          =================================================================== */}
      <div
        className="hero-subcard hero-subcard-filmmaker"
        style={{
          transform: `translate(${coords.x * 22}px, ${coords.y * 22}px)`
        }}
      >
        <div className="filmmaker-inner">
          <img
            src="/creator-fallbacks/paul-trillo.svg"
            alt="Paul Trillo — AI Director"
            className="filmmaker-img"
            loading="lazy"
          />
          <div className="filmmaker-badge">
            <Film size={11} />
            <span>AI CINEMATOGRAPHY</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          CARD 4: RIGHT-MIDGROUND IRIDESCENT DISC SCULPTURE
          =================================================================== */}
      <div
        className="hero-subcard hero-subcard-disc"
        style={{
          transform: `translate(${coords.x * -24}px, ${coords.y * -14}px)`
        }}
      >
        <div className="disc-art-canvas">
          <div className="iridescent-disc-shape" />
          <div className="disc-metadata">
            <span className="disc-title">Audio & VFX</span>
            <span className="disc-rating">★ 5.0</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          CARD 1: PRIMARY FOREGROUND LIME CREATOR CARD (STAR ELEMENT)
          =================================================================== */}
      <div
        className="hero-main-card"
        style={{
          transform: `perspective(1000px) translate(${coords.x * 14}px, ${coords.y * 14}px) rotateX(${
            coords.y * -5
          }deg) rotateY(${coords.x * 6}deg)`
        }}
      >
        <div className="main-card-header">
          <a
            href={`/creators/${current.slug}`}
            className="main-card-expand-btn"
            aria-label={`Open ${current.name} profile`}
          >
            <ArrowUpRight size={16} />
          </a>
          <span className="main-card-tag">{current.tag}</span>
        </div>

        {/* Inner Portrait Image */}
        <div className="main-card-portrait-wrap">
          <img
            src={current.avatar}
            alt={current.name}
            className="main-card-portrait-img"
          />
          <div className="portrait-glow-overlay" />
        </div>

        {/* Creator Info Footer */}
        <div className="main-card-footer">
          <div className="main-card-title-row">
            <h3 className="main-card-name">{current.name}</h3>
            <div className="main-card-stars">
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
            </div>
          </div>
          <p className="main-card-role">{current.role}</p>
        </div>

        {/* Floating Verified Mini Badge on Bottom Edge */}
        <a href={`/creators/${current.slug}`} className="hero-mini-floating-badge">
          <div className="badge-avatar-dot">
            <img src={current.avatar} alt="" />
          </div>
          <div className="badge-info">
            <span className="badge-handle">{current.handle}</span>
            <span className="badge-score">★ {current.rating} · {current.matchScore}</span>
          </div>
        </a>
      </div>

      {/* Floating lime ambient orb */}
      <div
        className="hero-ambient-lime-orb"
        style={{
          transform: `translate(${coords.x * -10}px, ${coords.y * 12}px)`
        }}
      />
    </div>
  );
}

// ==============================================================================
// 4. MAIN EXPORT: CinematicHero
// The complete, responsive, animated hero section for CreaXa
// ==============================================================================
interface CinematicHeroProps {
  creatorCount?: number;
}

export function CinematicHero({ creatorCount = 10 }: CinematicHeroProps) {
  const { containerRef, coords } = useHeroParallax();
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-cycle through the 4 showcase cards every 6 seconds if user is idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="cinematic-hero-root" ref={containerRef} aria-label="CreaXa Hero">
      <div className="hero-inner-container">
        
        {/* ===================================================================
            LEFT COLUMN: EDITORIAL TYPOGRAPHY & ACTIONS
            =================================================================== */}
        <div className="hero-left-col">
          {/* Eyebrow Pill */}
          <div className="hero-eyebrow-pill">
            <span className="eyebrow-brand">CREAXA</span>
            <span className="eyebrow-sep">→</span>
            <span className="eyebrow-desc">AI CREATOR MARKETPLACE</span>
          </div>

          {/* Staggered Mask Headline */}
          <h1 className="hero-editorial-headline">
            <span className="headline-line">
              <span className="headline-text">Find exceptional</span>
            </span>
            <span className="headline-line">
              <span className="headline-text">
                <em className="headline-accent">AI creative talent</em>
              </span>
            </span>
            <span className="headline-line">
              <span className="headline-text">for bold brand stories.</span>
            </span>
          </h1>

          {/* Subtitle Copy */}
          <p className="hero-editorial-sub">
            Explore AI filmmakers, animators, and generative artists through authentic portfolios,
            structured creative briefs, and collaboration-first workflows.
          </p>

          {/* Action Button Cluster */}
          <div className="hero-cta-cluster">
            <a href="/discover" className="button hero-btn-primary" id="hero-explore-creators">
              <span>Explore Creators</span>
              <ArrowRight size={17} className="cta-icon-slide" />
            </a>
            <a href="/app/brand/campaigns/new" className="button secondary hero-btn-secondary" id="hero-create-brief">
              <span>Create a Brief</span>
              <ArrowUpRight size={16} className="cta-icon-fade" />
            </a>
          </div>

          {/* Trust Indicators / Stats */}
          <div className="hero-trust-strip">
            <div className="trust-pill">
              <span className="trust-num">10</span>
              <span className="trust-label">Verified AI Pioneers</span>
            </div>
            <span className="trust-dot">•</span>
            <div className="trust-pill">
              <span className="trust-num">59+</span>
              <span className="trust-label">Original Works</span>
            </div>
            <span className="trust-dot">•</span>
            <div className="trust-pill">
              <span className="trust-num">100%</span>
              <span className="trust-label">Sourced Attribution</span>
            </div>
          </div>

          {/* Progress / Slider Dots (Inspired by Reference Image) */}
          <div className="hero-slider-pills" role="tablist" aria-label="Featured creator navigation">
            {[0, 1, 2, 3].map(idx => (
              <button
                key={idx}
                type="button"
                className={`slider-pill-btn ${activeSlide === idx ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Select creator card ${idx + 1}`}
                role="tab"
                aria-selected={activeSlide === idx}
              />
            ))}
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: LAYERED FLOATING COLLAGE CLUSTER
            =================================================================== */}
        <div className="hero-right-col">
          <HeroVisualCollage
            coords={coords}
            activeSlide={activeSlide}
            onSelectSlide={setActiveSlide}
          />
        </div>

      </div>

      {/* Bottom Scroll Cue */}
      <div className="hero-scroll-cue-wrap">
        <a href="#discovery-problem" className="hero-scroll-cue" aria-label="Scroll down to explore">
          <div className="scroll-cue-mouse">
            <div className="scroll-cue-wheel" />
          </div>
          <span>SCROLL TO EXPLORE</span>
        </a>
      </div>

      {/* Full-width Category Marquee Strip */}
      <HeroMarquee />
    </section>
  );
}
