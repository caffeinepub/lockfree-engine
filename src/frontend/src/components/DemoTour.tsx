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
      "After scanning, click 'Start Migration with Snorkel' to watch the animated 6-step migration: parsing your stack, mapping to ICP architecture, provisioning the NeoCloud EU subnet, deploying canisters, migrating persistent state, and a final health check.",
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
    targetId: "sidebar-billing",
    title: "Plan Upgrade & Billing",
    description:
      "Click Billing in the sidebar to simulate upgrading your plan. Choose a tier, go through the mock payment flow, and watch your plan update instantly — no real card needed.",
  },
  {
    targetId: "exit-demo-btn",
    title: "Ready for the Real Thing?",
    description:
      "When you're done exploring, sign in with Internet Identity to provision real engines, set up billing, and take full control of your cloud infrastructure.",
  },
];

interface LiveRect {
  top: number;
  left: number;
  width: number;
  height: number;
  found: boolean;
}

const CARD_WIDTH = 320;
const CARD_HEIGHT_EST = 210;
const GAP = 14;
const PAD = 8;

function computeTooltipPosition(
  rect: LiveRect,
  vw: number,
  vh: number,
): { top: number; left: number; placement: "above" | "below" | "center" } {
  if (!rect.found) {
    return {
      top: vh / 2 - CARD_HEIGHT_EST / 2,
      left: vw / 2 - CARD_WIDTH / 2,
      placement: "center",
    };
  }
  const spaceBelow = vh - (rect.top + rect.height);
  const placement: "above" | "below" =
    spaceBelow >= CARD_HEIGHT_EST + GAP ? "below" : "above";

  const top =
    placement === "below"
      ? rect.top + rect.height + GAP
      : rect.top - CARD_HEIGHT_EST - GAP;

  const rawLeft = rect.left + rect.width / 2 - CARD_WIDTH / 2;
  const left = Math.max(12, Math.min(rawLeft, vw - CARD_WIDTH - 12));

  return { top, left, placement };
}

interface DemoTourProps {
  open: boolean;
  onClose: () => void;
}

