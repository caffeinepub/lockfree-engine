# LockFree Engine

## Current State

LockFree Engine is a live, deployed multi-cloud dashboard demo on ICP. The app has a landing page, dashboard, engines management, billing, user guide, technical notes, admin panel, and migration guide. The last build updated the landing page roadmap section to reflect ICP Cloud Engines being in production. However, several files still contain outdated future-tense language treating Cloud Engines as a pending/future feature, and none of the files yet reference the Pakistan MoU, the confirmed 80/20 node provider revenue model, the Internet Intelligence Network (IIN), Caffeine Snorkel, or the App Market (Caffeine v3.0).

## Requested Changes (Diff)

### Add
- Pakistan MoU reference (240 million citizens, first production Cloud Engine deployment, 1,500 Caffeine licenses) as social proof in LandingPage roadmap section
- 80/20 revenue model (confirmed: 80% to node providers, 20% burned) in TechnicalNotesPage NeoCloud section and LandingPage vision cards
- IIN (Internet Intelligence Network) — verifiable AI inference at lower cost — referenced in UserGuidePage What's Coming sections (both Business and Developer tabs) and briefly in AI positioning
- Caffeine Snorkel — auto-migration of legacy apps to ICP — mentioned in UserGuidePage Migration Guide tab
- App Market (Caffeine v3.0, launching April 7 2026) — noted in UserGuidePage What's Coming sections as a new distribution channel
- "control panel" terminology (Dom's exact language for cloud engines) used where appropriate
- Node provider use cases (add nodes, create engines, monetise by allowing others to deploy) explicitly named in relevant sections

### Modify
- LandingPage ROADMAP_PHASES: Phase 2 status from `UPCOMING` to `ACTIVE` or equivalent; label updated to reflect API is in production pilots now, not pending
- LandingPage HOW_IT_WORKS step 03: Remove future-tense "will swap in" language around Cloud Engines API
- LandingPage VISION_CARDS: Add node provider / 80% revenue framing to "The Infrastructure Layer" card
- LandingPage Roadmap heading subtext: Add Pakistan MoU as concrete social proof
- TechnicalNotesPage Simulation Layer bullets: "When DFINITY releases the public Cloud Engines API" → "as DFINITY opens third-party developer access to the Cloud Engines API"
- TechnicalNotesPage footer note: Remove "pending public release" — pilots are live; update to "pending third-party developer access"
- TechnicalNotesPage Roadmap Phase 2: Update "When DFINITY releases" to reflect API is in production, third-party access is imminent
- TechnicalNotesPage NeoCloud section: Add 80/20 revenue model and Pakistan MoU reference
- UserGuidePage Business What's Coming: Replace "when the API goes public" with accurate framing; add Pakistan MoU, 80/20, App Market, IIN, Caffeine Snorkel
- UserGuidePage Developer What's Coming: Same framing fix; add IIN, Snorkel, App Market
- UserGuidePage "ICP Cloud Engines API (Future)" section: Rename to remove "(Future)"; rewrite opening paragraph removing "not yet publicly released"
- UserGuidePage Migration Guide "How do I get started?": Update "when it launches" framing

### Remove
- All instances of "pending public release of the ICP Cloud Engines API"
- All "when the API goes public/live" phrasing (replace with accurate current-state language)

## Implementation Plan

1. Update LandingPage.tsx:
   - ROADMAP_PHASES Phase 2: change status badge to active/in-progress, update label to "Active: API in Production Pilots"
   - HOW_IT_WORKS step 03: remove future-tense migration language
   - VISION_CARDS: add 80/20 node revenue framing to Infrastructure Layer card
   - Roadmap heading subtext: add Pakistan MoU sentence
   - Add Pakistan MoU detail as a social proof callout in the roadmap section

2. Update TechnicalNotesPage.tsx:
   - Simulation Layer section: replace "When DFINITY releases" language
   - Footer note: remove "pending public release"
   - Roadmap Phase 2: update description to reflect production status
   - NeoCloud section: add 80/20 revenue model and Pakistan MoU context

3. Update UserGuidePage.tsx:
   - Business What's Coming: reframe all "when" language; add IIN, App Market, Caffeine Snorkel, Pakistan MoU, 80/20
   - Developer What's Coming: same
   - "ICP Cloud Engines API (Future)" section: rename and rewrite opening
   - Migration Guide getting started section: update launch framing
