import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  DollarSign,
  HardDrive,
  Info,
  Loader2,
  MemoryStick,
  Server,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import {
  useCreateEngine,
  useGetMySubscription,
  useGetUsageSummary,
} from "../hooks/useQueries";
import { calcCostPerHour, getProviderConfig } from "../lib/providerUtils";

interface NewEngineModalProps {
  open: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
  isDemoMode?: boolean;
  onEngineCreated?: (engine: Engine) => void;
}

const providers = [
  { value: "AWS", label: "Amazon Web Services" },
  { value: "GCP", label: "Google Cloud Platform" },
  { value: "Azure", label: "Microsoft Azure" },
];

const PROVISIONING_STAGES = [
  "Allocating compute resources...",
  "Configuring network topology...",
  "Assigning IP addresses...",
  "Engine ready — bringing online...",
];

type ProvisionStep = "form" | "provisioning" | "complete";

export function NewEngineModal({
  open,
  onClose,
  onOpenPricing,
  isDemoMode,
  onEngineCreated,
}: NewEngineModalProps) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("AWS");
  const [cpu, setCpu] = useState(4);
  const [ram, setRam] = useState(16);
  const [storage, setStorage] = useState(100);
  const [provisionStep, setProvisionStep] = useState<ProvisionStep>("form");
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingEngineRef = useRef<Engine | null>(null);

  const { mutateAsync: createEngine, isPending } = useCreateEngine();
  const { data: subscription = "free" } = useGetMySubscription();
  const { data: usage } = useGetUsageSummary();

  const estimatedCost = calcCostPerHour(cpu, ram, storage);
  const enginesCount = Number(usage?.enginesCount ?? 0);
  const atEngineLimit = subscription === "free" && enginesCount >= 1;

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function clearProvisionInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function handleProvision() {
    if (!name.trim()) {
      toast.error("Please enter an engine name");
      return;
    }
    if (atEngineLimit && !isDemoMode) {
      toast.error(
        "Engine limit reached. Upgrade to Pro for unlimited engines.",
      );
      return;
    }

    if (isDemoMode) {
      // Build the fake engine
      const now = BigInt(Date.now()) * 1_000_000n;
      const fakeId = BigInt(Date.now());
      const fakeEngine: Engine = {
        id: fakeId,
        name: name.trim(),
        provider,
        status: "running",
        cpu: BigInt(cpu),
        ram: BigInt(ram),
        storage: BigInt(storage),
        costPerHour: estimatedCost,
        resilienceScore: 78n,
        ownerId: { _arr: new Uint8Array(29), _isPrincipal: true } as any,
        createdAt: now,
      };
      pendingEngineRef.current = fakeEngine;

      // Start provisioning animation
      setProvisionStep("provisioning");
      setProvisionProgress(0);
      setStageIndex(0);

      // ~6s total: update every 60ms (~100 ticks)
      let currentProgress = 0;
      let currentStage = 0;
      intervalRef.current = setInterval(() => {
        currentProgress += 1;
        setProvisionProgress(Math.min(currentProgress, 99));

        // Advance stage every 25 ticks
        const newStage = Math.min(
          Math.floor(currentProgress / 25),
          PROVISIONING_STAGES.length - 1,
        );
        if (newStage !== currentStage) {
          currentStage = newStage;
          setStageIndex(newStage);
        }

        if (currentProgress >= 100) {
          clearProvisionInterval();
          setProvisionProgress(100);
          setStageIndex(PROVISIONING_STAGES.length - 1);
          setTimeout(() => setProvisionStep("complete"), 300);
        }
      }, 60);

      return;
    }

    try {
      await createEngine({
        name: name.trim(),
        provider,
        cpu,
        ram,
        storage,
        costPerHour: estimatedCost,
      });
      toast.success(`${name} is being provisioned!`);
      handleClose();
    } catch {
      toast.error("Failed to provision engine. Please try again.");
    }
  }

  function handleComplete() {
    if (pendingEngineRef.current && onEngineCreated) {
      onEngineCreated(pendingEngineRef.current);
    }
    toast.success(`${pendingEngineRef.current?.name ?? "Engine"} is online!`);
    handleClose();
  }

  function handleClose() {
    if (isPending || provisionStep === "provisioning") return;
    clearProvisionInterval();
    setName("");
    setProvider("AWS");
    setCpu(4);
    setRam(16);
    setStorage(100);
    setProvisionStep("form");
    setProvisionProgress(0);
    setStageIndex(0);
    pendingEngineRef.current = null;
    onClose();
  }

  const config = getProviderConfig(provider);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {/* === FORM STEP === */}
        {provisionStep === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">
                New Cloud Engine
              </DialogTitle>
              <DialogDescription>
                Configure and provision a demand-driven compute engine. Switch
                providers anytime — no lock-in, no contracts.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-1">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="engine-name" className="text-xs">
                  Engine Name
                </Label>
                <Input
                  id="engine-name"
                  placeholder="e.g. production-api, dev-sandbox"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 font-mono text-sm"
                  autoComplete="off"
                  data-ocid="engine.input"
                />
              </div>

              {/* Provider */}
              <div className="space-y-1.5">
                <Label className="text-xs">Cloud Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="h-9" data-ocid="engine.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => {
                      const cfg = getProviderConfig(p.value);
                      return (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold font-mono ${cfg.textClass}`}
                            >
                              {p.value}
                            </span>
                            <span className="text-muted-foreground">
                              {p.label}
                            </span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className={`text-xs ${config.textClass}`}>
                  Provider: {config.label}
                </p>
              </div>

              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    CPU Cores
                  </Label>
                  <span className="text-xs font-mono font-bold">
                    {cpu} cores
                  </span>
                </div>
                <Slider
                  min={1}
                  max={64}
                  step={1}
                  value={[cpu]}
                  onValueChange={([v]) => setCpu(v)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>64</span>
                </div>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1.5">
                    <MemoryStick className="w-3.5 h-3.5" />
                    RAM
                  </Label>
                  <span className="text-xs font-mono font-bold">{ram} GB</span>
                </div>
                <Slider
                  min={1}
                  max={256}
                  step={1}
                  value={[ram]}
                  onValueChange={([v]) => setRam(v)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 GB</span>
                  <span>256 GB</span>
                </div>
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" />
                    Storage
                  </Label>
                  <span className="text-xs font-mono font-bold">
                    {storage} GB
                  </span>
                </div>
                <Slider
                  min={10}
                  max={2000}
                  step={10}
                  value={[storage]}
                  onValueChange={([v]) => setStorage(v)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 GB</span>
                  <span>2 TB</span>
                </div>
              </div>

              {/* Cost preview */}
              <div className="rounded-md bg-secondary/50 border border-border px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5" />
                  Estimated cost
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-foreground">
                    ${estimatedCost.toFixed(3)}/hr
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(estimatedCost * 720).toFixed(2)}/mo
                  </div>
                </div>
              </div>

              {/* No lock-in tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-xs text-primary cursor-help">
                    <Info className="w-3.5 h-3.5" />
                    <span>No vendor lock-in — migrate anytime</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-64">
                  <p>
                    ICP Mission 70 powers seamless multi-cloud migration. Your
                    engine can move across AWS, GCP, and Azure instantly — you
                    own your infrastructure.
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Free tier limit warning */}
              {atEngineLimit && !isDemoMode && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)]">
                  <AlertTriangle className="w-4 h-4 text-[oklch(0.72_0.18_55)] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-[oklch(0.82_0.18_55)]">
                      You've reached the Free tier limit (1 engine). Upgrade to
                      Pro to create unlimited engines.
                    </p>
                    {onOpenPricing && (
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onOpenPricing();
                        }}
                        className="text-xs text-[oklch(0.72_0.18_55)] underline mt-1 hover:no-underline"
                      >
                        Upgrade Now →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                data-ocid="engine.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProvision}
                disabled={isPending || (atEngineLimit && !isDemoMode)}
                className="gap-2"
                data-ocid="engine.submit_button"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "Provisioning..." : "Provision Engine"}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* === PROVISIONING ANIMATION STEP (demo mode) === */}
        {provisionStep === "provisioning" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Server className="w-5 h-5 text-primary animate-pulse" />
                Provisioning Engine...
              </DialogTitle>
              <DialogDescription>
                Spinning up <strong>{name}</strong> on {provider}. This takes a
                few seconds.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Pulsing status indicator */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Server className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-ping" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground animate-pulse font-mono">
                    {PROVISIONING_STAGES[stageIndex]}
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {Math.round(Math.min(provisionProgress, 100))}%
                  </span>
                </div>
                <Progress
                  value={Math.min(provisionProgress, 100)}
                  className="h-2"
                />
              </div>

              {/* Stage dots */}
              <div className="grid grid-cols-4 gap-1.5">
                {PROVISIONING_STAGES.map((stage, i) => (
                  <div
                    key={stage}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i <= stageIndex ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>

              {/* Stage labels */}
              <div className="grid grid-cols-2 gap-2">
                {PROVISIONING_STAGES.map((stage, i) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${
                      i < stageIndex
                        ? "text-primary"
                        : i === stageIndex
                          ? "text-foreground font-medium"
                          : "text-muted-foreground/40"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
                        i < stageIndex
                          ? "bg-primary"
                          : i === stageIndex
                            ? "bg-primary animate-pulse"
                            : "bg-muted-foreground/20"
                      }`}
                    />
                    {i === 0 && "Allocating compute"}
                    {i === 1 && "Network topology"}
                    {i === 2 && "Assigning IPs"}
                    {i === 3 && "Bringing online"}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 text-primary/60" />
                <span>ICP Mission 70 — demand-driven compute allocation</span>
              </div>
            </div>
          </>
        )}

        {/* === COMPLETE STEP (demo mode) === */}
        {provisionStep === "complete" && (
          <div className="flex flex-col items-center gap-5 py-8">
            <div className="w-16 h-16 rounded-full bg-status-running/10 border border-status-running/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-status-running" />
            </div>
            <div className="text-center space-y-1.5">
              <div className="font-display font-semibold text-xl">
                Engine Online
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>{name}</strong> is now running on {provider}
              </div>
              <div className="text-xs text-muted-foreground/70 font-mono mt-2">
                {cpu} CPU · {ram} GB RAM · {storage} GB · $
                {estimatedCost.toFixed(3)}/hr
              </div>
            </div>
            <Button
              onClick={handleComplete}
              className="w-full gap-2"
              data-ocid="engine.confirm_button"
            >
              <CheckCircle2 className="w-4 h-4" />
              View Engine
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
