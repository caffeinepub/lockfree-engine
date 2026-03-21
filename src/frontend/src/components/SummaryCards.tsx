import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightLeft, Cpu, DollarSign, Info, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Engine } from "../backend.d.ts";
import { formatCostPerMonth } from "../lib/providerUtils";

interface SummaryCardsProps {
  engines: Engine[] | undefined;
  isLoading: boolean;
  isDemoMode?: boolean;
}

// Gently ticking cost in demo mode
function useLiveCostMultiplier(isDemoMode: boolean) {
  const [multiplier, setMultiplier] = useState(1.0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDemoMode) {
      setMultiplier(1.0);
      return;
    }
    function scheduleTick() {
      tickRef.current = setTimeout(
        () => {
          const delta = (Math.random() - 0.48) * 0.025;
          setMultiplier((prev) => Math.max(0.92, Math.min(1.08, prev + delta)));
          scheduleTick();
        },
        8000 + Math.random() * 4000,
      );
    }
    scheduleTick();
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [isDemoMode]);

  return multiplier;
}

export function SummaryCards({
  engines,
  isLoading,
  isDemoMode = false,
}: SummaryCardsProps) {
  const costMultiplier = useLiveCostMultiplier(isDemoMode);

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
  const rawCostPerHour =
    engines?.reduce((sum, e) => sum + e.costPerHour, 0) ?? 0;
  const totalCostPerHour = isDemoMode
    ? rawCostPerHour * costMultiplier
    : rawCostPerHour;
  const avgResilience =
    total > 0
      ? Math.round(
          (engines?.reduce((sum, e) => sum + Number(e.resilienceScore), 0) ??
            0) / total,
        )
      : 0;
  const activeMigrations =
    engines?.filter((e) => e.status === "migrating").length ?? 0;

  const monthlyCostDisplay = formatCostPerMonth(totalCostPerHour);
  const hourlyCostDisplay = `$${totalCostPerHour.toFixed(4)}/hr`;

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
      animated: false,
    },
    {
      label: "Monthly Cost",
      value: monthlyCostDisplay,
      icon: DollarSign,
      tooltip: "Total estimated monthly cost across all active engines.",
      sub: hourlyCostDisplay,
      accentColor: "oklch(var(--status-provisioning))",
      valueColor: "text-foreground",
      animated: isDemoMode,
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
      animated: false,
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
      animated: false,
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
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="max-w-52 text-sm p-3">
                  <p>{card.tooltip}</p>
                </PopoverContent>
              </Popover>
            </div>

            {/* Value */}
            <div
              className={`text-3xl font-mono font-bold leading-none tabular-nums mb-1.5 ${card.valueColor} overflow-hidden`}
            >
              {card.animated ? (
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={card.value}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {card.value}
                  </motion.span>
                </AnimatePresence>
              ) : (
                card.value
              )}
            </div>

            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {card.label}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-0.5">
              {card.animated ? (
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={card.sub}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {card.sub}
                  </motion.span>
                </AnimatePresence>
              ) : (
                card.sub
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
