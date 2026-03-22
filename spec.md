# LockFree Engine

## Current State
The app is a fully functional demo on ICP with a Motoko backend and React frontend. The landing page has a "How it works" section with 3 steps (Provision, Deploy, Migrate Freely) and a Technical Depth section with 4 stack cards (Motoko, React, Internet Identity, NNS). The User Guide's Developer tab has a Migration Guide with code snippets for provisioning, migration flow, resilience scoring, cost tracking, AI chat, billing backend, affiliate system, and white-label. All content is currently written for a general/non-technical audience.

## Requested Changes (Diff)

### Add
- More precise technical detail to each HOW_IT_WORKS step (actor model, Candid, orthogonal persistence, Cloud Engines API swap-in)
- Deeper technical descriptions to the 4 TECH_STACK cards (actor model concurrency, WebAssembly compilation, Candid IDL, NNS governance mechanics, subnet allocation)
- Expanded code snippets in the Migration Guide: expand the migration-tech section to include realistic Motoko migration call with subnet ID, state transfer notes, and the simulation-to-production swap pattern; expand provisioning-tech to show the full actor call pattern with stable variable storage

### Modify
- `HOW_IT_WORKS` array in LandingPage.tsx — add technical depth to each step's `desc` field
- `TECH_STACK` array in LandingPage.tsx — expand each card's `desc` to include precise technical language
- `migration-tech` accordion item in UserGuidePage.tsx — expand code snippet to show realistic subnet migration call
- `provisioning-tech` accordion item in UserGuidePage.tsx — expand to show stable variable storage pattern

### Remove
- Nothing removed

## Implementation Plan
1. Update `HOW_IT_WORKS` step descriptions in LandingPage.tsx to add technical depth alongside the existing plain-language framing
2. Update `TECH_STACK` card descriptions in LandingPage.tsx with precise technical language (orthogonal persistence, actor model, Candid IDL, NNS subnet allocation mechanics)
3. Expand `migration-tech` code snippet in UserGuidePage.tsx with realistic Motoko subnet migration call and simulation-to-production swap pattern
4. Expand `provisioning-tech` code snippet in UserGuidePage.tsx with stable variable storage and full actor pattern
