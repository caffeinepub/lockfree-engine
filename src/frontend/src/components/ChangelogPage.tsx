import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowUpRight,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

type Category =
  | "Feature"
  | "Polish"
  | "Security"
  | "Launch"
  | "Documentation"
  | "Fix";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  category: Category;
  items: string[];
}

const CATEGORY_CONFIG: Record<
  Category,
  { color: string; icon: React.ReactNode }
> = {
  Feature: {
    color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    icon: <Zap className="w-3 h-3" />,
  },
  Polish: {
    color: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    icon: <Sparkles className="w-3 h-3" />,
  },
  Security: {
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: <Shield className="w-3 h-3" />,
  },
  Launch: {
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: <Star className="w-3 h-3" />,
  },
  Documentation: {
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    icon: <ArrowUpRight className="w-3 h-3" />,
  },
  Fix: {
    color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    icon: <Wrench className="w-3 h-3" />,
  },
};

const entries: ChangelogEntry[] = [
  {
    version: "v77",
    date: "Mar 19, 2026",
    title: "Auto-Guided Demo Tour",
    category: "Feature",
    items: [
      "Onboarding tour spotlights key dashboard areas in demo mode",
      '"Take the Tour" button added to demo banner',
      "Step-by-step progression with Next/Skip controls",
    ],
  },
  {
    version: "v76",
    date: "Mar 19, 2026",
    title: "Roadmap & Vision",
    category: "Feature",
    items: [
      "Phase 1→2→3 roadmap added to landing page",
      "Vision 2027 section with forward-looking pitch",
      "Accurate dates relative to Mission 70 timeline",
    ],
  },
  {
    version: "v75",
    date: "Mar 18, 2026",
    title: "Testimonial & Social Proof",
    category: "Launch",
    items: [
      "Dominic Williams (DFINITY founder) quote featured on landing page",
      "Hero credibility badge added",
      "Hero headline refined using his framing",
    ],
  },
  {
    version: "v74",
    date: "Mar 17, 2026",
    title: "Dashboard Info Popovers",
    category: "Fix",
    items: [
      "Info buttons on summary cards now open click-to-dismiss popovers",
      "Replaced hover tooltips that flashed and disappeared",
    ],
  },
  {
    version: "v73",
    date: "Mar 16, 2026",
    title: "Full Spec Documentation",
    category: "Documentation",
    items: [
      "Complete spec.md written to project root",
      "Caffeine Spec tab now fully populated",
      "All 80+ components documented",
    ],
  },
  {
    version: "v72",
    date: "Mar 15, 2026",
    title: "Production Launch",
    category: "Launch",
    items: [
      "App published to production",
      "OG/Twitter meta tags verified",
      "Final QA sweep complete",
    ],
  },
  {
    version: "v70",
    date: "Mar 14, 2026",
    title: "Admin Recognition Fix",
    category: "Fix",
    items: [
      "Admin status seeded directly from claimInitialAdmin return value",
      "No more second round-trip or 5–10s delay",
      "Admin shield appears instantly after sign-in",
    ],
  },
  {
    version: "v68",
    date: "Mar 13, 2026",
    title: "Demo Toggle Polish",
    category: "Polish",
    items: [
      "Demo Data toggle enlarged with emerald green label",
      "Double-ring pulsing glow added to toggle",
      "Sign In button updated to emerald green with vivid glow",
    ],
  },
  {
    version: "v65",
    date: "Mar 12, 2026",
    title: "Visual Accessibility",
    category: "Polish",
    items: [
      "Muted text in dark mode brightened to gray-300",
      "All section badge pills unified to consistent cyan blue",
      "Mobile banner overflow fixed",
    ],
  },
  {
    version: "v63",
    date: "Mar 11, 2026",
    title: "Terms of Service Prominence",
    category: "Security",
    items: [
      "ToS linked in landing page nav bar",
      "ToS linked in waitlist signup form",
      "ToS linked in Account Settings",
      "Footer link removed",
    ],
  },
  {
    version: "v60",
    date: "Mar 10, 2026",
    title: "Landing Page Copy Polish",
    category: "Polish",
    items: [
      'Removed "or" and "-no sign-up required" from footer CTA',
      "Footer CTA centered with clean single button",
      "Cloud provider names removed from diagrams",
    ],
  },
  {
    version: "v57",
    date: "Mar 9, 2026",
    title: "Technical Depth Section",
    category: "Documentation",
    items: [
      '"How it works" stack cards added to landing page (Motoko, React, Internet Identity, NNS)',
      "Honest technical documentation tone",
      "Positioned just below hero/features",
    ],
  },
  {
    version: "v56",
    date: "Mar 8, 2026",
    title: "What is a Cloud Engine?",
    category: "Documentation",
    items: [
      "Food truck analogy section added to landing page",
      "Four portable cloud benefit cards",
      "Non-technical plain language explanation",
    ],
  },
  {
    version: "v55",
    date: "Mar 7, 2026",
    title: "GDPR Data Rights",
    category: "Security",
    items: [
      '"Your Data Rights" section added to Account Settings',
      "Four rights explained: Access, Erasure, Portability, Rectification",
      "Admin delete/erasure action added to Users tab",
    ],
  },
  {
    version: "v54",
    date: "Mar 6, 2026",
    title: "Admin Data Export",
    category: "Feature",
    items: [
      "Export User Data button per row in Admin Users tab",
      "JSON download of user engines, migrations, account data",
      "User Guide admin section updated with data request workflow",
    ],
  },
  {
    version: "v51",
    date: "Mar 5, 2026",
    title: "Security & Trust",
    category: "Security",
    items: [
      "Security & Trust section added to landing page (4 trust cards)",
      "Terms of Service / AUP page at /terms",
      "Affiliate referral cap (50/account), burst detection, rate limiting",
      "Flagged affiliates panel in Admin",
    ],
  },
  {
    version: "v50",
    date: "Mar 4, 2026",
    title: "Stable Admin Assignment",
    category: "Fix",
    items: [
      "Admin principal stored in stable var (survives upgrades)",
      "postupgrade hook restores assignment automatically",
      "isAdmin check returns false gracefully for unregistered users",
    ],
  },
  {
    version: "v45",
    date: "Mar 3, 2026",
    title: "Migration Guide Tab",
    category: "Documentation",
    items: [
      "Third tab added to User Guide: Migration Guide",
      "Business and Developer migration flows",
      "Code snippets for Motoko schema, @dfinity/agent, auth-client",
    ],
  },
  {
    version: "v43",
    date: "Mar 2, 2026",
    title: "Full Demo Simulation",
    category: "Feature",
    items: [
      'CostAlerts "Migrate Now" wired to demo simulation',
      "8-stage migration progress animation",
      "Engine provisioning 4-stage animation",
    ],
  },
  {
    version: "v39",
    date: "Feb 28, 2026",
    title: "Demo Mode Overhaul",
    category: "Feature",
    items: [
      "Engine provisioning creates local state in demo mode",
      '"Provision Engine" button bypasses backend in demo',
      "New engines appear instantly on dashboard",
    ],
  },
  {
    version: "v34",
    date: "Feb 25, 2026",
    title: "UI Craft Pass",
    category: "Polish",
    items: [
      "Typography upgraded: Bricolage Grotesque, Plus Jakarta Sans, JetBrains Mono",
      "Dark mode depth improved",
      "Cinematic landing page hero with animated effects",
      "Electric cyan accent system",
    ],
  },
  {
    version: "v28",
    date: "Feb 20, 2026",
    title: "Account Settings & Data Export",
    category: "Feature",
    items: [
      "JSON and CSV export for user data",
      "Data Portability section in Account Settings",
      "Admin can export/delete any user's data",
    ],
  },
  {
    version: "v22",
    date: "Feb 15, 2026",
    title: "Affiliate & Referral Program",
    category: "Feature",
    items: [
      "LFE-XXXXXX format affiliate codes",
      "Bronze/Silver/Gold partner tiers",
      "Earnings calculator on Partners page",
    ],
  },
  {
    version: "v16",
    date: "Feb 10, 2026",
    title: "Four-Tier Pricing",
    category: "Feature",
    items: [
      "Free / Pro $49 / Business $199 / Enterprise $599",
      "Annual billing with discount toggle",
      "Mock Stripe and ICP payment flows",
    ],
  },
  {
    version: "v10",
    date: "Feb 5, 2026",
    title: "Admin Panel",
    category: "Feature",
    items: [
      "/admin route with role-based access",
      "Waitlist, Users, Analytics, Content Settings tabs",
      "claimInitialAdmin logic for first user",
    ],
  },
  {
    version: "v5",
    date: "Feb 1, 2026",
    title: "Core Dashboard",
    category: "Feature",
    items: [
      "Engine provisioning and management",
      "Migration flows with cost savings",
      "AI Deploy Chat with context-aware responses",
    ],
  },
  {
    version: "v1",
    date: "Jan 28, 2026",
    title: "Initial Launch",
    category: "Launch",
    items: [
      "Motoko backend on ICP",
      "React frontend with Internet Identity auth",
      "Demo mode with client-side data injection",
    ],
  },
];

