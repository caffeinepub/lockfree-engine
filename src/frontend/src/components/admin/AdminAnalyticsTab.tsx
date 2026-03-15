import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Cpu, TrendingUp, Users } from "lucide-react";
import { useAdminAnalytics } from "../../hooks/useAdminQueries";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  ocid: string;
  accent?: string;
}

function StatCard({
  label,
  value,
  icon,
  ocid,
  accent = "text-primary",
}: StatCardProps) {
  return (
    <Card
      data-ocid={ocid}
      className="bg-card border-border hover:border-primary/30 transition-colors"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {label}
            </p>
            <p className={`text-3xl font-display font-bold mt-2 ${accent}`}>
              {value}
            </p>
          </div>
          <div className={`p-2.5 rounded-lg bg-primary/10 ${accent}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
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
      className={`flex items-center justify-between p-3 rounded-lg border ${color}`}
    >
      <span className="text-xs font-medium capitalize">{tier}</span>
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
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-40 w-full" />
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
          icon={<Users className="w-5 h-5" />}
          accent="text-primary"
        />
        <StatCard
          ocid="admin.analytics.total_waitlist.card"
          label="Waitlist Signups"
          value={analytics.totalWaitlist.toString()}
          icon={<Clock className="w-5 h-5" />}
          accent="text-blue-400"
        />
        <StatCard
          ocid="admin.analytics.total_engines.card"
          label="Total Engines"
          value={analytics.totalEngines.toString()}
          icon={<Cpu className="w-5 h-5" />}
          accent="text-emerald-400"
        />
      </div>

      {/* Tier breakdown */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Users by Plan Tier
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <TierCard
              tier="Free"
              count={analytics.freeCount}
              color="border-muted bg-muted/30 text-muted-foreground"
            />
            <TierCard
              tier="Pro"
              count={analytics.proCount}
              color="border-blue-500/30 bg-blue-500/10 text-blue-400"
            />
            <TierCard
              tier="Business"
              count={analytics.businessCount}
              color="border-purple-500/30 bg-purple-500/10 text-purple-400"
            />
            <TierCard
              tier="Enterprise"
              count={analytics.enterpriseCount}
              color="border-amber-500/30 bg-amber-500/10 text-amber-400"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
