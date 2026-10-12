# REFERENCE ANALYSIS: ACTIVE THEORY EXPERIENCE & CREAXA 3D OPENING SPECIFICATION

**Reference Source**: Workspace recording `referance/Recording 2026-10-12 125009.mp4`  
**Video Specifications**:
- **Format**: MP4 (AVC Coding / H.264 Main, Progressive)
- **Resolution**: 1920 × 1080 (16:9 widescreen, SAR 1:1, DAR 16:9)
- **Duration**: 00:01:33.50 (93.50 seconds)
- **Frame Rate**: 30.00 fps (constant frame rate)
- **Audio Stream**: AAC stereo, 48 kHz, 192 kbps
- **Color Space**: yuv420p (tv range, progressive)

---

## 1. Opening Composition & Measured Relative Placement

The initial viewport composition presents a high-contrast, deep-black 3D space (`#000000` / `#050508`) occupied by a centered sculptural hero and floating technical UI.

### 1.1 Central Hero Sculpture
- **Ring Geometry**: Centered at screen coordinates `(50% X, 48% Y)`. Outer radius approximately 18% of viewport height; inner radius approximately 13% of viewport height. Thickness: ~2.5% of viewport width.
- **Inner Emblem**: Centered within the ring. In the reference, it is the stylized geometric Active Theory emblem (`a` glyph with beveled interior). For the **CreaXa** implementation, it is replaced with the official **CreaXa Geometric Nexus (`CX` / interconnected geometric prism)** to preserve CreaXa brand identity while retaining exact sculptural proportions and physical presence.
- **Strand Geometry**: Two fine, sweeping metallic ribbons connected to the lower perimeter of the ring at approximately 210° and 330°. They descend vertically, twisting and crossing over in a symmetrical figure-eight / hourglass curve down past the lower viewport boundary (`Y > 100%`).
- **Material Appearance**: High-index physical metallic reflection (`metalness: ~0.95`, `roughness: ~0.15`). Custom Fresnel and chromatic dispersion shader produces view-dependent iridescent fringe shifts (cyan `#00f0ff`, neon purple `#b829ff`, electric magenta `#ff1493`, and spectral gold `#ffd700` along grazing angles).

### 1.2 Atmospheric Particle Field
- **Spatial Distribution**: 3D volumetric cloud surrounding the central emblem and extending through deep Z space (`Z: -500 to +300`).
- **Appearance**: Spherical soft bokeh sprites with Gaussian radial falloff, varying in screen size (4px to 28px) and opacity (0.1 to 0.85).
- **Color Palette**: Multi-chromatic bokeh (amber `#ffaa33`, cyan `#33eeff`, magenta `#ff33aa`, emerald `#22dd88`, and soft lavender `#ccbbee`).
- **Motion**: Dual-mode — continuous ambient drift (slow organic Brownian motion) overlaid with scroll-linked Z-expansion and vortex rotation.

### 1.3 Minimal Interface Placement
- **Top Navigation Pill**: Positioned at `top: 28px`, `right: 36px`. Rounded capsule (`border-radius: 9999px`), translucent dark glass background (`rgba(10, 15, 20, 0.65)`), ultra-thin border (`1px solid rgba(255, 255, 255, 0.15)`), soft cyan/green backlight glow beneath the pill.
- **Navigation Content**: `WORK ────── CONTACT` (for CreaXa: `EXPLORE ────── DISCOVER` + `Skip Intro`).
- **Typography**: Monospace / technical grotesque, uppercase, `letter-spacing: 0.15em`, font size 11px–12px.
- **Initial Interactive Trigger**: A centered ASCII loader and trigger (`/30` digital counter progressing to `/>>>/` button) that initiates the WebGL audio/visual canvas.

---

## 2. Scene-by-Scene Visual Map & Timeline

