import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Award,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PartnersPageProps {
  onNavigate: (page: string) => void;
}

const ENGINE_TIERS = [
  { label: "Small", price: 29 },
  { label: "Medium", price: 99 },
  { label: "Large", price: 299 },
];

function getKickbackRate(referrals: number): number {
  if (referrals >= 200) return 0.08;
  if (referrals >= 50) return 0.05;
  return 0.03;
}

function getPartnerTier(referrals: number): "bronze" | "silver" | "gold" {
  if (referrals >= 200) return "gold";
  if (referrals >= 50) return "silver";
  return "bronze";
}

// ─── Tier Card ────────────────────────────────────────────────────────────────
interface TierCardProps {
  name: string;
  referralThreshold: string;
  kickback: string;
  requirements: string[];
  perks: string[];
  color: {
    bg: string;
    border: string;
    accent: string;
    badge?: string;
  };
  icon: React.ElementType;
  highlight?: boolean;
}

function TierCard({
  name,
  referralThreshold,
  kickback,
  requirements,
  perks,
  color,
  icon: Icon,
  highlight,
}: TierCardProps) {
  return (
    <div
      className="relative rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: color.bg,
        borderColor: color.border,
        boxShadow: highlight
          ? `0 0 0 1px ${color.border}, 0 8px 32px -8px ${color.accent}40`
          : undefined,
      }}
    >
      {highlight && (
        <div className="absolute top-3 right-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
            style={{
              background: `${color.accent}20`,
              borderColor: `${color.accent}50`,
              color: color.accent,
            }}
          >
            <Star className="w-3 h-3 fill-current" />
            Most Lucrative
          </span>
        </div>
      )}

      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${color.accent}18`,
              border: `1px solid ${color.accent}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: color.accent }} />
          </div>
          <div>
            <div
              className="font-display text-lg font-bold"
              style={{ color: color.accent }}
            >
              {name}
            </div>
            <div className="text-xs text-muted-foreground">
              {referralThreshold} engines/month
            </div>
          </div>
        </div>

        {/* Kickback rate */}
        <div
          className="rounded-lg p-3 mb-4 text-center"
          style={{
            background: `${color.accent}10`,
            border: `1px solid ${color.accent}25`,
          }}
        >
          <div
            className="font-mono text-3xl font-bold tabular-nums"
            style={{ color: color.accent }}
          >
            {kickback}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            kickback per provisioned engine
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Requirements
          </div>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <ChevronRight
                  className="w-3 h-3 mt-0.5 flex-shrink-0"
                  style={{ color: color.accent }}
                />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Perks */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Perks
          </div>
          <ul className="space-y-1">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Zap
                  className="w-3 h-3 mt-0.5 flex-shrink-0"
                  style={{ color: color.accent }}
                />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function PartnersPage({ onNavigate }: PartnersPageProps) {
  const [referralCount, setReferralCount] = useState(50);
  const [engineTierIndex, setEngineTierIndex] = useState(0);
  const [applyState, setApplyState] = useState<"idle" | "applying" | "success">(
    "idle",
  );
  const [calcApplyState, setCalcApplyState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const tier = getPartnerTier(referralCount);
  const kickbackRate = getKickbackRate(referralCount);
  const avgPrice = ENGINE_TIERS[engineTierIndex].price;
  const monthlyKickback = referralCount * avgPrice * kickbackRate;
  const annualProjection = monthlyKickback * 12;

  const tierColors = useMemo(
    () => ({
      bronze: {
        bg: "oklch(0.18 0.02 45)",
        border: "oklch(0.65 0.12 55 / 0.35)",
        accent: "oklch(0.72 0.12 55)",
      },
      silver: {
        bg: "oklch(0.17 0.008 240)",
        border: "oklch(0.55 0.05 240 / 0.4)",
        accent: "oklch(0.72 0.04 240)",
      },
      gold: {
        bg: "oklch(0.18 0.025 70)",
        border: "oklch(0.75 0.15 70 / 0.4)",
        accent: "oklch(0.82 0.16 70)",
      },
    }),
    [],
  );

  const tierLabel =
    tier === "bronze" ? "Bronze" : tier === "silver" ? "Silver" : "Gold";

  function handleRegisterClick() {
    setApplyState("applying");
    setTimeout(() => {
      setApplyState("success");
    }, 1500);
  }

  function handleCalcApply() {
    setCalcApplyState("loading");
    setTimeout(() => {
      setCalcApplyState("success");
      setTimeout(() => setCalcApplyState("idle"), 4000);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Partners & Node Kickbacks
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 max-w-2xl">
          Earn from every engine provisioned through your network — powered by
          ICP&apos;s demand-driven compute model. No vendor lock-in, no
          middlemen, on-chain transparency.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TierCard
          name="Bronze"
          referralThreshold="10+"
          kickback="3%"
          requirements={[
            "Active affiliate account",
            "10+ monthly provisioned engines",
          ]}
          perks={["Monthly earnings report", "Community forum access"]}
          color={tierColors.bronze}
          icon={Shield}
        />
        <TierCard
          name="Silver"
          referralThreshold="50+"
          kickback="5%"
          requirements={[
            "Bronze tier achieved",
            "50+ monthly provisioned engines",
          ]}
          perks={[
            "Dedicated account manager",
            "Co-marketing opportunities",
            "Early feature access",
          ]}
          color={tierColors.silver}
          icon={Award}
        />
        <TierCard
          name="Gold"
          referralThreshold="200+"
          kickback="8%"
          requirements={[
            "Silver tier achieved",
            "200+ monthly provisioned engines",
          ]}
          perks={[
            "Priority SLA & custom contract",
            "White-label rights",
            "Revenue share on Enterprise deals",
            "Priority support",
          ]}
          color={tierColors.gold}
          icon={Star}
          highlight
        />
      </div>

      {/* Earnings calculator */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Earnings Calculator
          </h2>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sliders */}
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Estimated monthly referrals
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground tabular-nums">
                    {referralCount}
                  </span>
                </div>
                <Slider
                  value={[referralCount]}
                  onValueChange={([v]) => setReferralCount(v)}
                  min={10}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Average engine tier
                </span>
                <div className="flex gap-2">
                  {ENGINE_TIERS.map((t, i) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setEngineTierIndex(i)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        engineTierIndex === i
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div>{t.label}</div>
                      <div className="font-mono font-bold mt-0.5">
                        ${t.price}/mo
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              {/* Partner tier badge */}
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: tierColors[tier].bg,
                  border: `1px solid ${tierColors[tier].border}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                  style={{
                    background: `${tierColors[tier].accent}20`,
                    color: tierColors[tier].accent,
                  }}
                >
                  {tier === "bronze" ? "B" : tier === "silver" ? "S" : "G"}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Your tier at {referralCount} referrals
                  </div>
                  <div
                    className="font-display font-bold text-lg capitalize"
                    style={{ color: tierColors[tier].accent }}
                  >
                    {tier} Partner ({(kickbackRate * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>

              {/* Monthly kickback */}
              <div className="rounded-xl border border-[oklch(0.72_0.19_145/0.3)] bg-[oklch(0.72_0.19_145/0.06)] p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Monthly Kickback
                </div>
                <div className="font-mono text-2xl font-bold text-[oklch(0.82_0.19_145)] tabular-nums">
                  ${monthlyKickback.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {referralCount} engines × ${avgPrice}/mo ×{" "}
                  {(kickbackRate * 100).toFixed(0)}%
                </div>
              </div>

              {/* Annual projection */}
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Annual Projection
                </div>
                <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                  $
                  {annualProjection.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on {referralCount} consistent monthly referrals
                </div>
              </div>

              {/* Calculator Apply button */}
              {calcApplyState === "success" ? (
                <div className="rounded-xl border border-[oklch(0.72_0.19_145/0.4)] bg-[oklch(0.72_0.19_145/0.08)] px-4 py-3 flex items-center gap-2.5 transition-all duration-300 animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4 text-[oklch(0.82_0.19_145)] flex-shrink-0" />
                  <p className="text-xs text-[oklch(0.82_0.19_145)]">
                    <strong>Application submitted</strong> for{" "}
                    <span className="capitalize">{tierLabel}</span> tier — check
                    your affiliate dashboard
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  disabled={calcApplyState === "loading"}
                  onClick={handleCalcApply}
                  data-ocid="partners.calc_apply.button"
                >
                  {calcApplyState === "loading" ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Start Earning as {tierLabel} Partner
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Node provider info */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            How Node-Provider Kickbacks Work
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "User provisions engine",
                desc: "A user spins up a Cloud Engine via your referral link on any provider (AWS, GCP, Azure).",
              },
              {
                step: "02",
                title: "ICP tracks on-chain",
                desc: "The provisioning event is recorded on-chain through ICP's demand-driven compute model.",
              },
              {
                step: "03",
                title: "Kickback credited",
                desc: "You earn your tier % of the node-provider rental fee, credited monthly to your affiliate balance.",
              },
            ].map((s) => (
              <div key={s.step} className="space-y-2">
                <div className="font-mono text-xs text-primary font-bold">
                  {s.step}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {s.title}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {applyState === "success" ? (
        <div className="rounded-xl border border-[oklch(0.72_0.19_145/0.4)] bg-[oklch(0.72_0.19_145/0.08)] p-6 flex flex-col items-center gap-4 text-center transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[oklch(0.72_0.19_145/0.2)] border border-[oklch(0.72_0.19_145/0.4)]">
            <Check
              className="w-7 h-7 text-[oklch(0.82_0.19_145)]"
              strokeWidth={2.5}
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">
              Application Submitted!
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Welcome to the LockFree Partner Network. We&apos;ll review your
              application and assign your tier based on referral volume.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border"
            style={{
              background: `${tierColors[tier].accent}20`,
              borderColor: `${tierColors[tier].accent}50`,
              color: tierColors[tier].accent,
            }}
          >
            {tier === "gold" ? (
              <Star className="w-4 h-4 fill-current" />
            ) : tier === "silver" ? (
              <Award className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            {tierLabel} Partner
          </div>
          <Button
            className="gap-2 mt-2"
            onClick={() => onNavigate("referrals")}
            data-ocid="partners.setup_affiliate.button"
          >
            <Users className="w-4 h-4" />
            Set Up Your Affiliate Account
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg">
              Ready to become a partner?
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Join the affiliate program and start earning from the ICP
              ecosystem.
            </p>
          </div>
          <Button
            className="gap-2 flex-shrink-0"
            disabled={applyState === "applying"}
            onClick={handleRegisterClick}
            data-ocid="partners.register_affiliate.button"
          >
            {applyState === "applying" ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Register as Affiliate
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
