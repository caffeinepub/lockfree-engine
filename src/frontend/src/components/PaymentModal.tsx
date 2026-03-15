import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  CreditCard,
  Loader2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpgradeSubscription } from "../hooks/useQueries";

type Step = "method" | "card" | "icp" | "processing" | "success";
type PaymentMethod = "card" | "icp";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  tier: "pro" | "business" | "enterprise";
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

function StepIndicator({
  current,
  steps,
}: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i < current ? "bg-primary text-background" : ""}
                ${i === current ? "bg-primary/20 border border-primary text-primary" : ""}
                ${i > current ? "bg-muted border border-border text-muted-foreground" : ""}
              `}
            >
              {i < current ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline transition-colors ${i === current ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 transition-colors ${i < current ? "bg-primary/40" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function PaymentModal({
  open,
  onClose,
  tier,
  onSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const { mutateAsync: upgradeSubscription } = useUpgradeSubscription();

  useEffect(() => {
    if (open) setStep("method");
  }, [open]);

  useEffect(() => {
    if (step !== "processing") return;
    const timer = setTimeout(async () => {
      try {
        await upgradeSubscription({ tier, paymentMethod });
        setStep("success");
      } catch {
        toast.error("Payment failed. Please try again.");
        setStep(paymentMethod === "card" ? "card" : "icp");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [step, tier, paymentMethod, upgradeSubscription]);

  const stepLabels = ["Payment", "Details", "Success"];
  const currentStepIndex =
    step === "method"
      ? 0
      : step === "card" || step === "icp" || step === "processing"
        ? 1
        : 2;

  function handleSelectMethod(method: PaymentMethod) {
    setPaymentMethod(method);
    setStep(method === "card" ? "card" : "icp");
  }

  function handleClose() {
    if (step === "processing") return;
    setStep("method");
    onClose();
  }

  const tierLabel = TIER_LABEL[tier] ?? tier;
  const tierPrice = TIER_PRICE[tier] ?? "";
  const tierIcp = TIER_ICP[tier] ?? "";
  const tierFeatures = TIER_FEATURES[tier] ?? [];
  const checkColor = TIER_CHECK_COLOR[tier] ?? "text-primary";
  const successBg =
    TIER_SUCCESS_BG[tier] ?? "bg-primary/10 border border-primary/20";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative px-6 pt-5 pb-4 border-b border-border bg-card">
          {step !== "processing" && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="payment.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {step === "success"
                ? `Welcome to ${tierLabel}!`
                : `Upgrade to ${tierLabel}`}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <StepIndicator current={currentStepIndex} steps={stepLabels} />

          {/* Step 1: Choose method */}
          {step === "method" && (
            <div className="step-content space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you'd like to pay for your{" "}
                <span className="text-foreground font-medium">{tierLabel}</span>{" "}
                plan.
              </p>

              <button
                type="button"
                onClick={() => handleSelectMethod("card")}
                data-ocid="payment.card.button"
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
                data-ocid="payment.icp.button"
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
            </div>
          )}

          {/* Step 2a: Card */}
          {step === "card" && (
            <div className="step-content space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)]">
                <AlertTriangle className="w-4 h-4 text-[oklch(0.72_0.18_55)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[oklch(0.82_0.18_55)]">
                  <span className="font-semibold">Demo Mode</span> — Simulated
                  payment. No real charges.
                </p>
              </div>
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
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setStep("processing")}
                  data-ocid="payment.card.submit_button"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay {tierPrice}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2b: ICP */}
          {step === "icp" && (
            <div className="step-content space-y-4">
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
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)]">
                <AlertTriangle className="w-4 h-4 text-[oklch(0.72_0.18_55)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[oklch(0.82_0.18_55)]">
                  <span className="font-semibold">Demo Mode</span> — No actual
                  wallet connection or ICP transfer will occur.
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setStep("method")}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-2 bg-[oklch(0.72_0.19_145)] hover:bg-[oklch(0.65_0.19_145)] text-background"
                  onClick={() => setStep("processing")}
                  data-ocid="payment.icp.submit_button"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Simulate ICP Payment
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === "processing" && (
            <div className="step-content flex flex-col items-center py-8 gap-4">
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
            <div className="step-content flex flex-col items-center py-4 gap-5">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center animate-check-pop ${successBg}`}
              >
                <Check className={`w-8 h-8 ${checkColor}`} />
              </div>
              <div className="text-center">
                <div className="font-display text-lg font-bold text-foreground">
                  You're now on {tierLabel}!
                </div>
                <div className="text-xs text-muted-foreground mt-1">
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
                data-ocid="payment.success.primary_button"
                onClick={() => {
                  onSuccess(tier);
                  setStep("method");
                }}
              >
                <Zap className="w-4 h-4" />
                Start Using {tierLabel}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
