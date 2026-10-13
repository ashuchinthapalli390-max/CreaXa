'use client';
import { useEffect, useState } from 'react';
import { MOTION_DURATIONS, MOTION_EASINGS, prefersReducedMotion } from '../lib/motion-tokens';

const SELECTORS = [
  '.hero-typography-col',
  '.hero-visual-col',
  '.editorial-ticker-strip',
  '.section-head-editorial',
  '.problem-card',
  '.brief-side-input',
  '.brief-side-output',
  '.creator-editorial-card',
  '.gallery-project-card',
  '.pipeline-step-card',
  '.final-cta-container',
  '.workspace-callout',
  '.project-progress',
  '.faq-item',
  '.section',
  '.page-intro',
  '.panel',
  '.form-panel',
  '.workspace-title',
  '.stat-grid>article',
  '.creator-card',
  '.portfolio-card',
  '.campaign-card',
  '.empty',
  '.profile-section',
  '.info-page>section',
  '.role-cards>button',
  '.resource-card',
  '.template-card',
  '.feature-card'
].join(',');

export default function MotionSystem() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let cancelled = false;
    let progressFrame = 0;
    const observed = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-motion-visible', 'true');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
    );

    const scan = () => {
      if (media.matches) return;
      document.querySelectorAll(SELECTORS).forEach((el, i) => {
        if (observed.has(el)) return;
        observed.add(el);
        el.classList.add('motion-ready');
        (el as HTMLElement).style.setProperty('--motion-delay', `${Math.min(i % 5, 4) * 60}ms`);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute('data-motion-visible', 'true');
        } else {
          el.setAttribute('data-motion-visible', 'false');
          io.observe(el);
        }
      });
    };

    scan();

    const mo = new MutationObserver(() => {
      if (!cancelled) scan();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const scroll = () => {
      if (progressFrame) return;
      progressFrame = requestAnimationFrame(() => {
        progressFrame = 0;
        const range = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty(
          '--page-progress',
          String(range > 0 ? window.scrollY / range : 0)
        );
        setShowTop(window.scrollY > 600);
      });
    };

    window.addEventListener('scroll', scroll, { passive: true });
    scroll();

    // Universal button tactile feedback
    const press = (event: PointerEvent) => {
      if (media.matches) return;
      const button = (event.target as Element)?.closest('button, .button, .icon-btn');
      if (!button || button.hasAttribute('disabled')) return;
      button.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(2px)' },
          { transform: 'translateY(0)' }
        ],
        { duration: MOTION_DURATIONS.button, easing: MOTION_EASINGS.editorial }
      );
    };

    document.addEventListener('pointerdown', press, { passive: true });

    const change = () => {
      if (media.matches) {
        io.disconnect();
        observed.forEach((el) => el.setAttribute('data-motion-visible', 'true'));
      } else {
        scan();
      }
    };
    media.addEventListener('change', change);

    return () => {
      cancelled = true;
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(progressFrame);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('pointerdown', press);
      media.removeEventListener('change', change);
      observed.forEach((el) => el.setAttribute('data-motion-visible', 'true'));
    };
  }, []);

  return (
    <>
      <div className="page-scroll-progress" aria-hidden="true" />
      {showTop && (
        <button
          className="back-top"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            })
          }
        >
          ↑
        </button>
      )}
    </>
  );
}
