import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Engine } from "./backend.d.ts";
import { AppSidebar } from "./components/AppSidebar";
import { BillingPage } from "./components/BillingPage";
import { ChangelogPage } from "./components/ChangelogPage";
import { ChatPage } from "./components/ChatPage";
import { DashboardPage } from "./components/DashboardPage";
import { EnginesPage } from "./components/EnginesPage";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { OnboardingTour, TOUR_SEEN_KEY } from "./components/OnboardingTour";
import { PartnersPage } from "./components/PartnersPage";
import { PricingModal } from "./components/PricingModal";
import { ReferralsAffiliatePage } from "./components/ReferralsAffiliatePage";
import { SettingsPage } from "./components/SettingsPage";
import { TermsPage } from "./components/TermsPage";
import { TopBar } from "./components/TopBar";
import { UserGuidePage } from "./components/UserGuidePage";
import { AdminPage } from "./components/admin/AdminPage";
import { useActor } from "./hooks/useActor";
import { adminQueryKeys, useIsAdmin } from "./hooks/useAdminQueries";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  queryKeys,
  useGetMySubscription,
  useListEngines,
  usePopulateDemoData,
} from "./hooks/useQueries";
import { useTheme } from "./hooks/useTheme";

// ─── Hardcoded admin principal (guaranteed fallback) ──────────────────────────
const HARDCODED_ADMIN_PRINCIPAL =
  "7xb3p-r7kxo-tjbki-fkmcf-buzj5-i5ux2-tcaye-tkujv-zmd6t-whrx7-lqe";

// ─── Client-side demo engines (used when not authenticated or as fallback) ────

const ANON_PRINCIPAL = Principal.fromText("2vxsx-fae");
const NOW_NS = BigInt(Date.now()) * 1_000_000n;

const DEMO_ENGINES: Engine[] = [
  {
    id: 1n,
    name: "Demo — CRM Platform (AWS)",
    provider: "AWS",
    status: "running",
    cpu: 4n,
    ram: 16n,
    storage: 200n,
    costPerHour: 0.15,
    resilienceScore: 72n,
    ownerId: ANON_PRINCIPAL,
    createdAt: NOW_NS - 86_400_000_000_000n * 14n,
  },
  {
    id: 2n,
    name: "Demo — Analytics Engine (GCP)",
    provider: "GCP",
    status: "running",
    cpu: 8n,
    ram: 32n,
    storage: 500n,
    costPerHour: 0.22,
    resilienceScore: 85n,
    ownerId: ANON_PRINCIPAL,
    createdAt: NOW_NS - 86_400_000_000_000n * 7n,
  },
  {
    id: 3n,
    name: "Demo — Storage Cluster (Azure)",
    provider: "Azure",
    status: "running",
    cpu: 2n,
    ram: 8n,
    storage: 1000n,
    costPerHour: 0.08,
    resilienceScore: 61n,
    ownerId: ANON_PRINCIPAL,
    createdAt: NOW_NS - 86_400_000_000_000n * 3n,
  },
  {
    id: 4n,
    name: "Demo — Dev/Staging (AWS)",
    provider: "AWS",
    status: "provisioning",
    cpu: 2n,
    ram: 4n,
    storage: 50n,
    costPerHour: 0.05,
    resilienceScore: 40n,
    ownerId: ANON_PRINCIPAL,
    createdAt: NOW_NS - 86_400_000_000_000n * 1n,
  },
];

type Page =
  | "dashboard"
  | "engines"
  | "chat"
  | "settings"
  | "billing"
  | "referrals"
  | "partners"
  | "userguide"
  | "changelog"
  | "admin";

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  engines: "Cloud Engines",
  chat: "AI Deploy",
  settings: "Settings",
  billing: "Billing",
  referrals: "Referrals & Affiliates",
  partners: "Partners",
  userguide: "User Guide",
  changelog: "Changelog",
  admin: "Admin",
};

const PRICING_SHOWN_KEY = "lockfree_pricing_shown";
const DEMO_PREF_KEY = "lockfree_demo_enabled";

