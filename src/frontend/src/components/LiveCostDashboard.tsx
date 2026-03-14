import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Engine } from "../backend.d.ts";
import { useCostSummary, useListEngines } from "../hooks/useQueries";
import { AICostOptimizationModal } from "./AICostOptimizationModal";

// ── Provider colours ───────────────────────────────────────────────────────
const PROVIDER_COLORS: Record<string, string> = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#00BCF2",
};

const ICP_RATE = 6.2; // 1 ICP ≈ $6.20 (mock)

// ── Day labels helper ──────────────────────────────────────────────────────
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function last7DayLabels(): string[] {
  const today = new Date().getDay();
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    labels.push(DAY_LABELS[(today - i + 7) % 7]);
  }
  return labels;
}

// ── Custom bar chart tooltip ───────────────────────────────────────────────
function EngineBarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; provider: string; monthly: number };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const icp = d.monthly / ICP_RATE;
  const color = PROVIDER_COLORS[d.provider] ?? "#888";
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs shadow-xl"
      style={{
        background: "oklch(var(--popover))",
        border: "1px solid oklch(var(--border))",
        minWidth: 150,
      }}
    >
      <div className="font-semibold text-foreground mb-1.5 truncate">
        {d.name}
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span style={{ color }}>{d.provider}</span>
      </div>
      <div className="text-muted-foreground">
        Monthly:{" "}
        <span className="text-foreground font-mono tabular-nums">
          ${d.monthly.toFixed(2)}
        </span>
      </div>
      <div className="text-muted-foreground">
        ≈{" "}
        <span className="text-foreground font-mono tabular-nums">
          {icp.toFixed(2)} ICP
        </span>
      </div>
    </div>
  );
}

