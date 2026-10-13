'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MOTION_EASINGS, prefersReducedMotion } from '../../lib/motion-tokens';

interface RevealHeadlineProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  lines: string[];
  subtitle?: string;
  staggerMs?: number;
  delayMs?: number;
  threshold?: number;
}

export function RevealHeadline({
  as: Component = 'h1',
  className = '',
  lines,
  subtitle,
  staggerMs = 90,
  delayMs = 0,
  threshold = 0.15
}: RevealHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className={`reveal-headline-container ${className}`}>
      <Component className="reveal-headline" aria-label={lines.join(' ')}>
        {lines.map((line, idx) => (
          <span key={idx} className="reveal-line-wrap" aria-hidden="true">
            <span
              className={`reveal-line ${revealed ? 'is-revealed' : ''}`}
              style={{
                transitionDelay: revealed ? `${delayMs + idx * staggerMs}ms` : '0ms',
                transitionTimingFunction: MOTION_EASINGS.editorial
              }}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          </span>
        ))}
      </Component>
      {subtitle && (
        <p
          className={`reveal-subtitle ${revealed ? 'is-revealed' : ''}`}
          style={{
            transitionDelay: revealed ? `${delayMs + lines.length * staggerMs + 60}ms` : '0ms',
            transitionTimingFunction: MOTION_EASINGS.editorial
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
