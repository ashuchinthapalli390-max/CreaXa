'use client';

import * as React from 'react';
import { prefersReducedMotion } from '@/lib/motion-tokens';
import { cn } from '@/lib/utils';

export interface AnimatedCounterProps {
  value?: number;
  target?: number;
  initial?: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  target: explicitTarget,
  initial = 0,
  durationMs = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const target = Number(explicitTarget !== undefined ? explicitTarget : (value !== undefined ? value : 0));
  const [current, setCurrent] = React.useState<number>(initial);
  const [hasStarted, setHasStarted] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    // Respect reduced motion
    if (prefersReducedMotion()) {
      setCurrent(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasStarted, target]);

  React.useEffect(() => {
    if (!hasStarted) return;
    if (prefersReducedMotion()) {
      setCurrent(target);
      return;
    }

    let startTimestamp: number | null = null;
    let animFrameId: number;

    const startVal = initial;
    const endVal = target;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);

      // Standard cubic ease-out: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = startVal + (endVal - startVal) * easeProgress;

      setCurrent(nextVal);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(endVal);
      }
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [hasStarted, initial, target, durationMs]);

  const formatted = React.useMemo(() => {
    const val = Number.isFinite(current) ? current : target;
    return val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [current, decimals, target]);

  return (
    <span ref={containerRef} className={cn('animated-counter', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
