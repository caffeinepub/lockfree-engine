import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const DEMO_TOUR_SEEN_KEY = "lockfree_demo_tour_seen";

// ── Amber accent (replaces cyan) ─────────────────────────────────────────────
const AMBER = {
  ring: "rgba(245, 158, 11, 0.85)",
  glow: "rgba(245, 158, 11, 0.45)",
  ringDim: "rgba(245, 158, 11, 0.35)",
  text: "rgba(245, 158, 11, 0.75)",
  btn: "rgba(245, 158, 11, 0.9)",
  btnHover: "rgba(245, 158, 11, 1)",
  progress: "rgba(245, 158, 11, 0.9)",
  progressBg: "rgba(245, 158, 11, 0.15)",
  border: "rgba(245, 158, 11, 0.35)",
  shadow: "rgba(245, 158, 11, 0.12)",
  dot: "rgba(245, 158, 11, 0.9)",
  dotDim: "rgba(245, 158, 11, 0.35)",
};

// ── Types ─────────────────────────────────────────────────────────────────────

/** Which app page this step lives on. Matches AppShell's Page type. */
type AppPage =
  | "dashboard"
  | "chat"
  | "billing"
  | "engines"
  | "referrals"
  | "partners"
  | "settings"
  | "userguide"
  | "technotes"
  | "admin";

interface TourStep {
  /** data-tour-id attribute of the target element */
  targetId: string | null;
  title: string;
  description: string;
  /** Which page this element lives on. Defaults to "dashboard" */
  page?: AppPage;
  /**
   * Optional selector to click BEFORE looking for targetId.
   * Use to open a modal/panel that contains the target element.
   */
  triggerSelector?: string;
}

interface DemoTourProps {
  open: boolean;
  onClose: () => void;
  /** Called when the tour needs to navigate to a different page */
  onNavigate?: (page: AppPage) => void;
  /** Current active page in the app shell */
  activePage?: string;
}

// ── Step definitions ──────────────────────────────────────────────────────────

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "summary-cards",
    page: "dashboard",
    title: "Your Live Metrics",
    description:
      "These cards show your total engines, monthly cost, average resilience score, and migrations completed. In demo mode the figures update live every few seconds — click the info icon on any card for more detail.",
  },
  {
    targetId: "new-engine-btn",
    page: "dashboard",
    title: "Provision a New Engine",
    description:
      "Click here to provision a new cloud engine in seconds. Choose your provider, CPU, RAM, and storage — then watch the multi-stage deployment animation.",
  },
  {
    targetId: "engine-card-0",
    page: "dashboard",
    title: "Your Cloud Engines",
    description:
      "Each engine runs on ICP and can migrate to any cloud provider instantly. Try the Stop/Start, Restart, and Scale buttons on a card — each runs a live progress animation and updates the engine status.",
  },
  {
    targetId: "ai-deploy-btn-0",
    page: "dashboard",
    title: "AI-Powered Deployment",
    description:
      "Describe any application in plain English. The AI builds and deploys it as an ICP canister directly to this engine — live in seconds.",
  },
  {
    targetId: "chat-scanner-tab",
    page: "chat",
    title: "Legacy App Scanner",
    description:
      "Switch to the Legacy App Scanner tab, paste your tech stack — Kubernetes, Node.js, PostgreSQL, or NeoCloud's own stack — and get a full component mapping plus a sovereign EU migration plan powered by Snorkel.",
  },
  {
    targetId: "snorkel-migration-progress",
    page: "chat",
    title: "Snorkel Migration in Action",
    description:
      "After scanning, click 'Start Migration with Snorkel' to watch the animated 6-step migration: parsing your stack, mapping to ICP architecture, provisioning the NeoCloud EU subnet, deploying canisters, migrating persistent state, and a final health check.",
  },
  {
    targetId: "live-cost-dashboard",
    page: "dashboard",
    title: "Live Cost Dashboard",
    description:
      "Your spending updates automatically every few seconds in demo mode. Hit the sparkles button to get AI-powered cost optimisation recommendations — apply them individually or all at once.",
  },
  {
    targetId: "notification-bell",
    page: "dashboard",
    title: "Live Notifications",
    description:
      "In demo mode, realistic alerts arrive automatically every 30–60 seconds — cost spikes, scaling events, migration completions. The badge updates in real time as new notifications land.",
  },
  {
    targetId: "sidebar-billing",
    page: "billing",
    title: "Plan Upgrade & Billing",
    description:
      "Click Billing in the sidebar to simulate upgrading your plan. Choose a tier, go through the mock payment flow, and watch your plan update instantly — no real card needed.",
  },
  {
    targetId: "exit-demo-btn",
    page: "dashboard",
    title: "Ready for the Real Thing?",
    description:
      "When you're done exploring, sign in with Internet Identity to provision real engines, set up billing, and take full control of your cloud infrastructure.",
  },
];

