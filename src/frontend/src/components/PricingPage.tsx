import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  Crown,
  Shield,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { OnboardingPaymentPage } from "./OnboardingPaymentPage";

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
      "Multi-cloud distribution controls",
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
    badge: { label: "Enterprise", icon: Crown, bg: "bg-[oklch(0.75_0.18_60)]" },
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

interface TierCardProps {
  tier: (typeof TIERS)[number];
  currentTier: string;
  annual: boolean;
  onUpgrade: () => void;
}

function TierCard({ tier, currentTier, annual, onUpgrade }: TierCardProps) {
  const isCurrent = currentTier === tier.id;
  const isFree = tier.id === "free";
  const Icon = tier.icon;
  const price = annual ? tier.annualMonthlyPrice : tier.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-7 transition-all duration-200 h-full ${tier.cardClass}`}
    >
      {tier.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <Badge
            className={`${tier.badge.bg} text-background text-xs font-semibold px-3 py-1 shadow-lg whitespace-nowrap`}
          >
            <tier.badge.icon className="w-3 h-3 mr-1" />
            {tier.badge.label}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tier.iconBg}`}
          >
            <Icon className={`w-5 h-5 ${tier.iconColor}`} />
          </div>
          <div className={`font-display font-bold text-lg ${tier.nameColor}`}>
            {tier.name}
          </div>
          {isCurrent && (
            <Badge className="ml-auto bg-primary/10 text-primary border border-primary/20 text-xs">
              Current
            </Badge>
          )}
        </div>

        <div className="mb-2">
          {isFree ? (
            <div className="font-display text-4xl font-bold text-foreground">
              $0
              <span className="text-base font-normal text-muted-foreground ml-1">
                /month
              </span>
            </div>
          ) : (
            <div>
              <div className="font-display text-4xl font-bold text-foreground">
                ${price}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  /mo
                </span>
              </div>
              {annual && (
                <div className="text-sm text-[oklch(0.72_0.19_145)] mt-1 font-medium">
                  Billed annually — 2 months free
                </div>
              )}
              {!annual && (
                <div className="text-sm text-muted-foreground mt-1">
                  or ${tier.annualMonthlyPrice}/mo billed annually
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {tier.tagline}
        </p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-7">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.checkColor}`}
            />
            <span
              className={`text-sm leading-relaxed ${isFree ? "text-muted-foreground" : "text-foreground/90"}`}
            >
              {feature}
            </span>
          </li>
        ))}
        {tier.notIncluded.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 opacity-40">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground line-through leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isFree ? (
        <Button variant="outline" className="w-full" disabled={isCurrent}>
          {isCurrent ? "Current Plan" : "Downgrade to Free"}
        </Button>
      ) : tier.id === "pro" ? (
        <Button
          data-ocid="pricing.pro.primary_button"
          className="w-full bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Pro"}
        </Button>
      ) : tier.id === "business" ? (
        <Button
          data-ocid="pricing.business.primary_button"
          className="w-full bg-[oklch(0.68_0.22_260)] hover:bg-[oklch(0.61_0.22_260)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Business"}
        </Button>
      ) : (
        <Button
          data-ocid="pricing.enterprise.primary_button"
          className="w-full bg-[oklch(0.75_0.18_60)] hover:bg-[oklch(0.68_0.18_60)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Enterprise"}
        </Button>
      )}
    </div>
  );
}

interface PricingPageProps {
  currentTier: string;
  onBack: () => void;
  onUpgrade: (tier: string) => void;
  isDemoMode?: boolean;
}

export function PricingPage({
  currentTier,
  onBack,
  onUpgrade,
  isDemoMode,
}: PricingPageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UpgradableTier>("pro");
  const [annual, setAnnual] = useState(false);

  function handleUpgrade(tier: UpgradableTier) {
    setSelectedTier(tier);
    setShowPayment(true);
  }

  function handlePaymentSuccess(tier: string) {
    setShowPayment(false);
    onUpgrade(tier);
  }

  if (showPayment) {
    return (
      <OnboardingPaymentPage
        tier={selectedTier}
        isDemoMode={isDemoMode}
        onBack={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        data-ocid="pricing.back_button"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Billing
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Choose Your Plan
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          Scale from free to enterprise — migrate providers at any time, no
          lock-in. All plans recorded on-chain for full transparency.
        </p>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mt-7">
          <span
            className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            data-ocid="pricing.annual.toggle"
            onClick={() => setAnnual((v) => !v)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              annual ? "bg-[oklch(0.72_0.19_145)]" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
          </span>
          {annual && (
            <Badge className="bg-[oklch(0.72_0.19_145/0.15)] text-[oklch(0.82_0.19_145)] border border-[oklch(0.72_0.19_145/0.4)] text-xs">
              Save 20% — 2 months free
            </Badge>
          )}
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            currentTier={currentTier}
            annual={annual}
            onUpgrade={() => handleUpgrade(tier.id as UpgradableTier)}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-muted-foreground mt-10">
        All plans include ICP on-chain transparency. Cancel or change plans
        anytime.
      </p>
    </div>
  );
}
