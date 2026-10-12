# Antigravity implementation prompt: CreaXa source continuation and immersive opening

You are working on an existing application, not starting a new product. Import and inspect the accompanying `CreaXa_Current_Source.zip` first. It contains the application source from the deployed revision `ca1842791b2046558a60781f06b78f661edf515b` plus handoff documentation.

Your task is to preserve the existing CreaXa marketplace and add a high-quality, real-time 3D opening experience before its existing homepage. Use the video or assets that I have added to this workspace under the name `reference` as the visual and motion reference. Also inspect `https://activetheory.net/` where your browser can display its actual homepage. The previous environment reached an unsupported-browser screen, so its full opening sequence, scroll choreography and interactions were NOT verified. Do not treat the old description as measured evidence.

The required visitor journey is:

**Open the homepage → immersive full-screen 3D opening → scroll-controlled cinematic progression → coordinated reveal of the existing CreaXa homepage → existing marketplace navigation and workflows.**

This is an additional entry experience. It is not a replacement of the marketplace with a portfolio agency website. Continue implementation from the supplied source and preserve the current marketplace state and behaviour.

## 1. Inspect and preserve the supplied application

Before editing:

1. Read `README.md`, `HANDOFF.md`, `package.json`, `vite.config.ts`, `app/chatgpt-auth.ts`, `lib/server.ts`, `lib/matching.ts`, `db/schema.ts`, the migrations, and existing public UI.
2. Identify how the existing homepage, public navigation, themes, authenticated dashboards, API handlers, file permissions and runtime bindings work.
3. Install the existing locked dependencies. Keep the supplied package versions unless a specific compatibility problem requires a change.
4. Run the current application and establish a baseline. Resolve genuine environment problems without quietly replacing its framework, authentication, database or file storage.
5. Create a Git baseline before implementation so changes are reviewable and reversible.

Current architecture:

- React 19 and TypeScript with Vinext/Vite and the Next.js-compatible App Router.
- Cloudflare Workers server runtime. This is not an ordinary standalone Next.js server.
- Cloudflare D1 database binding `DB`, R2 file storage binding `BUCKET`, Drizzle schema and migrations.
- Sites-managed ChatGPT authentication. Production identity comes from trusted hosting-platform request headers.
- Existing public UI: `app/marketplace.tsx` and `app/globals.css`.
- Existing small hero sculpture: `app/scene.tsx`. This is not the requested new opening experience.
- Server/API logic: `lib/server.ts`, `app/api/[...path]/route.ts`.
- Compatibility and lifecycle rules: `lib/matching.ts`.

Preserve the existing 10 themes, creator/brand/agency roles, real records, media permissions, forms, saved drafts, validation and protected routes. The existing CreaXa homepage must remain recognizably the same after the new opening ends. Do not flatten the marketplace into a static landing page.

## 2. Locate and correctly use the `reference` material

Search the project, supplied attachments and workspace asset folders for the file or folder named `reference`, including case variants and video extensions such as `.mp4`, `.mov` or `.webm`. Read any accompanying specification. The source ZIP itself does not contain the newly supplied reference recording; use the recording I added to your workspace.

If the recording exists:

- Determine its duration, resolution, aspect ratio and frame rate.
- Watch the whole recording, including loading, initial scene, forward scroll, reverse scroll if recorded, controls, menu interactions and the final transition.
- Extract relevant frames and compare them at matching viewport proportions.
- Produce a timeline with timestamp, scene state, geometry, camera framing, particle treatment, text, controls and transition behaviour.
- Separate observed scroll-linked movement from continuous ambient motion. A recording alone does not reveal exact wheel input, camera coordinates, internal easing or hidden interactions; mark those as inferred unless verified through the live site.

Use `reference` as design evidence. Do not show a visible page heading, watermark, tab, badge or player labelled “Reference”. If an existing implementation accidentally displays that label or a debug video player, remove that presentation while keeping the reference asset available for development.

Do not substitute the recording for real 3D by making it an autoplay background video. The finished opening must respond to scroll, pointer and supported touch input. If the recording is missing or inaccessible, report the exact missing asset and continue only with independently grounded work; do not claim an exact match from a written description alone.

## 3. Reference analysis before scene implementation

Create `REFERENCE_ANALYSIS.md` with:

- The opening composition and measured relative placement.
- Scene-by-scene visual map.
- Recording timestamps and screenshot/frame references.
- Verified navigation and interaction matrix.
- Forward and reverse scroll observations.
- Geometry, material, lighting, particle and font requirements.
- Responsive observations from real desktop/mobile evidence.
- Unverified behaviours and explicit inferences.
- Original replacement assets needed where source assets are unavailable or cannot be reused.

Reconstruct verified visual properties rather than inventing additional scenes. Use permitted assets or original replacements with comparable geometry, density, composition and material quality. Do not import Active Theory branding, client claims or project case studies into CreaXa.

## 4. Full-screen 3D opening

Render actual meshes and particles with Three.js or another justified real-time rendering approach. Direct Three.js is suitable for precise scene control. Add only dependencies that are needed.