| Timeline / Timestamp | Frame Ref | Scene State | 3D Geometry & Visuals | Camera Framing & Motion | Overlay / Interface State |
|---|---|---|---|---|---|
| **00:00 - 00:05** | `frame_001.jpg` – `frame_003.jpg` | **Preloader & Trigger** | Dark screen with ASCII particle ring, digital counter `/30` counting to complete, resolving to interactive start trigger `/>>>/`. | Static camera at origin, focused on preloader graphics. | Minimal ASCII / monospace typography in electric cyan. |
| **00:06 - 00:15** | `frame_004.jpg` – `frame_008.jpg` | **Scene 0: Hero Sculpture** | Centered metallic ring with iridescent rim highlights and figure-eight ribbon strands. Floating bokeh particles drift slowly in 3D depth. | Camera slightly pitched upward (`fov: 45°`), orbiting subtly with pointer position. | Floating top-right pill `WORK ── CONTACT` with glowing underlight; bottom scroll indicator. |
| **00:16 - 00:28** | `frame_009.jpg` – `frame_014.jpg` | **Scene 1: Tunnel Flythrough & Narrative** | Emblem ring rotates on Y-axis. Particles condense into a cylindrical vortex / tunnel around the camera trajectory. In the distant background, a landscape/horizon horizon appears. | Forward camera dolly (`+Z` translation), passing through the emblem and strands with subtle roll. | Left typographic headline: `CREATIVE DIGITAL EXPERIENCES`. Monospace technical copy at bottom right. |
| **00:29 - 00:52** | `frame_015.jpg` – `frame_032.jpg` | **Scene 2: 3D Project Carousel & Category Matrix** | Floating rounded 3D showcase cards with glossy borders, holographic media textures, and glitch/chromatic-aberration text orbiting around a central crystalline spine/totem. | Camera pans and zooms to frame active showcase cards (e.g. Xbox 20 Years, Harry Potter, Sustainable Horizons). | Left menu: `WHAT ARE YOU LOOKING FOR?` with category links (`WEBSITES`, `INSTALLATIONS`, `XR / VR / AI`, `MULTIPLAYER`, `GAMES`) and `ASK ME ANYTHING...` pill input. |
| **00:53 - 01:12** | `frame_033.jpg` – `frame_041.jpg` | **Scene 3: Deep Tech Chamber & Lab View** | Futuristic cylindrical reactor chamber with suspended cables and glowing magenta particle core, transitioning into underwater caustic lighting with hexagonal matrix (`// THE LAB ->`). | Dolly into the inner core, dramatic depth of field changes, caustic light refractions. | Technical HUD labels and crosshair glyphs. |
| **01:13 - 01:33** | `frame_042.jpg` – `frame_047.jpg` | **Scene 4: Reverse Scroll & Inverted Emblem Horizon** | Reverse scroll trajectory: camera retreats smoothly backwards, particles reverse drift, and the central emblem reappears suspended from an inverted looping strand overhead. | Reverse camera dolly, decelerating to a stop with gentle easing. | Seamless return of top-right navigation pill and atmospheric rest state. |

---

## 3. Verified Navigation & Interaction Matrix

| Element / Control | Reference Behavior | CreaXa Integrated Adaptation |
|---|---|---|
| **Initial Loader / Enter** | Monospace counter `/30`, ASCII glyphs, then `/>>>/` button click to reveal audio/3D. | Digital monospace loader with instant WebGL initialization and click/scroll trigger. |
| **Scroll Wheel / Drag** | Continuous virtual scroll controlling camera position along a 3D spline trajectory with momentum and damping. | Native/virtual bounded scroll section mapping normalized progress `0.0 -> 1.0` to camera and scene keyframes. Reverse scroll fully supported. |
| **Pointer Move** | Subtle parallax tilt of camera target (`±0.08 rad`), slight particle displacement around pointer raycast. | Normalized mouse coordinates `(x, y)` apply gentle camera offset and specular light tracking. |
| **Category Links** | Filters/focuses the active project card and camera target in 3D space. | In CreaXa: filter creative disciplines (`AI FILMMAKING`, `GENERATIVE ART`, `MOTION & ANIMATION`, `3D & XR`). |
| **Top-Right Pill** | `WORK` navigates to portfolio scene; `CONTACT` links to inquiry view. | Translucent pill with `EXPLORE` (jumps to 3D showcase), `SKIP INTRO` (transitions directly to marketplace), and sound toggle. |
| **Transition to Marketplace** | At progress 1.0 (or skip), the 3D scene smoothly transitions out and reveals the main content. | Coordinated camera dive/fade reveals the CreaXa header and full marketplace without page reload or layout jump. |
| **Replay Control** | Browser refresh reloads the experience. | Persistent session policy: intro displays once per session; an accessible "Replay 3D Intro" button is added to CreaXa header/footer. |

---

## 4. Forward and Reverse Scroll Observations

1. **Velocity and Inertia**: The scroll does not immediately snap; it utilizes exponential damping (`lerp` with factor ~0.06 to 0.08 per frame) producing silky, cinematic momentum.
2. **Reverse Integrity**: In frames `042` to `047`, scrolling backward smoothly reverses the camera path without clipping, shader flicker, or state desynchronization.
3. **No Timer Auto-Dismissal**: The experience remains locked to the user's scroll progression; there is no artificial 8-second auto-skip timer.
4. **Touch & Trackpad Gestures**: Smooth trackpad two-finger scroll and touch-drag advance the timeline predictably.

---

## 5. Geometry, Material, Lighting, Particle & Typography Requirements

