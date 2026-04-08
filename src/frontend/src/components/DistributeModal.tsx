import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Loader2, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import { useDistributeAndGetScore } from "../hooks/useQueries";
import { getProviderConfig } from "../lib/providerUtils";

interface DistributeModalProps {
  open: boolean;
  onClose: () => void;
  engines: Engine[];
  isDemoMode?: boolean;
}

const ALL_PROVIDERS = ["AWS", "GCP", "Azure"];

// Base resilience scores per provider for round-robin simulation
const PROVIDER_RESILIENCE: Record<string, number> = {
  AWS: 55,
  GCP: 72,
  Azure: 61,
};

function computeProjectedScore(engines: Engine[]): number {
  if (engines.length === 0) return 0;
  const assignments = engines.map(
    (_, i) => ALL_PROVIDERS[i % ALL_PROVIDERS.length],
  );
  const avgScore =
    assignments.reduce((sum, p) => sum + (PROVIDER_RESILIENCE[p] ?? 60), 0) /
    assignments.length;
  return Math.round(avgScore);
}

function getScoreColor(score: number): string {
  if (score < 40) return "text-destructive";
  if (score < 70) return "text-amber-500";
  return "text-status-running";
}

function getScoreBg(score: number): string {
  if (score < 40) return "bg-destructive/10 border-destructive/20";
  if (score < 70) return "bg-amber-500/10 border-amber-500/20";
  return "bg-status-running/10 border-status-running/20";
}

type Step = "preview" | "distributing" | "complete";

export function DistributeModal({
  open,
  onClose,
  engines,
  isDemoMode,
}: DistributeModalProps) {
  const [step, setStep] = useState<Step>("preview");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const { mutateAsync: distributeAndGetScore } = useDistributeAndGetScore();

  const projectedScore = computeProjectedScore(engines);

  // Build round-robin assignment preview
  const assignments = engines.map((engine, i) => ({
    engine,
    assignedProvider: ALL_PROVIDERS[i % ALL_PROVIDERS.length],
  }));

  function handleClose() {
    // Reset state on close
    setTimeout(() => {
      setStep("preview");
      setFinalScore(null);
    }, 250);
    onClose();
  }

  async function handleDistribute() {
    setStep("distributing");
    try {
      if (isDemoMode) {
        // Demo mode: simulate distribution without hitting the backend
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setFinalScore(projectedScore);
        setStep("complete");
        toast.success(
          `Engines distributed! Resilience score: ${projectedScore}%`,
        );
      } else {
        const result = await distributeAndGetScore();
        const score = Number(result.overallResilienceScore);
        setFinalScore(score);
        setStep("complete");
        toast.success(`Engines distributed! Resilience score: ${score}%`);
      }
    } catch {
      setStep("preview");
      toast.error("Distribution failed. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-lg border-white/10"
        style={{
          background: "oklch(var(--card) / 0.70)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 24px 80px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(1 0 0 / 0.06)",
          borderRadius: "16px",
        }}
      >
        {/* Top radial glow */}
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none rounded-t-2xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.82 0.22 195 / 0.07), transparent)",
          }}
        />
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {step === "preview" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Distribute Across Providers
                </DialogTitle>
                <DialogDescription>
                  Split your engines across AWS, GCP, and Azure for maximum
                  resilience. ICP handles routing transparently.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Projected resilience score */}
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getScoreBg(projectedScore)}`}
                >
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Projected Resilience Score
                    </div>
                    <div className="text-xs text-muted-foreground">
                      After distribution across all 3 providers
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-mono font-bold tabular-nums ${getScoreColor(projectedScore)}`}
                  >
                    {projectedScore}%
                  </div>
                </div>

                {/* Engine-to-provider assignment list */}
                {engines.length > 0 ? (
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Assignment Preview
                    </div>
                    <div
                      className="space-y-1 overflow-y-auto"
                      style={{ maxHeight: "220px" }}
                    >
                      {assignments.map(({ engine, assignedProvider }) => {
                        const fromConfig = getProviderConfig(engine.provider);
                        const toConfig = getProviderConfig(assignedProvider);
                        const isSame = engine.provider === assignedProvider;
                        return (
                          <div
                            key={engine.id.toString()}
                            className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary/30"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground truncate">
                                {engine.name}
                              </div>
                            </div>
                            {isSame ? (
                              <span
                                className={`text-xs font-bold font-mono ${fromConfig.textClass}`}
                              >
                                {engine.provider} (unchanged)
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span
                                  className={`text-xs font-bold font-mono ${fromConfig.textClass}`}
                                >
                                  {engine.provider}
                                </span>
                                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                <span
                                  className={`text-xs font-bold font-mono ${toConfig.textClass}`}
                                >
                                  {assignedProvider}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No engines to distribute yet
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    disabled={engines.length === 0}
                    onClick={handleDistribute}
                  >
                    <Shuffle className="w-4 h-4" />
                    Distribute Now
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "distributing" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Distributing...
                </DialogTitle>
                <DialogDescription>
                  Reassigning engines across all providers for maximum
                  resilience.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-5 py-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Shuffle className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">
                    Distributing across providers...
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Updating network routes and resilience scores
                  </div>
                </div>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </>
          )}

          {step === "complete" && finalScore !== null && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="w-14 h-14 rounded-full bg-status-running/10 border border-status-running/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-status-running" />
              </div>
              <div className="text-center space-y-2">
                <div className="font-display font-semibold text-lg">
                  Distribution Complete
                </div>
                <div className="text-sm text-muted-foreground">
                  Engines are now spread across AWS, GCP, and Azure
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono font-bold text-2xl tabular-nums ${getScoreBg(finalScore)} ${getScoreColor(finalScore)}`}
                >
                  Resilience Score: {finalScore}%
                </div>
              </div>
              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
