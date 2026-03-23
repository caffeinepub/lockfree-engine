import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Globe,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  MapPin,
  Network,
  Rocket,
  Shield,
  Star,
  TrendingUp,
  Truck,
  Users2,
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
  onTerms?: () => void;
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

const CLOUD_ENGINE_FEATURES = [
  {
    icon: MapPin,
    title: "Park it anywhere",
    desc: "Move between AWS, Google Cloud, or Azure without rebuilding from scratch. Your workload runs the same way regardless of where it's deployed.",
  },
  {
    icon: TrendingUp,
    title: "Scale up or down",
    desc: "Need more power today? Upgrade the engine. Quieter period? Downsize and save money. You control the dials.",
  },
  {
    icon: Copy,
    title: "Run multiple trucks",
    desc: "Spin up several engines in different locations for resilience and speed. Distribute load across regions with a click.",
  },
  {
    icon: LogOut,
    title: "Pick up and leave",
    desc: "If one provider gets too expensive or goes down, you migrate to another without losing your business. Zero lock-in, ever.",
  },
];

const TECH_STACK = [
  {
    badge: "// motoko",
    icon: Code2,
    title: "Motoko Backend",
    desc: "The entire application logic runs in a Motoko actor deployed as an ICP canister. Motoko is purpose-built for the Internet Computer — compiled to WebAssembly, with orthogonal persistence (heap state survives upgrades via stable variables), and an actor model that enforces asynchronous message passing with no shared mutable state.",
    color: "oklch(0.78 0.18 55)",
    bgColor: "oklch(0.78 0.18 55 / 0.07)",
    borderColor: "oklch(0.78 0.18 55 / 0.22)",
  },
  {
    badge: "// react + typescript",
    icon: Globe,
    title: "React Frontend",
    desc: "The UI is a React + TypeScript app served directly from the frontend canister via ICP's HTTP gateway — no CDN, no hosting bill. The frontend communicates with the backend actor via auto-generated Candid bindings, with React Query managing cache invalidation on every mutation.",
    color: "oklch(0.68 0.18 220)",
    bgColor: "oklch(0.68 0.18 220 / 0.07)",
    borderColor: "oklch(0.68 0.18 220 / 0.22)",
  },
  {
    badge: "// dfinity",
    icon: Shield,
    title: "Internet Identity",
    desc: "Authentication uses DFINITY's Internet Identity — a WebAuthn-based, self-sovereign identity system. Credentials are stored as cryptographic key pairs on the user's device. No passwords, no email, no centralised identity provider. Each session generates a delegation chain scoped to the canister.",
    color: "oklch(0.82 0.22 195)",
    bgColor: "oklch(0.82 0.22 195 / 0.07)",
    borderColor: "oklch(0.82 0.22 195 / 0.22)",
  },
  {
    badge: "// icp nns",
    icon: Network,
    title: "Network Nervous System",
    desc: "The ICP network is governed by the NNS — an on-chain DAO that controls subnet creation, node operator membership, and protocol upgrades. Cloud Engines are dedicated private subnets allocated via NNS proposal, giving enterprises configurable compute with on-chain governance and no hyperscaler dependency.",
    color: "oklch(0.72 0.2 310)",
    bgColor: "oklch(0.72 0.2 310 / 0.07)",
    borderColor: "oklch(0.72 0.2 310 / 0.22)",
  },
];

const STACK_TRACE = [
  "React UI",
  "Motoko Canister",
  "ICP Network",
  "Cloud Engine",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Provision",
    desc: "Spin up a Cloud Engine canister on your chosen provider. CPU, RAM, and storage parameters are passed via Candid to the Motoko backend, which stores the Engine record in a stable HashMap — persisting state across canister upgrades without a database.",
  },
  {
    step: "02",
    title: "Deploy",
    desc: "The AI Deploy Chat injects your engine context into each prompt, routing deployment commands as update calls to the backend actor. All state mutations go through the Internet Computer's consensus layer — no centralised server, no single point of failure.",
  },
  {
    step: "03",
    title: "Migrate Freely",
    desc: "Migration calls a subnet transfer endpoint on the Cloud Engines API. The simulation layer is architected to swap in the live DFINITY endpoint with no UI changes required — the Motoko actor interface stays identical. Zero downtime, zero lock-in.",
  },
];

