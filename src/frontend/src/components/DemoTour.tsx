import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const DEMO_TOUR_SEEN_KEY = "lockfree_demo_tour_seen";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  /** If target not found, show this fallback message instead of the normal description */
  fallbackNote?: string;
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
    fallbackNote:
      "The AI Deploy button appears on each engine card. Open the AI Deploy Chat from the sidebar to explore it.",
  },
  {
    targetId: "chat-scanner-tab",
    title: "Legacy App Scanner",
    description:
      "Switch to the Legacy App Scanner tab, paste your tech stack — Kubernetes, Node.js, PostgreSQL, or NeoCloud's own stack — and get a full component mapping plus a sovereign EU migration plan powered by Snorkel.",
    fallbackNote:
      "Open the AI Deploy Chat from the sidebar, then switch to the Legacy App Scanner tab to scan your tech stack.",
  },
  {
    targetId: "snorkel-migration-progress",
    title: "Snorkel Migration in Action",
    description:
      "After scanning, click 'Start Migration with Snorkel' to watch the animated 6-step migration: parsing your stack, mapping to ICP architecture, provisioning the NeoCloud EU subnet, deploying canisters, migrating persistent state, and a final health check.",
    fallbackNote:
      "Run a scan in the Legacy App Scanner to see the Snorkel migration progress — paste any tech stack and click Start Migration.",
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

// ── Layout constants ──────────────────────────────────────────────────────────
const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 220;
const SPOTLIGHT_PAD = 10;
const GAP = 14;
const SCREEN_EDGE = 16;

type Placement = "above" | "below" | "left" | "right" | "center";

interface TooltipPos {
  top: number;
  left: number;
  placement: Placement;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function computeLayout(
  rect: DOMRect,
  vw: number,
  vh: number,
): { tooltip: TooltipPos; spotlight: SpotlightRect } {
  const spotlight: SpotlightRect = {
    top: rect.top - SPOTLIGHT_PAD,
    left: rect.left - SPOTLIGHT_PAD,
    width: rect.width + SPOTLIGHT_PAD * 2,
    height: rect.height + SPOTLIGHT_PAD * 2,
  };

  const spaceBelow = vh - (rect.bottom + GAP);
  const spaceAbove = rect.top - GAP;
  const spaceRight = vw - (rect.right + GAP);
  const spaceLeft = rect.left - GAP;

  let placement: Placement = "below";
  if (spaceBelow >= TOOLTIP_HEIGHT) {
    placement = "below";
  } else if (spaceAbove >= TOOLTIP_HEIGHT) {
    placement = "above";
  } else if (spaceRight >= TOOLTIP_WIDTH) {
    placement = "right";
  } else if (spaceLeft >= TOOLTIP_WIDTH) {
    placement = "left";
  } else {
    placement = "below";
  }

  let top = 0;
  let left = 0;

  if (placement === "below") {
    top = rect.bottom + GAP;
    left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
  } else if (placement === "above") {
    top = rect.top - GAP - TOOLTIP_HEIGHT;
    left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
  } else if (placement === "right") {
    top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2;
    left = rect.right + GAP;
  } else if (placement === "left") {
    top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2;
    left = rect.left - GAP - TOOLTIP_WIDTH;
  }

  // Clamp to screen edges
  top = Math.max(SCREEN_EDGE, Math.min(top, vh - TOOLTIP_HEIGHT - SCREEN_EDGE));
  left = Math.max(
    SCREEN_EDGE,
    Math.min(left, vw - TOOLTIP_WIDTH - SCREEN_EDGE),
  );

  return { tooltip: { top, left, placement }, spotlight };
}

function centeredTooltip(vw: number, vh: number): TooltipPos {
  return {
    top: vh / 2 - TOOLTIP_HEIGHT / 2,
    left: vw / 2 - TOOLTIP_WIDTH / 2,
    placement: "center",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DemoTourProps {
  open: boolean;
  onClose: () => void;
}

type StepState = "idle" | "scrolling" | "visible";

export function DemoTour({ open, onClose }: DemoTourProps) {
  const [step, setStep] = useState(0);
  const [stepState, setStepState] = useState<StepState>("idle");
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  // ── Lock / unlock scroll ──────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Go to a specific step ─────────────────────────────────────────────────
  const goToStep = useCallback((n: number) => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    setStepState("idle");
    setTooltipPos(null);
    setSpotlight(null);
    setFallbackMessage(null);

    const tourStep = TOUR_STEPS[n];
    const el = document.querySelector<HTMLElement>(
      `[data-tour-id="${tourStep.targetId}"]`,
    );

    // ── Element not found — show fallback centered tooltip ─────────────────
    if (!el) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setTooltipPos(centeredTooltip(vw, vh));
      setSpotlight(null);
      setFallbackMessage(tourStep.fallbackNote ?? tourStep.description);
      setStepState("visible");
      return;
    }

    // ── Special case: step 3 (ai-deploy-btn-0) — fall back to engine-card-0 ─
    // The deploy button only appears on hover; if the rect is zero-sized, try card
    const rect = el.getBoundingClientRect();
    const isZeroSize = rect.width === 0 || rect.height === 0;

    let targetEl: HTMLElement = el;
    if (isZeroSize) {
      const fallbackEl = document.querySelector<HTMLElement>(
        '[data-tour-id="engine-card-0"]',
      );
      if (fallbackEl) {
        targetEl = fallbackEl;
      }
    }

    // ── Scroll target into view, then snapshot ─────────────────────────────
    setStepState("scrolling");

    // Only scroll if the element is not already fully in the viewport
    const targetRect = targetEl.getBoundingClientRect();
    const alreadyVisible =
      targetRect.top >= 0 &&
      targetRect.bottom <= window.innerHeight &&
      targetRect.left >= 0 &&
      targetRect.right <= window.innerWidth;

    if (!alreadyVisible) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait for scroll to settle, then take one snapshot
    const settleTime = alreadyVisible ? 100 : 900;
    settleTimer.current = setTimeout(() => {
      const snappedRect = targetEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { tooltip, spotlight: spot } = computeLayout(snappedRect, vw, vh);
      setTooltipPos(tooltip);
      setSpotlight(spot);
      setFallbackMessage(null);
      setStepState("visible");
    }, settleTime);
  }, []);

  // ── Trigger goToStep when tour opens or step changes ─────────────────────
  useEffect(() => {
    if (!open) {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      setStepState("idle");
      setTooltipPos(null);
      setSpotlight(null);
      return;
    }
    goToStep(step);
  }, [open, step, goToStep]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      document.body.style.overflow = "";
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

  const tooltipVisible = stepState === "visible" && tooltipPos !== null;
  const { placement } = tooltipPos ?? { placement: "center" as Placement };

  if (!open) return null;

  const cardW = Math.min(TOOLTIP_WIDTH, window.innerWidth - SCREEN_EDGE * 2);

  return (
    <>
      {/* ── 4-Quadrant spotlight overlay ─────────────────────────────────── */}
      {spotlight ? (
        <>
          {/* Top strip */}
          <div
            className="fixed z-[50] pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: Math.max(0, spotlight.top),
              background: "rgba(0,0,0,0.62)",
            }}
          />
          {/* Bottom strip */}
          <div
            className="fixed z-[50] pointer-events-none"
            style={{
              top: spotlight.top + spotlight.height,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.62)",
            }}
          />
          {/* Left strip */}
          <div
            className="fixed z-[50] pointer-events-none"
            style={{
              top: spotlight.top,
              left: 0,
              width: Math.max(0, spotlight.left),
              height: spotlight.height,
              background: "rgba(0,0,0,0.62)",
            }}
          />
          {/* Right strip */}
          <div
            className="fixed z-[50] pointer-events-none"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              right: 0,
              height: spotlight.height,
              background: "rgba(0,0,0,0.62)",
            }}
          />
          {/* Spotlight border ring */}
          <div
            className="fixed z-[51] pointer-events-none"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              borderRadius: 10,
              border: "2px solid oklch(0.82 0.22 195 / 0.7)",
              boxShadow: "0 0 16px oklch(0.82 0.22 195 / 0.25)",
            }}
          />
        </>
      ) : (
        /* Fallback: full dark overlay when no spotlight target */
        <div
          className="fixed inset-0 z-[50] pointer-events-none"
          style={{ background: "rgba(0,0,0,0.62)" }}
        />
      )}

      {/* ── Tooltip card ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {tooltipVisible && tooltipPos && (
          <motion.div
            key={`tour-step-${step}`}
            className="fixed z-[60] pointer-events-auto"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              width: cardW,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Directional arrow */}
            {spotlight && placement !== "center" && (
              <div
                className="absolute"
                style={arrowStyle(placement, tooltipPos, spotlight, cardW)}
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
                {fallbackMessage ?? currentStep.description}
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

// ── Arrow style helper ────────────────────────────────────────────────────────
function arrowStyle(
  placement: Placement,
  tooltipPos: TooltipPos,
  spotlight: SpotlightRect,
  cardW: number,
): React.CSSProperties {
  const ARROW = 8;
  const cyan = "oklch(0.82 0.22 195 / 0.7)";
  const transparent = "transparent";

  if (placement === "below") {
    // Arrow at top of card, pointing up toward the target
    const targetCenterX = spotlight.left + spotlight.width / 2;
    const arrowOffset = Math.max(
      ARROW + 4,
      Math.min(targetCenterX - tooltipPos.left, cardW - ARROW - 4),
    );
    return {
      position: "absolute",
      top: -ARROW,
      left: arrowOffset,
      width: 0,
      height: 0,
      borderLeft: `${ARROW}px solid ${transparent}`,
      borderRight: `${ARROW}px solid ${transparent}`,
      borderBottom: `${ARROW}px solid ${cyan}`,
      transform: "translateX(-50%)",
    };
  }

  if (placement === "above") {
    // Arrow at bottom of card, pointing down toward the target
    const targetCenterX = spotlight.left + spotlight.width / 2;
    const arrowOffset = Math.max(
      ARROW + 4,
      Math.min(targetCenterX - tooltipPos.left, cardW - ARROW - 4),
    );
    return {
      position: "absolute",
      bottom: -ARROW,
      left: arrowOffset,
      width: 0,
      height: 0,
      borderLeft: `${ARROW}px solid ${transparent}`,
      borderRight: `${ARROW}px solid ${transparent}`,
      borderTop: `${ARROW}px solid ${cyan}`,
      transform: "translateX(-50%)",
    };
  }

  if (placement === "right") {
    // Arrow at left edge of card, pointing left toward the target
    const targetCenterY = spotlight.top + spotlight.height / 2;
    const arrowOffset = Math.max(
      ARROW + 4,
      Math.min(targetCenterY - tooltipPos.top, TOOLTIP_HEIGHT - ARROW - 4),
    );
    return {
      position: "absolute",
      left: -ARROW,
      top: arrowOffset,
      width: 0,
      height: 0,
      borderTop: `${ARROW}px solid ${transparent}`,
      borderBottom: `${ARROW}px solid ${transparent}`,
      borderRight: `${ARROW}px solid ${cyan}`,
      transform: "translateY(-50%)",
    };
  }

  if (placement === "left") {
    // Arrow at right edge of card, pointing right toward the target
    const targetCenterY = spotlight.top + spotlight.height / 2;
    const arrowOffset = Math.max(
      ARROW + 4,
      Math.min(targetCenterY - tooltipPos.top, TOOLTIP_HEIGHT - ARROW - 4),
    );
    return {
      position: "absolute",
      right: -ARROW,
      top: arrowOffset,
      width: 0,
      height: 0,
      borderTop: `${ARROW}px solid ${transparent}`,
      borderBottom: `${ARROW}px solid ${transparent}`,
      borderLeft: `${ARROW}px solid ${cyan}`,
      transform: "translateY(-50%)",
    };
  }

  return {};
}
