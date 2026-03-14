import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp } from "lucide-react";
import { useCostSummary, useListEngines } from "../hooks/useQueries";

export function CostTracker() {
  const { data: cost, isLoading: costLoading } = useCostSummary();
  const { data: engines } = useListEngines();

  const totalMonthly = (cost?.totalCost ?? 0) * 720;
  const engineMap = new Map(engines?.map((e) => [e.id.toString(), e]) ?? []);

  return (
    <div className="console-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">Cost Tracker</span>
        <span className="text-xs text-muted-foreground ml-auto">
          Refreshes every 30s
        </span>
      </div>

      {costLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-mono font-bold text-foreground">
                ${totalMonthly.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/month</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />$
              {(cost?.totalCost ?? 0).toFixed(4)}/hr across all engines
            </div>
          </div>

          {(cost?.engineCosts?.length ?? 0) > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground mb-2">
                Per-engine breakdown
              </div>
              {cost?.engineCosts.map(([id, costPerHr]) => {
                const engine = engineMap.get(id.toString());
                const monthly = costPerHr * 720;
                return (
                  <div
                    key={id.toString()}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground font-medium truncate flex-1 mr-2">
                      {engine?.name ?? `Engine #${id}`}
                    </span>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      ${monthly.toFixed(2)}/mo
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