const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    label: "Now: Visualization & Demo",
    status: "LIVE" as const,
    accent: "oklch(0.72 0.19 145)",
    accentBg: "oklch(0.72 0.19 145 / 0.08)",
    accentBorder: "oklch(0.72 0.19 145 / 0.28)",
    items: [
      "Interactive dashboard demo",
      "Engine provisioning simulation",
      "Migration flow simulation",
      "AI Deploy Chat",
      "Affiliate & referral program",
    ],
  },
  {
    phase: "Phase 2",
    label: "Beta API Access",
    status: "UPCOMING" as const,
    accent: "oklch(0.82 0.22 195)",
    accentBg: "oklch(0.82 0.22 195 / 0.06)",
    accentBorder: "oklch(0.82 0.22 195 / 0.22)",
    items: [
      "ICP Cloud Engines API integration (Mission 70)",
      "Real engine provisioning on ICP",
      "Live cost metering in ICP cycles",
      "Private sector enterprise onboarding",
      "AI agent workload deployment support",
      "Beta partner onboarding",
    ],
  },
  {
    phase: "Phase 3",
    label: "Full Production",
    status: "FUTURE" as const,
    accent: "oklch(0.72 0.2 310)",
    accentBg: "oklch(0.72 0.2 310 / 0.06)",
    accentBorder: "oklch(0.72 0.2 310 / 0.22)",
    items: [
      "Multi-region engine orchestration",
      "Enterprise SLA guarantees for private sector clients",
      "AI agent infrastructure management",
      "White-label platform licensing",
      "Full NNS governance integration",
      "Public API for third-party integrations",
    ],
  },
];

const VISION_CARDS = [
  {
    icon: Layers,
    title: "The Infrastructure Layer",
    body: "Every developer building on ICP will need a way to provision, manage, and migrate cloud engines. LockFree Engine becomes the canonical tool for that — the AWS Console equivalent for the Internet Computer era.",
    accent: "oklch(0.82 0.22 195)",
    accentBg: "oklch(0.82 0.22 195 / 0.07)",
    accentBorder: "oklch(0.82 0.22 195 / 0.22)",
  },
  {
    icon: Users2,
    title: "The Enterprise Standard",
    body: "Fortune 500 teams and Web3-native companies alike will use white-labeled LockFree Engine deployments to manage their own cloud engine fleets. Demand-driven compute, no contracts, no lock-in.",
    accent: "oklch(0.74 0.19 145)",
    accentBg: "oklch(0.74 0.19 145 / 0.07)",
    accentBorder: "oklch(0.74 0.19 145 / 0.22)",
  },
  {
    icon: Globe,
    title: "The Open Ecosystem",
    body: "A public API and affiliate ecosystem means any tool, platform, or marketplace can integrate cloud engine management. LockFree Engine becomes infrastructure, not just an app.",
    accent: "oklch(0.72 0.2 310)",
    accentBg: "oklch(0.72 0.2 310 / 0.07)",
    accentBorder: "oklch(0.72 0.2 310 / 0.22)",
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
        <>
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
        </>
      )}
    </AnimatePresence>
  );
}