function AppShell() {
  const { identity, isInitializing, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  useListEngines(); // keep query active for cache
  const { data: subscription = "free" } = useGetMySubscription();
  const { data: isAdmin } = useIsAdmin();
  const { mutateAsync: populateDemo, isPending: isLoadingDemo } =
    usePopulateDemoData();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  // Initialize from localStorage — default to true (auto-load) unless user explicitly turned it off
  const [isDemoMode, setIsDemoMode] = useState(
    () => localStorage.getItem(DEMO_PREF_KEY) !== "false",
  );
  const [demoTier, setDemoTier] = useState<string | null>(null);

  // Hardcoded admin check — instant, no backend dependency
  const callerIsHardcodedAdmin =
    identity?.getPrincipal().toText() === HARDCODED_ADMIN_PRINCIPAL;
  const effectiveIsAdmin = !!(isAdmin || callerIsHardcodedAdmin);

  const effectiveTier = effectiveIsAdmin
    ? "enterprise"
    : isDemoMode && demoTier
      ? demoTier
      : subscription;
  const [demoEngines, setDemoEngines] = useState<Engine[]>([]);
  const [chatEngine, setChatEngine] = useState<Engine | undefined>(undefined);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  // Safety-net: inject client-side demo engines into the React Query cache whenever they change
  useEffect(() => {
    if (demoEngines.length > 0) {
      queryClient.setQueryData(queryKeys.engines, demoEngines);
    }
  }, [demoEngines, queryClient]);

  // Show onboarding tour on first login
  useEffect(() => {
    if (!identity) return;
    const tourSeen = localStorage.getItem(TOUR_SEEN_KEY);
    if (!tourSeen) {
      const timer = setTimeout(() => setTourOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [identity]);

  // Show pricing modal on first login
  useEffect(() => {
    if (!identity) return;
    const shown = localStorage.getItem(PRICING_SHOWN_KEY);
    if (!shown) {
      const tourSeen = localStorage.getItem(TOUR_SEEN_KEY);
      const delay = tourSeen ? 800 : 3000;
      const timer = setTimeout(() => {
        setPricingOpen(true);
        localStorage.setItem(PRICING_SHOWN_KEY, "true");
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [identity]);

  // Claim admin on login — seed the query cache immediately.
  // If the caller is the hardcoded admin, seed the cache instantly before
  // the async call so the sidebar shield appears with zero delay.
  useEffect(() => {
    try {
      if (!identity || !actor) return;

      // Instant seed for hardcoded admin — no round-trip required
      if (identity.getPrincipal().toText() === HARDCODED_ADMIN_PRINCIPAL) {
        queryClient.setQueryData(adminQueryKeys.isAdmin, true);
      }

      actor
        .claimInitialAdmin()
        .then((result) => {
          // Immediately write the definitive answer into the cache — no extra round-trip
          queryClient.setQueryData(adminQueryKeys.isAdmin, result);
        })
        .catch((err) => {
          console.warn("claimInitialAdmin failed:", err);
          // On failure, fall back to a fresh query
          void queryClient.refetchQueries({ queryKey: adminQueryKeys.isAdmin });
        });
    } catch (err) {
      console.warn("claimInitialAdmin effect threw synchronously:", err);
    }
  }, [identity, actor, queryClient]);

  async function handleLoadDemo() {
    localStorage.setItem(DEMO_PREF_KEY, "true");
    if (!identity) {
      // Set cache immediately and synchronously — don't rely on the useEffect chain
      queryClient.setQueryData(queryKeys.engines, DEMO_ENGINES);
      setDemoEngines(DEMO_ENGINES);
      setIsDemoMode(true);
      toast.success("Demo data loaded!");
      return;
    }
    try {
      await populateDemo();
      setIsDemoMode(true);
      toast.success("Demo data loaded!");
    } catch {
      // Fallback to client-side demo data if backend call fails
      queryClient.setQueryData(queryKeys.engines, DEMO_ENGINES);
      setDemoEngines(DEMO_ENGINES);
      setIsDemoMode(true);
      toast.success("Demo data loaded!");
    }
  }

  function handleClearDemo() {
    localStorage.setItem(DEMO_PREF_KEY, "false");
    queryClient.setQueryData(queryKeys.engines, []);
    setDemoEngines([]);
    setIsDemoMode(false);
    toast.success("Demo data cleared");
  }

  function handleEngineCreated(engine: Engine) {
    if (isDemoMode) {
      setDemoEngines((prev) => [...prev, engine]);
    }
  }

  function handleNavigateToChat(engine?: Engine) {
    setChatEngine(engine);
    setActivePage("chat");
  }

  function handleUpgrade(tier: string) {
    if (isDemoMode) setDemoTier(tier);
    setPricingOpen(false);
  }

  function handleSignOut() {
    clear();
    localStorage.setItem(DEMO_PREF_KEY, "false");
    setShowLanding(true);
    setIsDemoMode(false);
    setDemoEngines([]);
    setDemoTier(null);
    queryClient.clear();
  }

  // Show initializing state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-primary/80 animate-pulse" />
          </div>
          <div className="flex gap-1">
            {(["dot-0", "dot-1", "dot-2"] as const).map((id, i) => (
              <Skeleton
                key={id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Terms page
  if (showTerms) {
    return <TermsPage onBack={() => setShowTerms(false)} />;
  }

  // Landing page
  if (showLanding && !identity) {
    return (
      <LandingPage
        onSignIn={() => {
          setShowLanding(false);
          login();
        }}
        onTryDemo={() => setShowLanding(false)}
        isLoadingDemo={isLoadingDemo}
        onTerms={() => setShowTerms(true)}
      />
    );
  }

  // Login page if not authenticated
  if (!identity) {
    return (
      <LoginPage
        onLoadDemo={handleLoadDemo}
        isLoadingDemo={isLoadingDemo}
        isDemoMode={isDemoMode}
        onClearDemo={handleClearDemo}
        onTerms={() => setShowTerms(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AppSidebar
        activePage={activePage}
        onNavigate={(p) => setActivePage(p as Page)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
        <TopBar
          title={PAGE_TITLES[activePage]}
          onMenuClick={() => setMobileOpen(true)}
          isDemoMode={isDemoMode}
          onNavigate={(p) => setActivePage(p as Page)}
          onSignOut={handleSignOut}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 p-4 lg:p-6">
          {activePage === "dashboard" && (
            <DashboardPage
              isDemoMode={isDemoMode}
              onLoadDemo={handleLoadDemo}
              isLoadingDemo={isLoadingDemo}
              onNavigateToChat={handleNavigateToChat}
              onClearDemo={handleClearDemo}
              onEngineCreated={handleEngineCreated}
            />
          )}
          {activePage === "engines" && (
            <EnginesPage
              onNavigateToChat={handleNavigateToChat}
              isDemoMode={isDemoMode}
              onEngineCreated={handleEngineCreated}
            />
          )}
          {activePage === "chat" && (
            <ChatPage
              preselectedEngine={chatEngine}
              subscription={effectiveTier}
              onOpenPricing={() => setPricingOpen(true)}
            />
          )}
          {activePage === "settings" && (
            <SettingsPage isAdmin={effectiveIsAdmin} />
          )}
          {activePage === "billing" && (
            <BillingPage
              onPricingOpen={() => setPricingOpen(true)}
              overrideTier={effectiveTier}
              onTierChange={(tier) => {
                if (isDemoMode) setDemoTier(tier);
              }}
              isDemoMode={isDemoMode}
            />
          )}
          {activePage === "referrals" && <ReferralsAffiliatePage />}
          {activePage === "partners" && (
            <PartnersPage onNavigate={(p) => setActivePage(p as Page)} />
          )}
          {activePage === "userguide" && <UserGuidePage />}
          {activePage === "changelog" && <ChangelogPage />}
          {activePage === "admin" && <AdminPage />}
        </main>

        {/* Footer */}
        <footer className="px-4 lg:px-6 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>LockFree Engine — Built on ICP</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            © {new Date().getFullYear()} Built with love using caffeine.ai
          </a>
        </footer>
      </div>

      {/* First-login onboarding tour */}
      <OnboardingTour open={tourOpen} onClose={() => setTourOpen(false)} />

      {/* First-login pricing modal */}
      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        currentTier={effectiveTier}
        onUpgrade={handleUpgrade}
        isDemoMode={isDemoMode}
      />
    </div>
  );
}

export default function App() {
  const { theme } = useTheme();
  return (
    <TooltipProvider delayDuration={300}>
      <AppShell />
      <Toaster
        position="bottom-right"
        theme={theme as "dark" | "light" | "system"}
        richColors
      />
    </TooltipProvider>
  );
}
