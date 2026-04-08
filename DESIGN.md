# LockFreeEngine Design System

## Aesthetic Direction
Premium dark-mode SaaS platform — refined, technical, confident. Inspired by Linear, Vercel, Stripe. No generic AI aesthetics; every surface intentional. Deep navy foundation with electric cyan accent—enterprise-grade without corporate sterility.

## Palette (OKLCH)

| Role | Light Value | Chroma | Hue | Semantic |
|------|-----------|--------|-----|----------|
| Background | 0.10 | 0.014 | 245 | Deep navy, console-like |
| Card Surface | 0.14 | 0.016 | 243 | Slightly elevated, layered |
| Primary (Cyan) | 0.82 | 0.22 | 195 | Electric cyan—cloud-forward |
| Muted Text | 0.72 | 0.018 | 240 | Readable, not harsh |
| Foreground | 0.95 | 0.008 | 240 | Off-white, anti-harsh |
| Status Running | 0.74 | 0.19 | 145 | Emerald (live workloads) |
| Destructive | 0.62 | 0.22 | 25 | Red (errors, warnings) |

## Typography

| Tier | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| Display | Bricolage Grotesque | 700–800 | 2rem–4rem | Hero, section headlines |
| Body | Plus Jakarta Sans | 400–600 | 0.875rem–1.125rem | Content, UI text |
| Mono | JetBrains Mono | 400–600 | 0.75rem–0.875rem | Code, principals, IDs |

**Typography Rules:** Hero headlines use `letter-spacing: -0.025em`, tighter line-height (`1.15`). Section headlines: `-0.02em`. Body text: generous `line-height: 1.6`, normal letter-spacing. Improves readability and visual hierarchy.

## Elevation & Depth

| Surface | Shadow | Effect |
|---------|--------|--------|
| Card Base | `0 1px 2px rgba(0,0,0,0.08)` | Subtle, thin lines |
| Card Elevated | `0 4px 28px rgba(0,0,0,0.35), 0 1px 4px` | Primary interaction surface |
| Card Hover | `0 12px 48px rgba(0,0,0,0.4), 0 2px 8px` | On-hover lift (not aggressive) |
| Glow Soft | `0 0 12px oklch(primary / 0.2)` | Badge, accent edges |
| Glow Medium | `0 0 24px oklch(primary / 0.28)` | Interactive focus state |
| Glow Strong | `0 0 40px oklch(primary / 0.35)` | Primary CTA, announcement badge |

**Principle:** Shadow hierarchy reflects information density and interaction priority. No flat surfaces; all cards have at least a 1px subtle shadow. Hover states lift 2–4px with increased shadow radius—smooth transitions on `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.

## Structural Zones

| Zone | Background | Border | Treatment |
|------|-----------|--------|-----------|
| Hero | `oklch(0.1 0.014 245)` + atmosphere gradient | None | Full-bleed, radial gradient backdrop for depth |
| Announcement | `oklch(card / 0.4)` + blur | `border-bottom: 1px oklch(border / 0.3)` | Glass-morphism, minimal, 0.75rem padding |
| Section Cards | `oklch(card / 0.65)` + 12px blur | `1px oklch(border / 0.4)` | Glass effect, lifted on hover, inset highlight edge |
| Testimonial | `oklch(card / 0.8)` | `1px oklch(primary / 0.25)` | Pull-quote container—distinct, accent border, generous padding |
| Footer | `oklch(card / 0.6)` | `border-top: 1px oklch(border / 0.5)` | Slightly raised from main bg, dividing line |

## Component Patterns

| Pattern | Implementation | Notes |
|---------|-----------------|-------|
| CTA Button | Primary cyan, 8px radius, 0.75rem ⟶ 1.5rem padding | Lift on hover, subtle glow. Font-weight 600. |
| Secondary Button | Card bg, border, 8px radius | Smaller shadow, no glow, subtle lift. |
| Pull-Quote | Large quote mark (4rem), italic text (1.25rem), attribution | Centered, cyan accent border, glass background |
| Section Card | Translucent card + border + glass blur | Hovers to higher opacity, stronger border |
| Badge (Announcement) | Inline cyan pill, subtle pulse animation | Animates box-shadow 3s `ease-in-out` |

## Motion & Animation

| Animation | Curve | Duration | Target | Effect |
|-----------|-------|----------|--------|--------|
| Badge Pulse | `ease-in-out` | 3s | Announcement badge | Subtle glow pulse, `0 0 8px` to `0 0 16px` |
| Button Hover | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.3s | All interactive | Smooth lift (translateY -1px) + shadow expand |
| Card Hover | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.3s | Section cards | Opacity ↑, border brightens, shadow expands |
| Fade In | `ease` | 0.35s | Content load | `opacity 0→1`, `translateY 6px→0` |

## Spacing & Rhythm

**Token:** `--radius: 0.5rem` (8px base). Sections use 3rem–4rem vertical gaps. Cards use 1.5rem–2rem internal padding. Mobile scales to 1.5rem gaps, 1rem padding.

## Signature Detail

**Testimony Pull-Quote:** Large cyan quote mark (4rem) in Bricolage Grotesque Bold, accent-color border on distinct background. Creates an editorial, premium feel—signals credibility (Dominic Williams). Refined alternative to generic testimonial cards.

## Constraints & Anti-Patterns

✘ No full-page gradients  
✘ No rainbow palettes  
✘ No animations without purpose  
✘ No buttons smaller than 0.75rem ⟶ 1.5rem  
✘ No text smaller than 0.75rem on mobile  
✘ No harsh focus states—use cyan glow rings  

## Dark Mode Only
App defaults to dark. No light mode toggle. Typography, spacing, and interactions remain constant across future theme expansions.

---

**Files:** `index.css` (design tokens, animations, pull-quote), `tailwind.config.js` (shadow utilities, font families, radius). No component files modified—all styling via CSS and Tailwind utilities.
