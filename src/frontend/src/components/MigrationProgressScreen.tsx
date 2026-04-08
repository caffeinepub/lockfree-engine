import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ScanResult } from "./LegacyAppScanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MigrationStep {
  label: string;
  description: string;
  durationMs: number;
  techDetail: string;
}

export interface MigrationProgressScreenProps {
  result: ScanResult;
  stackInput: string;
  onComplete: (result: ScanResult, stackInput: string) => void;
  onNewScan: () => void;
}

// ─── Migration step definitions ───────────────────────────────────────────────

const MIGRATION_STEPS: MigrationStep[] = [
  {
    label: "Parsing legacy stack",
    description: "Analysing components, dependencies, and runtime requirements",
    durationMs: 1200,
    techDetail: "Dependency graph traversal · runtime fingerprinting",
  },
  {
    label: "Mapping to ICP architecture",
    description:
      "Converting each component to its ICP equivalent — canisters, blob storage, Internet Identity",
    durationMs: 1800,
    techDetail: "Candid interface generation · canister boundary analysis",
  },
  {
    label: "Provisioning sovereign subnet",
    description:
      "Requesting NeoCloud EU node allocation via NNS governance proposal",
    durationMs: 2200,
    techDetail: "NNS subnet allocation · eu-neocloud-1a node assignment",
  },
  {
    label: "Deploying canisters via Caffeine",
    description:
      "Compiling Motoko, generating Candid interfaces, pushing to subnet",
    durationMs: 2000,
    techDetail: "Motoko compilation · Wasm bytecode deployment",
  },
  {
    label: "Migrating persistent state",
    description:
      "Transferring data using Snorkel's orthogonal persistence mapper",
    durationMs: 1600,
    techDetail: "Orthogonal persistence mapper · stable memory transfer",
  },
  {
    label: "Verification & health check",
    description:
      "Running end-to-end tests, confirming uptime, issuing deployment certificate",
    durationMs: 1400,
    techDetail: "Canister heartbeat · certification chain verified",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepRow({
  step,
  index,
  status,
  elapsed,
}: {
  step: MigrationStep;
  index: number;
  status: "pending" | "active" | "done";
  elapsed?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: status === "pending" ? 0.35 : 1,
        x: 0,
      }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={[
        "relative flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-300",
        status === "done"
          ? "bg-cyan-500/6 border-cyan-500/20 backdrop-blur-sm"
          : status === "active"
            ? "bg-card/60 border-cyan-500/35 backdrop-blur-sm shadow-[0_0_16px_oklch(0.82_0.22_195/0.12)]"
            : "bg-secondary/8 border-border/20",
      ].join(" ")}
    >
      {/* Active pulsing glow overlay */}
      {status === "active" && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-cyan-500/4 pointer-events-none"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Step icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
        {status === "done" ? (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_oklch(0.82_0.22_195/0.5)]" />
          </motion.div>
        ) : status === "active" ? (
          <Loader2 className="w-4.5 h-4.5 text-cyan-400 animate-spin" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-border/30" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-semibold ${
              status === "done"
                ? "text-cyan-200"
                : status === "active"
                  ? "text-foreground"
                  : "text-muted-foreground/60"
            }`}
          >
            {step.label}
          </span>
          {status === "done" && elapsed !== undefined && (
            <span className="text-[10px] text-cyan-500/50 font-mono ml-auto">
              {(elapsed / 1000).toFixed(1)}s
            </span>
          )}
          {status === "active" && (
            <span className="text-[10px] text-cyan-400/60 animate-pulse ml-auto font-mono">
              running…
            </span>
          )}
        </div>
        <p
          className={`text-[11px] mt-0.5 leading-relaxed font-mono ${
            status === "active"
              ? "text-cyan-300/60"
              : "text-muted-foreground/50"
          }`}
        >
          {status === "active" ? step.description : step.techDetail}
        </p>
      </div>
    </motion.div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-1.5 rounded-full bg-white/6 overflow-hidden backdrop-blur-sm">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          boxShadow: "0 0 8px oklch(0.82 0.22 195 / 0.5)",
        }}
      />
      {/* shimmer sweep */}
      <motion.div
        className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ left: ["-10%", "110%"] }}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

function SuccessScreen({
  result,
  stackInput,
  onComplete,
  onNewScan,
}: {
  result: ScanResult;
  stackInput: string;
  onComplete: (result: ScanResult, stackInput: string) => void;
  onNewScan: () => void;
}) {
  const isNeoCloud = /kubernetes|sui move|nats|ceph|tee bft/i.test(stackInput);
  const stackName = isNeoCloud
    ? "NeoCloud Sovereign"
    : result.isEnterpriseSovereign
      ? "Enterprise"
      : stackInput.trim()
        ? stackInput.split(/[\n,]/)[0].trim().slice(0, 36) || "Sovereign"
        : "Sovereign";

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 p-4"
    >
      {/* Headline */}
      <div className="text-center space-y-2 py-2">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/12 border border-emerald-500/30 mx-auto shadow-[0_0_24px_oklch(0.72_0.19_145/0.2)]"
        >
          <CheckCircle2 className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_oklch(0.72_0.19_145/0.6)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Migration Complete
          </h3>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            Your{" "}
            <span className="text-cyan-300 font-semibold">{stackName}</span>{" "}
            stack is live on sovereign ICP infrastructure
          </p>
        </motion.div>
      </div>

      {/* Component mapping summary */}
      {result.components.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25 }}
          className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm px-3 py-2.5"
        >
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide font-semibold mb-1.5">
            Component Migration Summary
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {result.components.slice(0, 4).map((c, i) => (
              <span
                key={`${c.original}-${i}`}
                className="flex items-center gap-1 text-[10px]"
              >
                <span className="text-foreground/70 font-mono">
                  {c.original.split(/[/,]/)[0].trim()}
                </span>
                <span className="text-muted-foreground/40">→</span>
                <span className="text-cyan-300 font-semibold">
                  {c.icpEquivalent.split(/[+(]/)[0].trim()}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Deployed engine card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.3 }}
        className="rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/6 to-emerald-500/2 backdrop-blur-sm p-4 space-y-3 shadow-[0_0_20px_oklch(0.72_0.19_145/0.08)]"
      >
        {/* Engine header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_oklch(0.72_0.19_145/0.2)]">
              <Shield className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <div
                className="text-sm font-semibold text-foreground leading-tight truncate max-w-[160px] tracking-tight"
                title={stackName}
              >
                {stackName}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-cyan-400/60" />
                <span className="text-[11px] text-muted-foreground/70">
                  NeoCloud · Romania · EU
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_4px_oklch(0.72_0.19_145/0.8)]" />
              Live
            </span>
          </div>
        </div>

        {/* Subnet / tech details */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-background/40 border border-white/6 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-muted-foreground/50 mb-0.5">Subnet ID</div>
            <div className="font-mono text-foreground/90">eu-neocloud-1a</div>
          </div>
          <div className="rounded-lg bg-background/40 border border-white/6 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-muted-foreground/50 mb-0.5">Components</div>
            <div className="font-mono text-foreground/90">
              {result.components.length} canisters
            </div>
          </div>
        </div>

        {/* Cost savings callout */}
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-3 py-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-cyan-200">
              {result.savingsPercent}% cost reduction
            </span>
            <span className="text-xs text-muted-foreground/60">
              {" "}
              vs hyperscalers
            </span>
          </div>
          <span className="text-[10px] text-cyan-500/50 font-mono">
            ~€{result.icpCostMin.toLocaleString()}/mo
          </span>
        </div>

        {/* Attribution badge */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/40 border border-white/8 backdrop-blur-sm text-[10px] text-muted-foreground/60">
            <Sparkles className="w-3 h-3 text-primary" />
            Powered by Caffeine Snorkel + LockFreeEngine
          </span>
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <Button
          className="w-full h-10 font-semibold text-sm gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-background border-0 shadow-[0_0_16px_oklch(0.82_0.22_195/0.3)] hover:shadow-[0_0_28px_oklch(0.82_0.22_195/0.5)] transition-all duration-300 rounded-xl"
          onClick={() => onComplete(result, stackInput)}
          data-ocid="migration.open_dashboard_btn"
        >
          <ExternalLink className="w-4 h-4" />
          Your engine is live — open the Dashboard to see it running
        </Button>
        <Button
          variant="outline"
          className="w-full h-9 text-sm gap-2 border-white/10 bg-white/3 hover:bg-white/6 rounded-xl"
          onClick={onNewScan}
          data-ocid="migration.new_scan_btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New Scan
        </Button>
      </motion.div>

      <p className="text-center text-[11px] text-muted-foreground/35 pb-1">
        All migration is simulated · Powered by Caffeine Snorkel (coming soon) ·
        LockFreeEngine v3.0
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MigrationProgressScreen({
  result,
  stackInput,
  onComplete,
  onNewScan,
}: MigrationProgressScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepElapsed, setStepElapsed] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const hasStarted = useRef(false);

  const totalDuration = MIGRATION_STEPS.reduce(
    (sum, s) => sum + s.durationMs,
    0,
  );
  const elapsedSoFar = completedSteps.reduce(
    (sum, idx) => sum + MIGRATION_STEPS[idx].durationMs,
    0,
  );
  const progress = isComplete
    ? 100
    : Math.round((elapsedSoFar / totalDuration) * 100);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    (async () => {
      for (let i = 0; i < MIGRATION_STEPS.length; i++) {
        setCurrentStepIdx(i);
        const start = Date.now();
        await new Promise<void>((r) =>
          setTimeout(r, MIGRATION_STEPS[i].durationMs),
        );
        const elapsed = Date.now() - start;
        setStepElapsed((prev) => ({ ...prev, [i]: elapsed }));
        setCompletedSteps((prev) => [...prev, i]);
      }
      await new Promise<void>((r) => setTimeout(r, 300));
      setIsComplete(true);
    })();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4 p-4"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/25 shadow-[0_0_20px_oklch(0.82_0.22_195/0.15)]">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground tracking-tight">
                  Caffeine Snorkel Migration
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  Migrating your workload to sovereign ICP infrastructure
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                <span>
                  Step {Math.min(currentStepIdx + 1, MIGRATION_STEPS.length)} of{" "}
                  {MIGRATION_STEPS.length}
                </span>
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              {MIGRATION_STEPS.map((step, idx) => {
                const status = completedSteps.includes(idx)
                  ? "done"
                  : currentStepIdx === idx
                    ? "active"
                    : "pending";
                return (
                  <StepRow
                    key={step.label}
                    step={step}
                    index={idx}
                    status={status}
                    elapsed={stepElapsed[idx]}
                  />
                );
              })}
            </div>

            {/* Subnet target */}
            <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-card/30 backdrop-blur-sm px-3 py-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400/60 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground/70">
                Destination:{" "}
                <span className="text-foreground/80 font-mono">
                  eu-neocloud-1a
                </span>{" "}
                · NeoCloud Romania EU · NNS-governed
              </span>
            </div>
          </motion.div>
        ) : (
          <SuccessScreen
            result={result}
            stackInput={stackInput}
            onComplete={onComplete}
            onNewScan={onNewScan}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
