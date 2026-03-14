import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Sparkles, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import { useDistributeAndGetScore } from "../hooks/useQueries";

interface AICostOptimizationModalProps {
  open: boolean;
  onClose: () => void;
  engines: Engine[];
}

type Phase = "analysing" | "recommendation" | "applying" | "done";

const SCAN_STEPS = [
  "Analysing engine costs...",
  "Comparing provider rates...",
  "Computing optimal distribution...",
];

function getRecommendation(engines: Engine[]): {
  recommendation: string;
  savingsPct: number;
  targetProvider: string;
  color: string;
} {
  if (engines.length === 0) {
    return {
      recommendation: "Distribute evenly across AWS, GCP & Azure",
      savingsPct: 22,
      targetProvider: "GCP",
      color: "#4285F4",
    };
  }

  const counts: Record<string, number> = {};
  for (const e of engines) {
    counts[e.provider] = (counts[e.provider] ?? 0) + 1;
  }

  const awsCount = counts.AWS ?? 0;
  const gcpCount = counts.GCP ?? 0;
  const azureCount = counts.Azure ?? 0;
  const maxCount = Math.max(awsCount, gcpCount, azureCount);

  if (maxCount === 0) {
    return {
      recommendation: "Distribute evenly across AWS, GCP & Azure",
      savingsPct: 22,
      targetProvider: "All providers",
      color: "#4285F4",
    };
  }

  // Which provider has most engines?
  if (awsCount === maxCount && awsCount > gcpCount && awsCount > azureCount) {
    return {
      recommendation: "Move 60% of workloads to Google Cloud",
      savingsPct: 34,
      targetProvider: "GCP",
      color: "#4285F4",
    };
  }
  if (gcpCount === maxCount && gcpCount > awsCount && gcpCount > azureCount) {
    return {
      recommendation: "Move 50% of workloads to Azure",
      savingsPct: 28,
      targetProvider: "Azure",
      color: "#00BCF2",
    };
  }
  if (
    azureCount === maxCount &&
    azureCount > awsCount &&
    azureCount > gcpCount
  ) {
    return {
      recommendation: "Move 65% of workloads to AWS",
      savingsPct: 31,
      targetProvider: "AWS",
      color: "#FF9900",
    };
  }

  return {
    recommendation: "Distribute evenly across AWS, GCP & Azure",
    savingsPct: 22,
    targetProvider: "All providers",
    color: "#4285F4",
  };
}

export function AICostOptimizationModal({
  open,
  onClose,
  engines,
}: AICostOptimizationModalProps) {
  const [phase, setPhase] = useState<Phase>("analysing");
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { mutateAsync: distribute } = useDistributeAndGetScore();

  const rec = getRecommendation(engines);

  // Reset state on open
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase("analysing");
        setScanStep(0);
        setProgress(0);
      }, 300);
      return () => clearTimeout(t);
    }

    // Kick off the analysis animation
    setPhase("analysing");
    setScanStep(0);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 2.5;
      setProgress(Math.min(p, 100));
      // Advance scan steps at ~33% increments
      if (p >= 33 && p < 34) setScanStep(1);
      if (p >= 66 && p < 67) setScanStep(2);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("recommendation"), 200);
      }
    }, 37); // ~1.5s total

    return () => clearInterval(interval);
  }, [open]);

  async function handleApply() {
    setPhase("applying");
    try {
      await distribute();
      setPhase("done");
      setTimeout(() => {
        onClose();
        toast.success("Cost optimization applied! Resilience score updated.");
      }, 2000);
    } catch {
      setPhase("recommendation");
      toast.error("Failed to apply optimization. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {/* ── Phase: Analysing ── */}
        {phase === "analysing" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Optimizing Costs
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Scan rows */}
              <div className="space-y-3">
                {SCAN_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                        i < scanStep
                          ? "bg-status-running"
                          : i === scanStep
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`text-sm transition-colors duration-300 ${
                          i <= scanStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                      {i <= scanStep && (
                        <div
                          className="mt-1.5 h-1.5 rounded-full overflow-hidden"
                          style={{
                            background: "oklch(var(--muted))",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width:
                                i < scanStep
                                  ? "100%"
                                  : `${((progress % 33) / 33) * 100}%`,
                              background: "oklch(var(--primary))",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {i < scanStep && (
                      <CheckCircle2 className="w-4 h-4 text-status-running flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Main progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Analysing {engines.length} engine(s)...</span>
                  <span className="font-mono tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </>
        )}

        {/* ── Phase: Recommendation ── */}
        {(phase === "recommendation" || phase === "applying") && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Recommendation
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 space-y-4">
              {/* Savings highlight */}
              <div
                className="rounded-xl p-5 text-center space-y-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--status-running) / 0.08), oklch(var(--primary) / 0.06))",
                  border: "1px solid oklch(var(--status-running) / 0.2)",
                }}
              >
                <div
                  className="text-5xl font-display font-bold tabular-nums"
                  style={{ color: "oklch(var(--status-running))" }}
                >
                  {rec.savingsPct}%
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  estimated monthly savings
                </div>
              </div>

              {/* Recommendation card */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${rec.color}18`,
                      border: `1px solid ${rec.color}40`,
                    }}
                  >
                    <TrendingDown
                      className="w-4 h-4"
                      style={{ color: rec.color }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {rec.recommendation}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Redistributing to{" "}
                      <span
                        className="font-semibold font-mono"
                        style={{ color: rec.color }}
                      >
                        {rec.targetProvider}
                      </span>{" "}
                      optimizes cost and resilience simultaneously.
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "Engines", value: engines.length.toString() },
                    {
                      label: "Target",
                      value: rec.targetProvider.split(" ")[0],
                    },
                    { label: "Save", value: `${rec.savingsPct}%` },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center rounded-md p-2"
                      style={{ background: "oklch(var(--secondary) / 0.5)" }}
                    >
                      <div className="text-sm font-mono font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={phase === "applying"}
                >
                  Dismiss
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleApply}
                  disabled={phase === "applying"}
                >
                  {phase === "applying" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Apply Recommendation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ── Phase: Done ── */}
        {phase === "done" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(var(--status-running) / 0.1)",
                border: "1px solid oklch(var(--status-running) / 0.3)",
              }}
            >
              <CheckCircle2
                className="w-8 h-8 animate-check-pop"
                style={{ color: "oklch(var(--status-running))" }}
              />
            </div>
            <div className="text-center space-y-1">
              <div className="font-display font-semibold text-lg">
                Optimization Applied!
              </div>
              <div className="text-sm text-muted-foreground">
                Resilience score updated. Closing automatically...
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
