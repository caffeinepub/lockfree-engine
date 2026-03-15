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

// Animated provider network diagram
function ProviderNetwork() {
  const providers = [
    { id: "aws", label: "AWS", x: 72, y: 30, color: "oklch(0.74 0.18 55)" },
    { id: "gcp", label: "GCP", x: 20, y: 72, color: "oklch(0.68 0.18 220)" },
    {
      id: "azure",
      label: "Azure",
      x: 78,
      y: 76,
      color: "oklch(0.74 0.17 195)",
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
          fill="oklch(0.1 0.014 245)"
          stroke="oklch(0.82 0.22 195)"
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
          fill="oklch(0.82 0.22 195)"
          fontSize="3.5"
          fontFamily="JetBrains Mono, monospace"
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
              fill="oklch(0.14 0.016 243)"
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
              fontFamily="JetBrains Mono, monospace"
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
          stroke="oklch(0.82 0.22 195)"
          strokeWidth="0.3"
          animate={{ r: [7, 20], opacity: [0.45, 0] }}
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
              style: { top: "4%", left: "64%", color: "oklch(0.74 0.18 55)" },
              delay: 0.8,
            },
            {
              label: "Google",
              style: { top: "66%", left: "4%", color: "oklch(0.68 0.18 220)" },
              delay: 0.95,
            },
            {
              label: "Microsoft",
              style: { top: "72%", left: "68%", color: "oklch(0.74 0.17 195)" },
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
    color: "oklch(0.74 0.18 55)",
  },
  {
    icon: Shield,
    title: "No vendor lock-in",
    desc: "Your workloads belong to you. Switch providers, split load, or distribute freely — anytime.",
    color: "oklch(0.82 0.22 195)",
  },
  {
    icon: Globe,
    title: "Built on Internet Computer",
    desc: "Powered by DFINITY's ICP — sovereign compute, on-chain billing, self-sovereign identity.",
    color: "oklch(0.74 0.19 145)",
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
      // silently swallow — success state still shown
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          data-ocid="waitlist.success_state"
          className="flex items-center gap-3 px-5 py-4 rounded-xl bg-primary/8 border border-primary/25 text-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <CheckCircle2
            className="w-5 h-5 shrink-0"
            style={{ color: "oklch(0.74 0.19 145)" }}
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
            className="h-11 bg-card/50 border-border/60 text-sm flex-1 placeholder:text-muted-foreground/60 focus:border-primary/50"
            required
            disabled={isPending}
          />
          <Input
            data-ocid="waitlist_email.input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card/50 border-border/60 text-sm flex-1 placeholder:text-muted-foreground/60 focus:border-primary/50"
            required
            disabled={isPending}
          />
          <Button
            data-ocid="waitlist.submit_button"
            type="submit"
            className="h-11 px-6 font-semibold gap-2 text-sm shrink-0 shadow-glow-sm"
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
      {/* Layered atmospheric background */}
      <div className="fixed inset-0 login-grid-bg opacity-[0.14] pointer-events-none" />
      <div className="fixed inset-0 hero-atmosphere pointer-events-none" />

      {/* Cinematic diagonal beam — signature detail */}
      <div
        className="hero-beam fixed pointer-events-none"
        style={{
          top: "-20%",
          left: "35%",
          width: "3px",
          height: "130vh",
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.82 0.22 195 / 0.18) 35%, oklch(0.82 0.22 195 / 0.08) 65%, transparent 100%)",
          transform: "rotate(-12deg)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="hero-beam fixed pointer-events-none"
        style={{
          top: "-20%",
          left: "calc(35% + 80px)",
          width: "1px",
          height: "120vh",
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.68 0.2 220 / 0.1) 40%, transparent 80%)",
          transform: "rotate(-12deg)",
          filter: "blur(0.5px)",
          animationDelay: "1.5s",
        }}
      />

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent z-50" />

      {/* ── Nav ── */}
      <header className="relative z-40 flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 border-b border-border/30 backdrop-blur-md bg-background/60">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/generated/lockfree-logo-transparent.dim_200x200.png"
            alt="LockFreeEngine"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-display text-base font-bold tracking-tight">
            LockFreeEngine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border/50 rounded-full px-3 py-1.5 bg-card/30">
            <span className="w-1.5 h-1.5 rounded-full bg-status-running animate-pulse" />
            ICP Mainnet
          </div>
          <Button
            data-ocid="nav.button"
            variant="outline"
            size="sm"
            className="text-xs h-8 px-4 font-medium border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
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
      <section className="relative z-10 pt-20 pb-28 px-5 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left col */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Mission badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono mb-9"
                  style={{
                    background: "oklch(0.82 0.22 195 / 0.06)",
                    borderColor: "oklch(0.82 0.22 195 / 0.25)",
                    color: "oklch(0.82 0.22 195)",
                  }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Powered by DFINITY Mission 70
                </motion.div>

                {/* Headline — cinematic type treatment */}
                <h1 className="font-display font-extrabold tracking-tight leading-[1.05] mb-7">
                  <motion.span
                    className="block text-foreground"
                    style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    Cloud without
                  </motion.span>
                  <motion.span
                    className="block hero-gradient-text"
                    style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    the cage.
                  </motion.span>
                </h1>

                <motion.p
                  className="text-base md:text-lg text-muted-foreground leading-relaxed mb-9 max-w-md"
                  style={{ fontWeight: 400 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.35 }}
                >
                  Provision engines on AWS, GCP, or Azure — then migrate your
                  entire stack to another provider in under 5 seconds. No
                  contracts, no lock-in, ever.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <WaitlistForm />
                </motion.div>

                <motion.p
                  className="text-xs text-muted-foreground mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Already have access?{" "}
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    data-ocid="hero.link"
                  >
                    Sign in with Internet Identity
                  </button>
                </motion.p>
              </motion.div>
            </div>

            {/* Right col — network diagram */}
            <motion.div
              className="hidden lg:flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Glowing backdrop behind diagram */}
              <div
                className="relative w-full max-w-xs"
                style={{
                  filter: "drop-shadow(0 0 60px oklch(0.82 0.22 195 / 0.12))",
                }}
              >
                <ProviderNetwork />
              </div>

              {/* Stats row */}
              <motion.div
                className="grid grid-cols-3 gap-6 w-full max-w-xs mt-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                {[
                  { val: "3", label: "Providers" },
                  { val: "<5s", label: "Migration" },
                  { val: "∞", label: "Uptime" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className="font-mono font-bold text-foreground summary-value"
                      style={{ fontSize: "1.75rem" }}
                    >
                      {s.val}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="relative z-10 py-20 border-y border-border/30 bg-card/20 backdrop-blur-sm px-5 sm:px-8 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                className="flex flex-col gap-4 p-6 rounded-xl border bg-card/40 backdrop-blur-sm"
                style={{ borderColor: `${f.color.replace(")", " / 0.2)")}` }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${f.color.replace(")", " / 0.1)")}`,
                    border: `1px solid ${f.color.replace(")", " / 0.25)")}`,
                  }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <div className="font-display text-base font-semibold mb-1.5">
                    {f.title}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </div>
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
            className="text-center mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card/50 border border-border/50 text-xs font-mono text-muted-foreground mb-5">
              <Layers className="w-3 h-3" />
              How it works
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Three steps to total cloud freedom.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              From zero to multi-cloud in minutes. Provision, deploy, then
              migrate instantly — no DevOps PhD required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-border/30 via-primary/40 to-border/30" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative flex flex-col items-center text-center p-8 rounded-xl border border-border/40 bg-card/25 backdrop-blur-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-mono text-sm font-bold"
                  style={{
                    background: "oklch(0.82 0.22 195 / 0.08)",
                    border: "1px solid oklch(0.82 0.22 195 / 0.22)",
                    color: "oklch(0.82 0.22 195)",
                    boxShadow: "0 0 16px oklch(0.82 0.22 195 / 0.08)",
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
      <section className="relative z-10 py-28 px-5 sm:px-8 md:px-12 border-t border-border/30">
        {/* Focal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.82 0.22 195 / 0.05) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-display font-bold tracking-tight mb-5"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Ready to break free?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Sign in to get full access, or try the live demo — no sign-up
              required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="footer.primary_button"
                size="lg"
                className="h-12 px-8 font-semibold gap-2 text-sm shadow-glow"
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
                className="h-12 px-8 font-semibold gap-2 text-sm border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
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

            <p className="text-xs text-muted-foreground mt-6">
              No passwords · Self-sovereign identity · No lock-in
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground py-5 px-6 border-t border-border/20">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
