# Dars (درس) — Composition Mode Design Specification

## 1. Lead System: Mediterranean Modern Precision

- **Palette Roles**:
  - `ground`: `#f8fafc` (Slate 50 — clean, distraction-free reading canvas)
  - `surface`: `#ffffff` (Pure white card surfaces, navbar, dialogs)
  - `border`: `#e2e8f0` (Slate 200 — 1px crisp structural boundaries)
  - `border-focus`: `#0284c7` (Sea Blue 600)
  - `ink`: `#0f172a` (Slate 900 — high-contrast primary text)
  - `ink-muted`: `#64748b` (Slate 500 — metadata and secondary text)
  - `primary`: `#0284c7` (Mediterranean Sea Blue for CTAs, active pills, links)
  - `primary-hover`: `#0369a1`
  - `primary-surface`: `#f0f9ff` (Sky 50 tint for active tabs, selected lessons)
  - `state-red`: `#dc2626` (Reserved strictly for Admin tag, Live session indicator, urgency alerts)
  - `state-red-subtle`: `#fef2f2`
  - `state-success`: `#16a34a` (Completed checks, passing quiz scores)

- **Typography & Metrics**:
  - Display: `clamp(2.25rem, 5vw, 3.5rem)` (font-extrabold, line-height 1.15, tracking tight)
  - Headline: `1.75rem` / `28px` (font-bold, line-height 1.25)
  - Title: `1.25rem` / `20px` (font-semibold, line-height 1.35)
  - Body: `1rem` / `16px` (font-normal, line-height 1.6 for Arabic & Latin)
  - Small / Label: `0.875rem` / `14px` (font-medium, line-height 1.4)
  - Tiny / Pill: `0.75rem` / `12px` (font-semibold)

- **Control Metrics**:
  - Button Primary: `h-10 px-5 rounded-[10px]` with subtle shadow `shadow-xs hover:shadow-sm`
  - Input: `h-10 px-3.5 rounded-[10px] bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600`
  - Card: `rounded-[16px] border border-slate-200 bg-white p-5`
  - Radii Scale: `sm: 6px`, `md: 10px`, `lg: 16px`, `full: 9999px`

---

## 2. Component Inventory & Compositions

1. **Top Navigation**:
   - Fixed header with 1px border and 95% opacity blur backdrop (`backdrop-blur-md`).
   - Clean brand identity with Arabic font and subtle red dot.
   - Admin badge displayed only when authenticated with `role: 'admin'`.
   - Bilingual language selector toggle pill.

2. **Hero & Filter Bar**:
   - High-contrast, typography-driven hero without stock photos.
   - Category pill group with horizontal scroll support and smooth active indicator.
   - Live search with instant filtering.

3. **Course Card**:
   - 16:9 ratio thumbnail with subtle dark vignette gradient on bottom.
   - Dual-status pill badges (category + AI/Volunteer origin).
   - High-contrast typography with clamp-2 line limit.
   - Progress bar with completed percentage if enrolled.
   - Micro-interaction: subtle `translate-y-[-2px]` and border highlight on hover.

4. **Lesson Player**:
   - Cinema-mode video container (dark slate `#0f172a` with centered 16:9 player).
   - Sticky syllabus sidebar on desktop with clear completion circles and lesson types.
   - Tabbed workspace (Notes/Markdown reading vs Interactive Quiz).
   - Auth-gated "Mark Completed" trigger that opens sign-in modal if visitor is not authenticated.

5. **Creator Studio (Admin-Only)**:
   - Protected route showing access notice to non-admin visitors.
   - Drag & drop lesson builder with Markdown preview and R2 upload simulator.
