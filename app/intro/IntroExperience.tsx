'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createOpeningScene, SceneContext } from './scenes/createOpeningScene';
import { CameraController } from './camera/CameraController';
import { ScrollController } from './scroll/ScrollController';
import { SynthesizedAudio } from './audio/SynthesizedAudio';
import { IntroControls, CATEGORIES } from './IntroControls';

interface IntroExperienceProps {
  onComplete: () => void;
  forceReplay?: boolean;
}

export default function IntroExperience({ onComplete, forceReplay = false }: IntroExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [progress, setProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  // References to keep out of React re-render loops
  const sceneContextRef = useRef<SceneContext | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const scrollControllerRef = useRef<ScrollController | null>(null);
  const audioRef = useRef<SynthesizedAudio | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  // Skip handler
  const handleSkip = useCallback(() => {
    try {
      sessionStorage.setItem('creaxa_intro_dismissed', 'true');
    } catch {}
    setIsCompleted(true);
    if (audioRef.current) {
      audioRef.current.dispose();
    }
    onComplete();
  }, [onComplete]);

  // Start handler (click / initial interact)
  const handleStart = useCallback(() => {
    setIsStarted(true);
    if (audioRef.current && !audioRef.current.muted) {
      audioRef.current.init();
      audioRef.current.playChime();
    }
  }, []);

  // Sound toggle handler
  const handleToggleSound = useCallback(() => {
    if (!audioRef.current) return;
    const isNowActive = audioRef.current.toggle();
    setSoundEnabled(isNowActive);
  }, []);

  // Category select handler (animates progress to Scene 2)
  const handleSelectCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    if (scrollControllerRef.current) {
      scrollControllerRef.current.setTargetProgress(0.55);
    }
    if (audioRef.current) {
      audioRef.current.playChime();
    }
  }, []);

  useEffect(() => {
    // 1. Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceReplay) {
      handleSkip();
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 2. Initialize WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;
    } catch {
      // Fallback for WebGL initialization failure
      handleSkip();
      return;
    }

    // 3. Initialize Scene, Camera, Particles, and Controls
    const sceneCtx = createOpeningScene();
    sceneContextRef.current = sceneCtx;

    const cameraCtrl = new CameraController(45, window.innerWidth / window.innerHeight);
    cameraControllerRef.current = cameraCtrl;

    const scrollCtrl = new ScrollController();
    scrollControllerRef.current = scrollCtrl;

    const audio = new SynthesizedAudio();
    audioRef.current = audio;
    setSoundEnabled(!audio.muted);

    // 4. Pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 5. Wheel and Touch event listeners on container
    container.addEventListener('wheel', scrollCtrl.handleWheel, { passive: true });
    container.addEventListener('touchstart', scrollCtrl.handleTouchStart, { passive: true });
    container.addEventListener('touchmove', scrollCtrl.handleTouchMove, { passive: true });
    container.addEventListener('touchend', scrollCtrl.handleTouchEnd, { passive: true });
    window.addEventListener('keydown', scrollCtrl.handleKeyDown);

    // 6. Resize handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      cameraCtrl.setAspect(width / height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Context Loss handling
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
    const handleContextRestored = () => {
      handleResize();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();
    let hasCompletedTransition = false;

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Update scroll progress with inertia damping
      const currentProgress = scrollCtrl.update(delta);
      setProgress(currentProgress);

      if (currentProgress > 0.01 && !isStarted) {
        setIsStarted(true);
      }

      // Update Audio filter with scroll velocity
      if (audio) {
        audio.updateVelocity(scrollCtrl.velocity);
      }

      // Update Camera & Scene
      const mouse = mouseRef.current;
      cameraCtrl.update(currentProgress, mouse.x, mouse.y, delta);
      sceneCtx.update(elapsedTime, currentProgress, scrollCtrl.velocity, mouse.x, mouse.y);

      // Render Three.js frame
      renderer.render(sceneCtx.scene, cameraCtrl.camera);

      // Coordinated reveal transition when reaching progress >= 0.98
      if (currentProgress >= 0.98 && !hasCompletedTransition) {
        hasCompletedTransition = true;
        try {
          sessionStorage.setItem('creaxa_intro_dismissed', 'true');
        } catch {}
        setTimeout(() => {
          setIsCompleted(true);
          onComplete();
        }, 300);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    // 9. Cleanup on unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', scrollCtrl.handleKeyDown);
      container.removeEventListener('wheel', scrollCtrl.handleWheel);
      container.removeEventListener('touchstart', scrollCtrl.handleTouchStart);
      container.removeEventListener('touchmove', scrollCtrl.handleTouchMove);
      container.removeEventListener('touchend', scrollCtrl.handleTouchEnd);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      sceneCtx.dispose();
      audio.dispose();
      renderer.dispose();
    };
  }, [forceReplay, handleSkip, isStarted, onComplete]);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="intro-viewport-container"
      style={{
        opacity: progress > 0.92 ? Math.max(0, 1 - (progress - 0.92) * 12.5) : 1,
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />
      <IntroControls
        progress={progress}
        isStarted={isStarted}
        soundEnabled={soundEnabled}
        activeCategory={activeCategory}
        onStart={handleStart}
        onToggleSound={handleToggleSound}
        onSelectCategory={handleSelectCategory}
        onSkip={handleSkip}
      />
    </div>
  );
}
