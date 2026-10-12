export interface CameraKeyframe {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  rotationZ?: number;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  clientOrCategory: string;
  tag: string;
  color: string;
  description: string;
  previewGradient: [string, string];
}

export interface IntroState {
  progress: number; // 0.0 to 1.0
  targetProgress: number;
  velocity: number;
  direction: 1 | -1 | 0;
  isReady: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  activeCategory: string;
  soundEnabled: boolean;
}
