// ==============================================================================
// CREAXA CENTRAL MOTION DESIGN TOKENS
// ==============================================================================

export const MOTION_DURATIONS = {
  instant: 100,      // 80–120ms: Immediate click/active feedback
  icon: 160,         // 120–180ms: Icon hover, arrow translate, checkmark
  button: 200,       // 160–240ms: Button hover, pill select, badge
  dropdown: 240,     // 180–280ms: Popovers, menus, theme select
  card: 280,         // 220–350ms: Card hover elevation, tag reveal
  modal: 340,        // 250–400ms: Dialogs, command palette, drawers
  page: 420,         // 300–550ms: Route/tab content arrival
  headline: 700,     // 500–850ms: Line-mask typography entrance
  imageWipe: 750,    // 500–900ms: Editorial mask wipe reveal
  sectionReveal: 650 // 450–900ms: Scroll section entrance
} as const;

export const MOTION_EASINGS = {
  // Editorial deceleration (Power3.out equivalent)
  editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
  // Ultra-smooth cinematic curve (Power4.out / Expo.out equivalent)
  cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Sharp mechanical transition for Industrial Mono and Carbon Acid
  mechanical: 'cubic-bezier(0, 0, 0.2, 1)',
  // Subtle spring only for playful micro-accents
  springSoft: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
  // Standard CSS ease out
  standard: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
} as const;

export const MOTION_DISTANCES = {
  buttonIcon: 4,     // px: Arrow glide on hover
  cardHover: 4,      // px: Card elevation on hover
  textEntrance: 24,  // px: Upward reveal
  sectionReveal: 32, // px: Upward section entrance
  maskOffset: '110%' // for clipping masks
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getThemeMotionMultiplier(themeIndex: number): number {
  // Theme personality speed tuning:
  // Carbon Acid (2) and Industrial Mono (7) are crisper/faster (0.8x)
  // Terracotta Atelier (4) and Analog Film (8) are slower and more cinematic (1.15x)
  switch (themeIndex) {
    case 2:
    case 7:
      return 0.82;
    case 4:
    case 8:
      return 1.15;
    default:
      return 1.0;
  }
}
