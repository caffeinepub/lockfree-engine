import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const DEMO_TOUR_SEEN_KEY = "lockfree_demo_tour_seen";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "summary-cards",
    title: "Your Live Metrics",
    description:
      "These cards show your total engines, monthly cost, average resilience score, and migrations completed. In demo mode the figures update live every few seconds — click the info icon on any card for more detail.",
  },
  {
    targetId: "new-engine-btn",
    title: "Provision a New Engine",
    description:
      "Click here to provision a new cloud engine in seconds. Choose your provider, CPU, RAM, and storage — then watch the multi-stage deployment animation.",
  },
  {
    targetId: "engine-card-0",
    title: "Your Cloud Engines",
    description:
      "Each engine runs on ICP and can migrate to any cloud provider instantly. Try the Stop/Start, Restart, and Scale buttons on a card — each runs a live progress animation and updates the engine status.",
  },
  {
    targetId: "ai-deploy-btn-0",
    title: "AI-Powered Deployment",
    description:
      "Describe any application in plain English. The AI builds and deploys it as an ICP canister directly to this engine — live in seconds.",
  },
  {
    targetId: "chat-scanner-tab",
    title: "Legacy App Scanner",
    description:
      "Switch to the Legacy App Scanner tab, paste your tech stack — Kubernetes, Node.js, PostgreSQL, or NeoCloud's own stack — and get a full component mapping plus a sovereign EU migration plan powered by Snorkel.",
  },
  {
    targetId: "snorkel-migration-progress",
    title: "Snorkel Migration in Action",
    description:
      "After scanning, click 'Start Migration with Snorkel' to watch the animated 6-step migration: parsing your stack, mapping to ICP architecture, provisioning the NeoCloud EU subnet, deploying canisters, migrating persistent state, and a final health check — ending with your workload live.",
  },
  {
    targetId: "live-cost-dashboard",
    title: "Live Cost Dashboard",
    description:
      "Your spending updates automatically every few seconds in demo mode. Hit the sparkles button to get AI-powered cost optimisation recommendations — apply them individually or all at once.",
  },
  {
    targetId: "notification-bell",
    title: "Live Notifications",
    description:
      "In demo mode, realistic alerts arrive automatically every 30–60 seconds — cost spikes, scaling events, migration completions. The badge updates in real time as new notifications land.",
  },
  {
    targetId: "billing-upgrade",
    title: "Plan Upgrade & Billing",
    description:
      "Go to Billing in the sidebar to simulate upgrading your plan. Choose a tier, go through the mock payment flow, and watch your plan update instantly — no real card needed.",
  },
  {
    targetId: "exit-demo-btn",
    title: "Ready for the Real Thing?",
    description:
      "When you're done exploring, sign in with Internet Identity to provision real engines, set up billing, and take full control of your cloud infrastructure.",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  found: boolean;
}

function getElementRect(targetId: string): SpotlightRect {
  const el = document.querySelector(`[data-tour-id="${targetId}"]`);
  if (!el) {
    return { top: 0, left: 0, width: 0, height: 0, found: false };
  }
  const rect = el.getBoundingClientRect();
  const pad = 8;
  return {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
    found: true,
  };
}

interface DemoTourProps {
  open: boolean;
  onClose: () => void;
}

export function DemoTour({ open, onClose }: DemoTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<SpotlightRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    found: false,
  });
  const rafRef = useRef<number | null>(null);

  const currentStep = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  const updateRect = useCallback(() => {
    if (!open) return;
    const r = getElementRect(TOUR_STEPS[step].targetId);
    setRect(r);
  }, [open, step]);

  // Update rect when updateRect changes (which captures step+open)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      updateRect();
    }, 100);
    return () => clearTimeout(t);
  }, [open, updateRect]);

  useEffect(() => {
    if (!open) return;
    const handleResize = () => updateRect();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [open, updateRect]);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleFinish() {
    localStorage.setItem(DEMO_TOUR_SEEN_KEY, "true");
    onClose();
  }

  function handleNext() {
    if (isLast) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Scroll target into view when step changes
  useEffect(() => {
    if (!open) return;
    const el = document.querySelector(
      `[data-tour-id="${TOUR_STEPS[step].targetId}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const t = setTimeout(updateRect, 400);
      return () => clearTimeout(t);
    }
  }, [step, open, updateRect]);

  // Card positioning: below element if space, else above
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;

  const CARD_WIDTH = 320;
  const CARD_HEIGHT_EST = 200;
  const GAP = 12;

  let cardTop: number;
  let cardLeft: number;

  if (!rect.found) {
    cardTop = viewportH / 2 - CARD_HEIGHT_EST / 2;
    cardLeft = viewportW / 2 - CARD_WIDTH / 2;
  } else {
    const spaceBelow = viewportH - (rect.top + rect.height);
    if (spaceBelow >= CARD_HEIGHT_EST + GAP) {
      cardTop = rect.top + rect.height + GAP;
    } else {
      cardTop = rect.top - CARD_HEIGHT_EST - GAP;
    }
    cardLeft = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    cardLeft = Math.max(12, Math.min(cardLeft, viewportW - CARD_WIDTH - 12));
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ pointerEvents: "none" }}
          />

          {/* Spotlight cutout using box-shadow trick */}
          {rect.found && (
            <div
              className="fixed z-[51] pointer-events-none"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: 10,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.70)",
                border: "2px solid oklch(0.82 0.22 195 / 0.6)",
                transition: "all 0.3s ease",
              }}
            />
          )}

          {/* Dark overlay when no element found */}
          {!rect.found && (
            <div
              className="fixed inset-0 z-[51] pointer-events-none"
              style={{ background: "rgba(0,0,0,0.70)" }}
            />
          )}

          {/* Floating tour card */}
          <motion.div
            key={step}
            className="fixed z-[52] pointer-events-auto"
            style={{
              top: cardTop,
              left: cardLeft,
              width: CARD_WIDTH,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-5"
              style={{
                boxShadow:
                  "0 0 0 1px oklch(0.82 0.22 195 / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header row */}
              <div className="mb-3">
                <div className="text-[10px] font-mono font-semibold text-primary/70 uppercase tracking-widest mb-1">
                  Step {step + 1} of {TOUR_STEPS.length}
                </div>
                <h3 className="font-display font-semibold text-base text-foreground leading-tight">
                  {currentStep.title}
                </h3>
              </div>

              {/* Progress dots — use targetId as stable key */}
              <div className="flex items-center gap-1.5 mb-3">
                {TOUR_STEPS.map((tourStep, i) => (
                  <div
                    key={tourStep.targetId}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 20 : 6,
                      background:
                        i === step
                          ? "oklch(0.82 0.22 195)"
                          : i < step
                            ? "oklch(0.82 0.22 195 / 0.4)"
                            : "oklch(0.4 0 0)",
                    }}
                  />
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {currentStep.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2">
                {isFirst ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8"
                    onClick={handleFinish}
                    data-ocid="demo_tour.cancel_button"
                  >
                    Skip Tour
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8"
                    onClick={handlePrev}
                    data-ocid="demo_tour.secondary_button"
                  >
                    Previous
                  </Button>
                )}

                <Button
                  size="sm"
                  className="text-xs h-8 px-4"
                  onClick={handleNext}
                  data-ocid="demo_tour.primary_button"
                >
                  {isLast ? "Finish Tour" : "Next"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
