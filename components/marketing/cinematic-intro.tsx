'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface CinematicIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function CinematicIntro({ onComplete, forceShow = false }: CinematicIntroProps) {
  // Stages:
  // 0: Initial Dark Canvas & Fine Accent Line (0.0 - 0.7s)
  // 1: Symbol & Wordmark Mask Reveal (0.7 - 1.5s)
  // 2: "CREATIVITY. CONNECTED." Editorial Headline (1.5 - 2.5s)
  // 3: Kinetic Lines & Editorial Geometry (2.5 - 3.5s)
  // 4: Fullscreen Clean Media Wipe (3.5 - 4.4s)
  // 5: Complete & Dismount (4.5s)
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem('creaxa_cinematic_intro_seen', '1');
    } catch {}
    setIsVisible(false);
    document.body.style.overflow = '';
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    setHasMounted(true);

    // Check if user already saw the intro in this browser session
    try {
      const alreadySeen = sessionStorage.getItem('creaxa_cinematic_intro_seen');
      if (alreadySeen && !forceShow) {
        onComplete?.();
        return;
      }
    } catch {}

    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        dismissIntro();
        return;
      }
    }

    // Begin sequence
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Sequence timers (crisp, lightweight ~0.85s brand reveal)
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 450);
    const t3 = setTimeout(() => setStage(4), 700);
    const t4 = setTimeout(() => {
      dismissIntro();
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = '';
    };
  }, [forceShow, dismissIntro, onComplete]);

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dismissIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, dismissIntro]);

  if (!hasMounted || !isVisible) {
    return null;
  }

  return (
    <aside
      className={`cinematic-intro-overlay stage-${stage}`}
      aria-label="CreaXa opening title"
      role="dialog"
      aria-modal="true"
    >
      {/* Skip Intro Button */}
      <div className="intro-topbar">
        <span className="intro-meta-label">CX // 2026 EDITORIAL TITLE</span>
        <button
          type="button"
          onClick={dismissIntro}
          className="skip-intro-btn"
          aria-label="Skip cinematic opening"
        >
          <span>Skip Intro</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Main Canvas Presentation */}
      <div className="intro-canvas-center">
        {/* Fine Accent Line (Stage 0) */}
        <div className="intro-lead-line" />

        {/* 2D CreaXa Geometric Monogram Symbol (Stage 1) */}
        <div className={`intro-symbol-container ${stage >= 1 ? 'visible' : ''}`}>
          <svg
            className="intro-monogram-svg"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Precise kinetic geometric vector strokes */}
            <path
              className="intro-vector-bar bar-1"
              d="M30 18L18 82"
              stroke="var(--accent)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              className="intro-vector-bar bar-2"
              d="M50 18L50 82"
              stroke="var(--foreground, #ffffff)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              className="intro-vector-bar bar-3"
              d="M70 18L82 82"
              stroke="var(--accent)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              className="intro-vector-orbit"
              cx="50"
              cy="50"
              r="40"
              stroke="var(--line, #333333)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        {/* Wordmark (Stage 1+) */}
        <div className={`intro-wordmark-wrap ${stage >= 1 ? 'revealed' : ''}`}>
          <h2 className="intro-wordmark">
            CreaXa<span>.</span>
          </h2>
          <span className="intro-tagline">HUMAN VISION. GENERATIVE CRAFT.</span>
        </div>

        {/* Dramatic Line-by-Line Editorial Headline (Stage 2 - 3) */}
        <div className={`intro-headline-wrap ${stage >= 2 ? 'active' : ''}`}>
          <div className="headline-line-box">
            <span className="headline-line line-1">CREATIVITY.</span>
          </div>
          <div className="headline-line-box">
            <span className="headline-line line-2">
              <em>CONNECTED.</em>
            </span>
          </div>
        </div>

        {/* Abstract Editorial Kinetic Lines (Stage 3) */}
        <div className={`intro-kinetic-grid ${stage >= 3 ? 'drawn' : ''}`}>
          <div className="grid-wire wire-h1" />
          <div className="grid-wire wire-h2" />
          <div className="grid-wire wire-v1" />
          <div className="grid-wire wire-v2" />
          <span className="grid-spec-label label-left">PARADIGM 01 // DISCOVERY</span>
          <span className="grid-spec-label label-right">PARADIGM 02 // VERIFIED WORKFLOW</span>
        </div>
      </div>

      {/* Stage 4: Fullscreen Wipe Curtain */}
      <div className={`intro-wipe-curtain ${stage >= 4 ? 'wipe-active' : ''}`}>
        <div className="curtain-slice slice-top" />
        <div className="curtain-slice slice-bottom" />
      </div>
    </aside>
  );
}

export default CinematicIntro;
