# CreaXa — Ten Editorial Themes Design System

## 1. Overview

CreaXa features ten complete, hand-curated editorial themes designed to give the marketplace a distinct artistic personality. The themes are implemented using semantic CSS custom properties (tokens) on `:root`, allowing instant zero-flicker transitions across public pages, creator profiles, brand workspaces, and the 3D WebGL hero without component re-renders or form input loss.

---

## 2. The Ten Curation Palettes

| ID | Theme Name | Background | Foreground | Primary Accent | Editorial Mood & Character |
|---|---|---|---|---|---|
| `0` | **Obsidian Editorial** | `#11110F` | `#F2EEE5` | `#D95736` | Luxury editorial studio; high-contrast dark mode with titanium accents and warm vermilion. |
| `1` | **Paper & Ink** | `#F4F0E7` | `#232321` | `#B7432B` | Premium printed art journal; warm off-white paper with crisp typography and cinnabar red. |
| `2` | **Carbon Acid** | `#131715` | `#EDF3E6` | `#D4ED65` | Experimental tech studio; deep slate carbon with electric lime and technical grids. |
| `3` | **Midnight Cobalt** | `#09152B` | `#EEF1FC` | `#8BA8FF` | Cinematic evening atmosphere; deep indigo navy with electric cobalt highlights. |
| `4` | **Terracotta Atelier** | `#EBDCCE` | `#332720` | `#B85C3C` | Warm Mediterranean design studio; natural clay, warm umber, and terracotta tones. |
| `5` | **Arctic Signal** | `#E8F1F0` | `#173337` | `#008C83` | Clean architectural laboratory; cool spacious paper with structured deep teal accents. |
| `6` | **Plum Archive** | `#21151F` | `#F4E9EF` | `#E4A0B9` | Experimental fashion monograph; deep velvet plum with pale rose gold interactions. |
| `7` | **Industrial Mono** | `#E6E5E0` | `#1B1B1B` | `#EF5836` | Neo-brutalist architecture; concrete gray, sharp black structure, and graphic signal orange. |
| `8` | **Analog Film** | `#29231C` | `#F3E8D2` | `#DBAB57` | Nostalgic cinematic film production; warm sepia black with vintage cream and gold grading. |
| `9` | **Deep Teal Gallery** | `#092D30` | `#F5F1E6` | `#F4AA78` | Contemporary digital museum; rich ocean teal with parchment white and soft coral. |

---

## 3. Engineering Implementation

### 3.1 Semantic Token Architecture (`app/globals.css`)
Each theme defines consistent semantic design tokens:
- `--bg`: Main surface canvas background
- `--fg`: Primary text and high-contrast headlines
- `--accent`: Brand focus, action buttons, active tabs, and badges
- `--surface`: Cards, input fields, and elevated panel surfaces
- `--border`: Hairline structural borders and dividers
- `--muted`: Secondary labels, metadata, and timestamps

### 3.2 Dynamic Persistence & Hydration Safety
- When a user selects a theme via the header popover (`Header.tsx`), `localStorage.setItem('creaxa-theme', themeId)` is updated immediately.
- The `dataset.theme` attribute on `document.documentElement` updates synchronously, triggering instant CSS variable cascade without DOM re-mounts.
- Verified in Playwright E2E browser tests: themes survive hard browser page reloads.

### 3.3 Three.js Material & Lighting Synchronization
When the theme changes, the WebGL renderer receives updated uniform values:
- Ambient light color and intensity adjust to maintain proper scene exposure against light vs. dark backgrounds.
- Sculpture materials shift roughness and specular values to match the selected physical mood (chrome in *Obsidian Editorial*, ceramic in *Paper & Ink*).
