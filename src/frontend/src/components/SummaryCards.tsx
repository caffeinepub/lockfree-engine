import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRightLeft, Cpu, DollarSign, Info, Shield } from "lucide-react";
import type { Engine } from "../backend.d.ts";
import { formatCostPerMonth } from "../lib/providerUtils";

interface SummaryCardsProps {
  engines: Engine[] | undefined;
  isLoading: boolean;
}

export function SummaryCards({ engines, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["s1", "s2", "s3", "s4"] as const).map((id) => (
          <Skeleton key={id} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  const total = engines?.length ?? 0;
  const totalCostPerHour =
    engines?.reduce((sum, e) => sum + e.costPerHour, 0) ?? 0;
  const avgResilience =
    total > 0
      ? Math.round(
          (engines?.reduce((sum, e) => sum + Number(e.resilienceScore), 0) ??
            0) / total,
        )
      : 0;
  const activeMigrations =
    engines?.filter((e) => e.status === "migrating").length ?? 0;

  const cards = [
    {
      label: "Total Engines",
      value: total.toString(),
      icon: Cpu,
      tooltip:
        "A Cloud Engine is a managed compute unit that runs your ICP canisters. Switch providers anytime.",
      sub: `${engines?.filter((e) => e.status === "running").length ?? 0} running`,
      accentColor: "oklch(var(--primary))",
      valueColor: "text-foreground",
    },
    {
      label: "Monthly Cost",
      value: formatCostPerMonth(totalCostPerHour),
      icon: DollarSign,
      tooltip: "Total estimated monthly cost across all active engines.",
      sub: `$${totalCostPerHour.toFixed(4)}/hr`,
      accentColor: "oklch(var(--status-provisioning))",
      valueColor: "text-foreground",
    },
    {
      label: "Avg Resilience",
      value: `${avgResilience}%`,
      icon: Shield,
      tooltip:
        "How fault-tolerant your engines are across regions and providers. Higher is better.",
      sub: total > 0 ? "across all engines" : "no engines",
      accentColor:
        avgResilience >= 80
          ? "oklch(var(--status-running))"
          : avgResilience >= 50
            ? "oklch(var(--status-provisioning))"
            : "oklch(var(--destructive))",
      valueColor:
        avgResilience >= 80
          ? "text-status-running"
          : avgResilience >= 50
            ? "text-status-provisioning"
            : "text-destructive",
    },
    {
      label: "Migrations",
      value: activeMigrations.toString(),
      icon: ArrowRightLeft,
      tooltip: "Engines currently being migrated between cloud providers.",
      sub: activeMigrations > 0 ? "active" : "all stable",
      accentColor:
        activeMigrations > 0
          ? "oklch(var(--status-migrating))"
          : "oklch(var(--muted-foreground))",
      valueColor:
        activeMigrations > 0 ? "text-status-migrating" : "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="console-panel p-5 relative overflow-hidden"
        >
          {/* Accent dot left edge */}
          <div
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
            style={{ background: card.accentColor, opacity: 0.7 }}
          />

          <div className="pl-3">
            <div className="flex items-center justify-between mb-2">
              <card.icon
                className="w-4 h-4"
                style={{ color: card.accentColor }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-52">
                  <p>{card.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Value — visually dominant */}
            <div
              className={`text-3xl font-mono font-bold leading-none tabular-nums mb-1.5 ${card.valueColor}`}
            >
              {card.value}
            </div>

            {/* Label — clear hierarchy below value */}
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {card.label}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-0.5">
              {card.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
