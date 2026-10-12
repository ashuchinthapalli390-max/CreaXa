export class ScrollController {
  public progress: number = 0;
  public targetProgress: number = 0;
  public velocity: number = 0;
  public direction: 1 | -1 | 0 = 0;

  private isDragging: boolean = false;
  private touchStartY: number = 0;
  private damping: number = 0.07;
  private sensitivity: number = 0.00065;
  private onProgressCallback?: (progress: number, velocity: number) => void;

  constructor(options: { sensitivity?: number; damping?: number } = {}) {
    if (options.sensitivity) this.sensitivity = options.sensitivity;
    if (options.damping) this.damping = options.damping;
  }

  public onProgress(cb: (progress: number, velocity: number) => void) {
    this.onProgressCallback = cb;
  }

  public setTargetProgress(val: number) {
    this.targetProgress = Math.max(0, Math.min(1, val));
  }

  public jumpTo(val: number) {
    this.targetProgress = Math.max(0, Math.min(1, val));
    this.progress = this.targetProgress;
    this.velocity = 0;
    if (this.onProgressCallback) {
      this.onProgressCallback(this.progress, 0);
    }
  }

  public handleWheel = (e: WheelEvent) => {
    // Normalizes wheel delta across various browsers and trackpads
    const delta = e.deltaY;
    const change = delta * this.sensitivity;

    const prevTarget = this.targetProgress;
    this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + change));

    this.direction = this.targetProgress > prevTarget ? 1 : this.targetProgress < prevTarget ? -1 : 0;
  };

  public handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      this.isDragging = true;
      this.touchStartY = e.touches[0].clientY;
    }
  };

  public handleTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = this.touchStartY - currentY;
    this.touchStartY = currentY;

    const change = deltaY * this.sensitivity * 2.2;
    const prevTarget = this.targetProgress;
    this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + change));
    this.direction = this.targetProgress > prevTarget ? 1 : this.targetProgress < prevTarget ? -1 : 0;
  };

  public handleTouchEnd = () => {
    this.isDragging = false;
  };

  public handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      this.targetProgress = Math.min(1, this.targetProgress + 0.08);
      this.direction = 1;
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      this.targetProgress = Math.max(0, this.targetProgress - 0.08);
      this.direction = -1;
    }
  };

  public update(delta: number = 0.016): number {
    const prevProgress = this.progress;

    // Frame-rate independent exponential lerp
    const lerpFactor = 1.0 - Math.pow(1.0 - this.damping, delta * 60.0);
    this.progress += (this.targetProgress - this.progress) * lerpFactor;

    this.velocity = Math.abs(this.progress - prevProgress) / Math.max(delta, 0.001);

    if (Math.abs(this.targetProgress - this.progress) < 0.0001) {
      this.progress = this.targetProgress;
      this.velocity = 0;
    }

    if (this.onProgressCallback) {
      this.onProgressCallback(this.progress, this.velocity);
    }

    return this.progress;
  }
}
