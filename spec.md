# LockFree Engine

## Current State
The app has a sidebar with nav links: Dashboard, Engines, AI Deploy, Billing, Referrals, Partners, Settings. There is no User Guide / Help page. The `Page` type in App.tsx controls routing; AppSidebar renders navItems array.

## Requested Changes (Diff)

### Add
- New `UserGuidePage` component at `src/frontend/src/components/UserGuidePage.tsx`
- Accordion-style layout with two top-level sections: "For Business Owners" and "For Developers"
- Every feature of the app covered: Landing Page, Demo Mode, Login/Auth, Dashboard, Cloud Engines (provisioning, migration, distribute), AI Deploy Chat, Cost Tracker, Resilience Score, Billing/Subscription, Referrals & Affiliates, Partners Program, White-Label (Enterprise), Settings, Notifications, Profile/Sign Out, Onboarding Tour
- Sidebar nav item "User Guide" with BookOpen icon
- `userguide` added to the `Page` type and PAGE_TITLES in App.tsx

### Modify
- `App.tsx`: add `userguide` to `Page` type, PAGE_TITLES, and render `<UserGuidePage />` in the main content area
- `AppSidebar.tsx`: add User Guide nav item with BookOpen icon to navItems array

### Remove
- Nothing removed

## Implementation Plan
1. Create `UserGuidePage.tsx` with comprehensive accordion content covering all features, two audience sections (Business Owners / Developers), and proper `data-ocid` markers
2. Update `AppSidebar.tsx` to add the User Guide nav item
3. Update `App.tsx` to add the `userguide` page type and render the page
