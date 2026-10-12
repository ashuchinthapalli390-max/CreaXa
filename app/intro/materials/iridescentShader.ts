import * as THREE from 'three';

export function createIridescentMaterial(options: {
  baseColor?: THREE.Color;
  metalness?: number;
  roughness?: number;
  fresnelPower?: number;
} = {}) {
  const baseColor = options.baseColor || new THREE.Color(0x0c0f16);
  const fresnelPower = options.fresnelPower ?? 2.8;

  const uniforms = {
    uTime: { value: 0 },
    uBaseColor: { value: baseColor },
    uFresnelPower: { value: fresnelPower },
    uLightPos: { value: new THREE.Vector3(-15, 25, 20) },
    uRimLightPos: { value: new THREE.Vector3(15, -15, -20) },
    uCameraPos: { value: new THREE.Vector3(0, 0, 10) },
    uDispersion: { value: 0.85 },
    uEnvIntensity: { value: 1.2 }
  };

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform float uFresnelPower;
    uniform vec3 uLightPos;
    uniform vec3 uRimLightPos;
    uniform vec3 uCameraPos;
    uniform float uDispersion;
    uniform float uEnvIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    // Spectral color mapping for iridescent rainbow dispersion
    vec3 spectral(float t) {
      t = clamp(t, 0.0, 1.0);
      // Cyan -> Electric Purple -> Vivid Magenta -> Gold
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.33, 0.67);
      return a + b * cos(6.28318 * (c * t + d + uTime * 0.04));
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel reflection factor
      float NdotV = max(dot(normal, viewDir), 0.0);
      float fresnel = pow(1.0 - NdotV, uFresnelPower);

      // Key light specular highlight
      vec3 lightDir = normalize(uLightPos - vWorldPosition);
      vec3 halfVector = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfVector), 0.0);
      float specular = pow(NdotH, 48.0) * 1.5;

      // Rim back-light specular
      vec3 rimLightDir = normalize(uRimLightPos - vWorldPosition);
      vec3 rimHalf = normalize(rimLightDir + viewDir);
      float rimSpec = pow(max(dot(normal, rimHalf), 0.0), 32.0);

      // Iridescent chromatic shift along normal & view angle
      float iridIndex = fract(fresnel * 1.6 + dot(normal, vec3(0.0, 1.0, 0.0)) * 0.3 + sin(vWorldPosition.z * 0.4) * 0.2);
      vec3 iridColor = spectral(iridIndex);

      // Subtle metallic micro-faceting
      float stripe = pow(abs(sin(normal.y * 12.0 + normal.x * 8.0 + uTime * 0.2)), 6.0) * 0.2;

      // Composite physical metallic surface
      vec3 col = uBaseColor * 0.8;
      col += iridColor * fresnel * 1.8;
      col += vec3(0.0, 0.95, 1.0) * rimSpec * 1.2;
      col += vec3(1.0) * specular;
      col += vec3(0.8, 0.6, 1.0) * stripe;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  });

  return material;
}
