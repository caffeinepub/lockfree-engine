import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  Loader2,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpgradeSubscription } from "../hooks/useQueries";

type Step = "method" | "card" | "icp" | "processing" | "success";
type PaymentMethod = "card" | "icp";

interface OnboardingPaymentPageProps {
  tier: "pro" | "business" | "enterprise";
  isDemoMode?: boolean;
  onBack: () => void;
  onSuccess: (tier: string) => void;
}

const TIER_PRICE: Record<string, string> = {
  pro: "$49.00",
  business: "$199.00",
  enterprise: "$599.00",
};

const TIER_ICP: Record<string, string> = {
  pro: "80 ICP",
  business: "320 ICP",
  enterprise: "Custom ICP",
};

const TIER_LABEL: Record<string, string> = {
  pro: "Pro",
  business: "Business",
  enterprise: "Enterprise",
};

const TIER_FEATURES: Record<string, string[]> = {
  pro: [
    "Up to 10 Cloud Engines",
    "3 user seats",
    "Full migration flows",
    "AI Deploy Chat (unlimited)",
  ],
  business: [
    "Up to 50 Cloud Engines",
    "10 user seats",
    "Advanced cost optimization",
    "Multi-cloud distribution controls",
  ],
  enterprise: [
    "Unlimited engines & users",
    "White-label branding controls",
    "Dedicated onboarding + SLA",
    "Direct account manager",
  ],
};

const TIER_CHECK_COLOR: Record<string, string> = {
  pro: "text-[oklch(0.72_0.19_145)]",
  business: "text-[oklch(0.68_0.22_260)]",
  enterprise: "text-[oklch(0.75_0.18_60)]",
};

const TIER_SUCCESS_BG: Record<string, string> = {
  pro: "bg-[oklch(0.72_0.19_145/0.15)] border border-[oklch(0.72_0.19_145/0.4)]",
  business:
    "bg-[oklch(0.68_0.22_260/0.15)] border border-[oklch(0.68_0.22_260/0.4)]",
  enterprise:
    "bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.4)]",
};

