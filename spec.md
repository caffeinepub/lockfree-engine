# LockFree Engine

## Current State
The landing page has 13 sections, all with `py-24` or `py-28` padding (96–112px per section). This creates ~448px+ of excess vertical whitespace making the page feel very long. Several sections also have inconsistent visual styling — background darkness levels vary, card padding differs between sections, and section header margins are inconsistent.

## Requested Changes (Diff)

### Add
- Nothing new added in this build

### Modify
- **Padding tightening:** Reduce all `py-24` sections to `py-16`, and `py-28` sections to `py-20`
- **Section header margins:** Standardise `mb-16`/`mb-14` to `mb-10` across all sections
- **Visual unification:** Bring Private Sector cards into the same card style as other sections (`bg-card/30`, `border border-border/40`), remove inline style overrides where possible, normalise background darkness levels across sections
- **Card padding normalisation:** Bring Private Sector card padding from `p-8` down to `p-6` to match other sections

### Remove
- Inline style background overrides that cause inconsistent section darkness

## Implementation Plan
1. In LandingPage.tsx: replace all `py-24` with `py-16` and `py-28` with `py-20` on section wrappers
2. Standardise `mb-14`/`mb-16` on section headings to `mb-10`
3. Update Private Sector cards to use `bg-card/30 border border-border/40` instead of inline oklch backgrounds with inline borderLeft
4. Normalise section background inline styles to a consistent dark level
