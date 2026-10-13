'use client';
import { useEffect, useState } from 'react';
const SELECTORS = '.hero-copy,.hero-top,.hero-bottom,.discipline-strip,.brief-band,.workspace-callout,.project-progress,.faq-item,.section,.page-intro,.panel,.form-panel,.workspace-title,.stat-grid>article,.creator-card,.portfolio-card,.campaign-card,.empty,.profile-section,.info-page>section,.role-cards>button,.resource-card,.template-card,.feature-card,.founding-card,.brief-graphic';
export default function MotionSystem() {
    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        let cancelled = false, progressFrame = 0;
        const observed = new Set<Element>();
        const io = new IntersectionObserver(entries => { for (const e of entries)
            if (e.isIntersecting) {
                e.target.setAttribute('data-motion-visible', 'true');
                io.unobserve(e.target);
            } }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
        const scan = () => { if (media.matches)
            return; document.querySelectorAll(SELECTORS).forEach((el, i) => { if (observed.has(el) || el.closest('.intro-journey'))
            return; observed.add(el); el.classList.add('motion-ready'); (el as HTMLElement).style.setProperty('--motion-delay', `${Math.min(i % 4, 3) * 55}ms`); const rect = el.getBoundingClientRect(); if (rect.top < innerHeight && rect.bottom > 0)
            el.setAttribute('data-motion-visible', 'true');
        else {
            el.setAttribute('data-motion-visible', 'false');
            io.observe(el);
        } }); };
        scan();
        const mo = new MutationObserver(() => { if (!cancelled)
            scan(); });
        mo.observe(document.body, { childList: true, subtree: true });
        const scroll = () => { if (progressFrame)
            return; progressFrame = requestAnimationFrame(() => { progressFrame = 0; const range = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty('--page-progress', String(range > 0 ? scrollY / range : 0)); setShowTop(scrollY > 650); }); };
        window.addEventListener('scroll', scroll, { passive: true });
        scroll();
        const press = (event: PointerEvent) => { if (media.matches)
            return; const button = (event.target as Element)?.closest('button,.button'); if (!button || button.hasAttribute('disabled') || button.closest('.intro-interface'))
            return; button.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(0)' }], { duration: 210, easing: 'cubic-bezier(.2,.8,.2,1)' }); };
        document.addEventListener('pointerdown', press, { passive: true });
        const change = () => { if (media.matches) {
            io.disconnect();
            observed.forEach(el => el.setAttribute('data-motion-visible', 'true'));
        }
        else
            scan(); };
        media.addEventListener('change', change);
        return () => { cancelled = true; io.disconnect(); mo.disconnect(); cancelAnimationFrame(progressFrame); window.removeEventListener('scroll', scroll); document.removeEventListener('pointerdown', press); media.removeEventListener('change', change); observed.forEach(el => el.setAttribute('data-motion-visible', 'true')); };
    }, []);
    return <><div className="page-scroll-progress" aria-hidden="true"/>{showTop && <button className="back-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>↑</button>}</>;
}

