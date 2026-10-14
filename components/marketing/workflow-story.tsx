'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Check,
  Search,
  Send,
  ArrowRight,
  Clock,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  Edit3
} from 'lucide-react';

interface CreatorCandidate {
  data?: {
    name?: string;
    headline?: string;
    avatar?: string;
    tools?: string[];
    styles?: string[];
    contentTypes?: string[];
    rate?: number;
    currency?: string;
    turnaround?: number;
    revisions?: number;
  };
  slug?: string;
  verification?: string;
}

interface WorkflowStoryProps {
  creators?: CreatorCandidate[];
}

export interface WorkflowStageDef {
  id: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  duration: number; // in milliseconds
  panelFocus: 'input' | 'matching' | 'drawer';
  statusLeft: string;
  statusRight: string;
  accessibilityLabel: string;
}

export const WORKFLOW_STAGES: WorkflowStageDef[] = [
  {
    id: 'concept-input',
    stepNumber: 1,
    title: 'Concept Input',
    shortLabel: '01. Concept',
    duration: 3800,
    panelFocus: 'input',
    statusLeft: 'Capturing concept…',
    statusRight: 'Awaiting specification',
    accessibilityLabel: 'Stage 1: Creative concept input and natural language prompt'
  },
  {
    id: 'creative-analysis',
    stepNumber: 2,
    title: 'Creative Analysis',
    shortLabel: '02. Analysis',
    duration: 2600,
    panelFocus: 'input',
    statusLeft: 'Extracting keywords…',
    statusRight: 'Awaiting specification',
    accessibilityLabel: 'Stage 2: Automatic extraction of creative style, format and platform tags'
  },
  {
    id: 'structured-brief',
    stepNumber: 3,
    title: 'Structured Brief',
    shortLabel: '03. Structured Brief',
    duration: 3200,
    panelFocus: 'input',
    statusLeft: 'Parameters verified',
    statusRight: 'Ready for search',
    accessibilityLabel: 'Stage 3: Locked parameters for deliverables, format, licensing and timeline'
  },
  {
    id: 'creator-discovery',
    stepNumber: 4,
    title: 'Creator Discovery',
    shortLabel: '04. Discovery',
    duration: 2800,
    panelFocus: 'matching',
    statusLeft: 'Brief locked',
    statusRight: 'Filtering creator pool…',
    accessibilityLabel: 'Stage 4: Semantic search matching specialization and required AI tools'
  },
  {
    id: 'compatibility-analysis',
    stepNumber: 5,
    title: 'Compatibility Analysis',
    shortLabel: '05. Compatibility',
    duration: 3200,
    panelFocus: 'matching',
    statusLeft: 'Brief locked',
    statusRight: 'Scoring capability…',
    accessibilityLabel: 'Stage 5: Multi-dimensional attribute breakdown and fit calculation'
  },
  {
    id: 'creator-selection',
    stepNumber: 6,
    title: 'Candidate Selection',
    shortLabel: '06. Selection',
    duration: 2800,
    panelFocus: 'matching',
    statusLeft: 'Brief locked',
    statusRight: 'Match verified (96%)',
    accessibilityLabel: 'Stage 6: Candidate card selected with proven turnaround and toolstack'
  },
  {
    id: 'invitation-dispatch',
    stepNumber: 7,
    title: 'Invitation Dispatch',
    shortLabel: '07. Invitation',
    duration: 2800,
    panelFocus: 'drawer',
    statusLeft: 'Brief dispatched',
    statusRight: 'Invitation active',
    accessibilityLabel: 'Stage 7: Terms, budget and brief securely linked in candidate invitation'
  },
  {
    id: 'project-delivery',
    stepNumber: 8,
    title: 'Collaboration & Delivery',
    shortLabel: '08. Delivery',
    duration: 4800,
    panelFocus: 'drawer',
    statusLeft: 'Project in production',
    statusRight: 'Milestones tracked',
    accessibilityLabel: 'Stage 8: Production progression from accepted invitation to commercial rights delivery'
  }
];

const DEFAULT_PROMPT =
  'Create a cinematic campaign for a futuristic fashion collection, optimized for vertical social formats.';

const RECOGNISED_KEYWORDS = [
  'cinematic',
  'futuristic',
  'fashion',
  'vertical',
  'social',
  'video',
  'animation',
  'commercial',
  '3d',
  'luxury',
  'motion'
];

