# Dars (درس) — Design Criteria & Objectives

## 1. Project & Business Objectives

1. **Core Objective**: Provide a 100% free, high-credibility, community-driven MOOC for Tunisian learners that feels prestigious, lightning-fast, and distraction-free at $0 hosting cost.
2. **Target Audience**: 
   - Tunisian university students, baccalaureate candidates, and career switchers.
   - Accessing primarily from mobile phones (Android) on 3G/4G connections and budget laptops.
   - Highly price-sensitive, seeking verified practical skills (AI, software engineering, math, Cloudflare edge stack).
3. **Audience Fears & Friction**:
   - "Is this actually free or a freemium paywall trap?"
   - "Is the content low quality or AI-hallucinated slop?"
   - "Will this chew up my mobile data plan with heavy video bundles?"
4. **Required Beliefs**:
   - The platform is truly free and community-owned.
   - Content is structured, peer-reviewed, and high value.
   - Studying is frictionless: public content immediately accessible, sign-in only needed to record progress.
5. **Brand Positioning**:
   - Serious, empowering, Mediterranean coastal clarity (Lyceena sea blue `#0284c7`, crisp slate surfaces, minimal Tunisian crimson `#dc2626` strictly for state/live moments).

---

## 2. Constraints & Rules

- **Zero-cost Cloudflare edge architecture**: Assets must stay lean and performant.
- **Bilingual & Native RTL**: Arabic (Tunisian Derja & MSA) must have first-class layout, line-height, and typography parity with French and English.
- **Access Rule**: Content is fully public; saving progress requires authentication; uploading video/content is admin-only.

---

## 3. Checkable Success Criteria

| # | Criterion | Pass Condition | How Checked |
|---|---|---|---|
| **C1** | **Immediate 5-Second Credibility** | Top of screen immediately shows mission, free commitment (0 TND), search, and curated course tracks with clean typography and no decorative clutter. | First-viewport inspection at 1440px and 390px widths. |
| **C2** | **Zero Friction Public Access** | Any course can be opened and any video/markdown lesson viewed without being blocked by an auth dialog. | Unauthenticated user can navigate from `/` to lesson player and watch content. |
| **C3** | **Clear Auth Gate on Progress** | Clicking "Mark Complete" or quiz evaluation while unauthenticated shows an explicit login prompt explaining progress saving. | Action-trigger verification while logged out. |
| **C4** | **Restricted Admin Upload Studio** | Creator Studio is hidden for learners and guests; only accounts with `role: 'admin'` see the builder or can submit content. | Role check in navigation and backend 403 enforcement. |
| **C5** | **Bilingual Script Balance** | Arabic typography (`Tajawal`/`Cairo`) renders with comfortable line-height (1.6) and natural RTL margins without clipping or misaligned icons. | Visual inspection on both Arabic (`dir="rtl"`) and Latin (`dir="ltr"`). |
| **C6** | **Restrained Palette (No Red Fatigue)** | Sea Blue (`#0284c7`) carries primary navigation and actions; Tunisian red (`#dc2626`) appears in <= 5% of UI (live indicator, urgency badge). | CSS color token audit across all components. |
| **C7** | **Offline PWA Readiness** | Offline banner appears automatically when disconnected; downloaded lessons play without network. | Service worker cache and IndexedDB storage validation. |
| **C8** | **High Contrast & Accessible** | Text contrast >= 4.5:1 against surfaces, responsive down to 320px mobile screens without horizontal scroll. | Contrast math check on rendered tokens; viewport checks at 320px, 390px, 1440px. |
