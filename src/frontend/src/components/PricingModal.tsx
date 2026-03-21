import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Shield, Sparkles, Star, X, Zap } from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  currentTier: string;
  onUpgrade: (tier: string) => void;
  isDemoMode?: boolean;
}

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
      className={`relative flex flex-col rounded-xl border p-5 transition-all duration-200 ${tier.cardClass}`}
    >
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            className={`${tier.badge.bg} text-background text-xs font-semibold px-3 py-0.5 shadow-lg`}
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
            <div className="font-display text-3xl font-bold text-foreground">
              $0
              <span className="text-sm font-normal text-muted-foreground ml-1">
                /month
              </span>
            </div>
          ) : (
            <div>
              <div className="font-display text-3xl font-bold text-foreground">
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
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check
              className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tier.checkColor}`}
            />
            <span
              className={
                isFree ? "text-muted-foreground" : "text-foreground/90"
              }
            >
              {feature}
            </span>
          </li>
        ))}
        {tier.notIncluded.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm opacity-40"
          >
            <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground line-through">
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
          className="w-full"
          disabled={isCurrent}
        >
          {isCurrent ? "Current Plan" : "Downgrade to Free"}
        </Button>
      ) : tier.id === "pro" ? (
        <Button
          size="sm"
          data-ocid="pricing.pro.primary_button"
          className="w-full bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Pro"}
        </Button>
      ) : tier.id === "business" ? (
        <Button
          size="sm"
          data-ocid="pricing.business.primary_button"
          className="w-full bg-[oklch(0.68_0.22_260)] hover:bg-[oklch(0.61_0.22_260)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Business"}
        </Button>
      ) : (
        <Button
          size="sm"
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

export function PricingModal({
  open,
  onClose,
  currentTier,
  onUpgrade,
  isDemoMode,
}: PricingModalProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UpgradableTier>("pro");
  const [annual, setAnnual] = useState(false);

  function handleUpgrade(tier: UpgradableTier) {
    setSelectedTier(tier);
    setPaymentModalOpen(true);
  }

  function handlePaymentSuccess(tier: string) {
    setPaymentModalOpen(false);
    onUpgrade(tier);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-border bg-card">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="pricing.close_button"
            >
              <X className="w-4 h-4" />
            </button>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Choose your plan
              </DialogTitle>
              <DialogDescription className="text-sm">
                Scale from free to enterprise — migrate providers at any time,
                no lock-in.
              </DialogDescription>
            </DialogHeader>

            {/* Annual toggle */}
            <div className="flex items-center justify-center gap-3 mt-4">
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
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
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="px-6 pb-5 text-center text-xs text-muted-foreground">
            All plans include ICP on-chain transparency. Cancel or change plans
            anytime.
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        tier={selectedTier}
        onSuccess={handlePaymentSuccess}
        isDemoMode={isDemoMode}
      />
    </>
  );
}
