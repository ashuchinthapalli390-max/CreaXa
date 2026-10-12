import * as THREE from 'three';

/**
 * Creates the central 3D emblem composition:
 * - Outer beveled Torus ring
 * - Inner geometric CreaXa nexus emblem
 * - Sweeping, twisting metallic ribbon strands (figure-eight hourglass loop)
 */
export function createEmblemComposition(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  group.name = 'emblem-group';

  // 1. Outer Metallic Torus Ring (matching the reference ring)
  const ringRadius = 1.65;
  const ringTube = 0.12;
  const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 32, 128);
  const ringMesh = new THREE.Mesh(ringGeo, material);
  ringMesh.name = 'emblem-ring';
  group.add(ringMesh);

  // Inner beveled decorative lip for extra specular rim detail
  const innerLipGeo = new THREE.TorusGeometry(ringRadius - ringTube * 0.85, 0.04, 24, 96);
  const innerLipMesh = new THREE.Mesh(innerLipGeo, material);
  innerLipMesh.scale.set(1, 1, 1.4);
  group.add(innerLipMesh);

  // 2. Inner CreaXa Geometric Nexus (Stylized "CX" Prismatic Monogram)
  // An intricate, faceted geometric sculpture suspended in the ring center
  const nexusGroup = new THREE.Group();
  nexusGroup.name = 'nexus-core';

  // Left prong of "C" facet
  const cShape = new THREE.Shape();
  cShape.moveTo(-0.7, 0.7);
  cShape.lineTo(-0.1, 0.7);
  cShape.lineTo(-0.25, 0.45);
  cShape.lineTo(-0.45, 0.45);
  cShape.lineTo(-0.45, -0.45);
  cShape.lineTo(-0.25, -0.45);
  cShape.lineTo(-0.1, -0.7);
  cShape.lineTo(-0.7, -0.7);
  cShape.closePath();

  const cExtrudeSettings = {
    steps: 2,
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 4
  };
  const cGeo = new THREE.ExtrudeGeometry(cShape, cExtrudeSettings);
  cGeo.center();
  const cMesh = new THREE.Mesh(cGeo, material);
  cMesh.position.x = -0.32;
  nexusGroup.add(cMesh);

  // Right overlapping diagonal crosses forming "X" facet
  const xShape = new THREE.Shape();
  xShape.moveTo(0.05, 0.65);
  xShape.lineTo(0.65, -0.65);
  xShape.lineTo(0.42, -0.65);
  xShape.lineTo(-0.18, 0.65);
  xShape.closePath();

  const xMesh1 = new THREE.Mesh(new THREE.ExtrudeGeometry(xShape, cExtrudeSettings), material);
  xMesh1.position.x = 0.22;
  nexusGroup.add(xMesh1);

  const xShape2 = new THREE.Shape();
  xShape2.moveTo(0.65, 0.65);
  xShape2.lineTo(0.05, -0.65);
  xShape2.lineTo(-0.18, -0.65);
  xShape2.lineTo(0.42, 0.65);
  xShape2.closePath();

  const xMesh2 = new THREE.Mesh(new THREE.ExtrudeGeometry(xShape2, cExtrudeSettings), material);
  xMesh2.position.x = 0.22;
  nexusGroup.add(xMesh2);

  // Subtle central faceted diamond connector
  const diamondGeo = new THREE.OctahedronGeometry(0.28, 0);
  diamondGeo.scale(0.8, 1.4, 0.6);
  const diamondMesh = new THREE.Mesh(diamondGeo, material);
  diamondMesh.position.set(0, 0, 0.05);
  nexusGroup.add(diamondMesh);

  group.add(nexusGroup);

  // 3. Looping Figure-Eight Metallic Ribbon Strands
  // In the reference (frame_005.jpg), two strands connect to the bottom of the ring,
  // descend in a figure-eight cross curve, and flow deep into the lower plane.
  const createRibbonCurve = (inverted: boolean = false) => {
    const points: THREE.Vector3[] = [];
    const segments = 48;
    const yStart = -ringRadius + 0.1;
    const yEnd = -6.5;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = THREE.MathUtils.lerp(yStart, yEnd, t);
      // Hourglass / figure-eight crossover
      const angle = t * Math.PI * 1.8;
      const x = Math.sin(angle) * (0.85 * (1.0 - t * 0.3) + (inverted ? -0.1 : 0.1));
      const z = Math.cos(angle) * 0.45 * (1.0 - t * 0.2);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  };

  const curve1 = createRibbonCurve(false);
  const curve2 = createRibbonCurve(true);

  const strandRadius = 0.038;
  const strandGeo1 = new THREE.TubeGeometry(curve1, 96, strandRadius, 16, false);
  const strandMesh1 = new THREE.Mesh(strandGeo1, material);
  strandMesh1.name = 'strand-1';
  group.add(strandMesh1);

  const strandGeo2 = new THREE.TubeGeometry(curve2, 96, strandRadius, 16, false);
  const strandMesh2 = new THREE.Mesh(strandGeo2, material);
  strandMesh2.name = 'strand-2';
  strandMesh2.scale.set(-1, 1, 1);
  group.add(strandMesh2);

  // Upper suspension strands visible during reverse scroll (frame_045.jpg - frame_047.jpg)
  const createUpperCurve = () => {
    const points: THREE.Vector3[] = [];
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = THREE.MathUtils.lerp(ringRadius - 0.1, 5.5, t);
      const angle = t * Math.PI * 1.5;
      const x = Math.sin(angle) * 0.7 * (1.0 - t * 0.2);
      const z = Math.cos(angle) * 0.35;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  };
  const upperCurve = createUpperCurve();
  const upperGeo = new THREE.TubeGeometry(upperCurve, 64, strandRadius, 16, false);
  const upperMesh1 = new THREE.Mesh(upperGeo, material);
  upperMesh1.name = 'upper-strand-1';
  group.add(upperMesh1);

  const upperMesh2 = new THREE.Mesh(upperGeo, material);
  upperMesh2.name = 'upper-strand-2';
  upperMesh2.scale.set(-1, 1, 1);
  group.add(upperMesh2);

  return group;
}