Use the reference to define:

- A dark, immersive, viewport-filling environment.
- The central metallic emblem/ring or sculptural geometry.
- Iridescent, chrome and view-dependent surface treatment.
- Fine curved strands and spatial supporting geometry.
- Controlled highlights and environmental reflections.
- Depth-distributed particles with varied sizes and restrained glow.
- Camera framing, orientation and object scale.
- Minimal interface placement and technical typography.
- Appropriate continuous ambient motion.

Keep CreaXa as the actual brand. If the reference centrepiece incorporates an Active Theory-specific emblem, create original CreaXa geometry that preserves the observed sculptural composition and material treatment. Document this replacement rather than pretending it is the source model.

Do not use a flat screenshot, CSS ring, crude placeholder shape, emoji, text symbol or embedded recording as the principal artwork. Procedural mesh modelling is acceptable when it produces the required real geometry and quality. Use Blender or dedicated modelling tools when needed.

Keep rendering and application state separate. Suggested modules include `intro/IntroExperience.tsx`, `intro/rendering/createRenderer.ts`, `intro/scenes/createOpeningScene.ts`, `intro/geometry/`, `intro/materials/`, `intro/particles/`, `intro/camera/`, `intro/scroll/`, and `intro/IntroControls.tsx`. Adapt this structure to the actual project rather than scattering unrelated animation effects across the marketplace component.

## 5. Scroll-controlled camera and synchronized scene state

Implement one shared progress model for the opening experience.

- Prefer a bounded, native-scroll section with a sticky canvas when it can reproduce the reference reliably.
- Map its real scroll distance to normalized scene progress.
- Apply frame-rate-independent damping rather than raw wheel deltas.
- Track progress, direction and velocity where useful.
- Synchronize camera position, target, rotations, geometry transforms, materials, lighting, particles and HTML overlay state from that progress.
- Use smooth spline/keyframe trajectories derived from the reference.
- Implement reliable reverse scrolling, including crossing scene boundaries.
- Do not create separate timers that cause camera and UI animation drift.
- Do not permanently intercept page scrolling or trap touch gestures.
- Do not invent a fixed 8-second or 15-second auto-dismiss timer. The main journey is controlled by the user’s scroll, with an explicit skip option.

If GSAP/ScrollTrigger or a smooth-scroll library improves fidelity, integrate it into the same progress model and avoid competing scroll controllers. Keep animation values in renderer state/refs; avoid React state updates on every frame.

## 6. Transition into the existing CreaXa homepage

This integration is essential.

The opening belongs only to the homepage entry path. Place the complete existing CreaXa homepage after its scroll section. Keep the current routes and marketplace components functioning.

At the final scene boundary:

1. Coordinate the reference-appropriate geometry, camera, particle and overlay transition.
2. Reveal the existing CreaXa header and homepage as a continuous part of the same page.
3. Release any intro-specific scroll or pointer handling.
4. Restore normal document interaction without a jump, blank frame, abrupt theme flash or accidental full-page reload.
5. Move keyboard focus only when appropriate for an explicit user action, not during ordinary scrolling.

During the opening, existing CreaXa header/footer elements must not overlap the intended immersive composition. After the intro boundary, the normal header, homepage content and footer must display and work exactly as before. Avoid duplicate navigation bars or overlapping fixed controls.

Provide a clear, accessible `Skip intro` button with an actual jump/transition to the marketplace. Its destination must be the existing homepage content, not a fake page or unrelated external URL. Keyboard users and visitors with reduced-motion preferences must be able to access the marketplace immediately.

Choose a documented session policy: show the intro on a fresh homepage visit, avoid replaying it unexpectedly when a user returns from sign-in or a dashboard during the same session, and provide an intentional replay option. Store only this device/session preference in browser storage. Keep database records out of local storage.

Preserve direct entry to `/discover`, creator/project pages, `/login`, `/signup`, onboarding, dashboards, campaigns and project workspaces. These routes must not be forced through the intro. Preserve anchor destinations, browser history, back/forward navigation and sensible scroll restoration.

## 7. Existing marketplace features that must continue to work

Preserve and regression-check:

- Public homepage, creator discovery and creator/project detail views.
- Ten appearance themes and device-local theme selection.
- Creator, brand and agency onboarding.
- Published/unpublished creator profiles with real capabilities, rates and availability.
- Portfolio create/edit/publish/unpublish/delete, real media, workflow details, contribution and commercial-use declarations.
- Database-backed search, grouped filters, exact counts, sorting, pagination and saved creators.
- Five-step campaigns, persistent draft records, publishing validation, creative requirements, budget, dates, assets and rights.
- Explainable compatibility matching with format, currency, budget and availability checks.
- Invitations, expiry, withdrawal, decline and idempotent acceptance.
- Shared agreements, messages, named versioned submissions, revision allowance, approval, final delivery and completion.
- Partner-confirmed cancellation and the ability to continue a project after a cancellation request.
- Private file authorization, validated uploads and participant downloads.
- Notification read states, settings, evidence submission and moderator authorization.
- Support enquiries and account deletion rules.