// ── Highlight helpers ─────────────────────────────────────────────────────────

function removeHighlights() {
  for (const el of document.querySelectorAll("[data-tour-highlighted]")) {
    const htmlEl = el as HTMLElement;
    htmlEl.style.removeProperty("box-shadow");
    htmlEl.style.removeProperty("z-index");
    htmlEl.style.removeProperty("position");
    htmlEl.removeAttribute("data-tour-highlighted");
  }
}

function findTarget(targetId: string): HTMLElement | null {
  let el = document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`);
  // Fallback: ai-deploy-btn-0 may not be visible, use the engine card instead
  if (!el && targetId === "ai-deploy-btn-0") {
    el = document.querySelector<HTMLElement>('[data-tour-id="engine-card-0"]');
  }
  return el;
}

function highlightElement(el: HTMLElement) {
  removeHighlights();
  el.setAttribute("data-tour-highlighted", "true");
  el.style.boxShadow = `0 0 0 3px ${AMBER.ring}, 0 0 24px ${AMBER.glow}`;
  el.style.zIndex = "10";
  el.style.position = "relative";
}

// ── Tooltip position calculator ───────────────────────────────────────────────

interface TooltipPos {
  top: number;
  left: number;
  width: number;
  placement: "below" | "above";
}

const TOOLTIP_WIDTH = 340;
const TOOLTIP_GAP = 14;
const VIEWPORT_MARGIN = 16;

function calcTooltipPos(el: HTMLElement): TooltipPos {
  const rect = el.getBoundingClientRect();
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  // Approximate tooltip height for flip calculation
  const approxHeight = 160;

  // Decide vertical placement
  const spaceBelow = vpH - rect.bottom;
  const spaceAbove = rect.top;
  let top: number;
  let placement: "below" | "above";

  if (spaceBelow >= approxHeight + TOOLTIP_GAP || spaceBelow >= spaceAbove) {
    top = rect.bottom + TOOLTIP_GAP;
    placement = "below";
  } else {
    top = rect.top - approxHeight - TOOLTIP_GAP;
    placement = "above";
  }

  // Clamp top so tooltip stays within viewport
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, vpH - approxHeight - VIEWPORT_MARGIN),
  );

  // Horizontal: centre on the element, then clamp within viewport
  const effectiveWidth = Math.min(TOOLTIP_WIDTH, vpW - VIEWPORT_MARGIN * 2);
  let left = rect.left + rect.width / 2 - effectiveWidth / 2;
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, vpW - effectiveWidth - VIEWPORT_MARGIN),
  );

  return { top, left, width: effectiveWidth, placement };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DemoTour({
  open,
  onClose,
  onNavigate,
  activePage,
}: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const progressPct = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  // ── Position updater — re-runs on scroll/resize ──────────────────────────
  const updatePosition = useCallback(() => {
    if (!step.targetId) return;
    const el = findTarget(step.targetId);
    if (!el) return;
    setTooltipPos(calcTooltipPos(el));
  }, [step.targetId]);

  // ── Core: navigate → trigger → highlight → position ─────────────────────
  const activateStep = useCallback(
    (stepIndex: number) => {
      const s = TOUR_STEPS[stepIndex];
      if (!s) return;

      const targetPage = s.page ?? "dashboard";
      const currentPage = (activePage ?? "dashboard") as AppPage;
      const needsNav = targetPage !== currentPage;

      function doHighlight() {
        if (!s.targetId) {
          setTooltipPos(null);
          return;
        }

        // Optional trigger (click a button to open a modal/panel)
        if (s.triggerSelector) {
          const trigger = document.querySelector<HTMLElement>(
            s.triggerSelector,
          );
          if (trigger) trigger.click();
        }

        // Wait for DOM to settle after trigger, then highlight
        const settle = s.triggerSelector ? 350 : 0;
        highlightTimer.current = setTimeout(() => {
          const el = findTarget(s.targetId!);
          if (!el) {
            // Element not found — skip gracefully
            console.warn(
              `[DemoTour] Element not found: ${s.targetId}, skipping`,
            );
            setTooltipPos(null);
            return;
          }
          highlightElement(el);
          // Scroll element into view (center, with room for the tooltip)
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          // After scroll settles, compute tooltip position
          const posTimer = setTimeout(() => {
            rafRef.current = requestAnimationFrame(() => {
              setTooltipPos(calcTooltipPos(el));
            });
          }, 350);
          highlightTimer.current = posTimer;
        }, settle);
      }

      if (needsNav && onNavigate) {
        setIsNavigating(true);
        onNavigate(targetPage);
        // Wait for React to re-render the new page, then highlight
        highlightTimer.current = setTimeout(() => {
          setIsNavigating(false);
          doHighlight();
        }, 400);
      } else {
        doHighlight();
      }
    },
    [activePage, onNavigate],
  );

  // ── Re-run when step or open changes ────────────────────────────────────
  useEffect(() => {
    if (!open) {
      removeHighlights();
      setTooltipPos(null);
      return;
    }
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    activateStep(currentStep);
  }, [open, currentStep, activateStep]);

  // ── Update tooltip on scroll/resize ────────────────────────────────────
  useEffect(() => {
    if (!open || !step.targetId) return;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [open, step.targetId, updatePosition]);

  // ── Full cleanup on unmount ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      removeHighlights();
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Reset to step 0 each time the tour opens
  useEffect(() => {
    if (open) setCurrentStep(0);
  }, [open]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleClose() {
    removeHighlights();
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTooltipPos(null);
    onClose();
  }

  function handleSkip() {
    localStorage.setItem(DEMO_TOUR_SEEN_KEY, "true");
    handleClose();
  }

  function handleNext() {
    if (isLast) {
      localStorage.setItem(DEMO_TOUR_SEEN_KEY, "true");
      handleClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={`demo-tour-tooltip-${currentStep}`}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            position: "fixed",
            zIndex: 9999,
            pointerEvents: "auto",
            // Positioning: use calc'd position if available, else centre-bottom fallback
            ...(tooltipPos
              ? {
                  top: tooltipPos.top,
                  left: tooltipPos.left,
                  width: tooltipPos.width,
                }
              : {
                  bottom: isNavigating ? "50%" : 80,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: Math.min(
                    TOOLTIP_WIDTH,
                    window.innerWidth - VIEWPORT_MARGIN * 2,
                  ),
                }),
          }}
        >
          {/* Arrow pointing to element */}
          {tooltipPos && tooltipPos.placement === "below" && (
            <div
              style={{
                position: "absolute",
                top: -6,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderBottom: `7px solid ${AMBER.border}`,
              }}
            />
          )}
          {tooltipPos && tooltipPos.placement === "above" && (
            <div
              style={{
                position: "absolute",
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: `7px solid ${AMBER.border}`,
              }}
            />
          )}

          {/* Card */}
          <div
            style={{
              background: "rgba(9, 13, 27, 0.97)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${AMBER.border}`,
              borderRadius: 12,
              boxShadow: `0 8px 32px ${AMBER.shadow}, 0 2px 8px rgba(0,0,0,0.4)`,
              padding: "14px 16px 16px",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                height: 2,
                background: AMBER.progressBg,
                borderRadius: 2,
                marginBottom: 12,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: AMBER.progress,
                  borderRadius: 2,
                }}
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Step indicator */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: AMBER.text,
                marginBottom: 6,
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Step {currentStep + 1} of {TOUR_STEPS.length}
              {isNavigating && (
                <span style={{ marginLeft: 8, opacity: 0.65 }}>
                  navigating…
                </span>
              )}
            </div>

            {/* Content row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-content-${currentStep}`}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.3,
                        marginBottom: 5,
                        fontFamily: "var(--font-display, sans-serif)",
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(203, 213, 225, 0.85)",
                        lineHeight: 1.55,
                      }}
                    >
                      {step.description}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={handleNext}
                  data-ocid="demo_tour.next_button"
                  style={{
                    background: AMBER.btn,
                    color: "#000000",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: `0 0 12px ${AMBER.glow}`,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      AMBER.btnHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      AMBER.btn;
                  }}
                >
                  {isLast ? "Finish" : "Next →"}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  data-ocid="demo_tour.skip_button"
                  style={{
                    background: "transparent",
                    color: "rgba(148, 163, 184, 0.7)",
                    border: "none",
                    padding: "3px 4px",
                    fontSize: 11,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(148, 163, 184, 1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(148, 163, 184, 0.7)";
                  }}
                >
                  Skip Tour
                </button>
              </div>
            </div>

            {/* Dot indicators */}
            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={`dot-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index for dots
                    i
                  }`}
                  style={{
                    width: i === currentStep ? 14 : 5,
                    height: 5,
                    borderRadius: 3,
                    background:
                      i === currentStep
                        ? AMBER.dot
                        : i < currentStep
                          ? AMBER.dotDim
                          : "rgba(71, 85, 105, 0.5)",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
