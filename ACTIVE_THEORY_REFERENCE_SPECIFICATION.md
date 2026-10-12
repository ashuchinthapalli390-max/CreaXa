# MASTER PROMPT: ACTIVE THEORY PIXEL-ACCURATE 3D WEBSITE RECREATION

## ROLE AND OBJECTIVE

You are an elite creative developer, WebGL engineer, 3D technical artist, interaction designer, animation engineer, and frontend architect.

**REFERENCE WEBSITE: https://activetheory.net/**

Your objective is to recreate the reference website with the highest achievable visual and behavioral fidelity.

This is not a request to build a website merely inspired by Active Theory. Treat the reference as a strict visual and interaction specification.

The implementation must closely reproduce the reference's:

- Overall composition, layout and visual hierarchy
- Full-screen immersive 3D environment
- Opening scene and central 3D artwork
- Scroll-controlled camera choreography
- 3D models, lighting, materials and reflections
- Particle simulations and atmospheric effects
- Scrolling speed, inertia, easing and timing
- Interactive project presentations
- Navigation positions, styling and behavior
- Hover, pointer, click and touch interactions
- Typography, spacing, alignment and responsive positioning
- Scene transitions, shader effects and cinematic presentation
- Audio controls and contextual interfaces where present

**The primary objective is matching the reference experience, not creatively redesigning it.**

Do not replace complex 3D elements with ordinary images, basic CSS shapes, gradients, or video backgrounds.

Do not substitute scroll-linked camera movement with simple section-based entrance animations.

Use the live reference as the source of truth.

---

## PHASE 1: COMPREHENSIVE REFERENCE INSPECTION

Before writing implementation code, open https://activetheory.net/ in a real browser supporting WebGL.

Use browser automation such as Playwright, browser developer tools, screenshot capture and screen recording.

Study the entire experience, not just the first viewport.

### 1.1 Desktop inspection

Inspect the site at:

- 1920 × 1080
- 1440 × 900
- 1366 × 768
- 1280 × 800

Record the page at initial loading, after loading, throughout scrolling, after interactions and during transitions.

### 1.2 Complete scroll analysis

Capture the experience at approximately every 5% of its full scroll journey, with additional frames around major transitions.

For every scene, document:

- Camera position and orientation
- Visible 3D geometry
- Lighting and environmental changes
- Particle position, density and color
- Text appearance and positioning
- Transitions between objects
- Scale and rotation changes
- Background effects
- Scroll distance required to progress
- Motion easing and velocity response
- Interactions available in that scene

Distinguish animations driven by scrolling from continuously running ambient animations.

### 1.3 Interaction inspection

Test every visible control, including:

- Main navigation
- Work and Contact links
- Logo interactions
- Project selectors
- Project cards and previews
- AI assistant interface, where available
- Category filters
- Audio or music controls
- Hover-sensitive objects
- Mouse-responsive particle effects
- Touch interactions
- Project detail navigation
- Return navigation

Document the exact visible behavior and implement it.

### 1.4 Asset and rendering inspection

Examine publicly accessible resources to determine the visual structure and rendering requirements.

Identify relevant model formats, shaders, environmental textures, image textures, video textures, fonts and sound assets.

Use assets only where their licenses and permissions allow. Otherwise, create original replacement assets that closely match the reference's visual properties, composition and quality.

Do not copy proprietary source code, private endpoints or restricted assets.

**Required research output before development:**

Create `REFERENCE_ANALYSIS.md` containing:

1. Full-page scene map
2. Screenshot references
3. Scroll and camera timeline
4. Interaction matrix
5. Visual measurements
6. Asset requirements
7. Responsive observations
8. Features requiring further verification

Do not assume something is implemented in the reference if it has not been verified.

---

## PHASE 2: VISUAL DESIGN RECONSTRUCTION

### 2.1 Design direction

Recreate Active Theory's immersive, dark, cinematic, futuristic visual language.

Essential properties:

- Deep-black background
- Three-dimensional depth
- Iridescent metallic materials
- Holographic reflections
- Neon and chromatic highlights
- Atmospheric particle fields
- Minimal interface chrome
- Precision typography
- Exceptional visual polish
- Smooth cinematic movement

The interface must feel like an interactive 3D world rather than a conventional website.

Avoid generic SaaS styling, template components, dashboard aesthetics, excessive gradient cards and arbitrary decorative UI.

### 2.2 Initial hero scene

Recreate the reference's opening composition.

The hero should occupy the full viewport.

Construct an actual 3D scene containing:

