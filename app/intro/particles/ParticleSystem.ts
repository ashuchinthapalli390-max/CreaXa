import * as THREE from 'three';

export class ParticleSystem {
  public points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private count: number;
  private originalPositions: Float32Array;

  constructor(count: number = 3200) {
    this.count = count;

    // Generate circular soft glow texture for point sprites
    const spriteTexture = this.createBokehTexture();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randoms = new Float32Array(count * 3);

    this.originalPositions = new Float32Array(count * 3);

    // Multi-chromatic bokeh palette derived from reference
    const palette = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xb829ff), // Purple
      new THREE.Color(0xff1493), // Magenta
      new THREE.Color(0xffaa22), // Warm Amber
      new THREE.Color(0x10e080), // Emerald
      new THREE.Color(0xddeeff)  // Cool White
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Volumetric cylinder / spiral distribution around Z axis
      const radius = 2.0 + Math.pow(Math.random(), 1.5) * 16.0;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.4) * 80.0;

      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      this.originalPositions[i3] = x;
      this.originalPositions[i3 + 1] = y;
      this.originalPositions[i3 + 2] = z;

      // Color selection
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Varied bokeh sizing
      scales[i] = 12.0 + Math.random() * 32.0;

      // Random factors for individual Brownian motion
      randoms[i3] = (Math.random() - 0.5) * 2;
      randoms[i3 + 1] = (Math.random() - 0.5) * 2;
      randoms[i3 + 2] = Math.random() * Math.PI * 2;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute('randoms', new THREE.BufferAttribute(randoms, 3));

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uScrollVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTexture: { value: spriteTexture }
    };

    const vertexShader = `
      uniform float uTime;
      uniform float uProgress;
      uniform float uScrollVelocity;
      uniform vec2 uMouse;

      attribute vec3 customColor;
      attribute float scale;
      attribute vec3 randoms;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = customColor;

        vec3 pos = position;

        // Ambient organic drift
        float wave = sin(uTime * 0.8 + randoms.z) * 0.35;
        pos.x += sin(uTime * 0.5 + pos.y * 0.2) * 0.25 + wave * randoms.x;
        pos.y += cos(uTime * 0.4 + pos.x * 0.2) * 0.25 + wave * randoms.y;

        // Mouse parallax deflection
        pos.x += uMouse.x * (1.5 + abs(pos.z) * 0.05);
        pos.y += uMouse.y * (1.5 + abs(pos.z) * 0.05);

        // Scroll vortex expansion: particles swirl outwards into a tunnel as progress increases
        float tunnelFactor = smoothstep(0.1, 0.6, uProgress);
        float angle = uProgress * 4.0 + pos.z * 0.05;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        pos.xy = rot * pos.xy * (1.0 + tunnelFactor * 1.5);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Distance attenuation
        float dist = -mvPosition.z;
        gl_PointSize = scale * (350.0 / max(dist, 1.0));

        // Depth fog / fade near camera and far back
        float alpha = smoothstep(1.5, 4.0, dist) * (1.0 - smoothstep(40.0, 75.0, dist));
        vAlpha = alpha * 0.85;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        if (tex.a < 0.02) discard;
        gl_FragColor = vec4(vColor * 1.2, tex.a * vAlpha);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.name = 'atmospheric-particles';
  }

  private createBokehTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  public update(time: number, progress: number, velocity: number, mouseX: number, mouseY: number) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uProgress.value = progress;
    this.material.uniforms.uScrollVelocity.value = velocity;
    this.material.uniforms.uMouse.value.set(mouseX, mouseY);
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
