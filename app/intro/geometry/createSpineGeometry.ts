import * as THREE from 'three';

/**
 * Creates the central iridescent crystalline spine / vertebrae totem
 * visible in Scene 2 (frames 020 - 030).
 */
export function createSpineTotem(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  group.name = 'spine-totem';

  const vertebraCount = 14;
  const vertebraSpacing = 0.85;

  for (let i = 0; i < vertebraCount; i++) {
    const y = (i - vertebraCount / 2) * vertebraSpacing;
    const vertebra = new THREE.Group();
    vertebra.position.y = y;

    // Central core spool
    const coreGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.45, 16);
    const coreMesh = new THREE.Mesh(coreGeo, material);
    vertebra.add(coreMesh);

    // Lateral faceted wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.2);
    wingShape.lineTo(0.9, 0.1);
    wingShape.lineTo(1.1, -0.1);
    wingShape.lineTo(0.7, -0.2);
    wingShape.lineTo(0, -0.15);
    wingShape.closePath();

    const wingSettings = {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2
    };

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingSettings);
    wingGeo.center();

    // Right wing
    const rightWing = new THREE.Mesh(wingGeo, material);
    rightWing.position.set(0.65, 0, 0);
    rightWing.rotation.z = Math.sin(i * 0.4) * 0.15;
    vertebra.add(rightWing);

    // Left wing
    const leftWing = new THREE.Mesh(wingGeo, material);
    leftWing.position.set(-0.65, 0, 0);
    leftWing.rotation.y = Math.PI;
    leftWing.rotation.z = -Math.sin(i * 0.4) * 0.15;
    vertebra.add(leftWing);

    // Subtle scale breathing
    const scaleFactor = 1.0 - Math.abs(i - vertebraCount / 2) * 0.04;
    vertebra.scale.set(scaleFactor, scaleFactor, scaleFactor);

    group.add(vertebra);
  }

  return group;
}
