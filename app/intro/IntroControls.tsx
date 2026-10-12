'use client';

import React from 'react';
import { Volume2, VolumeX, ArrowDown, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { ShowcaseProject } from './types';
import { SHOWCASE_PROJECTS } from './geometry/createCardGeometry';

interface IntroControlsProps {
  progress: number;
  isStarted: boolean;
  soundEnabled: boolean;
  activeCategory: string;
  onStart: () => void;
  onToggleSound: () => void;
  onSelectCategory: (cat: string) => void;
  onSkip: () => void;
}

export const CATEGORIES = [
  'AI FILMMAKING',
  'GENERATIVE ART',
  'MOTION & ANIMATION',
  '3D & XR REALMS',
  'PRODUCT CREATIVE'
];

export function IntroControls({
  progress,
  isStarted,
  soundEnabled,
  activeCategory,
  onStart,
  onToggleSound,
  onSelectCategory,
  onSkip
}: IntroControlsProps) {
  // Scene-dependent overlay opacities
  const heroOpacity = Math.max(0, 1 - progress * 4.0);
  const headlineOpacity = Math.max(0, Math.min(1, (progress - 0.12) * 4.0)) * Math.max(0, 1 - (progress - 0.42) * 4.0);
  const showcaseOpacity = Math.max(0, Math.min(1, (progress - 0.38) * 4.0)) * Math.max(0, 1 - (progress - 0.85) * 4.0);
  const transitionOpacity = Math.max(0, (progress - 0.82) * 5.0);

  return (
    <div className="intro-overlay" aria-label="3D Experience Controls">
      {/* 1. INITIAL PRELOADER / START TRIGGER */}
      {!isStarted && (
        <div className="intro-preloader">
          <div className="preloader-art">
            <span className="mono-label">CREAXA // SYSTEM.INIT</span>
            <div className="ascii-ring">
              <pre>{`
      .-'''''-.      
    .'  * * *  '.    
   /  *   CX  *  \\   
  |  *  NEXUS  *  |  
   \\  *   3D  *  /   
    '.  * * *  .'    
      '-.....-'      
              `}</pre>
            </div>
            <button
              className="enter-btn"
              onClick={onStart}
              aria-label="Enter 3D Experience"
            >
              <span className="pulse-dot" />
              <span>/ &gt;&gt;&gt; / ENTER 3D EXPERIENCE</span>
            </button>
            <span className="counter-label">/ 30 COMPLETE · CLICK OR SCROLL</span>
          </div>
        </div>
      )}

      {/* 2. TOP FLOATING NAVIGATION PILL (matching reference frame_005) */}
      <div className="top-nav-pill-wrapper">
        <div className="nav-pill">
          <button
            className="pill-link"
            onClick={() => onSelectCategory(CATEGORIES[0])}
            aria-label="Explore 3D Work"
          >
            EXPLORE
          </button>
          <span className="pill-divider">────────</span>
          <a
            href="/discover"
            className="pill-link"
            aria-label="Discover Creators Directory"
          >
            DISCOVER
          </a>
          <button
            className="pill-icon-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            className="pill-skip-btn"
            onClick={onSkip}
            aria-label="Skip 3D Intro and enter marketplace"
          >
            SKIP INTRO ↗
          </button>
        </div>
        <div className="pill-glow" />
      </div>

      {/* 3. HERO OVERLAYS (Progress 0.0 - 0.25) */}
      {heroOpacity > 0.01 && (
        <div
          className="intro-scene-hero"
          style={{ opacity: heroOpacity, pointerEvents: heroOpacity > 0.5 ? 'auto' : 'none' }}
        >
          <div className="hero-badge">
            <span className="live-dot" />
            <span>THE REAL-TIME 3D CREATIVE NEXUS</span>
          </div>
          <div className="hero-scroll-prompt">
            <div className="scroll-mouse-icon">
              <span className="wheel-dot" />
            </div>
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <span className="tech-coord">CX / 3D.NEXUS.001</span>
          </div>
        </div>
      )}

      {/* 4. SCENE 1 HEADLINE & NARRATIVE (Progress 0.25 - 0.55) */}
      {headlineOpacity > 0.01 && (
        <div
          className="intro-scene-headline"
          style={{ opacity: headlineOpacity, pointerEvents: headlineOpacity > 0.5 ? 'auto' : 'none' }}
        >
          <div className="headline-content">
            <span className="eyebrow">A NEW KIND OF CREATIVE CONNECTION</span>
            <h1>
              INTELLIGENT<br />
              CREATIVE<br />
              MATCHING<span className="cyan-dot">.</span>
            </h1>
            <p>
              Big ideas deserve the right people. Discover elite AI filmmakers, 3D artists,
              and generative visionaries turning concepts into reality.
            </p>
          </div>
          <div className="headline-meta">
            <span>IN-HOUSE EXCELLENCE · ZERO PLACEHOLDERS</span>
            <span>VERIFIED CAPABILITIES · DIRECT ENGAGEMENT</span>
          </div>
        </div>
      )}

      {/* 5. SCENE 2 CATEGORY MATRIX & WORK INQUIRY (Progress 0.45 - 0.85) */}
      {showcaseOpacity > 0.01 && (
        <div
          className="intro-scene-showcase"
          style={{ opacity: showcaseOpacity, pointerEvents: showcaseOpacity > 0.5 ? 'auto' : 'none' }}
        >
          <div className="category-sidebar">
            <span className="sidebar-title">WHAT ARE YOU LOOKING FOR?</span>
            <div className="category-list">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  <span className="cat-arrow">-&gt;</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
            <a
              href="/app/brand/campaigns/new"
              className="ask-anything-pill"
              aria-label="Start a campaign inquiry"
            >
              <span>START A CAMPAIGN...</span>
              <Sparkles size={14} />
            </a>
          </div>

          <div className="active-card-indicator">
            <span className="indicator-title">FEATURED WORK IN 3D ORBIT</span>
            <span className="indicator-sub">ORBITING CREAXA TALENT COLLABORATIONS</span>
          </div>
        </div>
      )}

      {/* 6. SCENE 3 CONVERGENCE & HOMEPAGE TRANSITION (Progress 0.85 - 1.0) */}
      {transitionOpacity > 0.01 && (
        <div
          className="intro-scene-transition"
          style={{ opacity: transitionOpacity }}
        >
          <div className="transition-card">
            <span className="transition-eyebrow">REVEALING MARKETPLACE</span>
            <h2>CREAXA WORKSPACE</h2>
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, (progress - 0.85) * 666)}%` }}
              />
            </div>
            <span className="transition-hint">TRANSITIONING TO THE MAIN DIRECTORY...</span>
          </div>
        </div>
      )}

      {/* BOTTOM FIXED METADATA STRIP */}
      <div className="bottom-metadata-strip">
        <div className="meta-left">
          <span className="status-dot available" />
          <span>REAL-TIME WEBGL 2.0 ENGINE</span>
        </div>
        <div className="meta-center">
          <span className="progress-numeric">{(progress * 100).toFixed(0)}% PROGRESS</span>
        </div>
        <div className="meta-right">
          <span>HUMAN VISION · AI CAPABILITY</span>
        </div>
      </div>
    </div>
  );
}