// ── Resilience arc gauge ────────────────────────────────────────────────────
function ResilienceGauge({
  score,
  uniqueProviders,
}: {
  score: number;
  uniqueProviders: number;
}) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color =
    clampedScore >= 70 ? "#22c55e" : clampedScore >= 40 ? "#f59e0b" : "#ef4444";

  // SVG arc path
  const R = 48;
  const cx = 60;
  const cy = 60;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle; // 240 degrees
  const progressAngle = startAngle + (clampedScore / 100) * totalAngle;

  function polarToCartesian(
    cxP: number,
    cyP: number,
    r: number,
    deg: number,
  ): [number, number] {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cxP + r * Math.cos(rad), cyP + r * Math.sin(rad)];
  }

  function arcPath(fromDeg: number, toDeg: number, r: number): string {
    const [x1, y1] = polarToCartesian(cx, cy, r, fromDeg);
    const [x2, y2] = polarToCartesian(cx, cy, r, toDeg);
    const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  const trackPath = arcPath(startAngle, endAngle, R);
  const progressPath =
    clampedScore > 0 ? arcPath(startAngle, progressAngle, R) : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center cursor-help select-none">
          <svg
            width="120"
            height="90"
            viewBox="0 0 120 90"
            role="img"
            aria-label={`Resilience score: ${clampedScore}%`}
          >
            <title>Resilience score: {clampedScore}%</title>
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke="oklch(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            {progressPath && (
              <path
                d={progressPath}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
              />
            )}
            {/* Score label */}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono font-bold"
              style={{
                fill: color,
                fontSize: "18px",
                fontFamily: '"Geist Mono", monospace',
              }}
            >
              {clampedScore}%
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fill: "oklch(var(--muted-foreground))",
                fontSize: "9px",
                fontFamily: "Outfit, system-ui",
              }}
            >
              Resilience
            </text>
          </svg>
          {/* Provider count badge */}
          <div
            className="text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums -mt-1"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}40`,
              color,
            }}
          >
            +{uniqueProviders} provider{uniqueProviders !== 1 ? "s" : ""}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-64 text-xs">
        Resilience increases each time you add a new cloud provider. Spread
        across all 3 (AWS, GCP, Azure) for a maximum score of 100%.
      </TooltipContent>
    </Tooltip>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function LiveCostDashboard() {
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const { data: cost, isLoading: costLoading } = useCostSummary();
  const { data: engines, isLoading: enginesLoading } = useListEngines();

  const isLoading = costLoading || enginesLoading;
  const engineList: Engine[] = engines ?? [];

  // Build per-engine bar chart data
  const engineMap = new Map(engineList.map((e) => [e.id.toString(), e]));
  const barData = (cost?.engineCosts ?? []).map(([id, costPerHr]) => {
    const engine = engineMap.get(id.toString());
    return {
      name: engine?.name ?? `Engine #${id}`,
      provider: engine?.provider ?? "AWS",
      monthly: costPerHr * 720,
    };
  });

  // Fallback: use listEngines if cost summary doesn't have engine costs yet
  const displayBarData =
    barData.length > 0
      ? barData
      : engineList.map((e) => ({
          name: e.name,
          provider: e.provider,
          monthly: e.costPerHour * 720,
        }));

  // Total monthly
  const totalMonthlyUSD =
    displayBarData.reduce((sum, d) => sum + d.monthly, 0) ||
    (cost?.totalCost ?? 0) * 720;
  const totalMonthlyICP = totalMonthlyUSD / ICP_RATE;

  // 7-day trend simulation
  const dayLabels = last7DayLabels();
  const trendData = dayLabels.map((day, d) => ({
    day,
    cost:
      totalMonthlyUSD > 0
        ? +(totalMonthlyUSD * (0.92 + d * 0.018 + Math.sin(d) * 0.02)).toFixed(
            2,
          )
        : +(80 + d * 4 + Math.sin(d) * 3).toFixed(2),
  }));

  // Resilience score
  const avgResilience =
    engineList.length > 0
      ? engineList.reduce((sum, e) => sum + Number(e.resilienceScore), 0) /
        engineList.length
      : 0;
  const uniqueProviders = new Set(engineList.map((e) => e.provider)).size;

  return (
    <>
      <motion.div
        className="console-panel p-5 space-y-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* ── A. Header row ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Live pulse */}
              <span className="relative flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-running animate-pulse flex-shrink-0" />
                <span className="text-xs text-status-running font-semibold uppercase tracking-wider">
                  Live
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                · refreshes every 30s
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-1.5 mt-2">
                <div
                  className="h-9 w-40 rounded-md animate-pulse"
                  style={{ background: "oklch(var(--muted))" }}
                />
                <div
                  className="h-4 w-28 rounded animate-pulse"
                  style={{ background: "oklch(var(--muted))" }}
                />
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2.5">
                  <span className="text-4xl font-mono font-bold tabular-nums leading-none">
                    ${totalMonthlyUSD.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    / month
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1 font-mono">
                  ≈ {totalMonthlyICP.toFixed(2)} ICP/month
                </div>
              </>
            )}
          </div>

          {/* Resilience gauge */}
          <div className="flex-shrink-0">
            <ResilienceGauge
              score={Math.round(avgResilience)}
              uniqueProviders={uniqueProviders}
            />
          </div>

          {/* Optimize button */}
          <div className="w-full sm:w-auto flex items-center">
            <Button
              className="gap-2 w-full sm:w-auto"
              onClick={() => setOptimizeOpen(true)}
              disabled={engineList.length === 0}
            >
              <Sparkles className="w-4 h-4" />
              Optimize Costs
            </Button>
          </div>
        </div>

        {/* ── B. Per-engine bar chart ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Monthly Cost by Engine
            </span>
            {/* Provider legend */}
            <div className="flex items-center gap-3 ml-auto">
              {Object.entries(PROVIDER_COLORS).map(([p, c]) => (
                <div key={p} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: c }}
                  />
                  <span className="text-xs text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div
                className="h-[220px] rounded-lg animate-pulse min-w-[320px]"
                style={{ background: "oklch(var(--muted))" }}
              />
            ) : displayBarData.length === 0 ? (
              <div
                className="h-[220px] rounded-lg flex flex-col items-center justify-center gap-2"
                style={{ background: "oklch(var(--secondary) / 0.3)" }}
              >
                <span className="text-sm text-muted-foreground">
                  No engines running — provision one to see costs.
                </span>
              </div>
            ) : (
              <div className="min-w-[320px]">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={displayBarData}
                    margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "oklch(var(--muted-foreground))",
                        fontSize: 11,
                        fontFamily: "Outfit, system-ui",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => `$${v}`}
                      tick={{
                        fill: "oklch(var(--muted-foreground))",
                        fontSize: 11,
                        fontFamily: '"Geist Mono", monospace',
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={52}
                    />
                    <RechartTooltip
                      content={<EngineBarTooltip />}
                      cursor={{
                        fill: "oklch(var(--muted) / 0.5)",
                        radius: 4,
                      }}
                    />
                    <Bar dataKey="monthly" radius={[4, 4, 0, 0]}>
                      {displayBarData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}-${entry.provider}`}
                          fill={PROVIDER_COLORS[entry.provider] ?? "#888"}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── C. 7-day trend ── */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            7-Day Cost Trend
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <AreaChart
              data={trendData}
              margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(var(--primary))"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{
                  fill: "oklch(var(--muted-foreground))",
                  fontSize: 11,
                  fontFamily: "Outfit, system-ui",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => `$${v}`}
                tick={{
                  fill: "oklch(var(--muted-foreground))",
                  fontSize: 10,
                  fontFamily: '"Geist Mono", monospace',
                }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <RechartTooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Daily spend",
                ]}
                contentStyle={{
                  background: "oklch(var(--popover))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "oklch(var(--foreground))",
                }}
                labelStyle={{ color: "oklch(var(--muted-foreground))" }}
                cursor={{ stroke: "oklch(var(--primary))", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="oklch(var(--primary))"
                strokeWidth={2}
                fill="url(#costGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "oklch(var(--primary))",
                  stroke: "oklch(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* AI Optimization modal */}
      <AICostOptimizationModal
        open={optimizeOpen}
        onClose={() => setOptimizeOpen(false)}
        engines={engineList}
      />
    </>
  );
}
