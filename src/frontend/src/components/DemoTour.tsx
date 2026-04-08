import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const DEMO_TOUR_SEEN_KEY = "lockfree_demo_tour_seen";

interface TourStep {
  targetId: string | null;
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

// ── Highlight helpers (no scroll-lock, no overlay, no rAF) ───────────────────

function removeHighlights() {
  for (const el of document.querySelectorAll("[data-tour-highlighted]")) {
    const htmlEl = el as HTMLElement;
    htmlEl.style.removeProperty("box-shadow");
    htmlEl.style.removeProperty("z-index");
    htmlEl.style.removeProperty("position");
    htmlEl.removeAttribute("data-tour-highlighted");
  }
}

function highlightElement(targetId: string | null) {
  removeHighlights();
  if (!targetId) return;

  // Try the exact ID first, then fall back to engine-card-0 for ai-deploy-btn-0
  let el = document.querySelector<HTMLElement>(`[data-tour-id="${targetId}"]`);
  if (!el && targetId === "ai-deploy-btn-0") {
    el = document.querySelector<HTMLElement>('[data-tour-id="engine-card-0"]');
  }
  if (!el) return;

  el.setAttribute("data-tour-highlighted", "true");
  el.style.boxShadow =
    "0 0 0 3px rgba(6, 182, 212, 0.85), 0 0 24px rgba(6, 182, 212, 0.5)";
  el.style.zIndex = "10";
  el.style.position = "relative";

  // Scroll the highlighted element into view, centered, with room for the bottom panel
  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DemoTourProps {
  open: boolean;
  onClose: () => void;
}

export function DemoTour({ open, onClose }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const progressPct = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  // Apply highlight whenever step changes or tour opens
  useEffect(() => {
    if (!open) {
      removeHighlights();
      return;
    }
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    // Small delay: let React render the new step text before scrolling
    highlightTimer.current = setTimeout(() => {
      highlightElement(TOUR_STEPS[currentStep].targetId);
    }, 150);
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, [open, currentStep]);

  // Full cleanup on unmount
  useEffect(() => {
    return () => {
      removeHighlights();
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  function handleClose() {
    removeHighlights();
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
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

  // Reset to step 0 each time the tour opens
  useEffect(() => {
    if (open) setCurrentStep(0);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="demo-tour-panel"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          // Fixed to the bottom of the viewport — never affected by page scroll
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            // Narrow and centered on desktop
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 640,
              margin: "0 auto 0",
              pointerEvents: "auto",
              background: "rgba(9, 13, 27, 0.97)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(6, 182, 212, 0.35)",
              borderLeft: "1px solid rgba(6, 182, 212, 0.15)",
              borderRight: "1px solid rgba(6, 182, 212, 0.15)",
              borderRadius: "12px 12px 0 0",
              boxShadow:
                "0 -4px 32px rgba(6, 182, 212, 0.12), 0 -1px 0 rgba(6, 182, 212, 0.2)",
              padding: "16px 20px 20px",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                height: 2,
                background: "rgba(6, 182, 212, 0.15)",
                borderRadius: 2,
                marginBottom: 14,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "rgba(6, 182, 212, 0.9)",
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
                color: "rgba(6, 182, 212, 0.65)",
                marginBottom: 6,
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </div>

            {/* Content row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-content-${currentStep}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.35,
                        marginBottom: 4,
                        fontFamily: "var(--font-display, sans-serif)",
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(203, 213, 225, 0.85)",
                        lineHeight: 1.5,
                      }}
                    >
                      {step.description}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Buttons — always visible, no scroll needed */}
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
                    background: "rgba(6, 182, 212, 0.9)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 0 12px rgba(6, 182, 212, 0.35)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(6, 182, 212, 1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(6, 182, 212, 0.9)";
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
                    padding: "4px 6px",
                    fontSize: 12,
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
                gap: 5,
                justifyContent: "center",
                marginTop: 14,
              }}
            >
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={`dot-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index for dots
                    i
                  }`}
                  style={{
                    width: i === currentStep ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === currentStep
                        ? "rgba(6, 182, 212, 0.9)"
                        : i < currentStep
                          ? "rgba(6, 182, 212, 0.35)"
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
