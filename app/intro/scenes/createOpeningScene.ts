import * as THREE from 'three';
import { createIridescentMaterial } from '../materials/iridescentShader';
import { createEmblemComposition } from '../geometry/createEmblemGeometry';
import { createSpineTotem } from '../geometry/createSpineGeometry';
import { createProjectCardCarousel } from '../geometry/createCardGeometry';
import { ParticleSystem } from '../particles/ParticleSystem';

export interface SceneContext {
  scene: THREE.Scene;
  emblemGroup: THREE.Group;
  spineGroup: THREE.Group;
  cardCarousel: THREE.Group;
  particles: ParticleSystem;
  iridMaterial: THREE.ShaderMaterial;
  keyLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  accentPointLight: THREE.PointLight;
  update: (time: number, progress: number, velocity: number, mouseX: number, mouseY: number) => void;
  dispose: () => void;
}

export function createOpeningScene(): SceneContext {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020306);
  scene.fog = new THREE.FogExp2(0x020306, 0.018);

  // 1. Lighting setup
  const ambientLight = new THREE.AmbientLight(0x0a1020, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xf0f8ff, 1.8);
  keyLight.position.set(-15, 25, 20);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
  rimLight.position.set(15, -15, -20);
  scene.add(rimLight);

  const accentPointLight = new THREE.PointLight(0xb829ff, 3.0, 25);
  accentPointLight.position.set(0, 0, 4);
  scene.add(accentPointLight);

  // 2. Materials
  const iridMaterial = createIridescentMaterial();

  // 3. Central Emblem (Ring + CreaXa Nexus + Strands)
  const emblemGroup = createEmblemComposition(iridMaterial);
  emblemGroup.position.set(0, 0, 0);
  scene.add(emblemGroup);

  // 4. Central Spine Totem
  const spineGroup = createSpineTotem(iridMaterial);
  spineGroup.position.set(0, 0, -11.5);
  spineGroup.scale.set(1.4, 1.4, 1.4);
  scene.add(spineGroup);

  // 5. 3D Project Card Carousel
  const cardCarousel = createProjectCardCarousel(iridMaterial);
  cardCarousel.position.set(0, 0, -11.5);
  scene.add(cardCarousel);

  // 6. Volumetric GPU Particle System
  const particles = new ParticleSystem(typeof window !== 'undefined' && window.innerWidth < 768 ? 1400 : 3200);
  scene.add(particles.points);

  // 7. Synchronized Scene Animation Function
  const update = (time: number, progress: number, velocity: number, mouseX: number, mouseY: number) => {
    // Update iridescent shader uniforms
    iridMaterial.uniforms.uTime.value = time;

    // A. Central Emblem Choreography
    // Continuous ambient breathing rotation + scroll-driven transformation
    const ambientRotY = Math.sin(time * 0.4) * 0.08;
    const ambientRotX = Math.cos(time * 0.3) * 0.05;

    // As user scrolls forward, the emblem rotates, tilts, and translates
    emblemGroup.rotation.y = ambientRotY + progress * Math.PI * 1.5 + mouseX * 0.15;
    emblemGroup.rotation.x = ambientRotX + progress * 0.8 + mouseY * 0.1;
    emblemGroup.rotation.z = Math.sin(progress * Math.PI) * 0.25;

    // Position shift along scroll
    emblemGroup.position.y = THREE.MathUtils.lerp(0.0, 1.8, Math.min(progress * 2.0, 1.0));
    emblemGroup.position.z = THREE.MathUtils.lerp(0.0, 2.5, Math.min(progress * 1.8, 1.0));

    // Scale down / fade out as we pass it deep into the scene
    const emblemScale = THREE.MathUtils.lerp(1.0, 0.4, Math.max(0, (progress - 0.4) * 2.0));
    emblemGroup.scale.set(emblemScale, emblemScale, emblemScale);
    emblemGroup.visible = progress < 0.85;

    // B. Spine Totem Animation
    spineGroup.rotation.y = time * 0.15 + progress * 2.0;
    spineGroup.position.y = Math.sin(time * 0.8) * 0.2;

    // Visibility based on progress
    spineGroup.visible = progress > 0.15 && progress < 0.95;

    // C. Project Card Carousel Orbit
    // Cards revolve around the central spine as scroll advances
    const carouselOrbit = progress * Math.PI * 1.8 + time * 0.05;
    cardCarousel.rotation.y = carouselOrbit;
    cardCarousel.visible = progress > 0.18 && progress < 0.95;

    // D. Point Light tracking
    accentPointLight.position.x = Math.sin(time * 0.7) * 3.0;
    accentPointLight.position.y = Math.cos(time * 0.5) * 2.0;
    accentPointLight.position.z = THREE.MathUtils.lerp(4.0, -10.0, progress);

    // E. Particles update
    particles.update(time, progress, velocity, mouseX, mouseY);
  };

  const dispose = () => {
    particles.dispose();
    iridMaterial.dispose();
    scene.clear();
  };

  return {
    scene,
    emblemGroup,
    spineGroup,
    cardCarousel,
    particles,
    iridMaterial,
    keyLight,
    rimLight,
    accentPointLight,
    update,
    dispose
  };
}
