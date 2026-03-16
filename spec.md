# LockFree Engine

## Current State
The User Guide page (`UserGuidePage.tsx`) has two tabs: Business and Developer. Both are accordion-style, covering all app features. The page is accessible to everyone.

## Requested Changes (Diff)

### Add
- A third tab in the User Guide: **Migration Guide**
- Two sub-sections within Migration Guide:
  - **For Business Owners**: plain-language explanation of what migration means, why ICP Cloud Engines remove vendor lock-in, what their team needs to do, how LockFree Engine manages complexity, and how to get started
  - **For Developers**: 8 step-by-step accordion sections covering the full technical migration path from Web2 to ICP Cloud Engine, with code snippets (Motoko schema, @dfinity/agent calls, @dfinity/auth-client)

### Modify
- `UserGuidePage.tsx`: add a third tab "Migration Guide" alongside Business and Developer tabs

### Remove
- Nothing

## Implementation Plan
1. Add a "Migration Guide" tab to the Tabs component in UserGuidePage.tsx
2. Build the Business Owner section with plain-language accordion items
3. Build the Developer section with 8 technical accordion items including inline code snippets (styled with JetBrains Mono / monospace)
4. Ensure the tab is accessible to all users (no auth gate)
5. Validate and deploy
