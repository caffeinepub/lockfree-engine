import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Loader2,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import { useDistributeAndGetScore } from "../hooks/useQueries";

interface AICostOptimizationModalProps {
  open: boolean;
  onClose: () => void;
  engines: Engine[];
  isDemoMode?: boolean;
}

type Phase = "analysing" | "recommendations" | "done";

const SCAN_STEPS = [
  "Analysing engine costs...",
  "Comparing provider rates...",
  "Computing optimal distribution...",
];

interface Recommendation {
  id: string;
  title: string;
  description: string;
  savingsPct: number;
  impact: "High" | "Medium" | "Low";
  impactColor: string;
  icon: React.ReactNode;
  actionLabel: string;
  resultMessage: string;
}

function getRecommendations(engines: Engine[]): Recommendation[] {
  const counts: Record<string, number> = {};
  for (const e of engines) {
    counts[e.provider] = (counts[e.provider] ?? 0) + 1;
  }
  const awsCount = counts.AWS ?? 0;
  const gcpCount = counts.GCP ?? 0;
  const azureCount = counts.Azure ?? 0;

  const recs: Recommendation[] = [];

  // Primary workload redistribution
  if (awsCount > gcpCount && awsCount > azureCount) {
    recs.push({
      id: "redistribute",
      title: "Move 60% of workloads to Google Cloud",
      description:
        "Your AWS concentration is driving up costs. Redistributing to GCP spot instances reduces your monthly spend significantly.",
      savingsPct: 34,
      impact: "High",
      impactColor: "#22c55e",
      icon: <TrendingDown className="w-4 h-4" style={{ color: "#4285F4" }} />,
      actionLabel: "Apply Redistribution",
      resultMessage:
        "Workload redistribution applied! Projected saving: 34% per month.",
    });
  } else if (gcpCount > awsCount && gcpCount > azureCount) {
    recs.push({
      id: "redistribute",
      title: "Rebalance 50% of workloads to Azure",
      description:
        "Your GCP concentration is above the optimal threshold. Azure hybrid pricing offers better rates for your workload profile.",
      savingsPct: 28,
      impact: "High",
      impactColor: "#22c55e",
      icon: <TrendingDown className="w-4 h-4" style={{ color: "#00BCF2" }} />,
      actionLabel: "Apply Rebalance",
      resultMessage:
        "Workload rebalance applied! Projected saving: 28% per month.",
    });
  } else {
    recs.push({
      id: "redistribute",
      title: "Distribute evenly across all three providers",
      description:
        "Even distribution across AWS, GCP, and Azure eliminates single-vendor pricing risk and maximises spot availability.",
      savingsPct: 22,
      impact: "High",
      impactColor: "#22c55e",
      icon: <TrendingDown className="w-4 h-4" style={{ color: "#4285F4" }} />,
      actionLabel: "Apply Distribution",
      resultMessage:
        "Even distribution applied! Projected saving: 22% per month.",
    });
  }

  // Reserved instance recommendation
  recs.push({
    id: "reserved",
    title: "Switch 3 engines to reserved instances",
    description:
      "Engines running > 720 hrs/month are cheaper on 1-year reserved contracts. No performance change — pure cost reduction.",
    savingsPct: 18,
    impact: "Medium",
    impactColor: "#f59e0b",
    icon: <Zap className="w-4 h-4" style={{ color: "#f59e0b" }} />,
    actionLabel: "Convert to Reserved",
    resultMessage:
      "3 engines converted to reserved instances. Saving 18% on those workloads.",
  });

  // Resilience / redundancy
  recs.push({
    id: "resilience",
    title: "Enable cross-region failover on primary engines",
    description:
      "Adding a standby replica in a second region costs ~8% more but eliminates downtime risk and qualifies for SLA-backed billing credits.",
    savingsPct: 0,
    impact: "Medium",
    impactColor: "#3b82f6",
    icon: <Shield className="w-4 h-4" style={{ color: "#3b82f6" }} />,
    actionLabel: "Enable Failover",
    resultMessage: "Cross-region failover enabled. Resilience score updated.",
  });

  // Auto-scaling
  recs.push({
    id: "autoscale",
    title: "Enable auto-scale on 2 idle engines",
    description:
      "Two engines are consistently below 20% CPU utilisation. Auto-scaling down during off-peak hours reduces their footprint by 40%.",
    savingsPct: 12,
    impact: "Low",
    impactColor: "#8b5cf6",
    icon: <RotateCcw className="w-4 h-4" style={{ color: "#8b5cf6" }} />,
    actionLabel: "Enable Auto-Scale",
    resultMessage:
      "Auto-scaling enabled on 2 engines. Expect 12% reduction in idle costs.",
  });

  return recs;
}

