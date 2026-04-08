import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import type { MigrationRecord } from "../backend.d.ts";
import { useGetMigrationHistory } from "../hooks/useQueries";
import { getProviderConfig } from "../lib/providerUtils";

function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MigrationRow({
  record,
  index,
}: { record: MigrationRecord; index: number }) {
  const fromConfig = getProviderConfig(record.fromProvider);
  const toConfig = getProviderConfig(record.toProvider);

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors duration-150 cursor-default"
    >
      {/* Provider path */}
      <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
        <span className={`text-xs font-bold font-mono ${fromConfig.textClass}`}>
          {record.fromProvider}
        </span>
        <ArrowRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
        <span className={`text-xs font-bold font-mono ${toConfig.textClass}`}>
          {record.toProvider}
        </span>
      </div>

      {/* Engine name + date */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground truncate">
          {record.engineName}
        </div>
        <div className="text-xs text-muted-foreground/60">
          {formatTimestamp(record.timestamp)}
        </div>
      </div>

      {/* Savings badge */}
      {record.savedPerMonth > 0 ? (
        <Badge
          variant="outline"
          className="text-status-running border-status-running/30 bg-status-running/10 font-mono text-xs flex-shrink-0 gap-1"
        >
          <TrendingDown className="w-2.5 h-2.5" />${record.savedPerMonth}/mo
        </Badge>
      ) : record.savedPerMonth < 0 ? (
        <Badge
          variant="outline"
          className="text-amber-500 border-amber-500/30 bg-amber-500/10 font-mono text-xs flex-shrink-0"
        >
          +${Math.abs(record.savedPerMonth)}/mo
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="text-muted-foreground font-mono text-xs flex-shrink-0"
        >
          $0 diff
        </Badge>
      )}
    </motion.div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-1">
      {(["sh1", "sh2", "sh3"] as const).map((id) => (
        <div key={id} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="h-4 w-28 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function MigrationHistoryPanel() {
  const { data: history, isLoading } = useGetMigrationHistory();

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "oklch(var(--card) / 0.6)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            border: "1px solid oklch(var(--primary) / 0.2)",
          }}
        >
          <Clock
            className="w-3.5 h-3.5"
            style={{ color: "oklch(var(--primary))" }}
          />
        </div>
        <h3 className="font-display font-semibold text-base tracking-tight">
          Migration History
        </h3>
        {history && history.length > 0 && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full text-muted-foreground ml-auto"
            style={{
              background: "oklch(var(--secondary) / 0.8)",
              border: "1px solid oklch(var(--border))",
            }}
          >
            {history.length}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton />
      ) : !history || history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-xs text-muted-foreground/60">
            No migrations yet — use{" "}
            <span className="text-foreground font-medium">Migrate Now</span> on
            any engine
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
          {history.map((record, i) => (
            <MigrationRow
              key={record.id.toString()}
              record={record}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
