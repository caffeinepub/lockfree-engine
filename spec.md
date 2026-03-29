# LockFree Engine — Full Specification

**Version:** 119+  
**Status:** Live demo / pitch tool  
**Platform:** Internet Computer (ICP) via Caffeine  
**Stack:** React 19 + TypeScript frontend, Motoko backend  
**Last updated:** March 2026

---

## 1. Overview

LockFree Engine is a simulation-driven multi-cloud dashboard demo inspired by DFINITY's Mission 70 and Cloud Engines. It enables both developers and non-technical business owners to provision, deploy, migrate, and manage simulated cloud engines across AWS, Google Cloud, Azure, and sovereign EU infrastructure (NeoCloud) — eliminating vendor lock-in.

All cloud engine logic is simulated pending public release of the ICP Cloud Engines API. The app is a demo and pitch tool, not yet in production use.

---

## 2. Branding

- Logo / brand mark: **LockFreeEngine** (one word)
- Body copy, guides, headings: **LockFree Engine** (two words)
- Primary accent: electric cyan `oklch(0.82 0.22 195)`
- Secondary accent: emerald green `oklch(0.52 0.17 160)`
- Background: deep dark `oklch(0.08 0.02 240)`
- Typography: Bricolage Grotesque (headings), Plus Jakarta Sans (body), JetBrains Mono (code)

---

## 3. Authentication

- Internet Identity (ICP) for login
- `useInternetIdentity` hook handles login, logout, and identity state
- Demo mode: instant, client-side fake data injection — no login required
- Admin check: hardcoded client-side principal check for instant recognition on sign-in
- Hardcoded admin principal: `7xb3p-r7kxo-tjbki-fkmcf-buzj5-i5ux2-tcaye-tkujv-zmd6t-whrx7-lqe`

---

## 4. Demo Mode

- Activated automatically on page load; state persisted in localStorage
- Highly visible toggle: emerald green label, pulsing glow, larger size
- "Exit Demo" button appears in demo mode banner
- Auto-guided demo tour (8 steps) walks users through key screens
- "Take the Tour" button relaunches the tour at any time
- Demo data covers: engines, cost metrics, notifications, billing, referrals, white-label settings
- All simulation actions (Start/Stop, Restart, Scale, Plan Upgrade, Apply AI Recommendations) animate with progress indicators and status updates

---

## 5. Landing Page

Public-facing. Sections in order:

1. **Hero** — tagline, CTAs, architecture diagram (mobile landscape and desktop)
2. **What is a Cloud Engine?** — food truck analogy for layman clarity
3. **How It Works** — technical depth; stack cards (Motoko, React, Internet Identity, NNS); deeper language: orthogonal persistence, actor model, Candid, NNS subnet allocation
4. **Architecture Diagram** — three-layer vision: LockFree Engine / ICP / NeoCloud; animated dual pulsing rings from ICP core
5. **Built for the Companies AI Runs On** — private sector/AI agent security callout
6. **The Private Sector Opportunity** — three colour-coded cards (indigo/cyan/emerald) with left-accent stripes
7. **Security & Trust** — honest security messaging
8. **Testimonial** — Dominic Williams (DFINITY founder): *"Ha that's cool.. kind of a visualization of what cloud engines can do.. I like"*
9. **Roadmap** — Phase 1 (live), Phase 2, Phase 3; date-free; references EU sovereign infrastructure and AI agent workloads
10. **Waitlist Form** — email capture
11. **Footer CTA** — "Sign In with Internet Identity" button (emerald, pulsing glow)

**Visual rules:**
- No cloud provider names (Microsoft, Google, Amazon) in diagrams
- All badge pills and section highlights: consistent cyan blue `oklch(0.82 0.22 195)`
- Tightened section padding — no excessive whitespace between sections
- Mobile-responsive; architecture diagram shown at 65% scale in mobile landscape via `landscape:` Tailwind variant

---

## 6. Dashboard

Main authenticated view. Features:

- **Engine Cards** — status (running/stopped), provider badge, region, cost/hour, uptime
  - Actions: Start/Stop, Restart, Scale (all animated with progress in demo mode)
- **Metric Cards** — total cost, uptime %, active engines, resilience score
  - Info popovers open on click, stay open until dismissed
- **Live Cost Animation** — cost figures and trend charts animate periodically in demo mode
- **Empty State Banner** — full-width, bold headline, large emerald "Load Demo Engines" button with glow, secondary "Provision New Engine" option
- **Demo Mode Banner** — "Take the Tour" button (emerald text, emerald border), "Exit Demo" button

---

## 7. Sidebar Navigation

- Dashboard
- Provision Engine
- Migrations
- Cost Optimiser
- AI Deploy Chat
- Referrals & Partners
- Billing
- User Guide
- Technical Notes
- Account Settings
- Admin (role-gated, shield icon)

---

## 8. AI Deploy Chat

- Central chat interface for app deployment and cost optimisation
- Context-aware responses based on current engine state
- Persistent chat memory via localStorage
- AI Cost Optimisation: recommendations with apply/confirm flows, "Apply All" option

---

## 9. Billing & Pricing

- Four tiers: Free, Pro, Business, Enterprise
- Annual billing discounts shown
- Mock Stripe and ICP payment flows in demo mode
- Plan selection is a full-page view (not a modal) for clarity
- White-label settings available on Enterprise tier
  - Simulated save with spinner, success toast, live preview
- Admin account always shows Enterprise for demo/testing

---

## 10. Referrals & Partners