export function AICostOptimizationModal({
  open,
  onClose,
  engines,
  isDemoMode = false,
}: AICostOptimizationModalProps) {
  const [phase, setPhase] = useState<Phase>("analysing");
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);
  // Per-recommendation applying states: "idle" | "applying" | "done"
  const [recStates, setRecStates] = useState<
    Record<string, "idle" | "applying" | "done">
  >({});
  const { mutateAsync: distribute } = useDistributeAndGetScore();

  const recommendations = getRecommendations(engines);

  // Reset state on open
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase("analysing");
        setScanStep(0);
        setProgress(0);
        setRecStates({});
      }, 300);
      return () => clearTimeout(t);
    }

    setPhase("analysing");
    setScanStep(0);
    setProgress(0);
    setRecStates({});

    let p = 0;
    const interval = setInterval(() => {
      p += 2.5;
      setProgress(Math.min(p, 100));
      if (p >= 33 && p < 34) setScanStep(1);
      if (p >= 66 && p < 67) setScanStep(2);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("recommendations"), 200);
      }
    }, 37);

    return () => clearInterval(interval);
  }, [open]);

  async function handleApplyRec(rec: Recommendation) {
    setRecStates((s) => ({ ...s, [rec.id]: "applying" }));

    if (isDemoMode) {
      // Simulate a 1.5s processing delay
      await new Promise((r) => setTimeout(r, 1500));
      setRecStates((s) => ({ ...s, [rec.id]: "done" }));
      toast.success(rec.resultMessage);
    } else {
      try {
        if (rec.id === "redistribute") {
          await distribute();
        } else {
          await new Promise((r) => setTimeout(r, 1500));
        }
        setRecStates((s) => ({ ...s, [rec.id]: "done" }));
        toast.success(rec.resultMessage);
      } catch {
        setRecStates((s) => ({ ...s, [rec.id]: "idle" }));
        toast.error("Failed to apply recommendation. Please try again.");
      }
    }
  }

  const allApplied =
    phase === "recommendations" &&
    recommendations.every((r) => recStates[r.id] === "done");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {/* ── Phase: Analysing ── */}
        {phase === "analysing" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Analysing Your Engines
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-6">
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
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden bg-muted">
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

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Scanning {engines.length} engine(s)...</span>
                  <span className="font-mono tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </>
        )}

        {/* ── Phase: Recommendations ── */}
        {phase === "recommendations" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Recommendations
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {
                    recommendations.filter((r) => recStates[r.id] === "done")
                      .length
                  }{" "}
                  / {recommendations.length} applied
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-2 space-y-3">
              {recommendations.map((rec) => {
                const state = recStates[rec.id] ?? "idle";
                const isDone = state === "done";
                const isApplying = state === "applying";

                return (
                  <div
                    key={rec.id}
                    className={`rounded-lg border p-4 space-y-3 transition-all duration-300 ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isDone
                            ? "oklch(var(--status-running) / 0.1)"
                            : "oklch(var(--secondary) / 0.6)",
                          border: isDone
                            ? "1px solid oklch(var(--status-running) / 0.3)"
                            : "1px solid oklch(var(--border))",
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "oklch(var(--status-running))" }}
                          />
                        ) : (
                          rec.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {rec.title}
                          </span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                            style={{
                              color: rec.impactColor,
                              background: `${rec.impactColor}18`,
                              border: `1px solid ${rec.impactColor}40`,
                            }}
                          >
                            {rec.impact}
                          </span>
                          {rec.savingsPct > 0 && (
                            <span className="text-[10px] font-mono font-bold text-emerald-400">
                              -{rec.savingsPct}% cost
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {isDone ? (
                        <div
                          className="flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: "oklch(var(--status-running))" }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Applied
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs h-7 px-3"
                          onClick={() => handleApplyRec(rec)}
                          disabled={isApplying}
                        >
                          {isApplying ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" />
                              {rec.actionLabel}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  {allApplied ? "Done" : "Close"}
                </Button>
                {!allApplied && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={async () => {
                      for (const rec of recommendations) {
                        if ((recStates[rec.id] ?? "idle") === "idle") {
                          await handleApplyRec(rec);
                        }
                      }
                    }}
                    disabled={recommendations.some(
                      (r) => recStates[r.id] === "applying",
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    Apply All
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
