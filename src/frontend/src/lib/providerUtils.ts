// Provider color helpers
export type Provider = "AWS" | "GCP" | "Azure";

export const providerConfig: Record<
  string,
  {
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    cardClass: string;
  }
> = {
  AWS: {
    label: "AWS",
    color: "oklch(var(--provider-aws))",
    bgClass: "bg-aws/10",
    textClass: "text-aws",
    cardClass: "engine-card-aws",
  },
  GCP: {
    label: "Google Cloud",
    color: "oklch(var(--provider-gcp))",
    bgClass: "bg-gcp/10",
    textClass: "text-gcp",
    cardClass: "engine-card-gcp",
  },
  Azure: {
    label: "Azure",
    color: "oklch(var(--provider-azure))",
    bgClass: "bg-azure/10",
    textClass: "text-azure",
    cardClass: "engine-card-azure",
  },
};

export function getProviderConfig(provider: string) {
  return providerConfig[provider] ?? providerConfig.AWS;
}

export const statusConfig: Record<
  string,
  { label: string; dotClass: string; textClass: string; badgeClass: string }
> = {
  running: {
    label: "Running",
    dotClass: "bg-status-running",
    textClass: "text-status-running",
    badgeClass: "bg-status-running/10 text-status-running",
  },
  provisioning: {
    label: "Provisioning",
    dotClass: "bg-status-provisioning animate-pulse",
    textClass: "text-status-provisioning",
    badgeClass: "bg-status-provisioning/10 text-status-provisioning",
  },
  migrating: {
    label: "Migrating",
    dotClass: "bg-status-migrating animate-pulse-slow",
    textClass: "text-status-migrating",
    badgeClass: "bg-status-migrating/10 text-status-migrating",
  },
  stopped: {
    label: "Stopped",
    dotClass: "bg-status-stopped",
    textClass: "text-status-stopped",
    badgeClass: "bg-status-stopped/10 text-status-stopped",
  },
};

export function getStatusConfig(status: string) {
  return statusConfig[status] ?? statusConfig.stopped;
}

export function calcCostPerHour(
  cpu: number,
  ram: number,
  storage: number,
): number {
  return cpu * 0.02 + ram * 0.01 + storage * 0.001;
}

export function formatCostPerMonth(costPerHour: number): string {
  return `$${(costPerHour * 720).toFixed(2)}`;
}

export function formatCostPerHour(costPerHour: number): string {
  return `$${costPerHour.toFixed(3)}/hr`;
}

export function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}...${principal.slice(-6)}`;
}
