import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  Megaphone,
  Plus,
  ServerOff,
  Shuffle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ContentSettings, Engine } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useDeleteEngine, useListEngines } from "../hooks/useQueries";
import { CostAlerts } from "./CostAlerts";
import { DistributeModal } from "./DistributeModal";
import { EngineCard } from "./EngineCard";
import { LiveCostDashboard } from "./LiveCostDashboard";
import { MigrationHistoryPanel } from "./MigrationHistoryPanel";
import { NewEngineModal } from "./NewEngineModal";
import { SummaryCards } from "./SummaryCards";

interface DashboardPageProps {
  isDemoMode: boolean;
  onLoadDemo: () => void;
  isLoadingDemo: boolean;
  onNavigateToChat: (engine?: Engine) => void;
  onClearDemo: () => void;
  onEngineCreated?: (engine: Engine) => void;
}

function EngineGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {(["dsk1", "dsk2", "dsk3"] as const).map((id) => (
        <Skeleton key={id} className="h-56 rounded-lg" />
      ))}
    </div>
  );
}

function EmptyEnginesState({
  onNew,
  onDemo,
  onClearDemo,
  isDemoMode,
}: {
  onNew: () => void;
  onDemo: () => void;
  onClearDemo: () => void;
  isDemoMode: boolean;
}) {
  return (
    <motion.div
      className="console-panel flex flex-col items-center justify-center py-16 px-8 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      data-ocid="engines.empty_state"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <ServerOff className="w-7 h-7 text-primary/60" />
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">
        No engines yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        Provision your first cloud engine to get started. Engines run on ICP and
        can migrate across AWS, GCP, and Azure instantly.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onNew}
          className="gap-2"
          data-ocid="engines.primary_button"
        >
          <Plus className="w-4 h-4" />
          New Engine
        </Button>
        {/* Demo Data toggle row */}
        <div className="flex items-center justify-between gap-6 bg-card border border-border rounded-lg px-4 py-3 w-full max-w-xs">
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-foreground">
              Demo Data
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Load simulated engines to explore
            </span>
          </div>
          <Switch
            checked={isDemoMode}
            onCheckedChange={(checked) => {
              if (checked) onDemo();
              else onClearDemo();
            }}
            data-ocid="dashboard.demo.toggle"
            aria-label="Toggle demo data"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardPage({
  isDemoMode,
  onLoadDemo,
  isLoadingDemo: _isLoadingDemo,
  onNavigateToChat,
  onClearDemo,
  onEngineCreated,
}: DashboardPageProps) {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { data: engines, isLoading } = useListEngines();
  const { mutate: deleteEngine, isPending: isDeleting } = useDeleteEngine();
  const { actor } = useActor();

  const { data: publicSettings } = useQuery<ContentSettings>({
    queryKey: ["publicContentSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          demoModeEnabled: true,
          announcementBanner: "",
          affiliateEnabled: true,
        };
      return actor.getPublicContentSettings();
    },
    enabled: !!actor,
    staleTime: 60_000,
  });

  const announcementBanner = publicSettings?.announcementBanner ?? "";

  function handleDelete(id: bigint) {
    deleteEngine(id, {
      onSuccess: () => toast.success("Engine deleted"),
      onError: () => toast.error("Failed to delete engine"),
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Announcement banner */}
      <AnimatePresence>
        {announcementBanner && !bannerDismissed && (
          <motion.div
            key="announcement-banner"
            className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            data-ocid="dashboard.announcement.panel"
          >
            <Megaphone className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-amber-400 flex-1 leading-relaxed min-w-0 break-words">
              {announcementBanner}
            </span>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="text-amber-400/60 hover:text-amber-400 transition-colors flex-shrink-0"
              aria-label="Dismiss announcement"
              data-ocid="dashboard.announcement.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo mode banner */}
      {isDemoMode && (
        <motion.div
          className="flex items-center gap-2 flex-wrap px-4 py-2.5 rounded-lg bg-status-provisioning/10 border border-status-provisioning/20 text-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-status-provisioning animate-pulse flex-shrink-0" />
          <span className="text-status-provisioning font-medium min-w-0">
            Demo Mode
          </span>
          <span className="text-muted-foreground flex-1 hidden sm:inline">
            — This is simulated data. Changes won't persist between sessions.
          </span>
          <button
            type="button"
            onClick={onClearDemo}
            className="ml-auto flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-colors"
            data-ocid="dashboard.demo.toggle"
            aria-label="Exit demo mode"
          >
            Exit Demo
          </button>
        </motion.div>
      )}

      {/* Cost alerts */}
      <CostAlerts engines={engines ?? []} isDemoMode={isDemoMode} />

      {/* Summary cards */}
      <SummaryCards engines={engines} isLoading={isLoading} />

      {/* Engines section */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-lg tracking-tight">
              Cloud Engines
            </h2>
            {engines && (
              <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                {engines.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 text-xs"
                  onClick={() => setDistributeOpen(true)}
                  disabled={(engines?.length ?? 0) === 0}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Distribute Across Providers
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-60">
                <p>
                  Spread your engines evenly across AWS, GCP, and Azure for
                  maximum resilience and zero single-provider dependency.
                </p>
              </TooltipContent>
            </Tooltip>

            <Button
              size="sm"
              className="h-8 gap-2 text-xs"
              onClick={() => setNewModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              New Engine
            </Button>
          </div>
        </div>

        {isLoading ? (
          <EngineGridSkeleton />
        ) : !engines || engines.length === 0 ? (
          <EmptyEnginesState
            onNew={() => setNewModalOpen(true)}
            onDemo={onLoadDemo}
            onClearDemo={onClearDemo}
            isDemoMode={isDemoMode}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {engines.map((engine, i) => (
              <EngineCard
                key={engine.id.toString()}
                engine={engine}
                onDelete={handleDelete}
                onDeployShortcut={(e) => onNavigateToChat(e)}
                isDeleting={isDeleting}
                index={i}
                isDemoMode={isDemoMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Migration History */}
      <MigrationHistoryPanel />

      {/* Live Cost Dashboard */}
      <LiveCostDashboard />

      {/* Quick tips */}
      <div className="console-panel p-5">
        <div className="text-base font-display font-semibold tracking-tight mb-4">
          Why LockFree Engine?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              title: "No Vendor Lock-in",
              desc: "DFINITY Mission 70 guarantees zero vendor lock-in. Your engines, apps, and data can move across AWS, GCP, and Azure in seconds — no contracts, no exit fees.",
            },
            {
              title: "Instant Migration",
              desc: "Zero-downtime seamless migration: move your entire engine — apps, configs, databases — to another provider with 0 seconds of downtime. Announced in ICP Mission 70.",
            },
            {
              title: "ICP-Powered",
              desc: "Demand-driven compute on the Internet Computer Protocol. Pay only for what you use, scaled automatically — no minimum commitments, no idle costs.",
            },
            {
              title: "AI Deployment",
              desc: "Describe any app in plain English. The AI builds and deploys it as an ICP canister directly to your engine — live in seconds.",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="bg-secondary/30 rounded-md px-3 py-3 border border-border/40"
            >
              <div className="text-xs font-semibold text-foreground mb-1.5">
                {tip.title}
              </div>
              <div className="text-xs text-muted-foreground/80 leading-relaxed">
                {tip.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewEngineModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        isDemoMode={isDemoMode}
        onEngineCreated={onEngineCreated}
      />

      <DistributeModal
        open={distributeOpen}
        onClose={() => setDistributeOpen(false)}
        engines={engines ?? []}
      />
    </div>
  );
}
