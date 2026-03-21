import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  DollarSign,
  ExternalLink,
  Gift,
  Info,
  Link2,
  MousePointerClick,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetReferralCount,
  useReportReferral,
} from "../hooks/useReferralQueries";

const AFFILIATE_KEY = "lockfree_affiliate";
const REFERRAL_CREDITS_KEY = "lockfree_referral_credits";
const REFERRAL_BANNER_SHOWN_KEY = "lockfree_referral_banner_shown";

interface AffiliateData {
  name: string;
  email: string;
  referralCode: string;
  clickCount: number;
  signupCount: number;
  paidConversions: number;
  totalEarned: number;
  joinedAt: string;
}

interface ReferralCredit {
  fromCode: string;
  creditedAt: string;
  creditedMonths: number;
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LFE-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function loadAffiliate(): AffiliateData | null {
  try {
    const raw = localStorage.getItem(AFFILIATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadCredits(): ReferralCredit[] {
  try {
    const raw = localStorage.getItem(REFERRAL_CREDITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: accent
            ? `oklch(${accent} / 0.12)`
            : "oklch(0.2 0.01 240)",
          border: accent
            ? `1px solid oklch(${accent} / 0.25)`
            : "1px solid oklch(0.25 0.01 240)",
        }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: accent ? `oklch(${accent})` : "currentColor" }}
        />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-mono font-bold text-lg text-foreground tabular-nums">
          {value}
        </div>
      </div>
    </div>
  );
}

// ─── Copy Row ─────────────────────────────────────────────────────────────────
function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted/40 border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground truncate">
          {value}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-9 px-3 gap-1.5 flex-shrink-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

// ─── Affiliate Tab ────────────────────────────────────────────────────────────
function AffiliateTab() {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(
    loadAffiliate,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [registerState, setRegisterState] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [registerStep, setRegisterStep] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [payoutState, setPayoutState] = useState<
    "confirm" | "processing" | "success"
  >("confirm");

  // Hook must be called unconditionally before any early return
  const { data: referralCount } = useGetReferralCount(
    affiliate?.referralCode ?? "",
  );

  const REGISTER_STEPS = [
    "Generating your code...",
    "Setting up account...",
    "Almost ready...",
  ];

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const code = generateCode();
    setGeneratedCode(code);
    setRegisterState("submitting");
    setRegisterStep(0);

    // Advance through steps
    setTimeout(() => setRegisterStep(1), 600);
    setTimeout(() => setRegisterStep(2), 1200);
    setTimeout(() => {
      const data: AffiliateData = {
        name: name.trim(),
        email: email.trim(),
        referralCode: code,
        clickCount: 47,
        signupCount: 12,
        paidConversions: 8,
        totalEarned: 11.6,
        joinedAt: new Date().toISOString(),
      };
      localStorage.setItem(AFFILIATE_KEY, JSON.stringify(data));
      setRegisterState("success");
      // Auto-transition to dashboard after 3s
      setTimeout(() => {
        setAffiliate(data);
      }, 3000);
    }, 1800);
  }

  function handleGoToDashboard() {
    const data = loadAffiliate();
    if (data) setAffiliate(data);
  }

  function handlePayoutConfirm() {
    if (!affiliate) return;
    setPayoutState("processing");
    setTimeout(() => {
      setPayoutState("success");
      const amount = affiliate.totalEarned.toFixed(2);
      const updated = { ...affiliate, totalEarned: 0 };
      localStorage.setItem(AFFILIATE_KEY, JSON.stringify(updated));
      setAffiliate(updated);
      setTimeout(() => {
        setPayoutOpen(false);
        setPayoutState("confirm");
        toast.success(`Payout of $${amount} requested!`);
      }, 1500);
    }, 1500);
  }

  function handlePayoutOpenChange(open: boolean) {
    setPayoutOpen(open);
    if (!open) setPayoutState("confirm");
  }

  const shareLink = affiliate
    ? `${window.location.origin}/ref/${affiliate.referralCode}`
    : "";

  // Mock breakdown rows
  const mockReferrals = [
    {
      id: "user-a2b4c1",
      date: "Feb 25, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
    {
      id: "user-f7d9e3",
      date: "Feb 22, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
    {
      id: "user-b3c5a8",
      date: "Feb 18, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
    {
      id: "user-e1f2d6",
      date: "Feb 14, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
    {
      id: "user-g4h8i2",
      date: "Feb 10, 2026",
      status: "Free",
      earned: 0,
    },
    {
      id: "user-j5k9l3",
      date: "Feb 6, 2026",
      status: "Free",
      earned: 0,
    },
    {
      id: "user-m7n1o4",
      date: "Feb 3, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
    {
      id: "user-p2q6r5",
      date: "Jan 29, 2026",
      status: "Pro (paid)",
      earned: 1.45,
    },
  ];

  // ── Registration form / success screen ──
  if (!affiliate) {
    // Success reveal screen
    if (registerState === "success") {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-xl border border-[oklch(0.72_0.19_145/0.4)] bg-[oklch(0.72_0.19_145/0.08)] p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[oklch(0.72_0.19_145/0.2)] border border-[oklch(0.72_0.19_145/0.4)] animate-in zoom-in-50 duration-300">
              <Check
                className="w-8 h-8 text-[oklch(0.82_0.19_145)]"
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                You&apos;re in!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your affiliate account is ready. Share your code to start
                earning.
              </p>
            </div>

            {/* Generated code */}
            <div className="w-full max-w-sm space-y-2">
              <Label className="text-xs text-muted-foreground">
                Your Referral Code
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[oklch(0.12_0.01_240)] border border-[oklch(0.72_0.19_145/0.3)] rounded-lg px-4 py-3 font-mono text-xl font-bold tracking-widest text-[oklch(0.82_0.19_145)] text-center">
                  {generatedCode}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-12 px-3 gap-1.5 flex-shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast.success("Code copied!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm">
              <Button
                className="gap-2"
                onClick={handleGoToDashboard}
                data-ocid="affiliate.go_to_dashboard.button"
              >
                <TrendingUp className="w-4 h-4" />
                Go to Dashboard
              </Button>
              <p className="text-xs text-muted-foreground">
                Auto-redirecting to your dashboard in a moment...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Intro */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-card/80">
            <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
              Join the Affiliate Program
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Earn <span className="text-foreground font-semibold">5%</span> of
              every Pro subscription ($1.45/mo) that signs up through your
              unique referral link. Powered by demand-driven compute on ICP —
              transparent, on-chain, no vendor lock-in.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Link2, text: "Get your link" },
                { icon: Users, text: "Share with anyone" },
                { icon: DollarSign, text: "Earn 5% forever" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border text-center"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration form */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-card/80">
            <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
              Register as Affiliate
            </h2>
          </div>
          <form onSubmit={handleRegister} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="aff-name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="aff-name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={false}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aff-email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="aff-email"
                  type="email"
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={false}
                />
              </div>
            </div>

            {/* Submitting state: progress steps */}
            {registerState === "submitting" ? (
              <div className="space-y-3 py-1">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium">
                    {REGISTER_STEPS[registerStep]}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {REGISTER_STEPS.map((step, i) => (
                    <div
                      key={step}
                      className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{
                        background:
                          i <= registerStep
                            ? "oklch(0.82 0.22 195)"
                            : "oklch(0.25 0.01 240)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Button
                type="submit"
                className="gap-2"
                disabled={false}
                data-ocid="affiliate.register.submit_button"
              >
                <Star className="w-4 h-4" />
                Join Affiliate Program
              </Button>
            )}
          </form>
        </div>
      </div>
    );
  }

  const referralUsed =
    referralCount !== undefined
      ? Number(referralCount)
      : (affiliate?.signupCount ?? 0);
  const REFERRAL_CAP = 50;
  const capPct = Math.min((referralUsed / REFERRAL_CAP) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Fair-use warning banner */}
      <div
        data-ocid="affiliate.fair_use.panel"
        className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 flex items-start gap-3"
        style={{ background: "oklch(0.75 0.18 60 / 0.08)" }}
      >
        <AlertTriangle
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: "oklch(0.82 0.18 60)" }}
        />
        <p
          className="text-xs leading-relaxed"
          style={{ color: "oklch(0.88 0.12 60)" }}
        >
          <strong>Referral Fair Use Notice — </strong>
          Referrals are reviewed before payout. Accounts generating unusual
          referral activity are flagged for manual review. Each account is
          subject to a cap of <strong>50 qualifying referrals</strong>. A
          referred user must provision at least one engine before their kickback
          counts.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Affiliate Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, {affiliate.name}
          </p>
        </div>
        <Badge className="bg-[oklch(0.72_0.19_145/0.15)] text-[oklch(0.82_0.19_145)] border-[oklch(0.72_0.19_145/0.3)] border gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.19_145)] animate-pulse" />
          Active
        </Badge>
      </div>

      {/* Referral cap indicator */}
      <div
        className="rounded-xl border border-border bg-card p-4 space-y-2"
        data-ocid="affiliate.referral_cap.card"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            Qualifying Referrals Used
          </span>
          <span className="font-mono font-bold text-foreground">
            {referralUsed} / {REFERRAL_CAP}
            {referralUsed >= REFERRAL_CAP && (
              <span className="ml-2 text-amber-400 font-normal">
                (Cap reached)
              </span>
            )}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${capPct}%`,
              background:
                capPct >= 100 ? "oklch(0.75 0.18 60)" : "oklch(0.82 0.22 195)",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {REFERRAL_CAP - referralUsed > 0
            ? `${REFERRAL_CAP - referralUsed} qualifying referrals remaining before manual review is required to extend.`
            : "You have reached the referral cap. Contact support to request a cap extension after review."}
        </p>
      </div>

      {/* Links */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Your Referral Links
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <CopyRow label="Referral Code" value={affiliate.referralCode} />
          <CopyRow label="Shareable Link" value={shareLink} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={MousePointerClick}
          label="Link Clicks"
          value={affiliate.clickCount}
          accent="0.65 0.18 220"
        />
        <StatCard
          icon={UserCheck}
          label="Signups"
          value={affiliate.signupCount}
          accent="0.72 0.17 195"
        />
        <StatCard
          icon={TrendingUp}
          label="Paid Conversions"
          value={affiliate.paidConversions}
          accent="0.72 0.19 145"
        />
        <StatCard
          icon={DollarSign}
          label="Total Earned"
          value={`$${affiliate.totalEarned.toFixed(2)}`}
          accent="0.75 0.18 60"
        />
      </div>

      {/* Earnings card */}
      <div className="rounded-xl border border-[oklch(0.75_0.18_60/0.3)] bg-[oklch(0.75_0.18_60/0.06)] overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              Accrued Earnings
            </div>
            <div className="font-mono text-3xl font-bold text-[oklch(0.85_0.18_60)] tabular-nums">
              ${affiliate.totalEarned.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Minimum $10.00 to request payout
            </div>
          </div>
          <Button
            className="gap-2 bg-[oklch(0.75_0.18_60/0.2)] hover:bg-[oklch(0.75_0.18_60/0.3)] border border-[oklch(0.75_0.18_60/0.4)] text-[oklch(0.85_0.18_60)]"
            variant="outline"
            disabled={affiliate.totalEarned < 10}
            onClick={() => setPayoutOpen(true)}
            data-ocid="affiliate.payout.button"
          >
            <DollarSign className="w-4 h-4" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Breakdown table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Referral Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Earned
                </th>
              </tr>
            </thead>
            <tbody>
              {mockReferrals.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {r.id}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {r.date}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        r.earned > 0
                          ? "bg-[oklch(0.72_0.19_145/0.1)] text-[oklch(0.82_0.19_145)] border-[oklch(0.72_0.19_145/0.3)]"
                          : "bg-muted/50 text-muted-foreground border-border"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                    {r.earned > 0 ? `$${r.earned.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity requirement note */}
      <div
        className="rounded-xl border border-border bg-card/50 p-4 flex gap-3"
        data-ocid="affiliate.activity_required.panel"
      >
        <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-foreground mb-1">
            Activity Required for Payout
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A referred user must{" "}
            <strong className="text-foreground">
              provision at least one engine
            </strong>{" "}
            before their kickback counts towards your payout total. This ensures
            all referrals represent genuine platform engagement, not passive
            signups. The engine must remain active for at least 24 hours.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">How it works: </span>
          When someone signs up through your link and upgrades to Pro, you
          automatically earn 5% of the $29/month fee — that&rsquo;s{" "}
          <span className="text-foreground font-semibold">
            $1.45 per active referral
          </span>
          . Powered by demand-driven compute on ICP. Payouts are reviewed
          manually and processed monthly via your preferred method.
        </p>
      </div>

      {/* Payout modal */}
      <Dialog open={payoutOpen} onOpenChange={handlePayoutOpenChange}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          {payoutState === "processing" ? (
            <>
              <DialogHeader>
                <DialogTitle>Processing Payout</DialogTitle>
                <DialogDescription>
                  Please wait while we process your payout request.
                </DialogDescription>
              </DialogHeader>
              <div className="py-8 flex flex-col items-center gap-4">
                <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Processing payout...
                </p>
              </div>
            </>
          ) : payoutState === "success" ? (
            <>
              <DialogHeader>
                <DialogTitle>Payout Requested!</DialogTitle>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[oklch(0.72_0.19_145/0.2)] border border-[oklch(0.72_0.19_145/0.4)]">
                  <Check
                    className="w-8 h-8 text-[oklch(0.82_0.19_145)]"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg">
                    Payout Requested!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your payout has been submitted for review.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.75_0.18_60/0.3)] bg-[oklch(0.75_0.18_60/0.08)] px-8 py-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    Amount
                  </div>
                  <div className="font-mono text-3xl font-bold text-[oklch(0.85_0.18_60)] tabular-nums">
                    $
                    {affiliate.totalEarned === 0
                      ? "11.60"
                      : affiliate.totalEarned.toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  You&apos;re requesting a payout of your accrued affiliate
                  earnings.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="rounded-lg bg-[oklch(0.75_0.18_60/0.08)] border border-[oklch(0.75_0.18_60/0.25)] p-4 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Payout Amount
                  </div>
                  <div className="font-mono text-3xl font-bold text-[oklch(0.85_0.18_60)] tabular-nums">
                    ${affiliate.totalEarned.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 flex gap-2">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-300/80">
                    <strong>Demo Mode</strong> — No real payout is processed. In
                    production, payouts would be sent to your registered payment
                    method within 5 business days.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setPayoutOpen(false)}
                  data-ocid="affiliate.payout.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayoutConfirm}
                  className="gap-2"
                  data-ocid="affiliate.payout.confirm_button"
                >
                  <DollarSign className="w-4 h-4" />
                  Confirm Payout
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Referral Tab ─────────────────────────────────────────────────────────────
function ReferralTab() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [credits, setCredits] = useState<ReferralCredit[]>(loadCredits);
  const [applyCode, setApplyCode] = useState("");
  const affiliate = loadAffiliate();
  const shareLink = affiliate
    ? `${window.location.origin}/ref/${affiliate.referralCode}`
    : `${window.location.origin}/ref/LFE-DEMO01`;
  const { mutateAsync: reportReferral, isPending: isReporting } =
    useReportReferral();

  // Show demo banner on first visit
  useEffect(() => {
    const shown = localStorage.getItem(REFERRAL_BANNER_SHOWN_KEY);
    if (!shown) {
      setBannerVisible(true);
      localStorage.setItem(REFERRAL_BANNER_SHOWN_KEY, "true");
    }
  }, []);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    const code = applyCode.trim().toUpperCase();
    if (!code) return;

    try {
      const result = await reportReferral(code);
      if (result.__kind__ === "capReached") {
        toast.error("This referral code has reached its maximum use limit.");
        return;
      }
      if (result.__kind__ === "flagged") {
        toast.warning(
          "This referral code has been flagged for review. Please contact support.",
        );
        return;
      }
      // ok
      const credit: ReferralCredit = {
        fromCode: code,
        creditedAt: new Date().toISOString(),
        creditedMonths: 1,
      };
      const updated = [...credits, credit];
      setCredits(updated);
      localStorage.setItem(REFERRAL_CREDITS_KEY, JSON.stringify(updated));
      setApplyCode("");
      toast.success("1 free Pro month credited to your account!");
    } catch {
      // Fallback for demo mode (no actor connected)
      const credit: ReferralCredit = {
        fromCode: code,
        creditedAt: new Date().toISOString(),
        creditedMonths: 1,
      };
      const updated = [...credits, credit];
      setCredits(updated);
      localStorage.setItem(REFERRAL_CREDITS_KEY, JSON.stringify(updated));
      setApplyCode("");
      toast.success("1 free Pro month credited to your account!");
    }
  }

  const allCredits: ReferralCredit[] = bannerVisible
    ? [
        {
          fromCode: "JANE-REFERRAL",
          creditedAt: new Date().toISOString(),
          creditedMonths: 1,
        },
        ...credits,
      ]
    : credits;

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      {bannerVisible && (
        <div className="rounded-xl border border-[oklch(0.72_0.19_145/0.4)] bg-[oklch(0.72_0.19_145/0.08)] px-4 py-3 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[oklch(0.82_0.19_145)] flex-shrink-0" />
          <p className="text-sm text-[oklch(0.82_0.19_145)] flex-1">
            <strong>Your referral Jane signed up</strong> — 1 free Pro month
            added to your account!
          </p>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setBannerVisible(false)}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* My referral link */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            My Referral Link
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <CopyRow label="Share this link" value={shareLink} />
          <p className="text-xs text-muted-foreground">
            When a friend signs up and activates their account, you&apos;ll
            receive{" "}
            <strong className="text-foreground">1 free Pro month</strong> — no
            vendor lock-in, ever.
          </p>
        </div>
      </div>

      {/* Apply a code */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card/80">
          <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
            Apply a Referral Code
          </h2>
        </div>
        <form onSubmit={handleApply} className="p-5 flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="ref-code" className="text-xs">
              Enter referral code (e.g. LFE-ABC123)
            </Label>
            <Input
              id="ref-code"
              placeholder="LFE-ABC123"
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value)}
              className="font-mono"
            />
          </div>
          <Button
            type="submit"
            className="gap-2 flex-shrink-0"
            disabled={isReporting}
            data-ocid="referral.apply.submit_button"
          >
            <Gift className="w-4 h-4" />
            {isReporting ? "Checking..." : "Apply"}
          </Button>
        </form>
      </div>

      {/* Credits table */}
      {allCredits.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-card/80">
            <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
              Credits Earned
            </h2>
          </div>
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Credit
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Source
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCredits.map((c) => (
                  <tr
                    key={`${c.fromCode}-${c.creditedAt}`}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(0.82_0.19_145)]">
                        <Gift className="w-3 h-3" />
                        {c.creditedMonths} free month
                        {c.creditedMonths !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      from referral
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {new Date(c.creditedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">
            Referral Program:{" "}
          </span>
          Invite friends to LockFree Engine. For every friend who signs up and
          activates an account, you receive{" "}
          <span className="text-foreground font-semibold">
            1 free Pro month
          </span>{" "}
          (worth $29). No vendor lock-in, ever. Credits are applied
          automatically and visible in your billing summary.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function ReferralsAffiliatePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Referrals & Affiliates
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Earn from every user you bring to the platform — powered by
          demand-driven compute on ICP.
        </p>
      </div>

      <Tabs defaultValue="affiliate">
        <TabsList className="bg-muted/40 border border-border">
          <TabsTrigger value="affiliate" className="gap-2 text-xs">
            <ExternalLink className="w-3.5 h-3.5" />
            Affiliate Program
          </TabsTrigger>
          <TabsTrigger value="referral" className="gap-2 text-xs">
            <Users className="w-3.5 h-3.5" />
            Referral Program
          </TabsTrigger>
        </TabsList>

        <TabsContent value="affiliate" className="mt-6">
          <AffiliateTab />
        </TabsContent>

        <TabsContent value="referral" className="mt-6">
          <ReferralTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
