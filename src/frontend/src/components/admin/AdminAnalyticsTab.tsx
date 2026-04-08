import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Cpu, TrendingUp, Users } from "lucide-react";
import type React from "react";
import { useAdminAnalytics } from "../../hooks/useAdminQueries";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  ocid: string;
  accentClass: string;
  iconBgClass: string;
}

function StatCard({
  label,
  value,
  icon,
  ocid,
  accentClass,
  iconBgClass,
}: StatCardProps) {
  return (
    <div
      data-ocid={ocid}
      className="group relative rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-[0_0_20px_oklch(0.82_0.22_195/0.08)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {label}
          </p>
          <p className={`text-3xl font-display font-bold mt-2 ${accentClass}`}>
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgClass}`}>{icon}</div>
      </div>
    </div>
  );
}

interface TierCardProps {
  tier: string;
  count: bigint;
  color: string;
}

function TierCard({ tier, count, color }: TierCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-sm ${color}`}
    >
      <span className="text-xs font-semibold capitalize tracking-wide">
        {tier}
      </span>
      <span className="text-lg font-bold font-mono">{count.toString()}</span>
    </div>
  );
}

export function AdminAnalyticsTab() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6" data-ocid="admin.analytics.loading_state">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const analytics = data ?? {
    totalUsers: 0n,
    totalWaitlist: 0n,
    totalEngines: 0n,
    freeCount: 0n,
    proCount: 0n,
    businessCount: 0n,
    enterpriseCount: 0n,
  };

  return (
    <div className="space-y-6">
      {/* Top-level stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          ocid="admin.analytics.total_users.card"
          label="Total Users"
          value={analytics.totalUsers.toString()}
          icon={<Users className="w-5 h-5 text-primary" />}
          accentClass="text-primary"
          iconBgClass="bg-primary/10 border border-primary/20"
        />
        <StatCard
          ocid="admin.analytics.total_waitlist.card"
          label="Waitlist Signups"
          value={analytics.totalWaitlist.toString()}
          icon={<Clock className="w-5 h-5 text-[oklch(0.68_0.22_260)]" />}
          accentClass="text-[oklch(0.78_0.22_260)]"
          iconBgClass="bg-[oklch(0.68_0.22_260/0.12)] border border-[oklch(0.68_0.22_260/0.25)]"
        />
        <StatCard
          ocid="admin.analytics.total_engines.card"
          label="Total Engines"
          value={analytics.totalEngines.toString()}
          icon={<Cpu className="w-5 h-5 text-[oklch(0.72_0.19_145)]" />}
          accentClass="text-[oklch(0.82_0.19_145)]"
          iconBgClass="bg-[oklch(0.72_0.19_145/0.12)] border border-[oklch(0.72_0.19_145/0.25)]"
        />
      </div>

      {/* Tier breakdown */}
      <div className="rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Users by Plan Tier
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TierCard
            tier="Free"
            count={analytics.freeCount}
            color="border-border/60 bg-muted/30 text-muted-foreground"
          />
          <TierCard
            tier="Pro"
            count={analytics.proCount}
            color="border-[oklch(0.72_0.19_145/0.3)] bg-[oklch(0.72_0.19_145/0.08)] text-[oklch(0.82_0.19_145)]"
          />
          <TierCard
            tier="Business"
            count={analytics.businessCount}
            color="border-[oklch(0.68_0.22_260/0.3)] bg-[oklch(0.68_0.22_260/0.08)] text-[oklch(0.78_0.22_260)]"
          />
          <TierCard
            tier="Enterprise"
            count={analytics.enterpriseCount}
            color="border-[oklch(0.75_0.18_60/0.3)] bg-[oklch(0.75_0.18_60/0.08)] text-[oklch(0.85_0.18_60)]"
          />
        </div>
      </div>
    </div>
  );
}
