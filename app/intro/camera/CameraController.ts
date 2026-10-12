import * as THREE from 'three';
import { CameraKeyframe } from '../types';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  private keyframes: CameraKeyframe[];
  private currentPosition = new THREE.Vector3();
  private currentTarget = new THREE.Vector3();
  private mouseOffset = new THREE.Vector2();

  constructor(fov: number = 45, aspect: number = 16 / 9) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);

    // Camera trajectories derived from reference recording inspection
    this.keyframes = [
      {
        progress: 0.0,
        position: [0, 0.1, 7.6],
        target: [0, 0, 0],
        fov: 45
      },
      {
        progress: 0.22,
        position: [0.3, 0.4, 3.6],
        target: [0, 0.1, -4.0],
        fov: 46
      },
      {
        progress: 0.52,
        position: [0, 0.2, -3.8],
        target: [0, 0, -11.5],
        fov: 48
      },
      {
        progress: 0.78,
        position: [1.2, -0.3, -8.2],
        target: [0, 0.1, -14.0],
        fov: 50
      },
      {
        progress: 1.0,
        position: [0, 0, -20.0],
        target: [0, 0, -30.0],
        fov: 52
      }
    ];

    this.currentPosition.set(0, 0.1, 7.6);
    this.currentTarget.set(0, 0, 0);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  /**
   * Evaluates camera position and target along smooth Catmull-Rom trajectory at normalized progress t [0, 1]
   */
  public update(progress: number, mouseX: number, mouseY: number, delta: number = 0.016) {
    const t = THREE.MathUtils.clamp(progress, 0.0, 1.0);

    // Find bounding keyframe segment
    let k0 = this.keyframes[0];
    let k1 = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (t >= this.keyframes[i].progress && t <= this.keyframes[i + 1].progress) {
        k0 = this.keyframes[i];
        k1 = this.keyframes[i + 1];
        break;
      }
    }

    const span = k1.progress - k0.progress;
    const localT = span > 0.0001 ? (t - k0.progress) / span : 0;
    // Smooth cosine easing between keyframes
    const easeT = 0.5 - 0.5 * Math.cos(localT * Math.PI);

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(k0.position[0], k1.position[0], easeT),
      THREE.MathUtils.lerp(k0.position[1], k1.position[1], easeT),
      THREE.MathUtils.lerp(k0.position[2], k1.position[2], easeT)
    );

    const targetLookAt = new THREE.Vector3(
      THREE.MathUtils.lerp(k0.target[0], k1.target[0], easeT),
      THREE.MathUtils.lerp(k0.target[1], k1.target[1], easeT),
      THREE.MathUtils.lerp(k0.target[2], k1.target[2], easeT)
    );

    // Smooth mouse parallax damping
    const targetMouseX = mouseX * 0.55;
    const targetMouseY = mouseY * 0.45;
    this.mouseOffset.x += (targetMouseX - this.mouseOffset.x) * 0.06;
    this.mouseOffset.y += (targetMouseY - this.mouseOffset.y) * 0.06;

    targetPos.x += this.mouseOffset.x;
    targetPos.y += this.mouseOffset.y;

    // Apply smooth camera damping
    this.currentPosition.lerp(targetPos, 0.08);
    this.currentTarget.lerp(targetLookAt, 0.08);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);

    // Dynamic FOV interpolation
    const targetFov = THREE.MathUtils.lerp(k0.fov, k1.fov, easeT);
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = targetFov;
      this.camera.updateProjectionMatrix();
    }
  }

  public setAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
