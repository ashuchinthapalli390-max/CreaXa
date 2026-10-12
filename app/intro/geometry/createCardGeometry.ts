import * as THREE from 'three';
import { ShowcaseProject } from '../types';

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'p1',
    title: 'SYNTHETIC HORIZONS',
    clientOrCategory: 'AI FILMMAKING',
    tag: 'FEATURED 01',
    color: '#00f0ff',
    description: 'Neural cinema narrative combining Runway Gen-3 with custom procedural VFX pipelines.',
    previewGradient: ['#041e2b', '#0a4b5c']
  },
  {
    id: 'p2',
    title: 'NEURAL COUTURE',
    clientOrCategory: 'GENERATIVE ART',
    tag: 'FEATURED 02',
    color: '#b829ff',
    description: 'High-fashion campaign generated with Midjourney v6 and Flux latent space styling.',
    previewGradient: ['#23062e', '#671485']
  },
  {
    id: 'p3',
    title: 'ECHOES OF TOMORROW',
    clientOrCategory: 'MOTION & ANIMATION',
    tag: 'FEATURED 03',
    color: '#ff1493',
    description: 'Autonomous architectural visualization and kinetic fluid motion simulations.',
    previewGradient: ['#2e0517', '#8a0a4b']
  },
  {
    id: 'p4',
    title: 'METAVERSE ODYSSEY',
    clientOrCategory: '3D & XR REALMS',
    tag: 'FEATURED 04',
    color: '#ffd700',
    description: 'Real-time spatial computing environment powered by NeRF neural radiance fields.',
    previewGradient: ['#2e2405', '#735b0d']
  }
];

/**
 * Creates high-resolution canvas texture for each showcase card
 */
function createCardTexture(project: ShowcaseProject): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark atmospheric backdrop gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 640);
    grad.addColorStop(0, project.previewGradient[0]);
    grad.addColorStop(0.6, '#08080f');
    grad.addColorStop(1, project.previewGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 640);

    // 2. Subtle geometric grid / noise pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 3. Central ambient glowing aura
    const radial = ctx.createRadialGradient(512, 320, 40, 512, 320, 420);
    radial.addColorStop(0, project.color + '44');
    radial.addColorStop(0.7, project.color + '11');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1024, 640);

    // 4. Card Header: Tag & Category
    ctx.font = '600 24px "Courier New", monospace';
    ctx.fillStyle = project.color;
    ctx.letterSpacing = '4px';
    ctx.fillText(`[ ${project.tag} ]`, 64, 90);

    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.letterSpacing = '3px';
    ctx.fillText(project.clientOrCategory, 64, 130);

    // 5. Main Bold Title
    ctx.font = '900 68px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '2px';
    ctx.fillText(project.title, 64, 340);

    // Chromatic glitch offset shadow
    ctx.fillStyle = project.color + '66';
    ctx.fillText(project.title, 66, 338);

    // 6. Supporting Description
    ctx.font = '400 24px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.letterSpacing = '1px';
    ctx.fillText(project.description, 64, 420);

    // 7. Footer: Technical Coordinates & CTA indicator
    ctx.font = '600 18px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('CREAXA INTELLIGENT MATCHING PROTOCOL', 64, 570);

    ctx.fillStyle = project.color;
    ctx.fillText('VIEW PORTFOLIO →', 780, 570);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Creates 3D showcase card carousel orbiting in 3D space
 */
export function createProjectCardCarousel(borderMaterial: THREE.Material): THREE.Group {
  const carouselGroup = new THREE.Group();
  carouselGroup.name = 'project-carousel';

  const cardWidth = 5.2;
  const cardHeight = 3.25;
  const cardDepth = 0.08;

  SHOWCASE_PROJECTS.forEach((project, index) => {
    const cardMeshGroup = new THREE.Group();
    cardMeshGroup.name = `card-${project.id}`;

    // Texture material for face
    const texture = typeof document !== 'undefined' ? createCardTexture(project) : null;
    const faceMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide
    });

    // Card face geometry
    const faceGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const faceMesh = new THREE.Mesh(faceGeo, faceMaterial);
    faceMesh.position.z = cardDepth / 2 + 0.005;
    cardMeshGroup.add(faceMesh);

    // Beveled metallic border frame
    const frameShape = new THREE.Shape();
    const w = cardWidth / 2;
    const h = cardHeight / 2;
    const r = 0.25; // rounded corner radius

    frameShape.moveTo(-w + r, -h);
    frameShape.lineTo(w - r, -h);
    frameShape.quadraticCurveTo(w, -h, w, -h + r);
    frameShape.lineTo(w, h - r);
    frameShape.quadraticCurveTo(w, h, w - r, h);
    frameShape.lineTo(-w + r, h);
    frameShape.quadraticCurveTo(-w, h, -w, h - r);
    frameShape.lineTo(-w, -h + r);
    frameShape.quadraticCurveTo(-w, -h, -w + r, -h);

    const extrudeSettings = {
      steps: 1,
      depth: cardDepth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    };
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
    frameGeo.center();
    const frameMesh = new THREE.Mesh(frameGeo, borderMaterial);
    cardMeshGroup.add(frameMesh);

    // Spatial positioning: arranged in an elliptical orbit around the central spine
    const angle = (index / SHOWCASE_PROJECTS.length) * Math.PI * 2;
    const radiusX = 6.2;
    const radiusZ = 5.5;

    cardMeshGroup.position.x = Math.sin(angle) * radiusX;
    cardMeshGroup.position.z = Math.cos(angle) * radiusZ;
    cardMeshGroup.position.y = (index - 1.5) * 0.45;

    // Orient card slightly towards center / camera
    cardMeshGroup.rotation.y = angle + Math.PI;

    // Attach project data
    cardMeshGroup.userData = { project, index, angle };

    carouselGroup.add(cardMeshGroup);
  });

  return carouselGroup;
}
