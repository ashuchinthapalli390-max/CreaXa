'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { IntroEngine } from './rendering/engine';
import type { createAmbientAudio } from './audio';
const STAGES = [
    { title: 'Creative talent. Intelligently connected.', label: '01 / A NEW CREATIVE ECONOMY', copy: 'HUMAN VISION. AI CAPABILITY. CONNECTING CREATORS AND BRANDS.' },
    { title: 'The talent exists. The discovery is broken.', label: '02 / FRAGMENTED DISCOVERY', copy: 'SCATTERED PLATFORMS. UNCLEAR CAPABILITIES. DISCONNECTED WORKFLOWS.' },
    { title: 'From a rough idea to a real brief.', label: '03 / IDEA TO STRUCTURE', copy: 'STYLE, FORMAT, ASPECT RATIO, BUDGET AND COMMERCIAL RIGHTS DEFINED.' },
    { title: 'Find the right creative mind.', label: '04 / CREATIVE COMPATIBILITY', copy: 'TRANSPARENT, EXPLAINABLE MATCHING ACROSS TOOLS, STYLE AND AVAILABILITY.' },
    { title: 'Work that speaks for itself.', label: '05 / PORTFOLIO GALLERY', copy: 'ORIGINAL CINEMATIC PRODUCTIONS WITH DOCUMENTED AI TOOLCHAINS.' },
    { title: 'From first connection to final delivery.', label: '06 / COLLABORATION', copy: 'INVITE → ACCEPT → SUBMIT V1 → REVISE → APPROVE → DELIVER.' },
    { title: 'Make something extraordinary.', label: '07 / YOUR NEXT BEGINNING', copy: 'EXPLORE PUBLISHED CREATORS OR BUILD YOUR NEXT CAMPAIGN.' }
];
export default function IntroExperience() {
    const section = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null), progressLine = useRef<HTMLDivElement>(null), percentage = useRef<HTMLSpanElement>(null), hoverLabel = useRef<HTMLSpanElement>(null), engine = useRef<IntroEngine | null>(null), audio = useRef<ReturnType<typeof createAmbientAudio> | null>(null);
    const [hidden, setHidden] = useState(false), [ready, setReady] = useState(false), [stage, setStage] = useState(0), [paused, setPaused] = useState(false), [sound, setSound] = useState(false), [arrived, setArrived] = useState(false), [reason, setReason] = useState('');
    const stageRef = useRef(0), pausedRef = useRef(false);
    const updatePause = useCallback(() => { const p = !pausedRef.current; pausedRef.current = p; setPaused(p); engine.current?.setPaused(p); }, []);
    useEffect(() => { let skip = false; try {
        skip = sessionStorage.getItem('creaxa-intro-seen') === '1';
    }
    catch { } if (skip || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setHidden(true);
        setReason('');
    } }, []);
    useEffect(() => { if (hidden || !canvas.current || !section.current)
        return; let cancelled = false; let local: IntroEngine | null = null; setReady(false); const load = async () => { try {
        const { createIntroEngine } = await import('./rendering/engine');
        if (cancelled)
            return;
        local = await createIntroEngine(canvas.current!, section.current!, (p, s) => { progressLine.current?.style.setProperty('transform', `scaleX(${p})`); if (percentage.current)
            percentage.current.textContent = String(Math.round(p * 100)).padStart(2, '0'); if (stageRef.current !== s) {
            stageRef.current = s;
            setStage(s);
        } }, () => { if (!cancelled) {
            setReason('The visual experience is unavailable on this device. The marketplace is ready to use.');
            setHidden(true);
        } }, v => { if (canvas.current)
            canvas.current.style.cursor = v ? 'pointer' : 'default'; if (hoverLabel.current)
            hoverLabel.current.dataset.visible = String(v); }, updatePause);
        if (cancelled) {
            local.dispose();
            return;
        }
        engine.current = local;
        local.setPaused(pausedRef.current);
        setReady(true);
    }
    catch {
        if (!cancelled) {
            setReason('The visual experience is unavailable on this device. The marketplace is ready to use.');
            setHidden(true);
        }
    } }; load(); return () => { cancelled = true; local?.dispose(); engine.current = null; }; }, [hidden, updatePause]);
    useEffect(() => { const target = document.getElementById('creaxa-home'); if (!target)
        return; const observer = new IntersectionObserver(([entry]) => { setArrived(entry.isIntersecting); if (entry.isIntersecting) {
        try {
            sessionStorage.setItem('creaxa-intro-seen', '1');
        }
        catch { }
    } audio.current?.mute(!entry.isIntersecting ? false : true); }, { threshold: 0, rootMargin: '-10% 0px -40% 0px' }); observer.observe(target); const visible = () => audio.current?.mute(document.hidden || arrived); document.addEventListener('visibilitychange', visible); return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visible); }; }, [hidden, arrived]);
    useEffect(() => () => { audio.current?.dispose(); }, []);
    useEffect(() => { document.body.dataset.immersive = String(!hidden && !arrived); return () => { delete document.body.dataset.immersive; }; }, [hidden, arrived]);
    const enter = () => { try {
        sessionStorage.setItem('creaxa-intro-seen', '1');
    }
    catch { } const target = document.getElementById('creaxa-home'); target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); audio.current?.mute(true); target?.focus({ preventScroll: true }); };
    const replay = () => { try {
        sessionStorage.removeItem('creaxa-intro-seen');
    }
    catch { } setReason(''); setArrived(false); stageRef.current = 0; setStage(0); setHidden(false); requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' })); };
    const toggleSound = async () => { if (sound) {
        audio.current?.dispose();
        audio.current = null;
        setSound(false);
        return;
    } try {
        const { createAmbientAudio } = await import('./audio');
        audio.current = createAmbientAudio();
        await audio.current.resume();
        setSound(true);
    }
    catch {
        setSound(false);
    } };
    if (hidden)
        return <><button className="experience-replay" onClick={replay}>Explore the 3D experience <span>↗</span></button>{reason && <div className="experience-fallback" role="status">{reason}<button aria-label="Dismiss experience message" onClick={() => setReason('')}>×</button></div>}</>;
    return <section className="intro-journey" ref={section} aria-label="CreaXa immersive opening"><div className="intro-sticky"><canvas ref={canvas} className="intro-canvas" aria-label="Iridescent CreaXa sculpture and scroll-controlled 3D environment" role="img"/><div className="intro-vignette" aria-hidden="true"/><div className="intro-interface"><header className="intro-nav"><a className="intro-brand" href="/" aria-label="CreaXa home">CREAXA<span>®</span></a><nav aria-label="Experience navigation"><a href="/discover">DISCOVER</a><a href="/contact">CONTACT</a><button onClick={enter}>ENTER CREAXA <span>↗</span></button></nav><button className="intro-skip" onClick={enter}>SKIP INTRO <span>↗</span></button></header><div className="intro-topline"><span>INDEPENDENT MINDS. EXTRAORDINARY POSSIBILITIES.</span><button onClick={toggleSound} aria-pressed={sound}>SOUND {sound ? 'ON' : 'OFF'} <span className={'audio-bars ' + (sound ? 'playing' : '')} aria-hidden="true"><i /><i /><i /><i /></span></button></div><div className="intro-side-label">CX / CREATIVE UNIVERSE</div><div className="intro-stage" key={stage}><span>{STAGES[stage].label}</span><h1>{STAGES[stage].title}</h1><p>{STAGES[stage].copy}</p>{stage === 6 && <button className="intro-arrival" onClick={enter}>ENTER THE MARKETPLACE <span>↗</span></button>}</div><span className="intro-hover-label" ref={hoverLabel}>CLICK SCULPTURE TO {paused ? 'RESUME' : 'PAUSE'} ROTATION</span><div className="intro-bottom"><button className="intro-motion" onClick={updatePause} aria-pressed={paused}>MOTION / {paused ? 'PAUSED' : 'LIVE'}</button><div className="intro-scroll"><span>{ready ? 'SCROLL TO EXPLORE' : 'PREPARING THE EXPERIENCE'}</span><span className="scroll-track" aria-hidden="true"><i /></span></div><div className="intro-position"><span ref={percentage}>00</span><span> / 100</span></div></div><div className="intro-progress" aria-hidden="true"><div ref={progressLine}/></div></div></div>{arrived && <button className="experience-replay" onClick={replay}>Replay experience <span>↗</span></button>}</section>;
}

