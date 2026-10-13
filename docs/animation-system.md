# CreaXa — Animation & Cinematic 3D Storytelling System

## 1. Overview

CreaXa pairs high-end editorial typography with an immersive, scroll-driven visual journey that communicates the core marketplace problem and solution. The animation system is engineered across three interconnected layers:
1. **Three.js / WebGL 3D Narrative Canvas**: Persistent Catmull-Rom camera journey and 5,600-particle field.
2. **7-Scene Cinematic Scroll Experience**: Structured narrative walking the visitor from the fractured status quo to complete project delivery.
3. **Everyday Interface Micro-Animations**: Accessible, predictable CSS transitions on controls, dialogs, drawers, and workflow timelines.

---

## 2. Seven-Scene Cinematic Narrative

The scroll-driven experience (`app/intro/IntroExperience.tsx` and homepage sections) guides users through seven distinct visual chapters:

| Scene | Chapter Name | Editorial Headline | Narrative & Visual Meaning |
|---|---|---|---|
| **Scene 1** | **Hero: A New Creative Economy** | *Creative talent. Intelligently connected.* | Central iridescent sculpture with connected brand and creator nodes; dual CTAs ("Explore creators" and "Start a campaign"). |
| **Scene 2** | **The Problem: Fragmented Discovery** | *The talent exists. The discovery is broken.* | Nodes disconnect into separate 3D regions illustrating the pain points: scattered platforms, unclear skills, and missing workflow context. |
| **Scene 3** | **The Brief: Idea to Structure** | *From a rough idea to a real creative brief.* | Floating abstract particles condense into organized blocks: Style, Content type, Aspect ratio, Platform, Budget, Commercial rights, and Deadline. |
| **Scene 4** | **The Match: Creative Compatibility** | *Find the right creative mind.* | Requirement vectors align with eligible creator nodes; explainable compatibility scoring (Style 30%, Tools 20%, Format 20%, Industry 15%, Budget 15%). |
| **Scene 5** | **Portfolio Gallery** | *Work that speaks for itself.* | Showcases real published creator image and video productions with declared AI toolchains and verified workflows. |
| **Scene 6** | **Collaboration Workflow** | *From first connection to final delivery.* | Traverses the 6-step project lifecycle: *Invite → Accept → Submit v1 → Revise → Approve → Deliver*. |
| **Scene 7** | **Final Call to Action** | *Make something extraordinary.* | Converging nodes resolve into the primary action dock: "Discover creators", "Join as a creator", and "Start a campaign". |

---

## 3. WebGL & Three.js Architecture

### 3.1 Persistent Single Canvas
Rather than mounting separate WebGL contexts per section (which risks WebGL context loss and high memory usage), CreaXa utilizes a single persistent canvas driven by the viewport scroll position:
- **Catmull-Rom Camera Trajectory**: Centripetal Catmull-Rom curve with 9 keyframe control points ensuring smooth, continuous camera motion without jerky rotations.
- **Particle System**: 5,600 deterministic particles (`createParticleField`) positioned with custom mathematical distributions to frame the central geometry.
- **Frame-Rate Independent Damping**: Uses exponential damping (`damp(current, target, lambda, dt) = lerp(current, target, 1 - exp(-lambda * dt))`), guaranteeing identical camera glide at 30fps, 60fps, 120fps, and variable refresh rates.

### 3.2 Theme-Reactive Lighting & Shaders
The ambient WebGL scene responds dynamically when the user switches themes:
- In dark themes (*Obsidian Editorial*, *Midnight Cobalt*), metallic surfaces reflect high-contrast directional specular highlights.
- In lighter themes (*Paper & Ink*, *Arctic Signal*), materials soften into matte ceramic and frosted glass.

---

## 4. Everyday Interface Microinteractions

Everyday interactions are kept crisp, fast, and predictable:
- **Hover Transitions**: 120ms–220ms ease-out transitions for buttons and cards.
- **Search & Filter Drawer**: 240ms slide-out transition with debounced query updates to avoid visual stutter.
- **Collaboration Timeline**: Step indicators light up smoothly as work moves from *Submission* to *Revision* to *Approval*.
- **Theme Switcher**: Instant token updates applied to `:root` without page reloads or form state reset.

---

## 5. Performance & Accessibility Fallbacks

1. **Reduced Motion (`prefers-reduced-motion: reduce`)**:
   When detected via media query, 3D camera travel and particle animations are automatically bypassed. Typography and functional CTAs render statically with gentle opacity reveals.
2. **WebGL Context Fallback**:
   If WebGL is disabled or unsupported by hardware acceleration, the canvas gracefully hides and presents the complete, fully accessible HTML marketplace layout without errors.
