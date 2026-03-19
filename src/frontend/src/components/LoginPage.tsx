import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const DEMO_PREF_KEY = "lockfree_demo_enabled";

interface LoginPageProps {
  onLoadDemo: () => void;
  isLoadingDemo?: boolean;
  isDemoMode: boolean;
  onClearDemo: () => void;
  onTerms?: () => void;
}

// Animated provider network diagram
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
    <div className="relative w-full aspect-square max-w-sm mx-auto select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        {/* Connection lines */}
        {providers.map((p, i) => (
          <motion.line
            key={p.id}
            x1={icp.x}
            y1={icp.y}
            x2={p.x}
            y2={p.y}
            stroke={p.color}
            strokeWidth="0.4"
            strokeOpacity="0.4"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.2 }}
          />
        ))}

        {/* ICP core node */}
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
        <motion.circle
          cx={icp.x}
          cy={icp.y}
          r="10"
          fill="none"
          stroke="oklch(0.78 0.18 195 / 0.15)"
          strokeWidth="0.4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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

        {/* Provider nodes */}
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
              strokeOpacity="0.6"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r="11"
              fill="none"
              stroke={p.color}
              strokeWidth="0.25"
              strokeOpacity="0.2"
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

        {/* Animated ping on ICP */}
        <motion.circle
          cx={icp.x}
          cy={icp.y}
          r="7"
          fill="none"
          stroke="oklch(0.78 0.18 195)"
          strokeWidth="0.3"
          animate={{ r: [7, 16], opacity: [0.4, 0] }}
          transition={{
            duration: 2.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: 1,
          }}
        />
      </svg>

      {/* Migrate arrow badge */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground bg-card border border-border px-2.5 py-1 rounded-full whitespace-nowrap"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        migrate in &lt; 5s
      </motion.div>
    </div>
  );
}

export function LoginPage({
  onLoadDemo,
  isLoadingDemo,
  isDemoMode,
  onClearDemo,
  onTerms,
}: LoginPageProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  // Auto-load demo data on mount — only if user has NOT explicitly disabled demo mode
  const autoLoadFired = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally fire once on mount; ref guards against re-runs
  useEffect(() => {
    if (autoLoadFired.current) return;
    autoLoadFired.current = true;
    // Respect the user's explicit preference — don't auto-load if they turned it off
    if (localStorage.getItem(DEMO_PREF_KEY) === "false") return;
    if (isDemoMode) return; // already loaded
    const t = setTimeout(() => {
      onLoadDemo();
    }, 800);
    return () => clearTimeout(t);
  }, []); // empty deps intentional — fire once on mount

  function handleDemoToggle(checked: boolean) {
    if (checked) {
      localStorage.setItem(DEMO_PREF_KEY, "true");
      onLoadDemo();
    } else {
      localStorage.setItem(DEMO_PREF_KEY, "false");
      onClearDemo();
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 login-grid-bg opacity-30" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Deep glow anchored bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          left: "-10%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 195 / 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Nav bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
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
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-running animate-pulse" />
            ICP Mainnet
          </div>
        </div>
      </header>

      {/* Two-column hero */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Headline + CTA */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-mono mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Now on Internet Computer Protocol
                </div>

                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] mb-5">
                  <span className="text-foreground block">Cloud without</span>
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(120deg, oklch(0.82 0.18 195) 0%, oklch(0.7 0.2 220) 60%, oklch(0.68 0.16 250) 100%)",
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

                {/* CTA card */}
                <div className="bg-card border border-border rounded-lg p-6 max-w-sm">
                  <div className="relative mb-3 rounded-lg btn-shimmer-border">
                    <Button
                      className="w-full h-11 font-semibold gap-2 text-sm active:scale-[0.98] relative"
                      onClick={login}
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting…
                        </>
                      ) : (
                        <>
                          Sign in with Internet Identity
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Demo Data toggle row */}
                  <div className="flex items-center justify-between gap-4 px-3 py-4 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-emerald-300 flex items-center gap-2">
                        Demo Data
                        {isLoadingDemo && (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground mt-0.5">
                        Explore the dashboard with simulated engines
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-3 rounded-full bg-emerald-400/60 animate-pulse blur-md pointer-events-none" />
                      <div
                        className="absolute -inset-1 rounded-full bg-emerald-300/80 animate-pulse blur-sm pointer-events-none"
                        style={{ animationDelay: "0.4s" }}
                      />
                      <Switch
                        checked={isDemoMode}
                        onCheckedChange={handleDemoToggle}
                        disabled={isLoadingDemo}
                        data-ocid="login.demo.toggle"
                        aria-label="Toggle demo data"
                        className="relative z-10 scale-125"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                    No passwords · Self-sovereign identity · No lock-in
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Animated network diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="hidden lg:flex flex-col items-center justify-center"
            >
              <ProviderNetwork />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-2">
                {[
                  { val: "3", label: "Providers" },
                  { val: "<5s", label: "Migration" },
                  { val: "∞", label: "Uptime" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="font-mono text-xl font-bold text-foreground">
                      {stat.val}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-muted-foreground py-4 px-6">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
          <span className="text-border/60">·</span>
          <button
            type="button"
            data-ocid="login.terms.link"
            onClick={() => onTerms?.()}
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}