- A centered, sculptural metallic ring or emblem
- Iridescent and chrome surface treatment
- Fine curved metallic or luminous strands
- Physically convincing reflections
- Carefully controlled environmental lighting
- Floating particles distributed in three-dimensional space
- Subtle ambient rotation or movement
- Strong depth separation
- A dark surrounding environment
- Minimal floating navigation and scroll guidance

The central artwork must be rendered as genuine geometry, using properly modeled meshes or procedural geometry.

Do not replace this centerpiece with a static PNG, SVG illustration or CSS ring.

Implement physically based materials and custom shaders as necessary.

### 2.3 Materials and lighting

Use PBR-based material techniques, custom fragment shaders, procedural noise and view-dependent reflection effects.

Support:

- Fresnel reflections
- Iridescent color shifting
- Roughness and metalness control
- Environmental reflections
- Soft glow and bloom
- Chromatic aberration where appropriate
- Controlled specular lighting
- Atmospheric depth
- Color changes based on camera angle

Avoid excessive bloom that destroys detail.

Materials should feel premium and physically convincing.

### 2.4 Typography

Match the reference's typography as closely as licensing allows.

Inspect font family, weight, capitalization, letter spacing and alignment.

Use properly licensed fonts or metrically similar alternatives.

Preserve the small, technical, uppercase interface style.

Pay special attention to navigation text, project labels, category selectors, music controls and supporting copy.

Do not introduce oversized generic marketing headlines that disrupt the reference composition.

---

## PHASE 3: REAL-TIME 3D ARCHITECTURE

### Preferred technology stack

Use a maintainable, production-grade architecture.

Recommended technologies:

- Next.js with TypeScript
- Three.js
- React Three Fiber where appropriate
- WebGL 2.0
- Custom GLSL vertex and fragment shaders
- GSAP for suitable animation timelines
- ScrollTrigger only where it improves synchronization
- Lenis only where it does not conflict with the scroll controller
- Postprocessing for bloom, tone mapping and optical effects
- Blender for original 3D asset generation
- Draco or Meshopt compression for models

Use direct Three.js when it offers better control than React Three Fiber.

Use WebGPU only if there is a clear benefit and a properly implemented WebGL fallback.

### Architecture requirements

Develop modular systems for:

1. Rendering engine
2. Scene lifecycle management
3. Camera controller
4. Scroll controller
5. Particle engine
6. Procedural geometry
7. Shader materials
8. Asset management
9. Interaction and raycasting
10. Navigation
11. Project presentation
12. Audio management
13. Responsive quality settings
14. Loading and error handling

Keep the visual rendering layer separate from interface and application state.

Avoid monolithic animation files containing every scene.

---

## PHASE 4: SCROLL-DRIVEN 3D EXPERIENCE

**This is the most important development requirement.**

The reference does not behave like an ordinary vertically scrolling document.

Scrolling must control movement through the three-dimensional world.

### 4.1 Scroll controller

Build a virtual scroll progression system that maps scroll input to a normalized animation timeline.

Implement:

- Scroll velocity tracking
- Frame-rate-independent damping
- Smooth interpolation
- Camera position keyframes
- Camera target interpolation
- Rotation keyframes
- Material animation timelines
- Particle animation timelines
- Scene visibility and transition states
- Direction-aware scrolling
- Scroll restoration
- Reliable reverse scrolling

Avoid directly applying raw wheel delta values to camera movement without smoothing.

### 4.2 Camera choreography

Reconstruct each observed camera movement from the reference.

Support combinations of:

- Forward movement through depth
- Backward movement
- Smooth camera rotation
- Object orbiting
- Dolly movement
- Depth-based parallax
- Focus changes
- Controlled zoom
- Curved motion paths
- Smooth scene-to-scene transitions

Use spline-based camera trajectories where appropriate.

The experience must feel like one continuous cinematic sequence, not disconnected pages.

### 4.3 Reverse scrolling

All scroll animations must work correctly in both directions.

When the user scrolls backward:

- Camera movement reverses smoothly
- Objects return to their previous positions
- Material states interpolate correctly
- Text and interactive elements return correctly
- Scenes do not suddenly reset
- No jumps or flashing transitions occur

### 4.4 Animation synchronization

Synchronize camera position, lighting, particles, 3D project panels, text overlays and transition effects using a shared animation state.

Do not independently animate components in ways that cause timing drift.

---

## PHASE 5: PARTICLE SIMULATION

Build a GPU-friendly particle system that recreates the reference's atmospheric depth and movement.

Required properties:

- Thousands of particles when device capabilities permit
- Multiple depth layers
- Varied sizes and opacity
- Soft luminous appearance
- Controlled randomness
- Smooth ambient drift
- Camera-relative depth perception
- Color transitions
- Responsive movement
- Subtle mouse influence where observed

Use instanced rendering, point sprites or GPU shader simulation.

