import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Shield, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  currentTier: string;
  onUpgrade: (tier: string) => void;
}

const FREE_FEATURES = [
  "1 Cloud Engine",
  "5 deployments/month",
  "Community support",
  "ICP on-chain transparency",
  "No vendor lock-in",
];

const PRO_FEATURES = [
  "Unlimited engines",
  "Unlimited deployments",
  "Unlimited migrations",
  "AI cheapest-provider recommendations",
  "Priority support",
  "ICP on-chain transparency",
];

const ENTERPRISE_FEATURES = [
  "Everything in Pro",
  "White-label branding",
  "Team seats (up to 10 members)",
  "Dedicated SLAs",
  "Custom ICP pricing",
  "Priority support + custom terms",
  "Dedicated account manager",
];

interface TierCardProps {
  tier: "free" | "pro" | "enterprise";
  currentTier: string;
  onUpgrade: () => void;
}

function TierCard({ tier, currentTier, onUpgrade }: TierCardProps) {
  const isCurrent = currentTier === tier;
  const isPro = tier === "pro";
  const isEnterprise = tier === "enterprise";
  const isFree = tier === "free";

  const features = isFree
    ? FREE_FEATURES
    : isPro
      ? PRO_FEATURES
      : ENTERPRISE_FEATURES;

  return (
    <div
      className={`
        relative flex flex-col rounded-xl border p-5 transition-all duration-200
        ${isPro ? "tier-pro-glow border-[oklch(0.72_0.19_145/0.5)] bg-card" : ""}
        ${isEnterprise ? "tier-enterprise-glow border-[oklch(0.75_0.18_60/0.5)] bg-card" : ""}
        ${isFree ? "border-border bg-card/60" : ""}
      `}
    >
      {/* Popular badge */}
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[oklch(0.72_0.19_145)] text-background text-xs font-semibold px-3 py-0.5 shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      {isEnterprise && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[oklch(0.75_0.18_60)] text-background text-xs font-semibold px-3 py-0.5 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Enterprise
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${isFree ? "bg-muted/50 border border-border" : ""}
              ${isPro ? "bg-[oklch(0.72_0.19_145/0.15)] border border-[oklch(0.72_0.19_145/0.4)]" : ""}
              ${isEnterprise ? "bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.4)]" : ""}
            `}
          >
            {isFree && <Shield className="w-4 h-4 text-muted-foreground" />}
            {isPro && <Zap className="w-4 h-4 text-[oklch(0.72_0.19_145)]" />}
            {isEnterprise && (
              <Crown className="w-4 h-4 text-[oklch(0.75_0.18_60)]" />
            )}
          </div>
          <div>
            <div
              className={`font-display font-bold text-base capitalize
                ${isFree ? "text-muted-foreground" : ""}
                ${isPro ? "text-[oklch(0.82_0.19_145)]" : ""}
                ${isEnterprise ? "text-[oklch(0.85_0.18_60)]" : ""}
              `}
            >
              {tier}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-1">
          {isFree && (
            <div className="font-display text-3xl font-bold text-foreground">
              $0
              <span className="text-sm font-normal text-muted-foreground ml-1">
                /month
              </span>
            </div>
          )}
          {isPro && (
            <div>
              <div className="font-display text-3xl font-bold text-foreground">
                $29
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /month
                </span>
              </div>
              <div className="text-xs text-[oklch(0.72_0.19_145)] mt-0.5">
                or 50 ICP/month
              </div>
            </div>
          )}
          {isEnterprise && (
            <div>
              <div className="font-display text-3xl font-bold text-foreground">
                $499
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /month
                </span>
              </div>
              <div className="text-xs text-[oklch(0.75_0.18_60)] mt-0.5">
                or custom ICP
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2 mb-5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check
              className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0
                ${isFree ? "text-muted-foreground" : ""}
                ${isPro ? "text-[oklch(0.72_0.19_145)]" : ""}
                ${isEnterprise ? "text-[oklch(0.75_0.18_60)]" : ""}
              `}
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
      </ul>

      {/* CTA */}
      {isFree && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isCurrent}
        >
          {isCurrent ? "Current Plan" : "Downgrade to Free"}
        </Button>
      )}
      {isPro && (
        <Button
          size="sm"
          className="w-full bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background font-semibold"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? "Current Plan" : "Upgrade to Pro"}
        </Button>
      )}
      {isEnterprise && (
        <Button
          size="sm"
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
}: PricingModalProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"pro" | "enterprise">("pro");

  function handleUpgrade(tier: "pro" | "enterprise") {
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
        <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-border bg-card">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
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
          </div>

          {/* Tier cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <TierCard
              tier="free"
              currentTier={currentTier}
              onUpgrade={() => {}}
            />
            <TierCard
              tier="pro"
              currentTier={currentTier}
              onUpgrade={() => handleUpgrade("pro")}
            />
            <TierCard
              tier="enterprise"
              currentTier={currentTier}
              onUpgrade={() => handleUpgrade("enterprise")}
            />
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
      />
    </>
  );
}