### 5.1 Geometry Requirements
- **Emblem Ring**: Torus / extruded tube with smooth bevels and beveled inner edge.
- **CreaXa Inner Core**: Stylized multifaceted geometric sculpture (`CX` monogram nexus) with beveled planar facets.
- **Looping Strands**: 3D Parametric curve (`CatmullRomCurve3` or polynomial ribbon) with tubular extrusion (`TubeGeometry`), twisting 180° through the central axis.
- **Floating Showcase Cards**: Rounded rectangles (`PlaneGeometry` with rounded corner vertex displacement or smooth boundary mask) displaying high-resolution project art with iridescent metallic borders.
- **Spine / Column Totem**: Segmented organic/mechanical column with repeating iridescent vertebrae.

### 5.2 Materials & Shaders
- **Iridescent Chrome Shader**:
  - PBR base with high metalness (0.92) and low roughness (0.12).
  - Custom vertex shader passing view vector and normal to fragment shader.
  - Custom fragment shader calculating Fresnel angle `pow(1.0 - dot(N, V), 3.0)` and mapping to a multi-spectral iridescent gradient (cyan -> purple -> magenta -> gold).
- **Project Card Holographic Shader**:
  - Chromatic aberration / RGB split on hover and scroll motion.
  - Glitch / scanline displacement and glossy specular sweep.
- **Volumetric Particles**:
  - Instanced / Points sprite system with circular soft-edged alpha texture.
  - Depth-based size attenuation and distance fog.

### 5.3 Lighting Environment
- **Ambient Light**: Deep blue/indigo fill (`#080c18`, intensity: 0.6).
- **Key Light**: High-contrast cold white directional light (`#f0f8ff`, intensity: 1.8) positioned top-left (`-15, 25, 20`).
- **Rim / Accent Light**: Vibrant cyan-magenta rim light (`#00f0ff` / `#ff00aa`, intensity: 2.4) angled from behind (`10, -10, -25`) to catch beveled edges.
- **Point Lights**: Localized glowing orbs tracking with camera movement to provide localized specular glints on the metallic ribbons.

### 5.4 Typography
- **Font Stack**: Technical monospace and geometric sans (`ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `Inter`, `system-ui`).
- **Styles**: Small caps, wide letter-spacing (`0.12em` to `0.25em`), font sizes 10px–13px for interface chrome; bold condensed sans for primary headlines (`CREATIVE DIGITAL EXPERIENCES` / `INTELLIGENT CREATIVE MATCHING`).

---

## 6. Responsive Observations (Desktop & Mobile)

- **Desktop (1920×1080 / 1440×900)**: Full widescreen composition with central emblem comfortably sized (occupying central 35% of viewport); navigation fixed at top-right; project cards orbit horizontally across wide Z-depth.
- **Laptop / Tablet (1366×768 / 1024×768)**: Emblem scale dynamically adjusted to maintain clearance with floating navigation.
- **Mobile (390×844 / 375×667)**:
  - Camera field of view widened from 45° to 58° or camera pulled back along Z-axis (`z: 14` vs `z: 10`) to prevent the emblem from overflowing narrow portrait screens.
  - Particle count throttled from 3,500 to 1,200 for smooth 60fps rendering on mobile GPUs.
  - Bounded Device Pixel Ratio (`Math.min(window.devicePixelRatio, 2)`).
  - UI overlays adapted with compact touch-friendly targets and simplified layout.

---

## 7. Unverified Behaviors & Explicit Inferences

1. **Audio Implementation**: The reference recording audio stream contained ambient futuristic synth soundscapes. In the browser, web audio requires explicit user gesture before playback; audio is made optional with a mute/unmute control and synthesized/royalty-free atmospheric sound.
2. **Exact Spline Coordinates**: Internal camera coordinate curves in Active Theory are proprietary. We construct mathematically smooth 3D Catmull-Rom splines matching the observed frame framing and zoom distances at each progression percentage.
3. **Internal Easing Equations**: Inferred as exponential decay damping (`lerp(current, target, 0.07)`).

---

## 8. Original Replacement Assets (CreaXa Brand Alignment)

1. **Centerpiece Emblem**: Rather than copying Active Theory's proprietary `a` trademark glyph, we craft an original 3D **CreaXa Geometric Prism / Nexus (`CX`)**, which perfectly suits an intelligent AI creative matching marketplace while exhibiting the exact same physical metallic ring, beveled contours, and iridescent ribbon strands observed in the reference.
2. **Showcase Projects**: Rather than displaying Active Theory client case studies (Xbox, Harry Potter, etc.), the 3D cards feature high-impact **CreaXa AI Creative Showcase Campaigns** (e.g. *Neural Cinema*, *Autonomous Horizon*, *Synthetic Couture*, *Generative Realms*), maintaining authentic relevance to CreaXa's creator marketplace.
