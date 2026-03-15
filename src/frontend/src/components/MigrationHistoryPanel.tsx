import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, TrendingDown } from "lucide-react";
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

function MigrationRow({ record }: { record: MigrationRecord }) {
  const fromConfig = getProviderConfig(record.fromProvider);
  const toConfig = getProviderConfig(record.toProvider);

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-secondary/40 transition-colors">
      {/* Provider path */}
      <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
        <span className={`text-xs font-bold font-mono ${fromConfig.textClass}`}>
          {record.fromProvider}
        </span>
        <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className={`text-xs font-bold font-mono ${toConfig.textClass}`}>
          {record.toProvider}
        </span>
      </div>

      {/* Engine name + date */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground truncate">
          {record.engineName}
        </div>
        <div className="text-xs text-muted-foreground">
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
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-1">
      {["sh1", "sh2", "sh3"].map((id) => (
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
    <div className="console-panel p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-display font-semibold text-base tracking-tight">
          Migration History
        </h3>
        {history && history.length > 0 && (
          <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded-full text-muted-foreground border border-border ml-auto">
            {history.length}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <HistorySkeleton />
      ) : !history || history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-xs text-muted-foreground">
            No migrations yet — use{" "}
            <span className="text-foreground font-medium">Migrate Now</span> on
            any engine
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
          {history.map((record, i) => (
            <div
              key={record.id.toString()}
              className={`relative ${i > 0 ? "migration-timeline-row" : ""}`}
            >
              {i > 0 && (
                <div className="absolute left-5 -top-px w-px h-4 bg-border" />
              )}
              <MigrationRow record={record} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
