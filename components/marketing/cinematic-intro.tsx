'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

// ==============================================================================
// Web Audio API Chime Synthesizer
// Completely self-contained, browser-safe, zero external MP3 latency or 404s
// ==============================================================================
function playIntroChime(muted: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const t = ctx.currentTime;

    // Master volume (gentle, warm, premium)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, t);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
    masterGain.connect(ctx.destination);

    // Fundamental note: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t);
    osc1.connect(masterGain);

    // Harmonic fifth: A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, t);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.04, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.9);
    osc2.stop(t + 0.7);
  } catch {
    // Autoplay restrictions or headless environments fail silently
  }
}

// ==============================================================================
// CINEMATIC 5.5-SECOND BRAND SEQUENCE: CreaXa → Powered By CodeXa
// ==============================================================================
export function CinematicIntro({ onComplete, forceShow = false }: CinematicIntroProps) {
  // Phases:
  // 0: Initial clean dark screen -> centered large "C" appears (0.0s - 0.8s)
  // 1: Sound chime triggers, "C" moves left (0.8s - 1.5s)
  // 2: "reaXa" completes wordmark, "X" is 20% larger & lime (1.5s - 2.5s)
  // 3: "CREATIVITY. CONNECTED." tagline & lime line reveal (2.5s - 3.3s)
  // 4: "Powered By CodeXa" prominent reveal (3.3s - 4.6s)
  // 5: Recede & thin lime wipe transition (4.6s - 5.5s)
  // 6: Complete & unmount (5.5s)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const soundPlayedRef = useRef(false);

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem('creaxa_brand_intro_seen_v2', '1');
    } catch {}
    setIsVisible(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Check if user already saw the intro in this browser session
    try {
      const alreadySeen = sessionStorage.getItem('creaxa_brand_intro_seen_v2');
      if (alreadySeen && !forceShow) {
        onComplete?.();
        return;
      }
    } catch {}

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        dismissIntro();
        return;
      }
    }

    setIsVisible(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Storyboard Timers (Target: 5.5s total)
    // 00:00.8: Phase 1 - C moves left & chime sounds
    const t1 = setTimeout(() => {
      setPhase(1);
      if (!soundPlayedRef.current) {
        soundPlayedRef.current = true;
        playIntroChime(muted);
      }
    }, 800);

    // 00:01.5: Phase 2 - CreaXa wordmark completes with larger lime X
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 1500);

    // 00:02.5: Phase 3 - Tagline "CREATIVITY. CONNECTED." reveals
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 2500);

    // 00:03.3: Phase 4 - "Powered By CodeXa" reveals from below
    const t4 = setTimeout(() => {
      setPhase(4);
    }, 3300);

    // 00:04.6: Phase 5 - Logo recedes, thin lime wipe curtain activates
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 4600);

    // 00:05.5: Phase 6 - Dismount & unveil homepage hero
    const t6 = setTimeout(() => {
      dismissIntro();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [forceShow, dismissIntro, onComplete, muted]);

  // Keyboard accessibility: Escape, Space, or Enter to skip
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

  if (!isVisible) return null;

  return (
    <aside
      className={`creaxa-intro-viewport phase-${phase}`}
      aria-label="CreaXa opening brand sequence"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Controls: Sound toggle & Skip Intro */}
      <div className="intro-top-controls">
        <div className="intro-system-tag">
          <span className="system-dot" />
          <span>CREAXA PRODUCTION 2026</span>
        </div>

        <div className="intro-actions-cluster">
          <button
            type="button"
            className="intro-icon-toggle"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute intro audio' : 'Mute intro audio'}
            title={muted ? 'Unmute audio' : 'Mute audio'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onClick={dismissIntro}
            className="intro-skip-button"
            aria-label="Skip brand opening animation"
          >
            <span>Skip Intro</span>
            <ArrowRight size={13} className="skip-arrow" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Stage */}
      <div className="intro-stage-center">
        {/* Main Wordmark Container */}
        <div className={`brand-lockup-stage phase-stage-${phase}`}>
          
          {/* The Initial "C" (starts dead center, glides left in phase 1+) */}
          <div className="brand-letter-c-wrap">
            <span className="brand-letter-c">C</span>
          </div>

          {/* Sequential Remaining Characters (revealed in phase 2+) */}
          <div className="brand-remaining-letters">
            <span className="brand-char char-r">r</span>
            <span className="brand-char char-e">e</span>
            <span className="brand-char char-a">a</span>
            {/* The signature lime-accented, 20% larger "X" */}
            <span className="brand-char char-x">X</span>
            <span className="brand-char char-a2">a</span>
          </div>
        </div>

        {/* Phase 3: Tagline "CREATIVITY. CONNECTED." */}
        <div className={`brand-tagline-container ${phase >= 3 ? 'visible' : ''}`}>
          <div className="brand-accent-line" />
          <h3 className="brand-tagline-text">
            <span>CREATIVITY.</span>
            <span className="tagline-dot">•</span>
            <span>CONNECTED.</span>
          </h3>
        </div>

        {/* Phase 4: Prominent "Powered By CodeXa" */}
        <div className={`brand-codexa-container ${phase >= 4 ? 'visible' : ''}`}>
          <div className="codexa-badge-inner">
            <span className="codexa-prefix">POWERED BY</span>
            <span className="codexa-brandname">
              Code<span className="codexa-lime-x">X</span>a
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="intro-bottom-strip">
        <div className="intro-progress-track">
          <div className="intro-progress-fill" />
        </div>
      </div>

      {/* Phase 5 Transition: Thin lime horizontal wipe & fade */}
      <div className={`intro-lime-wipe-screen ${phase >= 5 ? 'active' : ''}`} />
    </aside>
  );
}

export default CinematicIntro;
