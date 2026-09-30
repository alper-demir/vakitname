---
name: Vakit
colors:
  surface: '#f3fbf5'
  surface-dim: '#d4dcd6'
  surface-bright: '#f3fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6ef'
  surface-container: '#e7f0ea'
  surface-container-high: '#e2eae4'
  surface-container-highest: '#dce5de'
  on-surface: '#151d1a'
  on-surface-variant: '#434841'
  inverse-surface: '#2a322e'
  inverse-on-surface: '#eaf3ec'
  outline: '#737970'
  outline-variant: '#c3c8bf'
  surface-tint: '#4a6549'
  primary: '#4a6549'
  on-primary: '#ffffff'
  primary-container: '#8ba888'
  on-primary-container: '#243d24'
  inverse-primary: '#b0cfad'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#57615c'
  on-tertiary: '#ffffff'
  tertiary-container: '#99a39e'
  on-tertiary-container: '#303935'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ccebc7'
  primary-fixed-dim: '#b0cfad'
  on-primary-fixed: '#07200b'
  on-primary-fixed-variant: '#334d33'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#dbe5df'
  tertiary-fixed-dim: '#bfc9c3'
  on-tertiary-fixed: '#151d1a'
  on-tertiary-fixed-variant: '#3f4945'
  background: '#f3fbf5'
  on-background: '#151d1a'
  surface-variant: '#dce5de'
typography:
  display-countdown:
    fontFamily: Manrope
    fontSize: 72px
    fontWeight: '200'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-countdown-mobile:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '200'
    lineHeight: 60px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes an atmospheric, contemplative interface for Islamic daily rituals, replacing conventional ornamental tropes with restrained contemporary elegance. The aesthetic merges the calm clarity of high-end ambient weather utilities with the tactile stillness of modern mindfulness applications. 

The primary aesthetic direction is **Mindful Glassmorphism & Organic Minimalism**. Visual space is treated with architectural reverence: expansive negative space, quiet surface transitions, and ultra-subtle Islamic geometric watermarks held strictly under 5% opacity. Interfaces reflect natural light shifts throughout the day—from mist-dappled sage and cream during dawn and midday, to ink-indigo and champagne gold through dusk and midnight. Every element conveys intentionality, presence, and stillness.

## Colors

The color system operates on dual atmospheric states corresponding to the sun’s traversal across the sky, with primary daylight tones grounded in botanical sage and warm cream, shifting dynamically to deep indigo celestial twilight.

- **Primary (`#8BA888`)**: A muted botanical sage used for active prayer indicators, compass alignments, progress rings, and subtle focal accents.
- **Secondary (`#D4AF37`)**: Brushed champagne gold reserved for the active prayer highlight, sunset/Imsak milestones, and subtle celestial cues.
- **Tertiary (`#D8E2DC`)**: Dewy mint glass tint used for surface fills, chip selections, and translucent badge backgrounds.
- **Neutral (`#2B332F`)**: Soft slate-earth used for body typography and high-contrast structural text, maintaining warmth without the harshness of pure black.

### Atmospheric State Rules
- **Daylight & Morning Mode**: Canvas surfaces use `#F8F9FA` transitioning into `#EDF2EE`. Accent borders adopt translucent white (`rgba(255, 255, 255, 0.65)`) over sage-tinted frosted layers.
- **Night & Ramadan Mode**: Canvas surfaces plunge into deep midnight ink (`#0B132B`) and celestial navy (`#1C2541`). Text steps down to oyster white (`#F3E9E5`), and primary lines rely on warm champagne gold (`#D4AF37`) and pale star-mist.

## Typography

The type system is powered entirely by **Manrope**, selected for its geometric purity, open apertures, and serene modernist voice. 

- **Countdown Display (`display-countdown`)**: Utilizes an ultra-light (`200` weight) rendering with tight negative letter tracking. This ensures the remaining hours and minutes read as architectural focal points rather than urgent digital timers.
- **Prayer Titles (`headline-md`)**: Rendered in medium weights with balanced line heights to maintain calm readability across Turkish diacritics (ç, ğ, ı, ö, ş, ü).
- **Label Subtext (`label-sm`)**: Formatted in uppercase with generous tracking (`0.08em`) to demarcate secondary astronomical cues (e.g., "GÜNEŞ", "KERAHAT VAKTİ", "KIBLE AÇISI") without demanding primary attention.

## Layout & Spacing

Layouts follow a single-column, phone-first fluid vertical flow framed by generous safe margins to give prayer cards breathing room.

