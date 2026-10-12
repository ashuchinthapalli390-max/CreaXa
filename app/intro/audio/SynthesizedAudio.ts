export class SynthesizedAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  constructor() {
    // Check localStorage preference
    try {
      this.isMuted = localStorage.getItem('creaxa_sound') !== 'true';
    } catch {
      this.isMuted = true;
    }
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public toggle(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('creaxa_sound', (!this.isMuted).toString());
    } catch {}

    if (!this.isMuted) {
      this.init();
      this.playChime();
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
    }
    return !this.isMuted;
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low pass filter with subtle resonance
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(420, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);
      this.filterNode.connect(this.masterGain);

      // Ambient sci-fi drone chord
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 note

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.droneOsc1.connect(droneGain);
      this.droneOsc2.connect(droneGain);
      droneGain.connect(this.filterNode);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch {
      // AudioContext not allowed or unsupported
    }
  }

  public updateVelocity(velocity: number) {
    if (!this.ctx || !this.filterNode || this.isMuted) return;
    // Modulate filter frequency based on scroll velocity for dynamic responsiveness
    const targetFreq = 420 + Math.min(velocity * 800, 1600);
    this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.15);
  }

  public playChime() {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {}
  }

  public dispose() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}
