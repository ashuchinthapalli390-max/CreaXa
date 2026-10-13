'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MOTION_EASINGS, prefersReducedMotion } from '../../lib/motion-tokens';

interface ImageWipeProps {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "16 / 9", "1 / 1", "4 / 3", "3 / 2"
  variant?: 'horizontal' | 'vertical' | 'curtain' | 'colorPanel';
  className?: string;
  delayMs?: number;
  priority?: boolean;
  children?: React.ReactNode;
}

export function ImageWipe({
  src,
  alt,
  aspectRatio = '16 / 9',
  variant = 'horizontal',
  className = '',
  delayMs = 0,
  priority = false,
  children
}: ImageWipeProps) {
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
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`image-wipe-frame wipe-${variant} ${revealed ? 'is-revealed' : ''} ${className}`}
      style={{
        aspectRatio,
        '--wipe-delay': `${delayMs}ms`,
        '--wipe-easing': MOTION_EASINGS.editorial
      } as React.CSSProperties}
    >
      <div className="image-wipe-shutter" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className="image-wipe-media"
      />
      {children && <div className="image-wipe-overlay">{children}</div>}
    </div>
  );
}