- **Grid & Margins**: A 4-column layout on mobile devices transitioning to an 8-column layout on iPad/tablet presentations. Safe side margins never compress below `1.25rem` (20px) on mobile and relax to `2rem` (32px) on larger viewports.
- **Vertical Rhythm**: Screens avoid dense lists. Generous vertical intervals (`space-xl`) separate the hero countdown module, the day’s progression arc, and the forthcoming prayer timelines. 
- **Component Breathing Room**: Card interiors maintain `space-lg` (24px) internal padding, preventing numerical timings and titles from crowding card borders.

## Elevation & Depth

Visual hierarchy is communicated through translucent glass physics rather than heavy drop shadows.

- **Glassmorphism Layers**: Cards employ `backdrop-filter: blur(24px) saturate(180%)`. Daytime cards use an ultra-translucent white-to-mint fill (`rgba(255, 255, 255, 0.65)` layered over `rgba(216, 226, 220, 0.25)`). Nighttime surfaces shift to translucent indigo-slate (`rgba(28, 37, 65, 0.65)`).
- **Hairline Outlines**: Every elevated card is bounded by a crisp 1px border using an asymmetric top-down gradient: `rgba(255, 255, 255, 0.4)` at the top edge descending to `rgba(255, 255, 255, 0.08)` at the bottom edge, simulating light grazing natural crystal glass.
- **Ambient Glow**: Elevation shadows are wide and gossamer-soft. Cards produce an ambient shadow of `0 12px 32px -4px rgba(43, 51, 47, 0.04)`. In dark modes, the shadow evolves into a celestial rim glow tinted with soft amber: `0 16px 40px -8px rgba(212, 175, 55, 0.06)`.

## Shapes

The interface embraces organic curvature inspired by natural domes and water vessels. 

- **Primary Cards & Containers**: Master cards utilize rounded corners calibrated between `24px` and `28px` (`rounded-xl` to custom iOS squircle parameters).
- **Buttons & Pills**: Quick-action pills, notification toggles, and audio controls adopt a fully rounded pill form (`rounded-full`), reinforcing effortless thumb ergonomics.
- **Geometry Watermarks**: Geometric Islamic motifs, when introduced as subtle textures behind the main countdown, must be clipped to circular or soft 8-point star polygons with smoothed outer vertices, maintaining an opacity no higher than `0.04` to `0.05`.

## Components

### Prayer Schedule Cards
- **Base Style**: Floating glassmorphic surfaces with 24px corner radiuses, hairline gradient borders, and `space-md` internal padding.
- **Current / Active State**: Highlighted by an interior fill tint of sage green (`rgba(139, 168, 136, 0.15)`) or warm champagne (`rgba(212, 175, 55, 0.12)` at night). Features a 4px vertical pill indicator on the leading edge and typography elevated to `label-lg` with a soft glowing badge.
- **Upcoming & Passed States**: Passed prayer entries drop to 40% opacity in neutral slate; future prayer times remain at 80% opacity with delicate tabular numerals.

### Hero Countdown Module
- Centerpiece container featuring a sweeping circular or parabolic time arc indicating the sun's relative path.
- The remaining duration displays via `display-countdown` typography. Below the countdown, a micro-pill chip identifies the incoming vakit: *"İkindi'ye Kalan Süre"*.
- Contains a minimal crescent moon or solar disk icon that glides smoothly across the hairline trajectory line.

### Buttons & Interactive Pills
- **Primary Buttons**: Minimal frosted pills (`rounded-full`) with `space-sm` vertical and `space-lg` horizontal padding. Daylight surfaces feature tinted sage with deep slate text; nighttime surfaces feature brushed champagne gold with deep midnight indigo text.
- **Audio / Ezan Trigger**: Discreet circular glass buttons (44px × 44px) enclosing delicate line-drawn soundwave or speaker pictograms.

### Form Inputs & City Selector
- Flat translucent input bars with 16px radius, containing placeholder text in warm earth-slate.
- Active states illuminate the 1px hairline border with a soft sage glow (`rgba(139, 168, 136, 0.4)`), accompanied by instantaneous, subtle background clearing.

### Qibla Compass & Auxiliary Tools
- The compass dial consists of dual ultra-thin concentric rings (1px hairline) with minimal degree indicators. 
- The Kaaba alignment vector transitions seamlessly from neutral mist to vivid sage green upon reaching true alignment, accompanied by soft iOS haptic feedback.