Particles should feel volumetric and spatially distributed rather than attached to a flat background.

Their movement must remain smooth while scrolling, transitioning and idling.

Optimize density for each performance tier.

---

## PHASE 6: PROJECT PORTFOLIO EXPERIENCE

Recreate the project-presentation system visible on the reference site.

Inspect and reproduce its actual spatial organization.

Potential rendering requirements include:

- Floating project panels
- Rounded video-textured geometry
- 3D project objects
- Moving environmental elements
- Project titles and category labels
- Cinematic camera movements between work
- Preview media
- Object selection
- Project-specific transitions
- Detailed project experiences

Every displayed item must have a meaningful interaction.

Do not create fake project case studies or invent client relationships to fill space.

Use verified reference information only where permitted, or configured original content and assets.

If a particular project detail cannot be reproduced because the asset is unavailable, document the limitation and produce a visually comparable original asset rather than silently inserting unrelated imagery.

---

## PHASE 7: NAVIGATION AND INTERFACE

Study the reference's minimal floating navigation system.

### 7.1 Main navigation

Recreate the observed navigation styling and placement, including:

- Pill-shaped controls
- Fine borders
- Transparent or translucent surfaces
- Accurate text alignment
- Minimal separators
- Hover treatments
- Smooth visibility transitions
- Behavior responsive to scroll velocity
- Consistent positioning relative to the viewport

The controls must remain usable without interfering with the WebGL scene.

### 7.2 Interactive overlays

Implement observed interface components with appropriate blending and stacking behavior.

Use carefully controlled CSS blending when needed to integrate HTML text with the WebGL environment.

### 7.3 AI navigation, if verified

If the reference contains conversational navigation, reproduce the real interaction flow.

Support contextual commands that can:

- Navigate to Work
- Navigate to Contact
- Find relevant projects
- Change project or category selection
- Move the viewport to the appropriate location

Do not claim to provide AI functionality through a set of canned, misleading responses.

Use a real configured provider and secure backend integration where necessary.

If the service is unavailable, provide a truthful interface state rather than fabricating successful functionality.

### 7.4 Audio controls

Recreate visible sound and music interfaces if present.

Use licensed media.

Respect browser autoplay restrictions.

Persist user sound preferences appropriately, and ensure controls correctly change actual audio state.

---

## PHASE 8: INTERACTION SYSTEM

Implement detailed pointer and touch behavior.

### Mouse movement

Where present in the reference:

- Pointer-sensitive visual effects
- Subtle camera influence
- Particle responses
- Raycast object detection
- Interactive hover emphasis
- Cursor state changes

### Hover

Match observed:

- Visual contrast
- Brightness changes
- Element displacement
- Border treatments
- Glow
- Transition duration
- Motion easing

### Click

Implement actual navigation and scene transitions.

Avoid buttons that only display visual feedback without performing an action.

### Touch

Adapt interactions for mobile devices:

- Touch-sensitive effects
- Swipe and scroll gestures
- Proper hit targets
- Mobile navigation
- No hover-only functionality
- Stable scrolling without gesture conflicts

---

## PHASE 9: CINEMATIC TRANSITIONS

Every major transition should be designed as a coordinated animation.

Potential transition techniques include:

- Camera flythroughs
- Geometry transformations
- Depth-based transitions
- Particle dispersion
- Object rotation
- Smooth lighting changes
- Material interpolation
- Optical distortion
- Refraction
- Shader-based reveal effects
- Animated texture transitions

Use the exact techniques that best reproduce the inspected reference.

Do not automatically add random effects merely to increase animation quantity.

Motion quality and accuracy matter more than the number of effects.

---

## PHASE 10: RESPONSIVE EXPERIENCE

Inspect the actual responsive behavior rather than simply shrinking the desktop composition.

Test:

- Desktop monitors
- Standard laptops
- Tablets
- Android phones
- iPhones
- Portrait and landscape orientation

Adapt:

- Camera framing
- Geometry placement
- Field of view
- Particle count
- Object scale
- Navigation placement
- Typography
- Touch controls
- Animation complexity
- Render resolution

Preserve the immersive visual identity across screen sizes.

On lower-powered hardware, use controlled quality reduction rather than allowing the experience to become unusable.

---

## PHASE 11: PERFORMANCE ENGINEERING

Target consistently smooth animation on supported devices.

### Performance objectives

- Target 60 FPS on capable desktop hardware
- Avoid unnecessary React rerenders in the render loop
- Prevent shader compilation stalls during interaction
- Use compressed geometry and textures
- Lazy-load secondary project assets
- Load appropriate texture resolutions
- Minimize draw calls
- Reuse geometry and materials
- Dispose of unused GPU resources
- Implement adaptive device-pixel-ratio limits
- Detect WebGL context loss and recover gracefully
- Prevent cumulative memory leaks

