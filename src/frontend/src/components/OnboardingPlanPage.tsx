import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Crown,
  Shield,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    icon: Shield,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted/50 border border-border",
    nameColor: "text-muted-foreground",
    checkColor: "text-muted-foreground",
    cardClass: "border-border bg-card/60",
    badge: null,
    tagline: "Try it free — no credit card needed",
    features: [
      "1 Cloud Engine (shared compute)",
      "1 vCPU / 2 GB RAM max",
      "1 user seat",
      "Basic AI Deploy Chat",
      "ICP on-chain transparency",
      "No vendor lock-in",
      "30-day trial, then upgrade required",
    ],
    notIncluded: [
      "Migration flows",
      "Cost dashboard",
      "Multi-cloud distribution",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 49,
    annualMonthlyPrice: 39,
    icon: Zap,
    iconColor: "text-[oklch(0.72_0.19_145)]",
    iconBg:
      "bg-[oklch(0.72_0.19_145/0.15)] border border-[oklch(0.72_0.19_145/0.4)]",
    nameColor: "text-[oklch(0.82_0.19_145)]",
    checkColor: "text-[oklch(0.72_0.19_145)]",
    cardClass: "tier-pro-glow border-[oklch(0.72_0.19_145/0.5)] bg-card",
    badge: {
      label: "Most Popular",
      icon: Sparkles,
      bg: "bg-[oklch(0.72_0.19_145)]",
    },
    tagline: "For solo developers and small teams",
    features: [
      "Up to 10 Cloud Engines",
      "3 user seats",
      "Full migration flows",
      "Cost dashboard & 7-day trend",
      "AI Deploy Chat (unlimited)",
      "AI cost optimization",
      "Standard email support",
      "ICP on-chain transparency",
    ],
    notIncluded: [],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 199,
    annualMonthlyPrice: 159,
    icon: Star,
    iconColor: "text-[oklch(0.68_0.22_260)]",
    iconBg:
      "bg-[oklch(0.68_0.22_260/0.15)] border border-[oklch(0.68_0.22_260/0.4)]",
    nameColor: "text-[oklch(0.78_0.22_260)]",
    checkColor: "text-[oklch(0.68_0.22_260)]",
    cardClass: "border-[oklch(0.68_0.22_260/0.5)] bg-card",
    badge: {
      label: "Growing Teams",
      icon: Star,
      bg: "bg-[oklch(0.68_0.22_260)]",
    },
    tagline: "For growing teams across multiple clouds",
    features: [
      "Up to 50 Cloud Engines",
      "10 user seats",
      "Everything in Pro",
      "Advanced cost optimization",
      "Multi-cloud distribution",
      "Affiliate dashboard access",
      "Priority support",
      "ICP on-chain transparency",
    ],
    notIncluded: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 599,
    annualMonthlyPrice: 479,
    icon: Crown,
    iconColor: "text-[oklch(0.75_0.18_60)]",
    iconBg:
      "bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.4)]",
    nameColor: "text-[oklch(0.85_0.18_60)]",
    checkColor: "text-[oklch(0.75_0.18_60)]",
    cardClass: "tier-enterprise-glow border-[oklch(0.75_0.18_60/0.5)] bg-card",
    badge: {
      label: "Enterprise",
      icon: Crown,
      bg: "bg-[oklch(0.75_0.18_60)]",
    },
    tagline: "For agencies and large organisations",
    features: [
      "Unlimited Cloud Engines",
      "Unlimited user seats",
      "Everything in Business",
      "White-label branding controls",
      "Dedicated onboarding + SLA",
      "Custom integrations (roadmap)",
      "Direct account manager",
      "Custom ICP pricing available",
    ],
    notIncluded: [],
  },
];

type UpgradableTier = "pro" | "business" | "enterprise";

interface OnboardingPlanPageProps {
  currentTier: string;
  isDemoMode?: boolean;
  onSelectTier: (tier: UpgradableTier) => void;
  onSkip: () => void;
}

interface TierCardProps {
  tier: (typeof TIERS)[number];
  currentTier: string;
  annual: boolean;
  onSelect: () => void;
}