export function OnboardingPaymentPage({
  tier,
  isDemoMode,
  onBack,
  onSuccess,
}: OnboardingPaymentPageProps) {
  const [step, setStep] = useState<Step>("method");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const { mutateAsync: upgradeSubscription } = useUpgradeSubscription();

  useEffect(() => {
    if (step !== "processing") return;
    const timer = setTimeout(async () => {
      if (isDemoMode) {
        setStep("success");
        return;
      }
      try {
        await upgradeSubscription({ tier, paymentMethod });
        setStep("success");
      } catch {
        toast.error("Payment failed. Please try again.");
        setStep(paymentMethod === "card" ? "card" : "icp");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [step, tier, paymentMethod, upgradeSubscription, isDemoMode]);

  const tierLabel = TIER_LABEL[tier] ?? tier;
  const tierPrice = TIER_PRICE[tier] ?? "";
  const tierIcp = TIER_ICP[tier] ?? "";
  const tierFeatures = TIER_FEATURES[tier] ?? [];
  const checkColor = TIER_CHECK_COLOR[tier] ?? "text-primary";
  const successBg =
    TIER_SUCCESS_BG[tier] ?? "bg-primary/10 border border-primary/20";

  function handleSelectMethod(method: PaymentMethod) {
    setPaymentMethod(method);
    setStep(method === "card" ? "card" : "icp");
  }

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{ background: "oklch(0.145 0.01 260)" }}
      data-ocid="onboarding.payment.page"
    >
      {/* Demo disclaimer banner */}
      <div className="sticky top-0 z-10 w-full bg-[oklch(0.38_0.12_70)] border-b border-[oklch(0.50_0.14_70)] px-4 py-2.5 flex items-center justify-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[oklch(0.92_0.16_80)] flex-shrink-0" />
        <p className="text-sm font-medium text-[oklch(0.97_0.05_80)] text-center">
          <span className="font-bold">Demo only</span> — This is not a real
          transaction. No plan will be activated and no payment will be charged.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 sm:px-6">
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
            <div className="w-7 h-7 rounded-full bg-primary text-background flex items-center justify-center text-xs font-bold">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-muted-foreground">Choose Plan</span>
          </div>
          <div className="w-10 h-px bg-primary/40 mx-3" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs font-bold">
              2
            </div>
            <span className="text-sm font-semibold text-foreground">
              Payment
            </span>
          </div>
        </div>

        {/* Selected plan summary */}
        {step !== "success" && (
          <div className="mb-5 p-3 rounded-xl border border-border bg-card/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">
                Selected plan
              </div>
              <div className="font-display font-bold text-foreground">
                {tierLabel}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground">{tierPrice}</div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
          </div>
        )}

        {/* Content card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Step 1: Choose method */}
          {step === "method" && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                How would you like to pay?
              </h2>

              <button
                type="button"
                onClick={() => handleSelectMethod("card")}
                data-ocid="onboarding.payment.card.button"
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-foreground">
                    Pay with Card
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Credit or debit card — {tierPrice}/month
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectMethod("icp")}
                data-ocid="onboarding.payment.icp.button"
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[oklch(0.72_0.19_145/0.1)] border border-[oklch(0.72_0.19_145/0.25)] flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-[oklch(0.72_0.19_145)]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-foreground">
                    Pay with ICP Wallet
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Internet Computer token — {tierIcp}/month
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>

              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                  onClick={onBack}
                  data-ocid="onboarding.payment.back.button"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to plan selection
                </Button>
              </div>
            </div>
          )}

          {/* Step 2a: Card */}
          {step === "card" && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">
                Card details
              </h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Card Number</Label>
                  <Input
                    className="h-9 font-mono text-sm"
                    defaultValue="4242 4242 4242 4242"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Expiry</Label>
                    <Input
                      className="h-9 font-mono text-sm"
                      defaultValue="12/29"
                      readOnly
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">CVC</Label>
                    <Input
                      className="h-9 font-mono text-sm"
                      defaultValue="123"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Name on Card</Label>
                  <Input
                    className="h-9 text-sm"
                    defaultValue="Demo User"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setStep("method")}
                  data-ocid="onboarding.payment.card.cancel_button"
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setStep("processing")}
                  data-ocid="onboarding.payment.card.submit_button"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay {tierPrice}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2b: ICP */}
          {step === "icp" && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">
                ICP Wallet payment
              </h2>
              <div className="p-4 rounded-xl border border-[oklch(0.72_0.19_145/0.3)] bg-[oklch(0.72_0.19_145/0.06)]">
                <div className="text-xs text-muted-foreground mb-1">
                  Amount to transfer
                </div>
                <div className="font-display text-2xl font-bold text-[oklch(0.82_0.19_145)]">
                  {tierIcp}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  per month, billed on-chain
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-2">
                <div className="flex items-start gap-2">
                  <Wallet className="w-4 h-4 text-[oklch(0.72_0.19_145)] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    You will be redirected to your ICP wallet app (e.g. Plug,
                    Stoic, or NNS) to authorise this transfer on the Internet
                    Computer. Your payment is recorded on-chain.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setStep("method")}
                  data-ocid="onboarding.payment.icp.cancel_button"
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2 bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background"
                  onClick={() => setStep("processing")}
                  data-ocid="onboarding.payment.icp.submit_button"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Simulate ICP Payment
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div
              className="flex flex-col items-center py-10 gap-4"
              data-ocid="onboarding.payment.loading_state"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground">
                  Processing your payment...
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {paymentMethod === "icp"
                    ? "Simulating ICP transfer"
                    : "Simulating card charge"}
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div
              className="flex flex-col items-center py-4 gap-5"
              data-ocid="onboarding.payment.success_state"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${successBg}`}
              >
                <Check className={`w-8 h-8 ${checkColor}`} />
              </div>
              <div className="text-center">
                <div className="font-display text-xl font-bold text-foreground">
                  You’re on {tierLabel}!
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your account has been upgraded successfully.
                </div>
              </div>
              <div className="w-full p-3 rounded-lg border border-border bg-secondary/30">
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Now unlocked
                </div>
                <ul className="space-y-1.5">
                  {tierFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 ${checkColor}`}
                      />
                      <span className="text-foreground/90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="w-full gap-2"
                data-ocid="onboarding.payment.success.primary_button"
                onClick={() => onSuccess(tier)}
              >
                <Zap className="w-4 h-4" />
                Start Using {tierLabel}
              </Button>
            </div>
          )}
        </div>

        {/* Footer note */}
        {step !== "success" && step !== "processing" && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            All plans include ICP on-chain transparency. Cancel or change plans
            anytime.
          </p>
        )}
      </div>
    </div>
  );
}
