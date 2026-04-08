import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  Megaphone,
  Play,
  Plus,
  Server,
  Shuffle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ContentSettings, Engine } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useDeleteEngine, useListEngines } from "../hooks/useQueries";
import { CostAlerts } from "./CostAlerts";
import { DEMO_TOUR_SEEN_KEY } from "./DemoTour";
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
  /** Called when the user clicks "Take the Tour" — handled at the app shell level */
  onTakeTour?: () => void;
}

function EngineGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {(["dsk1", "dsk2", "dsk3"] as const).map((id) => (
        <Skeleton key={id} className="h-56 rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyEnginesState({
  onNew,
  onDemo,
}: {
  onNew: () => void;
  onDemo: () => void;
  onClearDemo: () => void;
  isDemoMode: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="engines.empty_state"
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "oklch(var(--card) / 0.5)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 28px rgba(0,0,0,0.35)",
      }}
    >
      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500/60 via-cyan-400/80 to-emerald-500/60" />

      <div className="px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center gap-6">
        {/* Icon cluster */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(var(--primary) / 0.1)",
              border: "1px solid oklch(var(--primary) / 0.2)",
            }}
          >
            <Server
              className="w-6 h-6"
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
          <div className="w-2 h-2 rounded-full bg-cyan-400/40" />
          <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-foreground">
            No engines loaded — explore the demo
          </h3>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Load simulated cloud engines to explore all dashboard features
          </p>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onDemo}
          data-ocid="engines.primary_button"
          className="group relative flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all duration-200 hover:shadow-emerald-800/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="absolute inset-0 rounded-xl bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Play className="w-4 h-4 fill-white relative z-10" />
          <span className="relative z-10">Load Demo Engines</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground/50">or</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Secondary CTA */}
        <Button
          variant="outline"
          onClick={onNew}
          className="gap-2 border-border/60 hover:border-primary/40"
          data-ocid="engines.secondary_button"
        >
          <Plus className="w-4 h-4" />
          Provision New Engine
        </Button>
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
  onTakeTour,
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

  useEffect(() => {
    if (!isDemoMode) return;
    const seen = localStorage.getItem(DEMO_TOUR_SEEN_KEY);
    if (seen) return;
    const hasDemoEngines = (engines ?? []).some((e) =>
      e.name.toLowerCase().includes("demo"),
    );
    if (!hasDemoEngines) return;
    const t = setTimeout(() => {
      onTakeTour?.();
    }, 1200);
    return () => clearTimeout(t);
  }, [isDemoMode, engines, onTakeTour]);

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
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "oklch(0.72 0.17 80 / 0.08)",
              border: "1px solid oklch(0.72 0.17 80 / 0.2)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            data-ocid="dashboard.announcement.panel"
          >
            <Megaphone
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: "oklch(0.78 0.17 80)" }}
            />
            <span
              className="flex-1 leading-relaxed min-w-0 break-words"
              style={{ color: "oklch(0.78 0.17 80)" }}
            >
              {announcementBanner}
            </span>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="flex-shrink-0 transition-opacity opacity-50 hover:opacity-100"
              aria-label="Dismiss announcement"
              style={{ color: "oklch(0.78 0.17 80)" }}
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
          className="flex items-center gap-2 flex-wrap px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "oklch(var(--status-provisioning) / 0.08)",
            border: "1px solid oklch(var(--status-provisioning) / 0.2)",
            backdropFilter: "blur(8px)",
          }}
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
            onClick={() => onTakeTour?.()}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 hover:border-emerald-500/60 transition-colors"
            data-ocid="demo_tour.open_modal_button"
          >
            Take the Tour
          </button>
          <button
            type="button"
            onClick={onClearDemo}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-colors"
            data-ocid="dashboard.demo.toggle"
            aria-label="Exit demo mode"
            data-tour-id="exit-demo-btn"
          >
            Exit Demo
          </button>
        </motion.div>
      )}

      {/* Cost alerts */}
      <CostAlerts engines={engines ?? []} isDemoMode={isDemoMode} />

      {/* Summary cards */}
      <motion.div
        data-tour-id="summary-cards"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SummaryCards
          engines={engines}
          isLoading={isLoading}
          isDemoMode={isDemoMode}
        />
      </motion.div>

      {/* Engines section */}
      <div>
        <motion.div
          className="flex items-center justify-between mb-4 gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-lg tracking-tight">
              Cloud Engines
            </h2>
            {engines && (
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full text-muted-foreground"
                style={{
                  background: "oklch(var(--secondary) / 0.8)",
                  border: "1px solid oklch(var(--border))",
                }}
              >
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
              data-tour-id="new-engine-btn"
              data-ocid="engines.primary_button"
            >
              <Plus className="w-3.5 h-3.5" />
              New Engine
            </Button>
          </div>
        </motion.div>

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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <MigrationHistoryPanel />
      </motion.div>

      {/* Live Cost Dashboard */}
      <motion.div
        data-tour-id="live-cost-dashboard"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <LiveCostDashboard isDemoMode={isDemoMode} />
      </motion.div>

      {/* Why LockFreeEngine */}
      <motion.div
        className="rounded-2xl p-5"
        style={{
          background: "oklch(var(--card) / 0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-base font-display font-semibold tracking-tight mb-4">
          Why LockFreeEngine?
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
              className="rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-muted/20"
              style={{
                background: "oklch(var(--secondary) / 0.25)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="text-xs font-semibold text-foreground mb-1.5">
                {tip.title}
              </div>
              <div className="text-xs text-muted-foreground/70 leading-relaxed">
                {tip.desc}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

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
        isDemoMode={isDemoMode}
      />
    </div>
  );
}