function CategoryBadge({ category }: { category: Category }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.icon}
      {category}
    </span>
  );
}

export function ChangelogPage() {
  return (
    <div className="min-h-full" data-ocid="changelog.page">
      <ScrollArea className="h-full">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                Version History
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Changelog
            </h1>
            <p className="text-muted-foreground">
              A record of everything we've built.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

            <div className="space-y-8">
              {entries.map((entry, i) => (
                <div
                  key={entry.version}
                  className="relative pl-7"
                  data-ocid={`changelog.item.${i + 1}`}
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-0 top-[6px] w-[15px] h-[15px] rounded-full border-2 ${
                      i === 0
                        ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,210,210,0.5)]"
                        : "bg-card border-border"
                    }`}
                  />

                  {/* Card */}
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs text-primary border-primary/40 bg-primary/5 px-2 py-0"
                      >
                        {entry.version}
                      </Badge>
                      <CategoryBadge category={entry.category} />
                      <span className="text-xs text-muted-foreground ml-auto">
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">
                      {entry.title}
                    </h3>

                    <ul className="space-y-1">
                      {entry.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5 flex-shrink-0">
                            ›
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              LockFree Engine is actively developed.{" "}
              <span className="text-primary font-medium">
                More updates coming as Mission 70 unfolds.
              </span>
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
