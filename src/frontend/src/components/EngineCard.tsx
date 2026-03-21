import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRightLeft,
  Cpu,
  HardDrive,
  Loader2,
  MemoryStick,
  Play,
  RotateCw,
  Scaling,
  Square,
  Terminal,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import {
  formatCostPerHour,
  formatCostPerMonth,
  getProviderConfig,
  getStatusConfig,
} from "../lib/providerUtils";
import { MigrateModal } from "./MigrateModal";
import { ResilienceScoreBadge } from "./ResilienceScoreBadge";

interface EngineCardProps {
  engine: Engine;
  onDelete: (id: bigint) => void;
  onDeployShortcut: (engine: Engine) => void;
  isDeleting?: boolean;
  index?: number;
  isDemoMode?: boolean;
}

const SCALE_TIERS = [
  { name: "Small", cpu: 2, ram: 4, storage: 50 },
  { name: "Medium", cpu: 4, ram: 8, storage: 100 },
  { name: "Large", cpu: 8, ram: 16, storage: 200 },
  { name: "XL", cpu: 16, ram: 32, storage: 500 },
] as const;

function ResilienceBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-status-running"
      : score >= 50
        ? "bg-status-provisioning"
        : "bg-destructive";
  const textColor =
    score >= 80
      ? "text-status-running"
      : score >= 50
        ? "text-status-provisioning"
        : "text-destructive";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Resilience</span>
        <span
          className={`text-xs font-mono font-semibold tabular-nums ${textColor}`}
        >
          {score}%
        </span>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function EngineCard({
  engine,
  onDelete,
  onDeployShortcut,
  isDeleting,
  index = 0,
  isDemoMode,
}: EngineCardProps) {
  const [migrateOpen, setMigrateOpen] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<string | null>(null);
  const [simulatedSpecs, setSimulatedSpecs] = useState<{
    cpu: number;
    ram: number;
    storage: number;
  } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<
    "stop" | "start" | "restart" | "scale" | null
  >(null);
  const [scaleOpen, setScaleOpen] = useState(false);

  const provider = getProviderConfig(engine.provider);
  const resilienceScore = Number(engine.resilienceScore);
  const cpu = simulatedSpecs?.cpu ?? Number(engine.cpu);
  const ram = simulatedSpecs?.ram ?? Number(engine.ram);
  const storage = simulatedSpecs?.storage ?? Number(engine.storage);

  const displayStatus = simulatedStatus ?? engine.status;
  const statusBase = getStatusConfig(displayStatus);

  const isTransitional = ["stopping", "starting", "scaling"].includes(
    displayStatus,
  );
  const statusLabel = isTransitional
    ? displayStatus === "stopping"
      ? "Stopping..."
      : displayStatus === "starting"
        ? "Starting..."
        : "Scaling..."
    : statusBase.label;
  const statusBadgeClass = isTransitional
    ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
    : statusBase.badgeClass;
  const statusDotClass = isTransitional ? "bg-yellow-400" : statusBase.dotClass;

  function handleStopStart() {
    if (!isDemoMode) {
      toast.info(
        "This action will be available once connected to a live engine.",
      );
      return;
    }
    const current = displayStatus;
    if (current === "running" || current === "stopping") {
      setActionInProgress("stop");
      setSimulatedStatus("stopping");
      setTimeout(() => {
        setSimulatedStatus("stopped");
        setActionInProgress(null);
        toast.success("Engine stopped");
      }, 1200);
    } else if (current === "stopped" || current === "starting") {
      setActionInProgress("start");
      setSimulatedStatus("starting");
      setTimeout(() => {
        setSimulatedStatus("running");
        setActionInProgress(null);
        toast.success("Engine started");
      }, 1500);
    }
  }

  function handleRestart() {
    if (!isDemoMode) {
      toast.info(
        "This action will be available once connected to a live engine.",
      );
      return;
    }
    setActionInProgress("restart");
    setSimulatedStatus("stopping");
    setTimeout(() => {
      setSimulatedStatus("starting");
      setTimeout(() => {
        setSimulatedStatus("running");
        setActionInProgress(null);
        toast.success("Engine restarted successfully");
      }, 1200);
    }, 800);
  }

  function handleScaleTier(tier: (typeof SCALE_TIERS)[number]) {
    if (!isDemoMode) {
      toast.info(
        "This action will be available once connected to a live engine.",
      );
      setScaleOpen(false);
      return;
    }
    setScaleOpen(false);
    setActionInProgress("scale");
    setSimulatedStatus("scaling");
    setTimeout(() => {
      setSimulatedStatus(null);
      setSimulatedSpecs({
        cpu: tier.cpu,
        ram: tier.ram,
        storage: tier.storage,
      });
      setActionInProgress(null);
      toast.success(`Engine scaled to ${tier.name} tier`);
    }, 1800);
  }

  const isStoppedDisplay = displayStatus === "stopped";
  const isRunningDisplay =
    displayStatus === "running" || displayStatus === "stopping";

  return (
    <>
      <motion.div
        className={`relative flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-200 cursor-default ${provider.cardClass}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        layout
        data-tour-id={`engine-card-${index}`}
      >
        {/* Provider accent bar */}
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: provider.color }}
        />

        <div className="p-4 flex flex-col gap-3.5 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full font-mono ${provider.bgClass} ${provider.textClass}`}
                  style={{ border: `1px solid ${provider.color}35` }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: provider.color }}
                  />
                  {provider.label}
                </span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium cursor-default ${statusBadgeClass}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotClass} ${isTransitional ? "animate-pulse" : ""}`}
                      />
                      {statusLabel}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      Engine is currently{" "}
                      {displayStatus === "migrating"
                        ? "being migrated to another provider"
                        : displayStatus}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <ResilienceScoreBadge score={engine.resilienceScore} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Resilience score: how fault-tolerant this engine is</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <h3 className="font-display font-semibold text-base text-foreground truncate leading-tight">
                {engine.name}
              </h3>
              <p className="text-xs font-mono text-muted-foreground/60 mt-0.5">
                engine/{engine.id.toString()}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-sm font-mono font-bold text-foreground tabular-nums">
                {formatCostPerHour(engine.costPerHour)}
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {formatCostPerMonth(engine.costPerHour)}/mo
              </div>
            </div>
          </div>

          {/* Specs chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: Cpu, label: `${cpu} CPU` },
              { icon: MemoryStick, label: `${ram} GB RAM` },
              { icon: HardDrive, label: `${storage} GB` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-secondary/60 text-muted-foreground"
              >
                <Icon className="w-3 h-3" style={{ color: provider.color }} />
                <span className="font-mono">{label}</span>
              </div>
            ))}
          </div>

          {/* Resilience */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <ResilienceBar score={resilienceScore} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-52">
              <p>
                How fault-tolerant your engine is across regions and providers.
                Higher is better.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Actions */}
          <div className="flex items-center gap-1.5 pt-0.5 border-t border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs gap-1.5 flex-1"
                  onClick={() => setMigrateOpen(true)}
                  disabled={
                    displayStatus === "migrating" || actionInProgress !== null
                  }
                  style={
                    displayStatus !== "migrating" && actionInProgress === null
                      ? {
                          borderColor: `${provider.color}30`,
                          color: provider.color,
                        }
                      : undefined
                  }
                  data-ocid="engine.primary_button"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Migrate
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-64">
                <p>
                  Seamless multi-cloud migration: move this engine and all
                  deployed apps to another provider with 0 seconds downtime.
                  Powered by ICP Mission 70.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2.5 text-xs gap-1.5"
                  onClick={() => onDeployShortcut(engine)}
                  data-tour-id={`ai-deploy-btn-${index}`}
                >
                  <Terminal className="w-3 h-3" />
                  Deploy
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Open AI chat to deploy an app to this engine</p>
              </TooltipContent>
            </Tooltip>

            {/* Stop / Start */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  disabled={actionInProgress !== null}
                  onClick={handleStopStart}
                  data-ocid="engine.toggle"
                >
                  {actionInProgress === "stop" ||
                  actionInProgress === "start" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isRunningDisplay ? (
                    <Square className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isRunningDisplay ? "Stop this engine" : "Start this engine"}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Restart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  disabled={actionInProgress !== null || isStoppedDisplay}
                  onClick={handleRestart}
                  data-ocid="engine.secondary_button"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${
                      actionInProgress === "restart" ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Restart this engine</p>
              </TooltipContent>
            </Tooltip>

            {/* Scale */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  disabled={actionInProgress !== null}
                  onClick={() => setScaleOpen(true)}
                  data-ocid="engine.edit_button"
                >
                  {actionInProgress === "scale" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Scaling className="w-3.5 h-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Scale engine resources</p>
              </TooltipContent>
            </Tooltip>

            {/* Delete */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      disabled={isDeleting}
                      data-ocid="engine.delete_button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Delete this engine</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {engine.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the engine and all deployed
                    apps. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="engine.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(engine.id)}
                    data-ocid="engine.confirm_button"
                  >
                    Delete Engine
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>

      <MigrateModal
        engine={engine}
        open={migrateOpen}
        onClose={() => setMigrateOpen(false)}
        isDemoMode={isDemoMode}
      />

      {/* Scale Dialog */}
      <Dialog open={scaleOpen} onOpenChange={setScaleOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Scale Engine Resources</DialogTitle>
            <DialogDescription>
              Choose a new resource tier for {engine.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {SCALE_TIERS.map((tier) => {
              const isCurrent =
                tier.cpu === cpu &&
                tier.ram === ram &&
                tier.storage === storage;
              return (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => handleScaleTier(tier)}
                  className={`flex flex-col gap-1.5 p-3 rounded-lg border text-left transition-all duration-150 hover:scale-[1.02] focus:outline-none ${
                    isCurrent
                      ? "border-2 bg-secondary/50"
                      : "border-border hover:border-opacity-70 hover:bg-secondary/30"
                  }`}
                  style={{
                    borderColor: isCurrent ? provider.color : undefined,
                  }}
                  data-ocid="engine.secondary_button"
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: provider.color }}
                  >
                    {tier.name}
                    {isCurrent && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        (current)
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-muted-foreground font-mono">
                      {tier.cpu} CPU
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {tier.ram} GB RAM
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {tier.storage} GB Storage
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