Use `requestAnimationFrame` and frame-rate-independent animation calculations.

Do not continuously render at maximum fidelity on hardware that cannot sustain it.

Provide an attractive accessible fallback for unsupported devices.

Honor reduced-motion preferences with a functional alternative experience.

---

## PHASE 12: PRODUCTION ENGINEERING

The implementation must be a complete, maintainable website rather than a superficial prototype.

Requirements:

- Strict TypeScript
- Clean source architecture
- Reusable components
- Proper error handling
- Real navigation
- Functional interfaces
- Optimized loading
- Accessibility support
- Keyboard operability
- Appropriate semantic HTML
- Secure environment variable handling
- No exposed API secrets
- No dead links
- No fake integrations
- No broken routes
- No unnecessary dependencies
- No browser console errors
- No persistent unhandled exceptions

Do not introduce sample testimonials, fabricated metrics, fictitious projects or unrelated placeholder content.

Do not add unnecessary dashboard interfaces, pricing sections, marketing cards or unrelated features.

The final site must remain faithful to the reference's structure and behavior.

---

## PHASE 13: VISUAL COMPARISON AND VALIDATION

After implementing the website, compare it against the reference using real screenshots.

Capture matching viewports and scroll positions.

For every keyframe, inspect:

1. Overall composition
2. Central object geometry
3. Material appearance
4. Lighting
5. Background depth
6. Particle placement
7. Typography
8. Navigation position
9. Camera framing
10. Transition progress

Create side-by-side reference versus implementation images for internal validation.

Fix discrepancies before considering the implementation finished.

### Animation validation

Record both websites through equivalent scroll journeys.

Compare:

- Timing
- Camera trajectory
- Acceleration
- Damping
- Rotation
- Depth effects
- Scene changes
- Hover behavior
- Visual continuity

Do not judge fidelity using static screenshots alone.

### Required automated checks

Use browser automation to test:

- Initial loading
- Full scroll journey
- Reverse scrolling
- Navigation functionality
- Project interactions
- Responsive layouts
- Touch behavior
- Keyboard controls
- WebGL recovery
- Page refresh
- Browser history behavior

Report what was actually tested.

---

## PHASE 14: DEVELOPMENT WORKFLOW

Follow this sequence:

**Step 1:** Inspect the live reference thoroughly.

**Step 2:** Produce scene-by-scene visual and technical specifications.

**Step 3:** Build the rendering engine and full-screen scene foundation.

**Step 4:** Recreate the initial hero geometry, shaders, lighting and particle environment.

**Step 5:** Implement the full scroll controller and camera choreography.

**Step 6:** Build the remaining 3D environments and project presentation system.

**Step 7:** Implement navigation, overlays and interactions.

**Step 8:** Add audiovisual effects and responsive behavior.

**Step 9:** Optimize graphics and application performance.

**Step 10:** Compare the implementation with the reference, fix discrepancies and complete functional tests.

Do not stop after creating a convincing opening screenshot.

Do not treat a single animated hero as the completed website.

Complete and verify the entire experience.

---

## FINAL ACCEPTANCE CRITERIA

The implementation is successful only if:

- The opening viewport closely matches the reference's composition.
- The central artwork is genuinely rendered in 3D.
- Scroll input controls real camera movement.
- Scroll animations behave smoothly in both directions.
- The complete observed scene sequence is implemented.
- Particles, lighting and shaders create convincing depth.
- Navigation closely matches the reference.
- Project interactions operate correctly.
- Animations are synchronized rather than independent.
- The visual quality remains consistent across the journey.
- Mobile interactions are properly adapted.
- Rendering performance is optimized.
- There are no fake functional features.
- The project builds and runs without critical errors.
- All required dependencies and assets are properly documented.

## FINAL ENGINEERING INSTRUCTION

Do not optimize for speed of initial code generation at the expense of final quality.

Do not create a generic website that superficially resembles Active Theory.

Prioritize visual accuracy, interaction fidelity, cinematic animation quality, technical stability and completeness.

If a feature is technically complex, implement the underlying technique rather than replacing it with a low-fidelity shortcut.

If the browser cannot inspect a required behavior, clearly report that limitation rather than inventing a description.

If an exact recreation requires proprietary assets or unavailable source technology, implement the closest technically and legally viable equivalent, and document the difference.

**The goal is an exceptionally faithful, production-quality reconstruction of the complete Active Theory experience, including its immersive 3D environment, scroll-driven animation system, interactions and visual polish.**

Begin by inspecting the reference website before making any implementation decisions.