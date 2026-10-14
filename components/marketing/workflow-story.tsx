'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  Cpu,
  Search,
  Send,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  Shield,
  Clock,
  Layers,
  RotateCcw,
  Play,
  Pause,
  SlidersHorizontal,
  FolderCheck,
  FileText
} from 'lucide-react';

interface WorkflowStoryProps {
  creators?: any[];
}

export function WorkflowStory({ creators }: WorkflowStoryProps) {
  // Sequence 0 to 9 representing the 10 storyboard steps:
  // 0: Typing
  // 1: Analysis
  // 2: Extraction
  // 3: Validation / Verification
  // 4: Brief Completion
  // 5: Creator Search
  // 6: Compatibility Scoring
  // 7: Matching Creator Cards
  // 8: Invitation Sending
  // 9: Collaboration Progression
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
        setCurrentStep(9);
        setTypedText(fullPromptText);
        setIsPlaying(false);
      }
      const listener = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) {
          setCurrentStep(9);
          setTypedText(fullPromptText);
          setIsPlaying(false);
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [fullPromptText]);

  // Viewport intersection observer
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

  // Handle page visibility (pause when tab hidden)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else if (isIntersecting && !prefersReducedMotion) {
        setIsPlaying(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isIntersecting, prefersReducedMotion]);

  // Typing animation for Step 0
  useEffect(() => {
    if (currentStep !== 0 || !isPlaying || !isIntersecting || prefersReducedMotion) {
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
        // Advance to Step 1 after typing finishes
        timerRef.current = setTimeout(() => {
          setCurrentStep(1);
        }, 1200);
      }
    }, 28);

    return () => {
      clearInterval(typingInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, isPlaying, isIntersecting, prefersReducedMotion, fullPromptText]);

  // Step advancement timer for Steps 1 through 9
  useEffect(() => {
    if (currentStep === 0 || !isPlaying || !isIntersecting || prefersReducedMotion) {
      return;
    }

    const stepDurations: Record<number, number> = {
      1: 2200, // Analysis
      2: 2600, // Extraction
      3: 2200, // Verification visual
      4: 2500, // Brief completion
      5: 2200, // Creator search
      6: 2800, // Compatibility scoring
      7: 2800, // Matching creator cards
      8: 2400, // Invitation preparation
      9: 4500  // Collaboration progression (hold final)
    };

    const duration = stepDurations[currentStep] || 2500;
    timerRef.current = setTimeout(() => {
      if (currentStep < 9) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Loop back after holding final state
        setCurrentStep(0);
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, isPlaying, isIntersecting, prefersReducedMotion]);

  const jumpToPhase = (step: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(step);
    if (step > 0) setTypedText(fullPromptText);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(0);
    setTypedText('');
    setIsPlaying(true);
  };

  const stepLabels = [
    'Concept Conception',
    'AI Input Analysis',
    'Requirement Extraction',
    'Format Validation',
    'Structured Brief',
    'Creator Discovery',
    'Compatibility Evaluation',
    'Ranked Creator Match',
    'Invitation Dispatch',
    'Collaboration Lifecycle'
  ];

  // Primary creator candidate
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
        verification: 'Verified portfolio claims'
      };

  return (
    <div className="workflow-story-container" ref={containerRef}>
      {/* Editorial Chapter Navigation Bar */}
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
            className={`chapter-pill ${currentStep <= 2 ? 'active' : ''}`}
            onClick={() => jumpToPhase(0)}
          >
            01. Ideation & Specs
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep === 3 || currentStep === 4 ? 'active' : ''}`}
            onClick={() => jumpToPhase(4)}
          >
            02. Structured Brief
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep >= 5 && currentStep <= 7 ? 'active' : ''}`}
            onClick={() => jumpToPhase(7)}
          >
            03. Talent Match
          </button>
          <button
            type="button"
            className={`chapter-pill ${currentStep >= 8 ? 'active' : ''}`}
            onClick={() => jumpToPhase(9)}
          >
            04. Delivery Lifecycle
          </button>
        </div>

        <div className="story-controls">
          <button
            type="button"
            className="control-icon-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            className="control-icon-btn"
            onClick={restart}
            aria-label="Restart workflow sequence"
            title="Restart"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="workflow-stage">
        {/* =========================================================================
            PANEL 1: CREATIVE INPUT & SPECIFICATION (Sequences 0 - 4)
            ========================================================================= */}
        <div className={`stage-panel input-panel ${currentStep >= 4 ? 'condensed' : ''}`}>
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">01</span>
              <h4>Creative Conception & Extraction</h4>
            </div>
            <span className={`panel-status-pill ${currentStep >= 3 ? 'verified' : currentStep >= 1 ? 'analyzing' : 'typing'}`}>
              {currentStep === 0 && 'Typing idea…'}
              {currentStep === 1 && 'Analyzing syntax…'}
              {currentStep === 2 && 'Extracting parameters…'}
              {currentStep >= 3 && 'Parameters validated'}
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

          {/* Extracted Fields (Steps 2 - 4) */}
          <div className={`extracted-fields-grid ${currentStep >= 2 ? 'visible' : ''}`}>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Content Type</span>
              <strong className="spec-v">AI Video (Short-form)</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Visual Style</span>
              <strong className="spec-v">Cinematic & Haute Couture</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Aspect Ratio</span>
              <strong className="spec-v">9:16 Vertical (1080×1920)</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Required Tools</span>
              <strong className="spec-v">Runway Gen-3 • Kling • ComfyUI</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Budget Range</span>
              <strong className="spec-v">₹45,000 – ₹75,000</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
            <div className={`field-spec-cell ${currentStep >= 2 ? 'resolved' : ''}`}>
              <span className="spec-k">Commercial Rights</span>
              <strong className="spec-v">Worldwide Paid Social (Perpetual)</strong>
              {currentStep >= 3 && <Check size={12} className="spec-check" />}
            </div>
          </div>

          {/* Verification Checklist (Steps 3 - 4) */}
          {currentStep >= 3 && (
            <div className="verification-audit-strip">
              <div className="audit-item">
                <CheckCircle2 size={13} className="audit-icon success" />
                <span>Format Compatibility: 9:16 MP4 Confirmed</span>
              </div>
              <div className="audit-item">
                <CheckCircle2 size={13} className="audit-icon success" />
                <span>Commercial Usage: Explicit Terms Attached</span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="panel-action-row">
            <a href="/app/brand/campaigns/new" className="button stage-cta-btn">
              <span>Create a Campaign Brief</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Central Orchestrator Pulse */}
        <div className={`stage-divider-pulse ${currentStep >= 5 ? 'active-flow' : ''}`}>
          <div className="pulse-line" />
          <div className="pulse-orb">
            <Zap size={16} />
          </div>
          <div className="pulse-line" />
        </div>

        {/* =========================================================================
            PANEL 2: CREATOR DISCOVERY & MATCHING (Sequences 5 - 7)
            ========================================================================= */}
        <div className={`stage-panel matching-panel ${currentStep >= 5 ? 'active' : 'idle'}`}>
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">02</span>
              <h4>Creator Discovery & Compatibility</h4>
            </div>
            <span className={`panel-status-pill ${currentStep >= 7 ? 'verified' : currentStep >= 6 ? 'analyzing' : 'typing'}`}>
              {currentStep < 5 && 'Awaiting brief specs'}
              {currentStep === 5 && 'Scanning creative directory…'}
              {currentStep === 6 && 'Evaluating candidate fit…'}
              {currentStep >= 7 && 'Optimal match ranked'}
            </span>
          </div>

          {/* Simulated Discovery Toolbar */}
          <div className="discovery-search-visual">
            <div className="search-bar-mock">
              <Search size={14} className="search-icon" />
              <span>{currentStep >= 5 ? 'AI Filmmaker fashion 9:16' : 'Search creators…'}</span>
            </div>
            <div className="active-chips-strip">
              <span className={`filter-chip ${currentStep >= 5 ? 'on' : ''}`}>AI Video</span>
              <span className={`filter-chip ${currentStep >= 5 ? 'on' : ''}`}>Fashion</span>
              <span className={`filter-chip ${currentStep >= 5 ? 'on' : ''}`}>9:16</span>
              <span className={`filter-chip ${currentStep >= 5 ? 'on' : ''}`}>Runway</span>
            </div>
          </div>

          {/* Compatibility Scoring Weights (Step 6) */}
          <div className={`scoring-breakdown-box ${currentStep >= 6 ? 'visible' : ''}`}>
            <div className="score-row">
              <div className="score-labels">
                <span>Specialization & Style</span>
                <strong>98%</strong>
              </div>
              <div className="score-meter"><div className="meter-fill" style={{ width: '98%' }} /></div>
            </div>
            <div className="score-row">
              <div className="score-labels">
                <span>Declared Tools (Runway, Kling, ComfyUI)</span>
                <strong>95%</strong>
              </div>
              <div className="score-meter"><div className="meter-fill" style={{ width: '95%' }} /></div>
            </div>
            <div className="score-row">
              <div className="score-labels">
                <span>Output Format (9:16 4K)</span>
                <strong>100%</strong>
              </div>
              <div className="score-meter"><div className="meter-fill" style={{ width: '100%' }} /></div>
            </div>
            <div className="score-row">
              <div className="score-labels">
                <span>Budget & Turnaround Fit</span>
                <strong>92%</strong>
              </div>
              <div className="score-meter"><div className="meter-fill" style={{ width: '92%' }} /></div>
            </div>
          </div>

          {/* Ranked Creator Match Card (Step 7) */}
          <div className={`matched-creator-card ${currentStep >= 7 ? 'revealed' : ''}`}>
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
          PANEL 3: INVITATION DISPATCH & COLLABORATION PROGRESSION (Sequences 8 - 9)
          ========================================================================= */}
      <div className={`collaboration-progression-drawer ${currentStep >= 8 ? 'expanded' : ''}`}>
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
              {currentStep === 8 ? (
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
              const isPassed = currentStep === 9 || (currentStep === 8 && idx === 0);
              const isCurrent = currentStep === 8 ? idx === 0 : idx === 5;
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