function TierCard({ tier, currentTier, annual, onSelect }: TierCardProps) {
  const isCurrent = currentTier === tier.id;
  const isFree = tier.id === "free";
  const Icon = tier.icon;
  const price = annual ? tier.annualMonthlyPrice : tier.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-4 transition-all duration-200 ${
        tier.cardClass
      } ${!isFree && !isCurrent ? "hover:scale-[1.01] cursor-pointer" : ""}`}
    >
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            className={`${tier.badge.bg} text-background text-xs font-semibold px-3 py-0.5 shadow-lg whitespace-nowrap`}
          >
            <tier.badge.icon className="w-3 h-3 mr-1" />
            {tier.badge.label}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tier.iconBg}`}
          >
            <Icon className={`w-4 h-4 ${tier.iconColor}`} />
          </div>
          <div className={`font-display font-bold text-base ${tier.nameColor}`}>
            {tier.name}
          </div>
        </div>

        <div className="mb-1">
          {isFree ? (
            <div className="font-display text-2xl font-bold text-foreground">
              $0
              <span className="text-sm font-normal text-muted-foreground ml-1">
                /month
              </span>
            </div>
          ) : (
            <div>
              <div className="font-display text-2xl font-bold text-foreground">
                ${price}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /mo
                </span>
              </div>
              {annual && (
                <div className="text-xs text-[oklch(0.72_0.19_145)] mt-0.5 font-medium">
                  Billed annually — 2 months free
                </div>
              )}
              {!annual && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  or ${tier.annualMonthlyPrice}/mo billed annually
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{tier.tagline}</p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2 mb-5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm min-w-0">
            <Check
              className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tier.checkColor}`}
            />
            <span
              className={`break-words min-w-0 ${
                isFree ? "text-muted-foreground" : "text-foreground/90"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
        {tier.notIncluded.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm opacity-40 min-w-0"
          >
            <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground line-through break-words min-w-0">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isFree ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "Current Plan" : "Continue with Free"}
        </Button>
      ) : tier.id === "pro" ? (
        <Button
          size="sm"
          data-ocid="onboarding.plan.pro.primary_button"
          className="w-full text-xs bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background font-semibold gap-1.5"
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "Current Plan" : "Choose Pro"}
          {!isCurrent && <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
      ) : tier.id === "business" ? (
        <Button
          size="sm"
          data-ocid="onboarding.plan.business.primary_button"
          className="w-full text-xs bg-[oklch(0.68_0.22_260)] hover:bg-[oklch(0.61_0.22_260)] text-background font-semibold gap-1.5"
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "Current Plan" : "Choose Business"}
          {!isCurrent && <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
      ) : (
        <Button
          size="sm"
          data-ocid="onboarding.plan.enterprise.primary_button"
          className="w-full text-xs bg-[oklch(0.75_0.18_60)] hover:bg-[oklch(0.68_0.18_60)] text-background font-semibold gap-1.5"
          disabled={isCurrent}
          onClick={onSelect}
        >
          {isCurrent ? "Current Plan" : "Choose Enterprise"}
          {!isCurrent && <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
      )}
    </div>
  );
}

export function OnboardingPlanPage({
  currentTier,
  onSelectTier,
  onSkip,
}: OnboardingPlanPageProps) {
  const [annual, setAnnual] = useState(false);

  function handleSelect(tierId: string) {
    if (tierId === "free") {
      onSkip();
      return;
    }
    onSelectTier(tierId as UpgradableTier);
  }

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{ background: "oklch(0.145 0.01 260)" }}
      data-ocid="onboarding.plan.page"
    >
      {/* Demo disclaimer banner */}
      <div className="sticky top-0 z-10 w-full bg-[oklch(0.38_0.12_70)] border-b border-[oklch(0.50_0.14_70)] px-4 py-2.5 flex items-center justify-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[oklch(0.92_0.16_80)] flex-shrink-0" />
        <p className="text-sm font-medium text-[oklch(0.97_0.05_80)] text-center">
          <span className="font-bold">Demo only</span> — This is not a real
          transaction. No plan will be activated and no payment will be charged.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            LockFree Engine
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs font-bold">
              1
            </div>
            <span className="text-sm font-semibold text-foreground">
              Choose Plan
            </span>
          </div>
          <div className="w-10 h-px bg-border mx-3" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm text-muted-foreground">Payment</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Choose your plan
          </h1>
          <p className="text-sm text-muted-foreground">
            Scale from free to enterprise — migrate providers at any time, no
            lock-in.
          </p>
        </div>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span
            className={`text-sm font-medium ${
              !annual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            data-ocid="onboarding.plan.annual.toggle"
            onClick={() => setAnnual((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              annual ? "bg-[oklch(0.72_0.19_145)]" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              annual ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Annual
          </span>
          {annual && (
            <Badge className="bg-[oklch(0.72_0.19_145/0.15)] text-[oklch(0.82_0.19_145)] border border-[oklch(0.72_0.19_145/0.4)] text-xs">
              Save 20% — 2 months free
            </Badge>
          )}
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              currentTier={currentTier}
              annual={annual}
              onSelect={() => handleSelect(tier.id)}
            />
          ))}
        </div>

        {/* Footer note + skip */}
        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            All plans include ICP on-chain transparency. Cancel or change plans
            anytime.
          </p>
          <button
            type="button"
            onClick={onSkip}
            data-ocid="onboarding.plan.secondary_button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Skip for now — explore the dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