export function WorkflowStory({ creators }: WorkflowStoryProps) {
  // Current active stage index (0 to 7)
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  // User concept input state
  const [userPrompt, setUserPrompt] = useState(DEFAULT_PROMPT);
  const [typedChars, setTypedChars] = useState(DEFAULT_PROMPT.length);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  // Active filter chips (toggleable by user)
  const [activeFilterChips, setActiveFilterChips] = useState<string[]>([
    'AI Video',
    'Cinematic',
    'Runway Gen-3',
    '9:16 Format'
  ]);

  // Selected candidate toggle / expand
  const [isCandidateExpanded, setIsCandidateExpanded] = useState(true);

  // Active lifecycle milestone step
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(5);

  // Viewport & accessibility state
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStage = WORKFLOW_STAGES[currentStageIdx] || WORKFLOW_STAGES[0];

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setCurrentStageIdx(7);
        setTypedChars(DEFAULT_PROMPT.length);
      }
      const listener = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) {
          setCurrentStageIdx(7);
          setTypedChars(DEFAULT_PROMPT.length);
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Viewport intersection observer (pauses execution when offscreen)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Tab visibility listener (pauses timer when tab is hidden)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const canAutoplay = isIntersecting && isTabActive && !prefersReducedMotion && !isEditingPrompt;

  // Typewriter effect during Stage 0 (Concept Input)
  useEffect(() => {
    if (currentStageIdx !== 0 || !canAutoplay) {
      if (currentStageIdx > 0 && !isEditingPrompt) {
        setTypedChars(userPrompt.length);
      }
      return;
    }

    setTypedChars(0);
    let charIndex = 0;
    const textToType = userPrompt;

    typingTimerRef.current = setInterval(() => {
      if (charIndex < textToType.length) {
        charIndex++;
        setTypedChars(charIndex);
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 28);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentStageIdx, canAutoplay, userPrompt, isEditingPrompt]);

  // Central deterministic timeline controller
  useEffect(() => {
    if (!canAutoplay) {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      return;
    }

    const duration = currentStage.duration;

    stageTimerRef.current = setTimeout(() => {
      setCurrentStageIdx(prev => {
        if (prev < WORKFLOW_STAGES.length - 1) {
          return prev + 1;
        }
        // Seamless loop back to Stage 0
        return 0;
      });
    }, duration);

    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, [currentStageIdx, canAutoplay, currentStage.duration]);

  // Jump to specific workflow stage directly
  const jumpToStage = useCallback((index: number) => {
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setCurrentStageIdx(index);
    setTypedChars(userPrompt.length);
  }, [userPrompt.length]);

  // Handle user manual editing
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setUserPrompt(text);
    setTypedChars(text.length);
  };

  const handlePromptFocus = () => {
    setIsEditingPrompt(true);
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    if (idleResumeTimerRef.current) clearTimeout(idleResumeTimerRef.current);
  };

  const handlePromptBlur = () => {
    // Resume auto-advance after 5s idle
    if (idleResumeTimerRef.current) clearTimeout(idleResumeTimerRef.current);
    idleResumeTimerRef.current = setTimeout(() => {
      setIsEditingPrompt(false);
    }, 5000);
  };

  // Toggle filter chip
  const toggleChip = (chip: string) => {
    setActiveFilterChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  // Extracted entities preview based on text
  const highlightedEntities = useMemo(() => {
    const lower = userPrompt.toLowerCase();
    return RECOGNISED_KEYWORDS.filter(k => lower.includes(k));
  }, [userPrompt]);

  // Primary creator candidate
  const featuredCreator = (creators && creators.length > 0)
    ? creators[0]
    : {
        data: {
          name: 'Alice Wonder',
          headline: 'AI Filmmaker & Creative Director',
          avatar: '',
          tools: ['Runway Gen-3', 'Midjourney v7', 'ComfyUI', 'DaVinci'],
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

  const displayedText = userPrompt.slice(0, typedChars);

  return (
    <div className="workflow-story-container" ref={containerRef} aria-label="Interactive Workflow Walkthrough">
      {/* Editorial Phase Navigation Bar */}
      <div className="story-nav-header">
        <div className="story-step-indicator">
          <span className="step-tag">WORKFLOW TIMELINE • STEP 0{currentStage.stepNumber} OF 08</span>
          <span className="step-title" id="workflow-current-stage-title">
            Phase 0{currentStage.stepNumber} — {currentStage.title}
          </span>
        </div>

        <div className="story-chapter-pills" role="tablist" aria-label="Workflow Stages">
          {WORKFLOW_STAGES.map((s, idx) => {
            const isActive = currentStageIdx === idx;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`workflow-stage-panel-${idx}`}
                className={`chapter-pill ${isActive ? 'active' : ''}`}
                onClick={() => jumpToStage(idx)}
              >
                {s.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Interactive Stage */}
      <div className="workflow-stage">
        {/* =========================================================================
            PANEL 1: CREATIVE CONCEPTION & EXTRACTION (Left Panel)
            ========================================================================= */}
        <section
          className={`stage-panel input-panel ${currentStageIdx <= 2 ? 'active-stage' : 'idle'}`}
          aria-labelledby="panel-1-heading"
        >
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">01</span>
              <h4 id="panel-1-heading">Creative Conception & Extraction</h4>
            </div>
            <span
              className={`panel-status-pill ${
                currentStageIdx >= 2 ? 'verified' : currentStageIdx === 1 ? 'analyzing' : 'typing'
              }`}
            >
              {currentStage.statusLeft}
            </span>
          </div>

          {/* Interactive Concept Prompt Area */}
          <div
            className={`concept-prompt-box ${currentStageIdx >= 1 ? 'highlight-active' : ''}`}
            onClick={() => {
              if (currentStageIdx > 0) jumpToStage(0);
            }}
          >
            {isEditingPrompt ? (
              <textarea
                className="concept-interactive-input"
                value={userPrompt}
                onChange={handlePromptChange}
                onFocus={handlePromptFocus}
                onBlur={handlePromptBlur}
                aria-label="Edit campaign concept prompt"
                placeholder="Type your creative concept here…"
                rows={3}
                autoFocus
              />
            ) : (
              <p className="typed-content" onClick={() => setIsEditingPrompt(true)}>
                {currentStageIdx === 0 ? (
                  <>
                    {displayedText}
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
            )}

            {/* Keyword Extraction Sweep Indicator */}
            {currentStageIdx >= 1 && (
              <div className="analysis-indicator-bar" aria-hidden="true">
                <div className="indicator-sweep" />
              </div>
            )}

            <div className="concept-box-footnote">
              <span>
                {isEditingPrompt
                  ? 'Editing prompt — click outside to save'
                  : 'Click text to edit concept'}
              </span>
              <Edit3 size={11} />
            </div>
          </div>

          {/* Extracted Parameter Tags Preview */}
          {highlightedEntities.length > 0 && (
            <div className="prompt-tags-preview" aria-label="Extracted creative keywords">
              {highlightedEntities.map(tag => (
                <span key={tag} className="entity-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Structured Parameters Grid (Unlocked from Stage 2 onward) */}
          <div
            className="extracted-params-grid"
            aria-label="Structured Campaign Parameters"
          >
            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">CONTENT TYPE</span>
              <div className="param-value-row">
                <strong>AI Video & Animation</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">CREATIVE STYLE</span>
              <div className="param-value-row">
                <strong>Cinematic / Futuristic</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">FORMAT & RATIO</span>
              <div className="param-value-row">
                <strong>9:16 Vertical (4K)</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">TARGET PLATFORM</span>
              <div className="param-value-row">
                <strong>Reels, TikTok & Web</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">COMMERCIAL USE</span>
              <div className="param-value-row">
                <strong>Full Digital License</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>

            <div className={`param-item ${currentStageIdx >= 2 ? 'active-item' : ''}`}>
              <span className="param-label">BUDGET ESTIMATE</span>
              <div className="param-value-row">
                <strong>₹45,000 – ₹75,000</strong>
                {currentStageIdx >= 2 && <Check size={12} className="param-check" />}
              </div>
            </div>
          </div>

          {/* Verification Audit Strip */}
          <div className="verification-audit-strip">
            <div className="audit-item">
              <CheckCircle2 size={13} className="audit-icon success" />
              <span>Prompt consistency and deliverables validated</span>
            </div>
            <div className="audit-item">
              <CheckCircle2 size={13} className="audit-icon success" />
              <span>Commercial rights & revision thresholds defined</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="panel-action-row">
            <a href="/app/brand/campaigns/new" className="button hero-brief-btn">
              <span>Create Campaign</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* =========================================================================
            PANEL 2: CREATOR DISCOVERY & COMPATIBILITY (Right Panel)
            ========================================================================= */}
        <section
          className={`stage-panel matching-panel ${currentStageIdx >= 3 ? 'active-stage' : 'idle'}`}
          aria-labelledby="panel-2-heading"
        >
          <div className="panel-topbar">
            <div className="topbar-left">
              <span className="panel-number">02</span>
              <h4 id="panel-2-heading">Creator Discovery & Compatibility</h4>
            </div>
            <span
              className={`panel-status-pill ${
                currentStageIdx >= 5
                  ? 'verified'
                  : currentStageIdx >= 3
                  ? 'searching'
                  : 'standby'
              }`}
            >
              {currentStage.statusRight}
            </span>
          </div>

          {/* Search Bar Visual */}
          <div className={`discovery-search-mockup ${currentStageIdx >= 3 ? 'revealed' : ''}`}>
            <Search size={15} className="mockup-search-icon" aria-hidden="true" />
            <span className="mockup-search-text">
              {currentStageIdx >= 3 ? 'AI filmmaker fashion cinematic 9:16' : 'Search creators…'}
            </span>
          </div>

          {/* Interactive Filter Chips */}
          <div className="matching-filter-chips" aria-label="Sample creative filters">
            {['AI Video', 'Cinematic', 'Runway Gen-3', '9:16 Format', 'Available now'].map(chip => {
              const isOn = activeFilterChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  className={`story-chip ${isOn ? 'active' : ''}`}
                  onClick={() => toggleChip(chip)}
                  aria-pressed={isOn}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Compatibility Scoring Breakdown */}
          <div
            className={`scoring-metrics-card ${currentStageIdx >= 4 ? 'visible' : ''}`}
            aria-label="Capability Scoring Breakdown"
          >
            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-name">Style & aesthetic fit</span>
                <span className="metric-pct">98%</span>
              </div>
              <div className="metric-track" role="progressbar" aria-valuenow={currentStageIdx >= 4 ? 98 : 0} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="metric-fill"
                  style={{ width: currentStageIdx >= 4 ? '98%' : '0%' }}
                />
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-name">AI tools compatibility (Gen-3, Kling)</span>
                <span className="metric-pct">96%</span>
              </div>
              <div className="metric-track" role="progressbar" aria-valuenow={currentStageIdx >= 4 ? 96 : 0} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="metric-fill"
                  style={{ width: currentStageIdx >= 4 ? '96%' : '0%' }}
                />
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-name">Output format & 9:16 aspect ratio</span>
                <span className="metric-pct">100%</span>
              </div>
              <div className="metric-track" role="progressbar" aria-valuenow={currentStageIdx >= 4 ? 100 : 0} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="metric-fill"
                  style={{ width: currentStageIdx >= 4 ? '100%' : '0%' }}
                />
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-name">Industry relevance (Fashion & Luxury)</span>
                <span className="metric-pct">94%</span>
              </div>
              <div className="metric-track" role="progressbar" aria-valuenow={currentStageIdx >= 4 ? 94 : 0} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="metric-fill"
                  style={{ width: currentStageIdx >= 4 ? '94%' : '0%' }}
                />
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-header">
                <span className="metric-name">Commercial rights capability</span>
                <span className="metric-pct">100%</span>
              </div>
              <div className="metric-track" role="progressbar" aria-valuenow={currentStageIdx >= 4 ? 100 : 0} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="metric-fill"
                  style={{ width: currentStageIdx >= 4 ? '100%' : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Matched Creator Candidate Card */}
          <div
            className={`matched-creator-card ${currentStageIdx >= 5 ? 'revealed' : ''}`}
            onClick={() => setIsCandidateExpanded(!isCandidateExpanded)}
            style={{ cursor: 'pointer' }}
          >
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
                <p className="creator-headline">
                  {featuredCreator.data?.headline || 'AI Filmmaker & Creative Director'}
                </p>
              </div>
            </div>

            <div className="creator-card-tags">
              {(featuredCreator.data?.tools || ['Runway Gen-3', 'Midjourney', 'ComfyUI'])
                .slice(0, 3)
                .map((tool: string) => (
                  <span key={tool} className="tool-pill">
                    {tool}
                  </span>
                ))}
              <span className="turnaround-pill">
                <Clock size={11} /> 7d turnaround
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="panel-action-row">
            <a href="/discover" className="button secondary stage-cta-btn">
              <span>Explore All Creators</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </section>
      </div>

      {/* =========================================================================
          PANEL 3: INVITATION DISPATCH & COLLABORATION PROGRESSION (Stage 7 - 8)
          ========================================================================= */}
      <div
        className={`collaboration-progression-drawer ${
          currentStageIdx >= 6 ? 'expanded' : ''
        }`}
        aria-label="Collaboration Lifecycle Milestones"
      >
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
              {currentStageIdx === 6 ? (
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
          <div className="milestones-track" role="list">
            {[
              { id: 'invited', label: '1. Invited', desc: 'Brief & budget linked' },
              { id: 'accepted', label: '2. Accepted', desc: 'Terms agreed' },
              { id: 'submitted', label: '3. Submitted', desc: 'First cut uploaded' },
              { id: 'revision', label: '4. Revision', desc: 'Frame feedback' },
              { id: 'approved', label: '5. Approved', desc: 'Version finalized' },
              { id: 'delivered', label: '6. Delivered', desc: 'Commercial handoff' }
            ].map((m, idx) => {
              const isPassed =
                currentStageIdx === 7 ||
                (currentStageIdx === 6 && idx === 0) ||
                idx <= activeMilestoneIdx;
              const isCurrent = currentStageIdx === 6 ? idx === 0 : idx === activeMilestoneIdx;

              return (
                <div
                  key={m.id}
                  role="listitem"
                  className={`milestone-step ${isPassed ? 'completed' : ''} ${
                    isCurrent ? 'current' : ''
                  }`}
                  onClick={() => setActiveMilestoneIdx(idx)}
                  title={`Click to view milestone ${m.label}`}
                >
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
