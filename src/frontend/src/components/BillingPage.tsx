import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  ExternalLink,
  Image,
  Loader2,
  Lock,
  Mail,
  Paintbrush,
  RotateCcw,
  Save,
  Shield,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BillingEvent } from "../backend.d.ts";
import {
  useGetBillingEvents,
  useGetMySubscription,
  useGetUsageSummary,
} from "../hooks/useQueries";
import { PricingModal } from "./PricingModal";
import { SeatManagement } from "./SeatManagement";

interface BillingPageProps {
  onPricingOpen?: () => void;
  overrideTier?: string;
  onTierChange?: (tier: string) => void;
  isDemoMode?: boolean;
}

const WHITE_LABEL_KEY = "lockfree_whitelabel";

interface WhiteLabelConfig {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  customDomain: string;
}

function loadWhiteLabel(): WhiteLabelConfig {
  try {
    const raw = localStorage.getItem(WHITE_LABEL_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          companyName: "",
          primaryColor: "#00b4d8",
          logoUrl: "",
          customDomain: "",
        };
  } catch {
    return {
      companyName: "",
      primaryColor: "#00b4d8",
      logoUrl: "",
      customDomain: "",
    };
  }
}

interface SavedPreview {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  customDomain: string;
}

function WhiteLabelSection({
  subscription,
  onUpgrade,
  isDemoMode,
}: {
  subscription: string;
  onUpgrade: () => void;
  isDemoMode?: boolean;
}) {
  const isEnterprise = subscription === "enterprise";
  const [config, setConfig] = useState<WhiteLabelConfig>(loadWhiteLabel);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPreview, setSavedPreview] = useState<SavedPreview | null>(() => {
    const stored = loadWhiteLabel();
    return stored.companyName ? stored : null;
  });

  useEffect(() => {
    const stored = loadWhiteLabel();
    if (stored.primaryColor) {
      document.documentElement.style.setProperty(
        "--white-label-primary",
        stored.primaryColor,
      );
    }
  }, []);

  function handleSave() {
    if (isSaving) return;

    if (!isDemoMode) {
      // Non-demo: just save locally
      localStorage.setItem(WHITE_LABEL_KEY, JSON.stringify(config));
      document.documentElement.style.setProperty(
        "--white-label-primary",
        config.primaryColor,
      );
      toast.success("White-label branding saved!");
      setSavedPreview({ ...config });
      return;
    }

    // Demo mode: animated save flow
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(WHITE_LABEL_KEY, JSON.stringify(config));
      document.documentElement.style.setProperty(
        "--white-label-primary",
        config.primaryColor,
      );
      setSavedPreview({ ...config });
      setIsSaving(false);
      toast.success("White-label settings saved successfully", {
        description: "Your branding is now active across the console.",
        duration: 4000,
      });
    }, 1500);
  }

  function handleReset() {
    const defaults: WhiteLabelConfig = {
      companyName: "",
      primaryColor: "#00b4d8",
      logoUrl: "",
      customDomain: "",
    };
    localStorage.removeItem(WHITE_LABEL_KEY);
    document.documentElement.style.removeProperty("--white-label-primary");
    setConfig(defaults);
    setSavedPreview(null);
    toast.success("Branding reset to default.");
  }

  if (!isEnterprise) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="font-display font-bold text-foreground mb-1.5">
          White-Label Branding
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
          White-label branding is available on the Enterprise plan. Rebrand the
          console with your company identity.
        </p>
        {isDemoMode ? (
          <Button
            size="sm"
            className="gap-2 bg-[oklch(0.75_0.18_60)] hover:bg-[oklch(0.68_0.18_60)] text-background"
            onClick={onUpgrade}
            data-ocid="billing.whitelabel.open_modal_button"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Enterprise
          </Button>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            Contact sales to activate white-labeling
          </div>
        )}
      </div>
    );
  }

  // Enterprise but not demo mode — show contact sales notice inside the form
  if (!isDemoMode) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.3)] flex items-center justify-center flex-shrink-0">
            <Paintbrush className="w-4 h-4 text-[oklch(0.75_0.18_60)]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-foreground">
              White-Label Branding
            </h3>
            <p className="text-xs text-muted-foreground">
              All team members will see your custom branding across the console
            </p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-[oklch(0.75_0.18_60/0.12)] text-[oklch(0.85_0.18_60)] border border-[oklch(0.75_0.18_60/0.3)] text-xs">
              Enterprise
            </Badge>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/20 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.3)] flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-[oklch(0.75_0.18_60)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Contact sales to activate white-labeling
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reach out to your account manager or email{" "}
              <span className="text-primary font-mono">
                enterprise@lockfreeengine.io
              </span>{" "}
              to enable custom branding for your organisation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.3)] flex items-center justify-center flex-shrink-0">
          <Paintbrush className="w-4 h-4 text-[oklch(0.75_0.18_60)]" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-foreground">
            White-Label Branding
          </h3>
          <p className="text-xs text-muted-foreground">
            All team members will see your custom branding across the console
          </p>
        </div>
        <div className="ml-auto">
          <Badge className="bg-[oklch(0.75_0.18_60/0.12)] text-[oklch(0.85_0.18_60)] border border-[oklch(0.75_0.18_60/0.3)] text-xs">
            Enterprise
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Rebrand LockFree Engine with your company identity. All team members
        will see your custom branding across the entire console — no vendor
        lock-in, fully on-chain.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="wl-name" className="text-xs">
            Company Name
          </Label>
          <Input
            id="wl-name"
            placeholder="Acme Cloud"
            value={config.companyName}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, companyName: e.target.value }))
            }
            data-ocid="billing.whitelabel.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wl-color" className="text-xs">
            Primary Color
          </Label>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg border border-border flex-shrink-0 cursor-pointer"
              style={{ background: config.primaryColor }}
              title={config.primaryColor}
            />
            <input
              id="wl-color"
              type="color"
              value={config.primaryColor}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))
              }
              className="sr-only"
              aria-label="Pick primary color"
            />
            <Input
              value={config.primaryColor}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))
              }
              placeholder="#00b4d8"
              className="font-mono text-xs"
            />
            <label
              htmlFor="wl-color"
              className="flex-shrink-0 cursor-pointer"
              title="Open color picker"
            >
              <div className="w-9 h-9 rounded-lg border border-border bg-muted/40 hover:bg-muted flex items-center justify-center transition-colors">
                <Paintbrush className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="wl-logo" className="text-xs">
            Logo URL
          </Label>
          <Input
            id="wl-logo"
            placeholder="https://example.com/logo.png"
            value={config.logoUrl}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, logoUrl: e.target.value }))
            }
          />
          {config.logoUrl && (
            <div className="mt-1.5 p-2 rounded-lg border border-border bg-muted/30 flex items-center gap-2">
              <img
                src={config.logoUrl}
                alt="Logo preview"
                className="h-6 max-w-[80px] object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-muted-foreground">
                Live preview
              </span>
            </div>
          )}
          {!config.logoUrl && (
            <div className="mt-1.5 p-2 rounded-lg border border-dashed border-border bg-muted/20 flex items-center gap-2 text-muted-foreground">
              <Image className="w-3.5 h-3.5" />
              <span className="text-xs">Enter a URL to preview your logo</span>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wl-domain" className="text-xs">
            Custom Domain
          </Label>
          <Input
            id="wl-domain"
            placeholder="console.yourcompany.com"
            value={config.customDomain}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, customDomain: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground">
            Point your CNAME to{" "}
            <span className="font-mono text-primary">
              app.lockfreeengine.io
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          className="gap-2"
          onClick={handleSave}
          disabled={isSaving}
          data-ocid="billing.whitelabel.save_button"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Settings
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleReset}
          disabled={isSaving}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Default
        </Button>
      </div>

      {/* Saved branding preview card */}
      {savedPreview?.companyName && (
        <div
          className="rounded-xl border border-border bg-card overflow-hidden"
          data-ocid="billing.whitelabel.success_state"
        >
          <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72_0.19_145)]" />
            <span className="text-xs font-semibold text-[oklch(0.82_0.19_145)]">
              Active Branding Preview
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              Live across the console
            </span>
          </div>
          <div className="p-4">
            <div
              className="rounded-lg p-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(135deg, ${savedPreview.primaryColor}18 0%, ${savedPreview.primaryColor}08 100%)`,
                borderLeft: `3px solid ${savedPreview.primaryColor}`,
              }}
            >
              {savedPreview.logoUrl && (
                <img
                  src={savedPreview.logoUrl}
                  alt="Company logo"
                  className="h-10 max-w-[100px] object-contain flex-shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              )}
              {!savedPreview.logoUrl && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ background: savedPreview.primaryColor }}
                >
                  {savedPreview.companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-display font-bold text-base truncate"
                  style={{ color: savedPreview.primaryColor }}
                >
                  {savedPreview.companyName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Powered by LockFree Engine
                  {savedPreview.customDomain && (
                    <span className="ml-1.5 font-mono">
                      · {savedPreview.customDomain}
                    </span>
                  )}
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: savedPreview.primaryColor }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TIER_LIMITS = {
  free: { engines: 1, deployments: 5, migrations: 0 },
  pro: { engines: 10, deployments: -1, migrations: -1 },
  business: { engines: 50, deployments: -1, migrations: -1 },
  enterprise: { engines: -1, deployments: -1, migrations: -1 },
};

const TIER_PRICE: Record<string, string> = {
  free: "$0",
  pro: "$49",
  business: "$199",
  enterprise: "$599",
};

const TIER_ICON: Record<string, React.ElementType> = {
  free: Shield,
  pro: Zap,
  business: Star,
  enterprise: Crown,
};

const TIER_COLOR: Record<string, string> = {
  free: "text-muted-foreground",
  pro: "text-[oklch(0.82_0.19_145)]",
  business: "text-[oklch(0.78_0.22_260)]",
  enterprise: "text-[oklch(0.85_0.18_60)]",
};

const TIER_ICON_COLOR: Record<string, string> = {
  free: "text-muted-foreground",
  pro: "text-[oklch(0.72_0.19_145)]",
  business: "text-[oklch(0.68_0.22_260)]",
  enterprise: "text-[oklch(0.75_0.18_60)]",
};

const TIER_ICON_BG: Record<string, string> = {
  free: "bg-muted/50 border border-border",
  pro: "bg-[oklch(0.72_0.19_145/0.15)] border border-[oklch(0.72_0.19_145/0.4)]",
  business:
    "bg-[oklch(0.68_0.22_260/0.15)] border border-[oklch(0.68_0.22_260/0.4)]",
  enterprise:
    "bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.4)]",
};

import type React from "react";

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    upgrade:
      "bg-[oklch(0.72_0.19_145/0.12)] text-[oklch(0.82_0.19_145)] border-[oklch(0.72_0.19_145/0.3)]",
    downgrade: "bg-muted/50 text-muted-foreground border-border",
    payment: "bg-primary/10 text-primary border-primary/20",
    subscription: "bg-primary/10 text-primary border-primary/20",
    refund:
      "bg-[oklch(0.75_0.18_60/0.12)] text-[oklch(0.85_0.18_60)] border-[oklch(0.75_0.18_60/0.3)]",
  };
  const key = type.toLowerCase();
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[key] ?? styles.payment}`}
    >
      {type}
    </span>
  );
}

interface UsageMeterProps {
  label: string;
  value: number;
  max: number | null;
  warn?: boolean;
  onUpgrade?: () => void;
}

function UsageMeter({ label, value, max, warn, onUpgrade }: UsageMeterProps) {
  const pct = max === null ? 0 : Math.min((value / max) * 100, 100);
  const isNearLimit = max !== null && pct >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span
          className={`font-mono font-semibold ${isNearLimit ? "text-[oklch(0.72_0.18_55)]" : "text-foreground"}`}
        >
          {value} / {max === null ? "∞" : max}
        </span>
      </div>
      {max !== null ? (
        <Progress
          value={pct}
          className={`h-1.5 ${isNearLimit ? "[&>div]:bg-[oklch(0.72_0.18_55)]" : "[&>div]:bg-primary"}`}
        />
      ) : (
        <div className="h-1.5 rounded-full bg-secondary">
          <div className="h-full w-0 rounded-full bg-primary/40" />
        </div>
      )}
      {warn && isNearLimit && onUpgrade && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)]">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.72_0.18_55)]" />
            <span className="text-xs text-[oklch(0.82_0.18_55)]">
              Approaching limit
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs px-2 text-[oklch(0.72_0.18_55)] hover:bg-[oklch(0.72_0.18_55/0.1)]"
            onClick={onUpgrade}
          >
            Upgrade
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function BillingPage({
  onPricingOpen,
  overrideTier,
  onTierChange,
  isDemoMode,
}: BillingPageProps) {
  const { data: _subscription = "free", isLoading: subLoading } =
    useGetMySubscription();
  const subscription = overrideTier ?? _subscription;
  const { data: billingEvents = [], isLoading: eventsLoading } =
    useGetBillingEvents();
  const { data: usage, isLoading: usageLoading } = useGetUsageSummary();
  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1, 1);
  const nextBillingStr = nextBilling.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const [pricingOpen, setPricingOpen] = useState(false);

  const limits =
    TIER_LIMITS[subscription as keyof typeof TIER_LIMITS] ?? TIER_LIMITS.free;
  const enginesCount = Number(usage?.enginesCount ?? 0);
  const deploymentsCount = Number(usage?.deploymentsThisMonth ?? 0);
  const migrationsCount = Number(usage?.migrationsThisMonth ?? 0);

  const TierIcon = TIER_ICON[subscription] ?? Shield;

  function openPricing() {
    setPricingOpen(true);
    onPricingOpen?.();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your plan, usage, and payment history — all recorded on-chain.
        </p>
      </div>

      {/* Section A: Current Plan */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Current Plan
          </h2>
        </div>
        <div className="p-5">
          {subLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading plan...</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${TIER_ICON_BG[subscription] ?? TIER_ICON_BG.free}`}
                >
                  <TierIcon
                    className={`w-5 h-5 ${TIER_ICON_COLOR[subscription] ?? TIER_ICON_COLOR.free}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display text-2xl font-bold capitalize ${TIER_COLOR[subscription] ?? TIER_COLOR.free}`}
                    >
                      {subscription}
                    </span>
                    <span className="font-display text-lg font-semibold text-muted-foreground">
                      {TIER_PRICE[subscription] ?? "$0"}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <CalendarDays className="w-3 h-3" />
                    Next billing: {nextBillingStr}
                  </div>
                </div>
              </div>
              <div className="sm:ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={openPricing}
                  data-ocid="billing.plan.open_modal_button"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Change Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section B: Usage */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Usage This Month
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {usageLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading usage...</span>
            </div>
          ) : (
            <>
              <UsageMeter
                label="Cloud Engines"
                value={enginesCount}
                max={limits.engines === -1 ? null : limits.engines}
                warn={subscription === "free" || subscription === "pro"}
                onUpgrade={openPricing}
              />
              <UsageMeter
                label="Deployments"
                value={deploymentsCount}
                max={limits.deployments === -1 ? null : limits.deployments}
                warn={subscription === "free"}
                onUpgrade={openPricing}
              />
              <UsageMeter
                label="Migrations"
                value={migrationsCount}
                max={
                  limits.migrations === -1
                    ? null
                    : limits.migrations === 0
                      ? null
                      : limits.migrations
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Section C: Billing Log */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80 flex items-center justify-between">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            On-Chain Billing Log
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.19_145)] animate-pulse" />
            <span className="text-xs text-[oklch(0.72_0.19_145)] flex items-center gap-1">
              Transparent audit trail — stored on ICP
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
        <div>
          {eventsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground p-5">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading billing history...</span>
            </div>
          ) : billingEvents.length === 0 ? (
            <div
              className="p-8 text-center"
              data-ocid="billing.log.empty_state"
            >
              <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No billing events yet.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your payment history will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="billing.log.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Event
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Plan
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Currency
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Note
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(billingEvents as BillingEvent[]).map((event) => (
                    <TableRow
                      key={event.id.toString()}
                      className="border-border"
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {formatDate(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        <EventTypeBadge type={event.eventType} />
                      </TableCell>
                      <TableCell className="text-xs text-foreground capitalize font-medium">
                        {event.tier}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-semibold text-right">
                        {event.amount > 0 ? `$${event.amount.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground uppercase">
                        {event.currency}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                        {event.note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Section D: Seat Management */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Team Seats
          </h2>
        </div>
        <div className="p-5">
          <SeatManagement
            subscription={subscription}
            onUpgradeToEnterprise={openPricing}
          />
        </div>
      </div>

      {/* Section E: White-Label Branding */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            White-Label Branding
          </h2>
        </div>
        <div className="p-5">
          <WhiteLabelSection
            subscription={subscription}
            onUpgrade={openPricing}
            isDemoMode={isDemoMode}
          />
        </div>
      </div>

      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        currentTier={subscription}
        isDemoMode={isDemoMode}
        onUpgrade={(tier) => {
          onTierChange?.(tier);
          setPricingOpen(false);
        }}
      />
    </div>
  );
}
