import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, Search, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import { useDeleteEngine, useListEngines } from "../hooks/useQueries";
import { queryKeys } from "../hooks/useQueries";
import { DistributeModal } from "./DistributeModal";
import { EngineCard } from "./EngineCard";
import { NewEngineModal } from "./NewEngineModal";

interface EnginesPageProps {
  onNavigateToChat: (engine?: Engine) => void;
  isDemoMode?: boolean;
  onEngineCreated?: (engine: Engine) => void;
}

export function EnginesPage({
  onNavigateToChat,
  isDemoMode,
  onEngineCreated,
}: EnginesPageProps) {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { data: engines, isLoading, isFetching } = useListEngines();
  const { mutate: deleteEngine, isPending: isDeleting } = useDeleteEngine();
  const qc = useQueryClient();

  const filtered = engines?.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.provider.toLowerCase().includes(search.toLowerCase());
    const matchProvider =
      filterProvider === "all" || e.provider === filterProvider;
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchProvider && matchStatus;
  });

  function handleDelete(id: bigint) {
    deleteEngine(id, {
      onSuccess: () => toast.success("Engine deleted"),
      onError: () => toast.error("Failed to delete engine"),
    });
  }

  function handleRefresh() {
    void qc.invalidateQueries({ queryKey: queryKeys.engines });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search engines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>

        <Select value={filterProvider} onValueChange={setFilterProvider}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="AWS">AWS</SelectItem>
            <SelectItem value="GCP">GCP</SelectItem>
            <SelectItem value="Azure">Azure</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="provisioning">Provisioning</SelectItem>
            <SelectItem value="migrating">Migrating</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 text-xs"
          onClick={() => setDistributeOpen(true)}
          disabled={(engines?.length ?? 0) === 0}
        >
          <Shuffle className="w-3.5 h-3.5" />
          Distribute
        </Button>

        <Button
          size="sm"
          className="h-8 gap-2 text-xs ml-auto"
          onClick={() => setNewModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          New Engine
        </Button>
      </div>

      {/* Stats bar */}
      {!isLoading && engines && (
        <motion.div
          className="flex flex-wrap gap-3 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>
            <span className="font-mono font-semibold text-foreground">
              {engines.length}
            </span>{" "}
            total
          </span>
          <span>
            <span className="font-mono font-semibold text-status-running">
              {engines.filter((e) => e.status === "running").length}
            </span>{" "}
            running
          </span>
          <span>
            <span className="font-mono font-semibold text-status-provisioning">
              {engines.filter((e) => e.status === "provisioning").length}
            </span>{" "}
            provisioning
          </span>
          <span>
            <span className="font-mono font-semibold text-status-migrating">
              {engines.filter((e) => e.status === "migrating").length}
            </span>{" "}
            migrating
          </span>
          {isFetching && (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Refreshing...
            </span>
          )}
        </motion.div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"] as const).map((id) => (
            <Skeleton key={id} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : (filtered?.length ?? 0) === 0 ? (
        <div className="console-panel flex flex-col items-center justify-center py-16 text-center">
          <div className="text-sm text-muted-foreground mb-3">
            {search || filterProvider !== "all" || filterStatus !== "all"
              ? "No engines match your filters"
              : "No engines yet"}
          </div>
          {!search && filterProvider === "all" && filterStatus === "all" && (
            <Button
              size="sm"
              onClick={() => setNewModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Create your first engine
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map((engine, i) => (
            <EngineCard
              key={engine.id.toString()}
              engine={engine}
              onDelete={handleDelete}
              onDeployShortcut={onNavigateToChat}
              isDeleting={isDeleting}
              index={i}
            />
          ))}
        </div>
      )}

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
