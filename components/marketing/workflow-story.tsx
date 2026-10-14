'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Check,
  Search,
  Send,
  ArrowRight,
  Clock,
  FileText
} from 'lucide-react';

interface WorkflowStoryProps {
  creators?: any[];
}

export function WorkflowStory({ creators }: WorkflowStoryProps) {
  // 7 Streamlined Phases:
  // 0: Concept Input (Typing)
  // 1: Structured Brief (Extraction & Validation)
  // 2: Creator Search (Discovery Search & Chips)
  // 3: Capability Evaluation (Score Bars)
  // 4: Creator Selection (Candidate Card Emphasis)
  // 5: Invitation (Dispatch & Linked Brief)
  // 6: Collaboration (Lifecycle Milestones: Invite → Accept → Submit → Revise → Approve → Deliver)
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fullPromptText =
    'Create a cinematic campaign for a futuristic fashion collection, optimized for vertical social formats.';

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setCurrentStep(6);
        setTypedText(fullPromptText);
      }
      const listener = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) {
          setCurrentStep(6);
          setTypedText(fullPromptText);
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [fullPromptText]);

  // Viewport intersection observer (pause when offscreen)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Handle page visibility (pause when browser tab hidden)
  const [isTabActive, setIsTabActive] = useState(true);
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const shouldAnimate = isIntersecting && isTabActive && !prefersReducedMotion;

  // Typing animation for Step 0
  useEffect(() => {
    if (currentStep !== 0 || !shouldAnimate) {
      if (currentStep > 0) setTypedText(fullPromptText);
      return;
    }

    let index = 0;
    setTypedText('');
    const typingInterval = setInterval(() => {
      if (index < fullPromptText.length) {
        setTypedText(fullPromptText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        timerRef.current = setTimeout(() => {
          setCurrentStep(1);
        }, 1200);
      }
    }, 28);

    return () => {
      clearInterval(typingInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, shouldAnimate, fullPromptText]);

  // Step advancement timer for Steps 1 through 6
  useEffect(() => {
    if (currentStep === 0 || !shouldAnimate) {
      return;
    }

    const stepDurations: Record<number, number> = {
      1: 3000, // Structured brief
      2: 2400, // Creator search
      3: 3000, // Capability evaluation
      4: 2800, // Creator selection
      5: 2500, // Invitation dispatch
      6: 4200  // Collaboration hold before looping back
    };

    const duration = stepDurations[currentStep] || 2800;
    timerRef.current = setTimeout(() => {
      if (currentStep < 6) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Continuous smooth loop with readable pause
        setCurrentStep(0);
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, shouldAnimate]);

  const jumpToPhase = (step: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(step);
    if (step > 0) setTypedText(fullPromptText);
  };

  const stepLabels = [
    'Concept Input',
    'Structured Brief',
    'Creator Search',
    'Capability Evaluation',
    'Creator Selection',
    'Invitation Dispatch',
    'Collaboration Lifecycle'
  ];

  // Primary creator candidate (authorized illustrative data)
  const featuredCreator = (creators && creators.length > 0)
    ? creators[0]
    : {
        data: {
          name: 'Alice Wonder',
          headline: 'AI Filmmaker & Creative Director',
          avatar: '',
          tools: ['Runway Gen-3', 'Kling', 'ComfyUI', 'DaVinci'],
          styles: ['Cinematic', 'Luxury', 'Futuristic'],
          contentTypes: ['AI Video', 'AI Animation'],
          rate: 45000,
          currency: 'INR',
          turnaround: 7,
          revisions: 2
        },
        slug: 'alice-wonder',
        verification: 'Verified claims'
      };

  return (
    <div className="workflow-story-container" ref={containerRef}>
      {/* Editorial Phase Navigation Bar */}
      <div className="story-nav-header">
        <div className="story-step-indicator">
          <span className="step-tag">WORKFLOW TIMELINE</span>
          <span className="step-title">
            Phase 0{currentStep + 1} — {stepLabels[currentStep]}
          </span>
        </div>

        <div className="story-chapter-pills">
          <button
            type="button"
            className={`chapter-pill ${currentStep === 0 ? 'active' : ''}`}
            onClick={() => jumpToPhase(0)}
          >
            01. Concept
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => jumpToPhase(1)}
          >
            02. Structured Brief
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep >= 2 && currentStep <= 4 ? 'active' : ''}`}
            onClick={() => jumpToPhase(4)}
          >
            03. Talent Match
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep >= 5 ? 'active' : ''}`}
            onClick={() => jumpToPhase(6)}
          >
            04. Delivery Lifecycle
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="workflow-stage">
        {/* =========================================================================
            PANEL 1: CREATIVE INPUT & SPECIFICATION (Phases 0 - 1)
            ========================================================================= */}
        <div className={`stage-panel input-panel ${currentStep >= 2 ? 'condensed' : ''}`}>
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">01</span>
              <h4>Creative Conception & Extraction</h4>
            </div>
            <span className={`panel-status-pill ${currentStep >= 1 ? 'verified' : 'typing'}`}>
              {currentStep === 0 && 'Typing concept…'}
              {currentStep >= 1 && 'Parameters structured'}
            </span>
          </div>

          {/* Typing & Concept Box */}
          <div className={`concept-prompt-box ${currentStep >= 1 ? 'highlight-active' : ''}`}>
            <p className="typed-content">
              {currentStep === 0 ? (
                <>
                  {typedText}
                  <span className="typing-caret" aria-hidden="true">|</span>
                </>
              ) : (
                <>
                  Create a <span className="entity-tag">cinematic</span> campaign for a futuristic{' '}
                  <span className="entity-tag">fashion</span> collection, optimized for{' '}
                  <span className="entity-tag">vertical</span> social formats.
                </>
              )}
            </p>
            {currentStep >= 1 && (
              <div className="analysis-indicator-bar">
                <div className="indicator-sweep" />
              </div>
            )}
          </div>

          {/* Structured Parameters Grid (Phase 1) */}
          <div className={`extracted-params-grid ${currentStep >= 1 ? 'revealed' : ''}`}>
            <div className="param-item">
              <span className="param-label">CONTENT TYPE</span>
              <div className="param-value-row">
                <strong>AI Video & Animation</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className="param-item">
              <span className="param-label">CREATIVE STYLE</span>
              <div className="param-value-row">
                <strong>Cinematic / Futuristic</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className="param-item">
              <span className="param-label">FORMAT & RATIO</span>
              <div className="param-value-row">
                <strong>9:16 Vertical (4K)</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className="param-item">
              <span className="param-label">COMMERCIAL USE</span>
              <div className="param-value-row">
                <strong>Full Brand License</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className="param-item">
              <span className="param-label">TIMELINE</span>
              <div className="param-value-row">
                <strong>14 Days Production</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className="param-item">
              <span className="param-label">BUDGET ESTIMATE</span>
              <div className="param-value-row">
                <strong>₹45,000 – ₹75,000</strong>
                {currentStep >= 1 && <Check size={12} className="param-check" />}
              </div>
            </div>
          </div>

          {/* Structured Brief Summary Bar (Phase 1+) */}
          <div className={`structured-brief-card ${currentStep >= 1 ? 'ready' : ''}`}>
            <div className="brief-card-meta">
              <FileText size={16} className="brief-icon" />
              <div>
                <strong>Futuristic Fashion Cinematic Brief</strong>
                <span>Verified parameters ready for talent matching</span>
              </div>
            </div>
            <a href="/app/brand/campaigns/new" className="button hero-brief-btn">
              <span>Create Campaign</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: CREATOR DISCOVERY & COMPATIBILITY (Phases 2 - 4)
            ========================================================================= */}
        <div className={`stage-panel matching-panel ${currentStep >= 2 ? 'active-stage' : ''}`}>
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">02</span>
              <h4>Creator Discovery & Compatibility</h4>
            </div>
            <span className={`panel-status-pill ${currentStep >= 4 ? 'verified' : currentStep >= 2 ? 'searching' : 'standby'}`}>
              {currentStep < 2 && 'Waiting for brief…'}
              {currentStep === 2 && 'Filtering creator pool…'}
              {currentStep === 3 && 'Evaluating capability…'}
              {currentStep >= 4 && 'Match confirmed'}
            </span>
          </div>

          {/* Search Bar Visual */}
          <div className={`discovery-search-mockup ${currentStep >= 2 ? 'revealed' : ''}`}>
            <Search size={15} className="mockup-search-icon" />
            <span className="mockup-search-text">
              {currentStep >= 2 ? 'AI filmmaker fashion cinematic 9:16' : 'Search creators…'}
            </span>
          </div>

          {/* Active Filter Chips */}
          <div className={`matching-filter-chips ${currentStep >= 2 ? 'chips-in' : ''}`}>
            <span className="story-chip active">AI Video</span>
            <span className="story-chip active">Cinematic</span>
            <span className="story-chip active">Runway Gen-3</span>
            <span className="story-chip active">9:16 Format</span>
            <span className="story-chip">Available now</span>
          </div>

          {/* Compatibility Scoring (Phases 3 - 4) */}
          <div className={`scoring-metrics-card ${currentStep >= 3 ? 'visible' : ''}`}>
            <div className="metric-row">
              <span className="metric-name">Creative specialization fit</span>
              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{ width: currentStep >= 3 ? '98%' : '0%' }}
                />
              </div>
              <span className="metric-pct">98%</span>
            </div>

            <div className="metric-row">
              <span className="metric-name">AI tools compatibility (Gen-3, Kling)</span>
              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{ width: currentStep >= 3 ? '96%' : '0%' }}
                />
              </div>
              <span className="metric-pct">96%</span>
            </div>

            <div className="metric-row">
              <span className="metric-name">Output format & aspect ratio</span>
              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{ width: currentStep >= 3 ? '100%' : '0%' }}
                />
              </div>
              <span className="metric-pct">100%</span>
            </div>

            <div className="metric-row">
              <span className="metric-name">Brand aesthetic alignment</span>
              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{ width: currentStep >= 3 ? '94%' : '0%' }}
                />
              </div>
              <span className="metric-pct">94%</span>
            </div>

            <div className="metric-row">
              <span className="metric-name">Commercial rights capability</span>
              <div className="metric-track">
                <div
                  className="metric-fill"
                  style={{ width: currentStep >= 3 ? '100%' : '0%' }}
                />
              </div>
              <span className="metric-pct">100%</span>
            </div>
          </div>

          {/* Creator Match Card (Phases 4+) */}
          <div className={`matched-creator-card ${currentStep >= 4 ? 'revealed' : ''}`}>
            <div className="creator-card-header">
              <div className="creator-avatar-bubble">
                {featuredCreator.data?.avatar ? (
                  <img src={'/api/files/' + featuredCreator.data.avatar} alt="" />
                ) : (
                  <span>{featuredCreator.data?.name?.slice(0, 1) || 'A'}</span>
                )}
              </div>
              <div className="creator-card-info">
                <div className="creator-badge-row">
                  <span className="creator-name">{featuredCreator.data?.name || 'Alice Wonder'}</span>
                  <span className="match-score-badge">96% Compatibility</span>
                </div>
                <p className="creator-headline">{featuredCreator.data?.headline || 'AI Filmmaker & Creative Director'}</p>
              </div>
            </div>

            <div className="creator-card-tags">
              {(featuredCreator.data?.tools || ['Runway Gen-3', 'Midjourney', 'ComfyUI']).slice(0, 3).map((tool: string) => (
                <span key={tool} className="tool-pill">{tool}</span>
              ))}
              <span className="turnaround-pill">
                <Clock size={11} /> 7d typical turnaround
              </span>
            </div>
          </div>

          <div className="panel-action-row">
            <a href="/discover" className="button secondary stage-cta-btn">
              <span>Explore All Creators</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL 3: INVITATION DISPATCH & COLLABORATION PROGRESSION (Phases 5 - 6)
          ========================================================================= */}
      <div className={`collaboration-progression-drawer ${currentStep >= 5 ? 'expanded' : ''}`}>
        <div className="drawer-inner">
          <div className="drawer-header">
            <div className="drawer-title-group">
              <span className="drawer-phase-num">03</span>
              <div>
                <h5>Invitation & Shared Production Workspace</h5>
                <p>Structured milestones from accepted invitation to final rights delivery.</p>
              </div>
            </div>
            <div className="drawer-status-badge">
              {currentStep === 5 ? (
                <>
                  <Send size={13} className="dispatch-icon" />
                  <span>Dispatching Invitation…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} className="success-icon" />
                  <span>Workspace Active</span>
                </>
              )}
            </div>
          </div>

          {/* Stepper Milestones */}
          <div className="milestones-track">
            {[
              { id: 'invited', label: '1. Invited', desc: 'Brief & budget linked' },
              { id: 'accepted', label: '2. Accepted', desc: 'Terms agreed' },
              { id: 'submitted', label: '3. Submitted', desc: 'First cut uploaded' },
              { id: 'revision', label: '4. Revision', desc: 'Frame feedback' },
              { id: 'approved', label: '5. Approved', desc: 'Version finalized' },
              { id: 'delivered', label: '6. Delivered', desc: 'Commercial handoff' }
            ].map((m, idx) => {
              const isPassed = currentStep === 6 || (currentStep === 5 && idx === 0);
              const isCurrent = currentStep === 5 ? idx === 0 : idx === 5;
              return (
                <div key={m.id} className={`milestone-step ${isPassed ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-marker">
                    {isPassed ? <Check size={11} /> : <span>0{idx + 1}</span>}
                  </div>
                  <strong className="step-label">{m.label}</strong>
                  <span className="step-desc">{m.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowStory;