Main routes include `/`, `/discover`, `/creators/[slug]`, `/projects/[slug]`, public information pages, `/onboarding`, `/app/creator/*`, `/app/brand/*`, `/app/notifications`, `/app/settings`, and protected `/admin/*` tooling. Preserve the supplied dynamic route dispatch and API contracts.

Do not create fabricated creators, clients, reviews, projects, transactions, verification badges, compatibility results or dashboard counts. Real empty states are the correct display when the database has no applicable records. Do not put “demo”, “test”, “sample project” or “reference” labels in product-facing UI. Development verification code may use isolated fixtures; those fixtures must never seed the hosted database.

## 8. Runtime portability and truthful service states

The ZIP contains source, not a transferable copy of hosted services, user records or credentials.

- `DB` and `BUCKET` require real runtime bindings or properly configured local equivalents.
- Existing production authentication depends on Sites dispatch. Copying the source to another host does not copy its authentication service.
- Never trust arbitrary visitor-supplied `oai-authenticated-user-*` headers on a new public host. Preserve the trusted Sites boundary or implement a genuine configured authentication integration with equivalent server-side authorization.
- Do not silently switch to Firebase, Supabase or a different provider merely to make the UI appear functional.
- If a migration to a different host is needed, document the exact adapter and configuration changes and preserve all ownership/participant rules.
- Preserve `.openai/hosting.json` when continuing this same Site. It contains the existing Site identity and logical bindings, not secrets. Do not use that identity to overwrite an unrelated project.
- The supplied ZIP intentionally excludes `.git`, dependencies, build output, local runtime caches, uploaded data, credentials and secret values.

Known configuration state of the supplied revision:

- Core marketplace source was built and passed 62 API assertions using an isolated database/storage adapter.
- Hosted homepage/discovery/API reads and the protected-route sign-in redirect were checked.
- Browser visual fidelity and full authenticated browser workflows were not verified in the authoring environment.
- The real LLM brief assistant requires `OPENAI_API_KEY`; it is not enabled merely by copying the source.
- Evidence review requires configured `ADMIN_USER_IDS`; no user is automatically granted moderator privileges.
- Email delivery, payment processing and escrow are not integrated. Do not represent them as enabled.
- Current uploads support JPG, PNG, WebP, MP4 and PDF up to 25 MB. Portfolio display media supports images and MP4; private PDF evidence is downloaded as an attachment.

Expose truthful configuration states. Preserve the manual campaign builder when AI is unavailable. Keep secrets server-side and out of source, logs, screenshots and browser bundles.

## 9. Responsive behaviour, accessibility and performance

Verify actual rendering at desktop, laptop and mobile sizes, including at least 1920×1080, 1440×900, 1366×768, 390×844 and one mobile landscape orientation where supported.

Adapt camera framing, field of view, object scale, particle count, render resolution and overlay placement for each device class. Use adaptive quality, bounded device pixel ratio, reused geometry/materials and sensible draw-call limits. Measure performance rather than claiming universal 60 FPS.

Handle WebGL initialization failure, context loss, restoration, resize, orientation change and page visibility. Provide immediate access to the existing CreaXa site when rendering is unavailable. The fallback is a usable marketplace entry, not an error screen that traps the visitor.

Honor reduced-motion preferences. Avoid automatic audio; if a real audio control is implemented, use licensed audio, require user interaction to start it and make the control change actual sound state. Do not create a fake sound button.

Dispose of geometries, materials, textures, renderer resources, observers, timers and event listeners when the intro unmounts. Pause unnecessary work when the scene is offscreen or the tab is hidden.

## 10. Validation and completion criteria

Run the existing TypeScript check and marketplace verification before and after changes. Use the project’s portable build entrypoint, not absolute helper paths from the previous environment.

Check the new opening in a real WebGL-capable browser. Capture matched reference/implementation frames and equivalent scroll journeys. Test:

- First load and refresh.
- Initial composition and real 3D geometry.
- Full forward and reverse scroll journey.
- Pointer/touch interactions that are actually grounded in the reference.
- Skip, replay, reduced-motion and unsupported-WebGL entry.
- Transition into the unchanged CreaXa homepage.
- Navigation after transition, sign-in return and direct deep links.
- Browser back/forward and scroll restoration.
- Keyboard access and focus handling.
- Mobile portrait/landscape rendering and gesture behaviour.
- Console errors, asset loading failures, context loss and resource cleanup.
- Representative existing marketplace workflows without placing fixtures in the live database.

Deliver the complete implemented intro and integration. Include `REFERENCE_ANALYSIS.md`, a concise change report, configuration requirements, actual verification results and documented visual differences. Do not label the work pixel-identical, production-ready or fully verified unless the collected evidence supports that claim.

Begin by importing the supplied source, inspecting the actual `reference` recording in my workspace, and preserving the current marketplace baseline. Then implement the new opening and its transition into CreaXa.
