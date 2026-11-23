---
name: Dars (درس)
description: Free community MOOC platform for Tunisia running zero-cost on Cloudflare
colors:
  primary: "#0284c7"
  primary-hover: "#0369a1"
  primary-surface: "#f0f9ff"
  accent-red: "#dc2626"
  accent-red-subtle: "#fef2f2"
  neutral-bg: "#f8fafc"
  neutral-surface: "#ffffff"
  neutral-border: "#e2e8f0"
  neutral-text: "#0f172a"
  neutral-muted: "#64748b"
  state-success: "#16a34a"
  state-warning: "#d97706"
  state-info: "#0284c7"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Tajawal, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, Tajawal, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, Tajawal, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Plus Jakarta Sans, Tajawal, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, Tajawal, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  badge-active:
    backgroundColor: "{colors.accent-red-subtle}"
    textColor: "{colors.accent-red}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card-course:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

## Overview

Dars (درس) is an educational product designed for learners across Tunisia. The visual language takes direct inspiration from the Mediterranean coast and trusted educational portals like Lyceena, pairing deep sea blue (`#0284c7`) with clean open surfaces (`#f8fafc`), crisp typography, and restrained Tunisian red accents (`#dc2626`) strictly used for live status badges, recording indicators, and active course alerts.

The interface is engineered to feel weightless and calm on mobile devices, with seamless switching between Arabic (RTL) and French/English (LTR).

## Colors

The palette is anchored around Mediterranean Sea Blue as the primary brand and navigational anchor, supported by clean slate neutrals and minimal semantic state accents:

- **Primary Brand (Sea Blue)**:
  - `primary`: `#0284c7` (Mediterranean azure for primary actions, progress bars, active tab highlights)
  - `primary-hover`: `#0369a1` (Deeper sea blue for interaction states)
  - `primary-surface`: `#f0f9ff` (Soft sky tint for active navigation items, enrolled lesson rows, highlighted modules)
- **Minimal Accent (Tunisian Crimson Red)**:
  - `accent-red`: `#dc2626` (Reserved strictly for high-visibility signals: "Live" badge, course exam deadline, streak indicator)
  - `accent-red-subtle`: `#fef2f2` (Background tint for red badges)
- **Neutrals**:
  - `neutral-bg`: `#f8fafc` (Slate 50 — calm, anti-glare canvas)
  - `neutral-surface`: `#ffffff` (Pure white for course cards, video player chassis, modal panels)
  - `neutral-border`: `#e2e8f0` (Subtle boundary borders, avoiding heavy dropped shadows)
  - `neutral-text`: `#0f172a` (High-contrast slate 900 for long-form reading)
  - `neutral-muted`: `#64748b` (Slate 500 for metadata, timestamps, author credits)
- **State Semantics**:
  - `state-success`: `#16a34a` (Completed lesson checkmarks, passing quiz scores)
  - `state-warning`: `#d97706` (Draft courses, pending moderation)
  - `state-info`: `#0284c7` (System tips, prerequisite notices)

## Typography

Typography prioritizes bilingual clarity across Latin (French/English) and Arabic scripts:
- **Latin Font Stack**: `Plus Jakarta Sans`, `system-ui`, `sans-serif`
- **Arabic Font Stack**: `Tajawal`, `Cairo`, `system-ui`, `sans-serif`
- **Scale**:
  - Display: `clamp(2rem, 5vw, 3.25rem)`, 700 weight, line height 1.15
  - Headline: `1.75rem`, 600 weight, line height 1.25
  - Title: `1.25rem`, 600 weight, line height 1.35
  - Body: `1rem` (16px base), 400 weight, line height 1.6 for comfortable reading
  - Label / Metadata: `0.875rem`, 500 weight, line height 1.4

## Elevation

Flat and tonal layering over heavy shadows:
- Surface elevation is communicated via subtle borders (`1px solid #e2e8f0`) and contrast shifts.
- Floating elements (dropdown menus, mobile nav drawer) use a soft ambient shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.08)`.
- Cards do not stack shadows; they lift slightly on hover via `transform: translateY(-2px)` and a subtle border color shift to `{colors.primary}`.

## Components

- **Buttons**:
  - Primary: Filled Sea Blue (`#0284c7`), rounded `10px`, white bold text, transition on hover to `#0369a1`.
  - Secondary: Soft sky background (`#f0f9ff`), Sea Blue text (`#0284c7`), no border.
  - Ghost: Transparent background, slate text, subtle border on hover.
- **Course Card**:
  - White surface, `16px` border-radius, `1px solid #e2e8f0`.
  - 16:9 thumbnail ratio with duration badge top-right.
  - Bilingual title in bold slate 900, category tag, progress bar in `{colors.primary}`.
- **Lesson Player**:
  - Dedicated focused mode: video player container with 16:9 responsive aspect ratio.
  - Collapsible module sidebar with completed checkmarks in `{colors.state-success}`.
  - Tabbed lesson notes, transcript, and interactive quiz panel.
- **PWA Status Bar**:
  - Slim offline banner (`#f0f9ff` with Sea Blue text and cloud icon) showing "Offline mode: downloaded lessons available".

## Do's and Don'ts

### Do:
- Keep the red accent minimal and purposeful (state, urgency, active alerts).
- Maintain generous line-height (`1.6`) for Arabic text, which requires more vertical breathing room than Latin text.
- Use native RTL layout attributes (`dir="rtl"`, CSS logical properties `margin-inline-start`, `padding-inline-end`).
- Ensure video players and quiz widgets adapt cleanly to 360px wide mobile screens.

### Don't:
- Do not use red for general buttons, large banners, or background fills (red fatigue).
- Do not use generic gradient text or frosted glass effects that kill mobile GPU performance.
- Do not make lessons require an online check to render if they have been downloaded to the PWA offline cache.
- Do not use nested cards or multi-layer containers.
