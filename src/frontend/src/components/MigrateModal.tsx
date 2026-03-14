import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Engine, MigrationRecord } from "../backend.d.ts";
import { useMigrateEngineWithDetails } from "../hooks/useQueries";
import { getProviderConfig } from "../lib/providerUtils";

interface MigrateModalProps {
  engine: Engine;
  open: boolean;
  onClose: () => void;
}

const providers = ["AWS", "GCP", "Azure"];

// Mock monthly costs per provider
const PROVIDER_MONTHLY_COSTS: Record<string, number> = {
  AWS: 240,
  GCP: 167,
  Azure: 182,
};

const MIGRATION_PHASES = [
  "Snapshotting engine state...",
  "Transferring canisters...",
  "Updating network routes...",
  "Verifying integrity...",
];

const ITEMS_TO_MIGRATE = [
  "Engine state & runtime",
  "Deployed canisters",
  "App configurations",
  "Network routes",
];

type Step = "confirm" | "migrating" | "complete";

export function MigrateModal({ engine, open, onClose }: MigrateModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [targetProvider, setTargetProvider] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [migrationRecord, setMigrationRecord] =
    useState<MigrationRecord | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { mutateAsync: migrateWithDetails } = useMigrateEngineWithDetails();

  const availableProviders = providers.filter((p) => p !== engine.provider);
  const currentConfig = getProviderConfig(engine.provider);
  const targetConfig = targetProvider
    ? getProviderConfig(targetProvider)
    : null;

  const currentCost = PROVIDER_MONTHLY_COSTS[engine.provider] ?? 240;
  const targetCost = targetProvider
    ? (PROVIDER_MONTHLY_COSTS[targetProvider] ?? 167)
    : null;
  const savings = targetCost !== null ? currentCost - targetCost : null;

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("confirm");
        setTargetProvider(null);
        setProgress(0);
        setPhaseIndex(0);
        setMigrationRecord(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  function clearProgressInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function handleMigrate() {
    if (!targetProvider) return;
    setStep("migrating");
    setProgress(0);
    setPhaseIndex(0);

    // Animate progress through 4 phases
    let currentProgress = 0;
    let currentPhase = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += 3;
      setProgress(Math.min(currentProgress, 95));

      // Update phase label every 25% progress
      const newPhase = Math.min(
        Math.floor(currentProgress / 25),
        MIGRATION_PHASES.length - 1,
      );
      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        setPhaseIndex(newPhase);
      }
    }, 80);

    try {
      const record = await migrateWithDetails({
        id: engine.id,
        targetProvider,
      });
      clearProgressInterval();
      setProgress(100);
      setMigrationRecord(record);
      setTimeout(() => setStep("complete"), 400);
      toast.success(`${engine.name} migrated to ${targetProvider}!`);
    } catch {
      clearProgressInterval();
      setProgress(0);
      setStep("confirm");
      toast.error("Migration failed. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Migrate Engine</DialogTitle>
              <DialogDescription>
                Move <strong>{engine.name}</strong> and all its apps to a new
                cloud provider instantly.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Zero-downtime badge */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-status-running/8 border border-status-running/20">
                <Shield className="w-4 h-4 text-status-running flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-status-running block">
                    0 seconds downtime — as announced in DFINITY Mission 70
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    Seamless multi-cloud migration. Your engine stays live
                    throughout.
                  </span>
                </div>
              </div>

              {/* Cost estimate table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-secondary/40 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Cost Estimate
                </div>
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold font-mono ${currentConfig.textClass}`}
                      >
                        {engine.provider}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Current
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold tabular-nums">
                      ${currentCost}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {targetProvider && targetConfig ? (
                        <span
                          className={`text-xs font-bold font-mono ${targetConfig.textClass}`}
                        >
                          {targetProvider}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Select target
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Target
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold tabular-nums text-muted-foreground">
                      {targetCost !== null ? `$${targetCost}/mo` : "—"}
                    </span>
                  </div>
                  {savings !== null && (
                    <div className="flex items-center justify-between px-3 py-2.5 bg-secondary/20">
                      <div className="flex items-center gap-2">
                        {savings >= 0 ? (
                          <TrendingDown className="w-3.5 h-3.5 text-status-running" />
                        ) : (
                          <TrendingUp className="w-3.5 h-3.5 text-destructive" />
                        )}
                        <span className="text-xs font-medium">
                          {savings >= 0 ? "Estimated savings" : "Cost increase"}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-mono font-bold tabular-nums ${
                          savings >= 0
                            ? "text-status-running"
                            : "text-destructive"
                        }`}
                      >
                        {savings >= 0
                          ? `$${savings}/mo`
                          : `+$${Math.abs(savings)}/mo`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Target provider selector */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  Migrate To
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableProviders.map((p) => {
                    const config = getProviderConfig(p);
                    const selected = targetProvider === p;
                    const cost = PROVIDER_MONTHLY_COSTS[p] ?? 0;
                    const diff = currentCost - cost;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setTargetProvider(p)}
                        className={`
                          flex flex-col items-start gap-1 p-3 rounded-md border text-sm font-semibold
                          transition-all duration-150 text-left
                          ${
                            selected
                              ? `${config.bgClass} border-current`
                              : "border-border hover:border-border/80 hover:bg-secondary/50"
                          }
                          ${config.textClass}
                        `}
                        style={
                          selected
                            ? { borderColor: `${config.color}60` }
                            : undefined
                        }
                      >
                        <span className="font-mono font-bold">
                          {config.label}
                        </span>
                        <span className="text-xs font-normal font-mono text-muted-foreground">
                          ${cost}/mo
                        </span>
                        {diff > 0 && (
                          <span className="text-xs font-normal text-status-running">
                            save ${diff}/mo
                          </span>
                        )}
                        {diff < 0 && (
                          <span className="text-xs font-normal text-destructive">
                            +${Math.abs(diff)}/mo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items to migrate */}
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  What will be migrated
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ITEMS_TO_MIGRATE.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <ChevronRight className="w-3 h-3 text-primary/60 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2"
                  disabled={!targetProvider}
                  onClick={handleMigrate}
                >
                  <ArrowRight className="w-4 h-4" />
                  Migrate Now
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "migrating" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Migrating...</DialogTitle>
              <DialogDescription>
                Transferring engine state and all apps to{" "}
                <strong>{targetProvider}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {/* Provider labels */}
              <div className="flex items-center justify-center gap-4 text-sm font-semibold">
                <span className={currentConfig.textClass}>
                  {engine.provider}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground animate-pulse" />
                {targetConfig && (
                  <span className={targetConfig.textClass}>
                    {targetProvider}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground animate-pulse">
                    {MIGRATION_PHASES[phaseIndex]}
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {Math.round(Math.min(progress, 100))}%
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
              </div>

              {/* Phase indicators */}
              <div className="grid grid-cols-4 gap-1">
                {MIGRATION_PHASES.map((phase, i) => (
                  <div
                    key={phase}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= phaseIndex ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-status-running" />
                <span>0 seconds downtime — engine stays live</span>
              </div>
            </div>
          </>
        )}

        {step === "complete" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-14 h-14 rounded-full bg-status-running/10 border border-status-running/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-status-running" />
            </div>
            <div className="text-center space-y-1">
              <div className="font-display font-semibold text-lg">
                Migration Complete
              </div>
              <div className="text-sm text-muted-foreground">
                {engine.name} is now running on {targetProvider}
              </div>
              {migrationRecord && (
                <div className="mt-2">
                  {migrationRecord.savedPerMonth > 0 ? (
                    <Badge
                      variant="outline"
                      className="text-status-running border-status-running/30 bg-status-running/10 font-mono"
                    >
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Saving ${migrationRecord.savedPerMonth}/month
                    </Badge>
                  ) : migrationRecord.savedPerMonth < 0 ? (
                    <Badge
                      variant="outline"
                      className="text-amber-500 border-amber-500/30 bg-amber-500/10 font-mono"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Cost difference: +$
                      {Math.abs(migrationRecord.savedPerMonth)}/month
                    </Badge>
                  ) : null}
                </div>
              )}
            </div>
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
