import { Button } from "@/components/ui/button";
import { TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Engine } from "../backend.d.ts";
import { MigrateModal } from "./MigrateModal";

interface CostAlertsProps {
  engines: Engine[];
  isDemoMode?: boolean;
}

interface Alert {
  id: string;
  engine: Engine;
  message: string;
  severity: "high" | "medium";
}

function buildAlerts(engines: Engine[]): Alert[] {
  const alerts: Alert[] = [];

  for (const engine of engines) {
    if (engine.status !== "running") continue;

    const provider = engine.provider.toUpperCase();

    if (provider.includes("AWS")) {
      alerts.push({
        id: engine.id.toString(),
        engine,
        message: `Your ${engine.name} (AWS) is projected to cost 22% more next month — consider migrating.`,
        severity: "high",
      });
    } else if (provider.includes("AZURE")) {
      alerts.push({
        id: engine.id.toString(),
        engine,
        message: `Your ${engine.name} (Azure) is projected to cost 15% more next month.`,
        severity: "medium",
      });
    }
    // GCP engines get no alert
  }

  return alerts;
}

export function CostAlerts({ engines, isDemoMode }: CostAlertsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [migrateTarget, setMigrateTarget] = useState<Engine | null>(null);

  const alerts = buildAlerts(engines).filter((a) => !dismissedIds.has(a.id));

  if (alerts.length === 0) return null;

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div
                className="relative flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-3 rounded-lg"
                style={{
                  background:
                    alert.severity === "high"
                      ? "oklch(0.72 0.17 80 / 0.08)"
                      : "oklch(0.72 0.17 80 / 0.05)",
                  borderLeft: `3px solid oklch(${alert.severity === "high" ? "0.72 0.17 80" : "0.68 0.15 80"})`,
                  border: "1px solid oklch(0.72 0.17 80 / 0.2)",
                  borderLeftWidth: "3px",
                }}
              >
                {/* Icon */}
                <TrendingUp
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(var(--status-provisioning))" }}
                />

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed text-foreground">
                    {alert.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:flex-shrink-0 sm:ml-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 border-status-provisioning/30 text-status-provisioning hover:bg-status-provisioning/10"
                    onClick={() => setMigrateTarget(alert.engine)}
                  >
                    Migrate Now
                  </Button>
                  <button
                    type="button"
                    aria-label="Dismiss alert"
                    className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    onClick={() =>
                      setDismissedIds((prev) => new Set([...prev, alert.id]))
                    }
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Migrate modal triggered from alert */}
      {migrateTarget && (
        <MigrateModal
          engine={migrateTarget}
          open={!!migrateTarget}
          onClose={() => setMigrateTarget(null)}
          isDemoMode={isDemoMode}
        />
      )}
    </>
  );
}