export function DemoTour({ open, onClose }: DemoTourProps) {
  const [step, setStep] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [liveRect, setLiveRect] = useState<LiveRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    found: false,
  });

  const rafRef = useRef<number | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  const currentStep = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  // rAF loop: continuously tracks target element position
  const startTracking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const loop = () => {
      const targetId = TOUR_STEPS[stepRef.current].targetId;
      const el = document.querySelector(`[data-tour-id="${targetId}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setLiveRect({
          top: r.top - PAD,
          left: r.left - PAD,
          width: r.width + PAD * 2,
          height: r.height + PAD * 2,
          found: true,
        });
      } else {
        // Missing target — log warning and show centered fallback
        console.warn(
          `[DemoTour] No element found for data-tour-id="${targetId}". Add the attribute to the target element.`,
        );
        setLiveRect({ top: 0, left: 0, width: 0, height: 0, found: false });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const stopTracking = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // When open state changes
  useEffect(() => {
    if (open) {
      setStep(0);
    } else {
      stopTracking();
      setTooltipVisible(false);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    }
  }, [open, stopTracking]);

  // When step changes: scroll → settle → show tooltip
  useEffect(() => {
    if (!open) return;

    // Stop rAF + hide tooltip while transitioning
    stopTracking();
    setTooltipVisible(false);

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

    const targetId = TOUR_STEPS[step].targetId;
    const el = document.querySelector(`[data-tour-id="${targetId}"]`);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait for scroll to settle (600ms), then start rAF tracking and show tooltip
    settleTimerRef.current = setTimeout(() => {
      startTracking();
      setTooltipVisible(true);
    }, 600);

    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [step, open, startTracking, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [stopTracking]);

  function handleFinish() {
    localStorage.setItem(DEMO_TOUR_SEEN_KEY, "true");
    stopTracking();
    onClose();
  }

  function handleNext() {
    if (isLast) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const {
    top: cardTop,
    left: cardLeft,
    placement,
  } = computeTooltipPosition(liveRect, vw, vh);

  const cardW = Math.max(280, Math.min(CARD_WIDTH, vw - 24));

  if (!open) return null;

  return (
    <>
      {/* Backdrop: full-screen dark overlay */}
      <div
        className="fixed inset-0 z-[50] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.72)" }}
      />

      {/* Spotlight cutout: positioned over target, box-shadow creates the dark surround */}
      {liveRect.found && (
        <div
          className="fixed z-[51] pointer-events-none"
          style={{
            top: liveRect.top,
            left: liveRect.left,
            width: liveRect.width,
            height: liveRect.height,
            borderRadius: 10,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
            border: "2px solid oklch(0.82 0.22 195 / 0.65)",
            transition:
              "top 0.15s ease, left 0.15s ease, width 0.15s ease, height 0.15s ease",
          }}
        />
      )}

      {/* Tooltip card — animated per step, NO position transition (rAF handles it) */}
      <AnimatePresence mode="wait">
        {tooltipVisible && (
          <motion.div
            key={step}
            className="fixed z-[52] pointer-events-auto"
            style={{
              top: cardTop,
              left: cardLeft,
              width: cardW,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Arrow pointing toward target */}
            {liveRect.found && (
              <div
                className="absolute left-1/2"
                style={{
                  // Clamp arrow horizontal position to card bounds
                  transform: `translateX(${Math.max(
                    -(cardW / 2 - 16),
                    Math.min(
                      liveRect.left +
                        liveRect.width / 2 -
                        (cardLeft + cardW / 2),
                      cardW / 2 - 16,
                    ),
                  )}px) translateX(-50%)`,
                  ...(placement === "below"
                    ? {
                        top: -8,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "8px solid oklch(0.82 0.22 195 / 0.7)",
                        width: 0,
                        height: 0,
                      }
                    : {
                        bottom: -8,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: "8px solid oklch(0.82 0.22 195 / 0.7)",
                        width: 0,
                        height: 0,
                      }),
                }}
              />
            )}

            {/* Card body */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "oklch(0.09 0.016 245 / 0.97)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid oklch(0.82 0.22 195 / 0.35)",
                boxShadow:
                  "0 0 0 1px oklch(0.82 0.22 195 / 0.1), 0 24px 64px rgba(0,0,0,0.6), 0 0 32px oklch(0.82 0.22 195 / 0.08)",
              }}
            >
              {/* Step counter */}
              <div
                className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-1"
                style={{ color: "oklch(0.82 0.22 195 / 0.7)" }}
              >
                Step {step + 1} of {TOUR_STEPS.length}
              </div>

              {/* Title */}
              <h3 className="font-display font-semibold text-sm text-foreground leading-tight mb-2">
                {currentStep.title}
              </h3>

              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-3">
                {TOUR_STEPS.map((s, i) => (
                  <div
                    key={s.targetId}
                    className="h-0.5 rounded-full transition-all duration-300"
                    style={{
                      flex: i === step ? 3 : 1,
                      background:
                        i === step
                          ? "oklch(0.82 0.22 195)"
                          : i < step
                            ? "oklch(0.82 0.22 195 / 0.45)"
                            : "oklch(0.3 0 0)",
                    }}
                  />
                ))}
              </div>

              {/* Description */}
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ color: "oklch(0.72 0.02 245)" }}
              >
                {currentStep.description}
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-xs h-8 px-3 rounded-lg transition-colors duration-200"
                  style={{
                    color: "oklch(0.55 0.02 245)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.72 0.02 245)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.55 0.02 245)";
                  }}
                  onClick={handleFinish}
                  data-ocid="demo_tour.skip_button"
                >
                  Skip Tour
                </button>

                <Button
                  size="sm"
                  className="h-8 px-5 text-xs font-semibold"
                  style={{
                    background: "oklch(0.82 0.22 195)",
                    color: "oklch(0.06 0.01 245)",
                    border: "none",
                  }}
                  onClick={handleNext}
                  data-ocid="demo_tour.next_button"
                >
                  {isLast ? "Finish Tour" : "Next →"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
