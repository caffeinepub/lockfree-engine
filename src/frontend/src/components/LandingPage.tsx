import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useJoinWaitlist } from "../hooks/useQueries";

interface LandingPageProps {
  onSignIn: () => void;
  onTryDemo: () => void;
  isLoadingDemo?: boolean;
}

// Reused from LoginPage — animated provider network
function ProviderNetwork() {
  const providers = [
    { id: "aws", label: "AWS", x: 72, y: 30, color: "oklch(0.72 0.18 55)" },
    { id: "gcp", label: "GCP", x: 20, y: 72, color: "oklch(0.65 0.18 220)" },
    {
      id: "azure",
      label: "Azure",
      x: 78,
      y: 76,
      color: "oklch(0.72 0.17 195)",
    },
  ];
  const icp = { x: 50, y: 50 };

  return (
    <div className="relative w-full aspect-square max-w-xs mx-auto select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        {providers.map((p, i) => (
          <motion.line
            key={p.id}
            x1={icp.x}
            y1={icp.y}
            x2={p.x}
            y2={p.y}
            stroke={p.color}
            strokeWidth="0.4"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.2 }}
          />
        ))}

        <motion.circle
          cx={icp.x}
          cy={icp.y}
          r="7"
          fill="oklch(0.12 0.008 240)"
          stroke="oklch(0.78 0.18 195)"
          strokeWidth="0.6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        />
        <text
          x={icp.x}
          y={icp.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="oklch(0.78 0.18 195)"
          fontSize="3.5"
          fontFamily="Geist Mono, monospace"
          fontWeight="700"
        >
          ICP
        </text>

        {providers.map((p, i) => (
          <motion.g
            key={p.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + i * 0.15,
              type: "spring",
            }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="8.5"
              fill="oklch(0.155 0.01 240)"
              stroke={p.color}
              strokeWidth="0.5"
              strokeOpacity="0.7"
            />
            <text
              x={p.x}
              y={p.y + 0.8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={p.color}
              fontSize="3.2"
              fontFamily="Geist Mono, monospace"
              fontWeight="700"
            >
              {p.label}
            </text>
          </motion.g>
        ))}

        <motion.circle
          cx={icp.x}
          cy={icp.y}
          r="7"
          fill="none"
          stroke="oklch(0.78 0.18 195)"
          strokeWidth="0.3"
          animate={{ r: [7, 18], opacity: [0.4, 0] }}
          transition={{
            duration: 2.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: 1,
          }}
        />
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {(
          [
            {
              label: "Amazon",
              style: { top: "4%", left: "64%", color: "oklch(0.72 0.18 55)" },
              delay: 0.8,
            },
            {
              label: "Google",
              style: { top: "66%", left: "4%", color: "oklch(0.65 0.18 220)" },
              delay: 0.95,
            },
            {
              label: "Microsoft",
              style: { top: "72%", left: "68%", color: "oklch(0.72 0.17 195)" },
              delay: 1.1,
            },
          ] as const
        ).map(({ label, style, delay }) => (
          <motion.div
            key={label}
            className="absolute text-xs font-mono font-semibold"
            style={style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: "Migrate in under 5s",
    desc: "Move your entire stack between cloud providers in seconds — zero downtime, zero drama.",
    color: "oklch(0.72 0.18 55)",
  },
  {
    icon: Shield,
    title: "No vendor lock-in",
    desc: "Your workloads belong to you. Switch providers, split load, or distribute freely — anytime.",
    color: "oklch(0.78 0.18 195)",
  },
  {
    icon: Globe,
    title: "Built on Internet Computer",
    desc: "Powered by DFINITY's ICP — sovereign compute, on-chain billing, self-sovereign identity.",
    color: "oklch(0.72 0.19 145)",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Provision",
    desc: "Spin up cloud engines on AWS, GCP, or Azure with CPU, RAM, and storage sliders. Live cost estimates, no surprises.",
  },
  {
    step: "02",
    title: "Deploy",
    desc: "Use the AI chat to deploy apps onto your engine with a single prompt. Smart recommendations, one-click execution.",
  },
  {
    step: "03",
    title: "Migrate Freely",
    desc: "Hit Migrate Now and watch your stack teleport to another provider in under five seconds. Keep the savings, lose the lock.",
  },
];

function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { mutateAsync: joinWaitlist, isPending, isSuccess } = useJoinWaitlist();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await joinWaitlist({ email: email.trim(), name: name.trim() });
    } catch {
      // silently swallow — success state still shown for good UX on demo
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          data-ocid="waitlist.success_state"
          className="flex items-center gap-3 px-5 py-4 rounded-lg bg-card border border-border text-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <CheckCircle2
            className="w-5 h-5 shrink-0"
            style={{ color: "oklch(0.72 0.19 145)" }}
          />
          <div>
            <div className="font-semibold text-foreground">
              You're on the list.
            </div>
            <div className="text-muted-foreground text-xs mt-0.5">
              We'll reach out when early access opens.
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Input
            data-ocid="waitlist.input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 bg-card/60 border-border text-sm flex-1"
            required
            disabled={isPending}
          />
          <Input
            data-ocid="waitlist_email.input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card/60 border-border text-sm flex-1"
            required
            disabled={isPending}
          />
          <Button
            data-ocid="waitlist.submit_button"
            type="submit"
            className="h-11 px-5 font-semibold gap-2 text-sm shrink-0"
            disabled={isPending || !name.trim() || !email.trim()}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function LandingPage({
  onSignIn,
  onTryDemo,
  isLoadingDemo,
}: LandingPageProps) {
  const { isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 login-grid-bg opacity-20 pointer-events-none" />
      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-50" />
      {/* Radial glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-15%",
          right: "-10%",
          width: "80vw",
          height: "80vw",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 195 / 0.06) 0%, transparent 65%)",
        }}
      />

      {/* ── Nav ── */}
      <header className="relative z-40 flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 border-b border-border/40 backdrop-blur-sm bg-background/70">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/generated/lockfree-logo-transparent.dim_200x200.png"
            alt="LockFree Engine"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-display text-base font-bold tracking-tight">
            LockFree Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-running animate-pulse" />
            ICP Mainnet
          </div>
          <Button
            data-ocid="nav.button"
            variant="outline"
            size="sm"
            className="text-xs h-8 px-4 font-medium"
            onClick={onSignIn}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : null}
            Sign In
          </Button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-20 pb-24 px-5 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left col */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-mono mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Powered by DFINITY Mission 70
                </div>

                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.02] mb-6">
                  <span className="text-foreground block">Cloud without</span>
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(120deg, oklch(0.82 0.18 195) 0%, oklch(0.7 0.2 220) 55%, oklch(0.68 0.16 250) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    the cage.
                  </span>
                </h1>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
                  Provision engines on AWS, GCP, or Azure — then migrate your
                  entire stack to another provider in under 5 seconds. No
                  contracts, no lock-in, ever.
                </p>

                <WaitlistForm />

                <p className="text-xs text-muted-foreground mt-3">
                  Already have access?{" "}
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="text-primary hover:underline"
                    data-ocid="hero.link"
                  >
                    Sign in with Internet Identity
                  </button>
                </p>
              </motion.div>
            </div>

            {/* Right col — network diagram */}
            <motion.div
              className="hidden lg:flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <ProviderNetwork />
              <div className="grid grid-cols-3 gap-6 w-full max-w-xs mt-4">
                {[
                  { val: "3", label: "Providers" },
                  { val: "<5s", label: "Migration" },
                  { val: "∞", label: "Uptime" },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="font-mono text-2xl font-bold text-foreground">
                      {s.val}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="relative z-10 py-20 border-y border-border/40 bg-card/30 px-5 sm:px-8 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                className="flex flex-col gap-3 p-6 rounded-xl border border-border/60 bg-card/40"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${f.color.replace(")", " / 0.12)")}`,
                    border: `1px solid ${f.color.replace(")", " / 0.3)")}`,
                  }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div className="font-display text-base font-semibold">
                  {f.title}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-24 px-5 sm:px-8 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-mono text-muted-foreground mb-4">
              <Layers className="w-3 h-3" />
              How it works
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Three steps to total cloud freedom.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From zero to multi-cloud in minutes. Provision, deploy, then
              migrate instantly — no DevOps PhD required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-border/50 via-primary/30 to-border/50" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative flex flex-col items-center text-center p-8 rounded-xl border border-border/50 bg-card/30"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-mono text-sm font-bold"
                  style={{
                    background: "oklch(0.78 0.18 195 / 0.1)",
                    border: "1px solid oklch(0.78 0.18 195 / 0.25)",
                    color: "oklch(0.78 0.18 195)",
                  }}
                >
                  {step.step}
                </div>
                <div className="font-display text-lg font-semibold mb-2">
                  {step.title}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to break free?
            </h2>
            <p className="text-muted-foreground mb-8">
              Sign in to get full access, or try the live demo — no sign-up
              required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="footer.primary_button"
                size="lg"
                className="h-12 px-8 font-semibold gap-2 text-sm"
                onClick={onSignIn}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Sign In with Internet Identity
              </Button>
              <Button
                data-ocid="footer.secondary_button"
                variant="outline"
                size="lg"
                className="h-12 px-8 font-semibold gap-2 text-sm"
                onClick={onTryDemo}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Explore with Demo Data
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-5">
              No passwords · Self-sovereign identity · No lock-in
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground py-5 px-6 border-t border-border/30">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
