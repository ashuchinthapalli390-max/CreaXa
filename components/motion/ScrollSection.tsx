'use client';
import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion-tokens';

interface ScrollSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  threshold?: number;
}

export function ScrollSection({
  id,
  className = '',
  children,
  threshold = 0.12
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`scroll-section ${inView ? 'is-in-view' : ''} ${className}`}
      data-in-view={inView}
    >
      {children}
    </section>
  );
}