export function LandingPage({
  onSignIn,
  onTryDemo: _onTryDemo,
  isLoadingDemo: _isLoadingDemo,
  onTerms,
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
          <button
            type="button"
            onClick={() => onTerms?.()}
            className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.terms.link"
          >
            Terms
          </button>
          <Button
            data-ocid="nav.button"
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
                  className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-md"
                  style={{ fontWeight: 400 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.35 }}
                >
                  Provision engines on AWS, GCP, or Azure — then migrate your
                  entire stack to another provider in under 5 seconds. Built for
                  private sector companies that need sovereign, secure compute
                  for their data. No contracts, no lock-in, ever.
                </motion.p>

                {/* Dom quote credibility badge */}
                <motion.div
                  className="flex items-start gap-0 mb-8 max-w-md"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.42 }}
                >
                  <div
                    className="w-0.5 self-stretch rounded-full shrink-0 mr-3"
                    style={{ background: "oklch(0.82 0.22 195 / 0.55)" }}
                  />
                  <p
                    className="font-mono text-xs italic leading-relaxed"
                    style={{ color: "oklch(0.72 0.12 195)" }}
                  >
                    &ldquo;A visualization of what cloud engines can do.&rdquo;
                    <span
                      className="not-italic ml-1.5 font-medium md:block md:mt-1 md:ml-0"
                      style={{ color: "oklch(0.60 0.08 195)" }}
                    >
                      — Dominic Williams, DFINITY
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.48 }}
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
                  { val: "\u221e", label: "Uptime" },
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
      <section className="relative z-10 py-24 border-y border-border/30 bg-card/20 backdrop-blur-sm px-5 sm:px-8 md:px-12">
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

      {/* Private Sector / AI Agents callout */}
      <section className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-y border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono mb-6"
            style={{
              background: "oklch(0.82 0.22 195 / 0.06)",
              borderColor: "oklch(0.82 0.22 195 / 0.25)",
              color: "oklch(0.82 0.22 195)",
            }}
          >
            <span>The Private Sector Opportunity</span>
          </div>
          <h2
            className="font-display font-bold tracking-tight mb-4"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)" }}
          >
            Built for the companies AI runs on
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-10">
            Governments already have their cloud contracts locked in. The gap is
            in the private sector — the companies handling sensitive business
            data, running AI agents, and building the next generation of
            enterprise software. They need sovereign, auditable compute that no
            hyperscaler controls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div
              className="flex flex-col gap-4 p-8 rounded-xl border backdrop-blur-sm"
              style={{
                background: "oklch(0.45 0.18 264 / 0.12)",
                borderColor: "oklch(0.55 0.18 264 / 0.25)",
                borderLeft: "3px solid oklch(0.55 0.18 264 / 0.5)",
              }}
            >
              <div
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.7 0.18 264)" }}
              >
                Data Sovereignty
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your business data stays in infrastructure you control — not on
                servers owned by a competitor.
              </p>
            </div>
            <div
              className="flex flex-col gap-4 p-8 rounded-xl border backdrop-blur-sm"
              style={{
                background: "oklch(0.82 0.22 195 / 0.08)",
                borderColor: "oklch(0.82 0.22 195 / 0.22)",
                borderLeft: "3px solid oklch(0.82 0.22 195 / 0.5)",
              }}
            >
              <div
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.82 0.22 195)" }}
              >
                AI Agent Security
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The next wave of enterprise AI runs agents directly on your
                data. That compute needs to be isolated, auditable, and
                sovereign.
              </p>
            </div>
            <div
              className="flex flex-col gap-4 p-8 rounded-xl border backdrop-blur-sm"
              style={{
                background: "oklch(0.65 0.18 158 / 0.1)",
                borderColor: "oklch(0.65 0.18 158 / 0.25)",
                borderLeft: "3px solid oklch(0.65 0.18 158 / 0.5)",
              }}
            >
              <div
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.72 0.18 158)" }}
              >
                No Hyperscaler Dependency
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AWS, Google, and Microsoft all have commercial interests in the
                data they process. ICP doesn't.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is a Cloud Engine? ── */}
      <section
        className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-y border-border/30"
        style={{ background: "oklch(0.12 0.014 243 / 0.5)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column — text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-6"
                style={{
                  background: "oklch(0.82 0.22 195 / 0.06)",
                  borderColor: "oklch(0.82 0.22 195 / 0.25)",
                  color: "oklch(0.82 0.22 195)",
                }}
              >
                <Truck className="w-3 h-3" />
                What is a Cloud Engine?
              </div>

              <h2
                className="font-display font-bold tracking-tight mb-5"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
              >
                Your cloud. Fully portable.
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                Think of it like owning a food truck instead of a restaurant. A
                traditional restaurant is fixed in one location — you're stuck
                with one landlord, one location, and if you want to move, it's a
                huge, expensive ordeal. A cloud engine is your food truck. It
                contains everything you need to run your business, and you can
                take it anywhere.
              </p>

              <p className="text-sm text-muted-foreground/75 leading-relaxed italic">
                LockFree Engine is the dashboard that makes all of this possible
                — from one place, across every major cloud provider.
              </p>
            </motion.div>

            {/* Right column — 2x2 feature cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {CLOUD_ENGINE_FEATURES.map((feat) => (
                <motion.div
                  key={feat.title}
                  className="border border-border/40 bg-card/30 rounded-xl p-5 flex flex-col gap-3"
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "oklch(0.82 0.22 195 / 0.08)",
                      border: "1px solid oklch(0.82 0.22 195 / 0.22)",
                    }}
                  >
                    <feat.icon
                      className="w-4 h-4"
                      style={{ color: "oklch(0.82 0.22 195)" }}
                    />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground mb-1">
                      {feat.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Technical Depth: Built on a different kind of cloud ── */}
      <section
        className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-b border-border/30 overflow-hidden"
        style={{ background: "oklch(0.11 0.014 243 / 0.6)" }}
      >
        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.82 0.22 195 / 0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Atmospheric focal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.82 0.22 195 / 0.04) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Section header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5"
              style={{
                background: "oklch(0.82 0.22 195 / 0.06)",
                borderColor: "oklch(0.82 0.22 195 / 0.25)",
                color: "oklch(0.82 0.22 195)",
              }}
            >
              <Code2 className="w-3 h-3" />
              Under the hood
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Built on a different kind of cloud.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              Every part of LockFree Engine runs on the Internet Computer — no
              AWS, no GCP, no Azure under the hood. Here's exactly what that
              means.
            </p>
          </motion.div>

          {/* 2×2 tech stack cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {TECH_STACK.map((card) => (
              <motion.div
                key={card.title}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl border backdrop-blur-sm overflow-hidden"
                style={{
                  background: card.bgColor,
                  borderColor: card.borderColor,
                }}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {/* Corner glow on hover */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${card.color.replace(")", " / 0.15)")} 0%, transparent 70%)`,
                  }}
                />

                {/* Badge row */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-md border"
                    style={{
                      color: card.color,
                      borderColor: card.borderColor,
                      background: card.bgColor,
                    }}
                  >
                    {card.badge}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: card.bgColor,
                      border: `1px solid ${card.borderColor}`,
                    }}
                  >
                    <card.icon
                      className="w-4 h-4"
                      style={{ color: card.color }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display font-semibold text-base mb-2 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stack trace bar */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              className="inline-flex items-center gap-0 rounded-xl border px-1 py-1 overflow-x-auto max-w-full"
              style={{
                borderColor: "oklch(0.82 0.22 195 / 0.18)",
                background: "oklch(0.13 0.016 243 / 0.8)",
              }}
            >
              {STACK_TRACE.map((step, i) => (
                <div key={step} className="flex items-center">
                  <motion.span
                    className="font-mono text-xs px-3.5 py-2 rounded-lg whitespace-nowrap"
                    style={{ color: "oklch(0.82 0.22 195)" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    {step}
                  </motion.span>
                  {i < STACK_TRACE.length - 1 && (
                    <motion.span
                      className="font-mono text-xs px-1 select-none"
                      style={{ color: "oklch(0.82 0.22 195 / 0.35)" }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      →
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
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
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5"
              style={{
                background: "oklch(0.82 0.22 195 / 0.06)",
                borderColor: "oklch(0.82 0.22 195 / 0.25)",
                color: "oklch(0.82 0.22 195)",
              }}
            >
              <Layers
                className="w-3 h-3"
                style={{ color: "oklch(0.82 0.22 195)" }}
              />
              How it works
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Three steps to total cloud freedom.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
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

      {/* ── Security & Trust ── */}
      <section className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5"
              style={{
                background: "oklch(0.82 0.22 195 / 0.06)",
                borderColor: "oklch(0.82 0.22 195 / 0.25)",
                color: "oklch(0.82 0.22 195)",
              }}
            >
              <Shield
                className="w-3 h-3"
                style={{ color: "oklch(0.82 0.22 195)" }}
              />
              Security &amp; Trust
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Built on infrastructure you can trust.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              No centralised server. No password database. No lock-in. These
              aren't marketing claims — they're technical facts about how ICP
              works.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: "ICP Architecture",
                body: "No centralised server. Your data lives in tamper-proof canisters on the Internet Computer, replicated across independent node providers worldwide. No single point of failure or control.",
                accent: "0.82 0.22 195",
              },
              {
                icon: KeyRound,
                title: "Internet Identity",
                body: "No passwords stored. Authentication uses cryptographic keys via DFINITY's Internet Identity protocol. Your login cannot be stolen from a database because there is no password database.",
                accent: "0.72 0.19 145",
              },
              {
                icon: Users2,
                title: "Referral Fair Use",
                body: "All referral and affiliate activity is monitored for abuse. Payouts require a genuine new user to provision at least one engine. A 50-referral cap and manual review process protect all participants.",
                accent: "0.75 0.18 60",
              },
              {
                icon: Download,
                title: "Data Sovereignty",
                body: "Export your full account data at any time as JSON or CSV from Account Settings. LockFree Engine does not lock you in — true to our name. Your data belongs to you.",
                accent: "0.72 0.17 290",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `oklch(${card.accent} / 0.1)`,
                    border: `1px solid oklch(${card.accent} / 0.25)`,
                  }}
                >
                  <card.icon
                    className="w-4.5 h-4.5"
                    style={{
                      color: `oklch(${card.accent})`,
                      width: 18,
                      height: 18,
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dom Testimonial ── */}
      <section
        className="relative z-10 py-28 px-5 sm:px-8 md:px-12 border-t border-border/30 overflow-hidden"
        style={{ background: "oklch(0.12 0.014 243 / 0.5)" }}
      >
        {/* Radial focal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.82 0.22 195 / 0.06) 0%, transparent 65%)",
          }}
        />
        {/* Subtle top shimmer */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.82 0.22 195 / 0.3) 40%, oklch(0.82 0.22 195 / 0.3) 60%, transparent)",
          }}
        />

        <div className="max-w-3xl md:max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* DFINITY badge */}
            <div className="flex justify-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono"
                style={{
                  background: "oklch(0.82 0.22 195 / 0.06)",
                  borderColor: "oklch(0.82 0.22 195 / 0.25)",
                  color: "oklch(0.82 0.22 195)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                DFINITY Foundation
              </div>
            </div>

            {/* Giant decorative opening quote */}
            <div
              className="font-display leading-none select-none mb-2 text-center"
              style={{
                fontSize: "6rem",
                color: "oklch(0.82 0.22 195 / 0.18)",
                lineHeight: 0.85,
                marginBottom: "-1.5rem",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            {/* Quote text */}
            <blockquote>
              <p
                className="font-display italic font-medium leading-relaxed mb-8 text-foreground md:whitespace-nowrap"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)" }}
              >
                Ha that&apos;s cool.. kind of a visualization of what cloud
                engines can do.. I like
              </p>

              {/* Attribution */}
              <footer>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 h-px mb-2"
                    style={{ background: "oklch(0.82 0.22 195 / 0.4)" }}
                  />
                  <cite className="not-italic font-display font-semibold text-foreground text-base">
                    Dominic Williams
                  </cite>
                  <p className="text-sm text-muted-foreground font-medium">
                    Founder &amp; Chief Scientist, DFINITY Foundation
                  </p>
                  <p
                    className="font-mono text-xs mt-2 italic"
                    style={{ color: "oklch(0.60 0.08 195)" }}
                  >
                    Unsolicited reaction on seeing LockFree Engine for the first
                    time
                  </p>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section
        className="relative z-10 py-24 px-5 sm:px-8 md:px-12 border-t border-border/30 overflow-hidden"
        style={{ background: "oklch(0.11 0.014 243 / 0.7)" }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 100%, oklch(0.82 0.22 195 / 0.04) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5"
              style={{
                background: "oklch(0.82 0.22 195 / 0.06)",
                borderColor: "oklch(0.82 0.22 195 / 0.25)",
                color: "oklch(0.82 0.22 195)",
              }}
            >
              <Calendar className="w-3 h-3" />
              Roadmap
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              The road to full cloud freedom.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              LockFree Engine is a working demo today. When the ICP Cloud
              Engines API goes public, this becomes the real thing.
            </p>
          </motion.div>

          {/* Desktop: horizontal connector line */}
          <div className="hidden lg:block relative mb-2">
            <div
              className="absolute left-[16.66%] right-[16.66%] top-[2.2rem] h-px"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.72 0.19 145 / 0.5), oklch(0.82 0.22 195 / 0.5), oklch(0.72 0.2 310 / 0.5))",
              }}
            />
          </div>

          {/* Phase cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.14 } },
            }}
          >
            {ROADMAP_PHASES.map((phase) => (
              <motion.div
                key={phase.phase}
                className="relative flex flex-col rounded-2xl border backdrop-blur-sm overflow-hidden"
                style={{
                  background: phase.accentBg,
                  borderColor: phase.accentBorder,
                }}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {/* Top status bar */}
                <div
                  className="h-0.5 w-full"
                  style={{
                    background:
                      phase.status === "LIVE"
                        ? `linear-gradient(to right, ${phase.accent}, ${phase.accent.replace(")", " / 0.3)")})`
                        : `linear-gradient(to right, ${phase.accent.replace(")", " / 0.25)")}, transparent)`,
                  }}
                />

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Phase label + status pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div
                        className="font-mono text-[10px] font-semibold tracking-widest uppercase mb-1"
                        style={{ color: phase.accent }}
                      >
                        {phase.phase}
                      </div>
                      <div className="font-display font-semibold text-foreground text-base leading-tight">
                        {phase.label}
                      </div>
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold whitespace-nowrap"
                      style={{
                        background:
                          phase.status === "LIVE"
                            ? `${phase.accent.replace(")", " / 0.15)")}`
                            : "oklch(0.14 0.016 243 / 0.8)",
                        borderColor:
                          phase.status === "LIVE"
                            ? `${phase.accent.replace(")", " / 0.4)")}`
                            : "oklch(0.25 0.016 243)",
                        color:
                          phase.status === "LIVE"
                            ? phase.accent
                            : "oklch(0.55 0.02 240)",
                        boxShadow:
                          phase.status === "LIVE"
                            ? `0 0 10px ${phase.accent.replace(")", " / 0.3)")}`
                            : "none",
                      }}
                    >
                      {phase.status === "LIVE" && (
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: phase.accent }}
                        />
                      )}
                      {phase.status}
                    </div>
                  </div>

                  {/* Period */}

                  {/* Items */}
                  <ul className="flex flex-col gap-2 mt-1">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{
                            background:
                              phase.status === "LIVE"
                                ? phase.accent
                                : "oklch(0.35 0.016 243)",
                          }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{
                            color:
                              phase.status === "LIVE"
                                ? "oklch(0.88 0.008 240)"
                                : "oklch(0.6 0.014 240)",
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Vision / Future State ── */}
      <section
        className="relative z-10 py-28 px-5 sm:px-8 md:px-12 border-t border-border/30 overflow-hidden"
        style={{ background: "oklch(0.09 0.016 245)" }}
      >
        {/* Multi-point atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 20% 50%, oklch(0.82 0.22 195 / 0.05) 0%, transparent 60%), " +
              "radial-gradient(ellipse 50% 50% at 80% 40%, oklch(0.72 0.2 310 / 0.05) 0%, transparent 55%), " +
              "radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.74 0.19 145 / 0.04) 0%, transparent 60%)",
          }}
        />
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, oklch(0.72 0.2 310 / 0.3) 30%, oklch(0.82 0.22 195 / 0.4) 50%, oklch(0.74 0.19 145 / 0.3) 70%, transparent 100%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5"
              style={{
                background: "oklch(0.82 0.22 195 / 0.06)",
                borderColor: "oklch(0.82 0.22 195 / 0.25)",
                color: "oklch(0.82 0.22 195)",
              }}
            >
              <Rocket className="w-3 h-3" />
              Vision 2027
            </div>
            <h2
              className="font-display font-bold tracking-tight mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
            >
              What this becomes.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              When the ICP Cloud Engines API launches publicly, LockFree Engine
              transforms from a visualization into the definitive multi-cloud
              management layer for the Internet Computer ecosystem.
            </p>
          </motion.div>

          {/* Vision cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.14 } },
            }}
          >
            {VISION_CARDS.map((card) => (
              <motion.div
                key={card.title}
                className="group relative rounded-2xl border p-7 flex flex-col gap-5 overflow-hidden"
                style={{
                  background: card.accentBg,
                  borderColor: card.accentBorder,
                }}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {/* Hover corner glow */}
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${card.accent.replace(")", " / 0.18)")} 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: card.accentBg,
                    border: `1px solid ${card.accentBorder}`,
                    boxShadow: `0 0 18px ${card.accent.replace(")", " / 0.15)")}`,
                  }}
                >
                  <card.icon
                    className="w-5 h-5"
                    style={{ color: card.accent }}
                  />
                </div>

                <div>
                  <h3
                    className="font-display font-semibold text-base mb-3"
                    style={{ color: card.accent }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing statement */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-block rounded-2xl border px-8 py-6 max-w-2xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.22 195 / 0.06) 0%, oklch(0.72 0.2 310 / 0.04) 100%)",
                borderColor: "oklch(0.82 0.22 195 / 0.2)",
                boxShadow:
                  "0 0 40px oklch(0.82 0.22 195 / 0.05), inset 0 1px 0 oklch(0.82 0.22 195 / 0.08)",
              }}
            >
              <Star
                className="w-5 h-5 mx-auto mb-4"
                style={{ color: "oklch(0.82 0.22 195 / 0.5)" }}
              />
              <p
                className="font-display font-bold italic leading-snug"
                style={{
                  fontSize: "clamp(1.1rem, 2.2vw, 1.3rem)",
                  background:
                    "linear-gradient(125deg, oklch(0.92 0.14 195) 0%, oklch(0.82 0.22 195) 40%, oklch(0.72 0.2 310) 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                &ldquo;We&apos;re not waiting for the future. We&apos;re
                building the dashboard for it.&rdquo;
              </p>
            </div>
          </motion.div>
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
            <p className="text-base md:text-lg mb-10 leading-relaxed text-muted-foreground">
              Sign in to get full access,{" "}
              <span
                style={{
                  color: "oklch(0.72 0.19 145)",
                  animation: "emerald-pulse-text 1.8s ease-in-out infinite",
                }}
              >
                try the live demo
              </span>
              .
            </p>

            <div className="flex justify-center">
              <Button
                data-ocid="footer.primary_button"
                size="lg"
                className="h-12 px-8 font-semibold gap-2 text-sm"
                onClick={onSignIn}
                disabled={isLoggingIn}
                style={{
                  background: "oklch(0.52 0.17 160)",
                  color: "white",
                  border: "1px solid oklch(0.65 0.2 160 / 0.8)",
                  boxShadow:
                    "0 0 20px oklch(0.6 0.2 160 / 0.9), 0 0 50px oklch(0.55 0.2 160 / 0.6), 0 0 80px oklch(0.5 0.2 160 / 0.35)",
                  animation: "emerald-pulse 1.8s ease-in-out infinite",
                }}
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Sign In with Internet Identity
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground py-5 px-6 border-t border-border/20">
        <span>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