- Affiliate/referral programme with dashboard
- Simulated registration, payout, and calculator actions in demo mode
- Abuse mitigation: referral cap (50 per affiliate), burst detection (>10 referrals in 24h flagged), minimum activity requirement, waitlist rate limiting
- Affiliate dashboard shows fair-use banner and progress bar
- Admin panel shows flagged affiliates

---

## 11. Notifications

- Bell icon top-right with dropdown for alerts
- Simulated periodic demo alerts appear in the bell (every 3–5 minutes)
- No toast pop-ups for demo notifications (scaled back to reduce distraction)
- User profile dropdown: Account Settings, Billing, Sign Out

---

## 12. User Guide

Sidebar-accessible, accordion-style. Three tabs:

1. **For Business Owners** — non-technical guide to all features
2. **For Developers** — technical guide with code snippets
3. **Migration Guide** — both technical (with code) and non-technical migration steps

Both main tabs include:
- "What's Coming" section (Mission 70 roadmap) — positioned at the top
- AI Deploy Chat guidance
- Theme toggle, demo data toggle
- Account/data export, pricing
- Admin section (admins only)

---

## 13. Technical Notes

Sidebar-accessible page for technical audiences. Covers:

- Backend persistence model (orthogonal persistence, stable variables)
- Simulation-to-production swap plan (replace simulation layer with real ICP Cloud Engines API calls)
- Abuse mitigation logic
- Concurrency model (actor model, message queuing)
- Security model
- Architecture diagram (LockFree Engine / ICP / NeoCloud)

---

## 14. Admin Section

Role-gated. Hidden `/admin` route. Pages:

- **Waitlist** — manage waitlist signups
- **Users** — user management; each user's principal ID displayed with copy button; export/erasure of any user's data
- **Analytics** — platform usage metrics
- **Content/Settings** — admin configuration

Admin assignment:
- Stored in a stable Motoko variable to persist across deployments
- Hardcoded client-side check for instant UI recognition on sign-in
- Admin always has Enterprise access for demo/testing

---

## 15. Account Settings

- JSON/CSV export of user data
- "Your Data Rights" section — GDPR-style: access, erasure, portability, rectification
- Theme preference persisted

---

## 16. Theme

- Dark mode default
- Sun/moon toggle top-right
- No flash of light mode on load
- Muted/secondary text in dark mode: `gray-300` for readability
- Toast notifications match selected theme

---

## 17. Backend (Motoko)

- Deployed on ICP via Caffeine
- Orthogonal persistence — state survives upgrades automatically
- Actor model — single-threaded message processing, no race conditions
- Candid interface for frontend-backend communication
- NNS subnet allocation for canister deployment
- Stable variables for: admin assignment, user registry, waitlist, affiliate data
- Rate limiting on waitlist signups and referral submissions
- Role-based access control (RBAC) for admin routes

---

## 18. Frontend Architecture

- React 19 + TypeScript
- Vite build
- Tailwind CSS with OKLCH design tokens
- shadcn/ui component library (Radix primitives)
- motion/react for animations
- React Query (@tanstack/react-query) for server state
- TanStack Router for client-side routing
- next-themes for theme management
- ErrorBoundary wrapping the full app
- "Clear Cache & Reload" button on error screen

---

## 19. Simulation Layer

All Cloud Engines logic is simulated client-side. Simulation covers:

- Engine provisioning, start/stop, restart, scale
- Cost metrics and trend data (animate periodically)
- Migration flows
- AI cost optimisation recommendations
- Billing and plan upgrade flows
- Referral and affiliate actions
- White-label settings save
- Notification alerts

Production swap: replace simulation functions with real ICP Cloud Engines API calls when the API goes public. No architectural changes required — the simulation layer is a drop-in replacement.

---

## 20. Mobile Responsiveness

- Fully responsive across portrait and landscape on all screen sizes
- Announcement bars and banners wrap text cleanly on mobile
- Architecture diagram: visible in mobile landscape at 65% scale (`landscape:` Tailwind variant); hidden in portrait
- All dashboard cards and forms adapt to narrow viewports

---

## 21. Social / OG Meta

- OG image: dark/techy style, tagline "Your portable cloud console", LockFreeEngine logo
- Per-route meta tags: title, description, og:title, og:description, og:image, twitter:card

---

## 22. Branding Footer

All pages include:
```
© {currentYear}. Built with love using caffeine.ai
```
Linked to `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content={hostname}`

---

## 23. Terms of Service

- Available at `/terms`
- Linked in landing page nav and Account Settings
- Covers: referral fair use, data handling, AUP

---

## 24. Known Limitations (Demo)

- All cloud engine actions are simulated — no real infrastructure is provisioned
- Stripe and ICP payment flows are mocked
- The ICP Cloud Engines API is not yet public — production integration pending
- Admin principal must be hardcoded if automatic assignment fails across deployments
- Changelog removed for demo; will be reintroduced in production

---

## 25. Roadmap (Date-Free)

**Phase 1 — Complete**
- Interactive dashboard demo
- Engine provisioning simulation
- Migration flow simulation
- AI Deploy Chat
- Affiliate & referral program

**Phase 2 — Pending ICP Cloud Engines API**
- Real engine provisioning via ICP Cloud Engines API
- NeoCloud sovereign EU infrastructure integration
- Live cost and resilience data
- Enterprise SSO and white-label onboarding

**Phase 3 — Scale**
- First enterprise clients onboarded
- Joint DFINITY presentation
- nLighten edge data centre integration (30+ European sites)
- AI agent workload optimisation
- Full billing integration
