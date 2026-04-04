import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Building2,
  Code2,
  FileCode2,
  Layers,
  Lock,
  Network,
  Rocket,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="font-mono text-xs bg-muted rounded-md p-4 overflow-x-auto border border-border text-muted-foreground leading-relaxed">
      <code>{children.trim()}</code>
    </pre>
  );
}

function SectionIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </span>
  );
}

export function TechnicalNotesPage() {
  return (
    <div
      className="max-w-4xl mx-auto space-y-8 pb-12"
      data-ocid="technotes.page"
    >
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Technical Notes
            </h1>
            <p className="text-sm text-muted-foreground">
              Architecture and implementation reference for LockFree Engine v1 —
              built on the Internet Computer Protocol
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Badge
            variant="outline"
            className="text-xs font-mono border-primary/30 text-primary"
          >
            ICP / Motoko
          </Badge>
          <Badge variant="outline" className="text-xs font-mono border-border">
            React 19
          </Badge>
          <Badge variant="outline" className="text-xs font-mono border-border">
            Demo v1
          </Badge>
        </div>
      </div>

      {/* Quick-reference architecture card */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            System at a Glance
          </CardTitle>
          <CardDescription className="text-xs">
            Two-canister deployment on the Internet Computer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock>{`[Browser]  →  [Frontend Canister (React SPA)]  →  [Backend Canister (Motoko Actor)]
                                                              ↑
                              [Internet Identity]  ←  authenticated principal
                              [NNS / Governance]   ←  subnet management

// All state lives in the Motoko actor — orthogonally persistent, no database required`}</CodeBlock>
        </CardContent>
      </Card>

      {/* Combined architecture diagram */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Combined Architecture — ICP · NeoCloud · LockFree Engine
          </CardTitle>
          <CardDescription className="text-xs">
            Three-layer infrastructure vision: physical compute · protocol ·
            operator dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArchitectureDiagram />
        </CardContent>
      </Card>

      {/* Accordion sections */}
      <Accordion
        type="multiple"
        defaultValue={["architecture"]}
        className="space-y-2"
        data-ocid="technotes.panel"
      >
        {/* 1 — Architecture Overview */}
        <AccordionItem
          value="architecture"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Layers} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Architecture Overview
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Two canisters, Internet Identity, NNS governance
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Two canisters: the frontend canister serves the React SPA as static assets; the backend canister is a Motoko actor that manages all application state.",
                "Internet Identity handles authentication — no passwords, no JWTs, no centralised auth server. WebAuthn-derived key pairs are domain-scoped.",
                "The NNS (Network Nervous System) governs subnet allocation, canister upgrades, and protocol decisions. LockFree Engine canisters run on NNS-managed subnets.",
                "All state lives in the backend canister — orthogonally persistent, meaning variables survive message boundaries and canister upgrades without any external database.",
                "ICP canisters are purpose-built for AI agent workloads requiring data sovereignty: each canister runs in a WebAssembly sandbox with deterministic execution, no shared memory between canisters, and cryptographically verifiable computation. Private sector companies running AI agents on sensitive business data can deploy those agents as ICP canisters — auditable, isolated, and controlled entirely by the canister owner, not a hyperscaler.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 2 — Motoko Backend Deep Dive */}
        <AccordionItem
          value="motoko"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Code2} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Motoko Backend Deep Dive
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Stable variables, actor model, Candid, orthogonal persistence
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Stable variables: declared with `stable var` — automatically serialised to stable memory on canister upgrade, then deserialised on restart. No manual migration scripts required.",
                "Orthogonal persistence: the canister heap is part of the IC protocol. Variables persist across messages and upgrades without any external database layer.",
                "Actor model: the backend is a single Motoko actor. All public methods are async and return `async T`. Concurrent calls are handled by the IC scheduler — no locks needed for non-overlapping messages.",
                "Candid: the interface description language used to generate the `backend.d.ts` TypeScript bindings consumed by the React frontend via the `useActor` hook.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest mb-2">
                Stable variable declarations
              </p>
              <CodeBlock>{`stable var adminPrincipal : ?Principal = null;
stable var users : [(Principal, UserRecord)] = [];

// These survive canister upgrades — no migration needed.
// On first deploy: adminPrincipal = null, users = [].
// After upgrade:   values from before the upgrade are restored automatically.`}</CodeBlock>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3 — Simulation Layer Design */}
        <AccordionItem
          value="simulation"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={FileCode2} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Simulation Layer Design
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  How demo mode is isolated and ready for real API swap-in
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "All Cloud Engines API calls in this demo are simulated client-side using React state and demo data — zero backend involvement for simulated operations.",
                "The simulation is intentionally isolated: all simulated logic lives in demo-mode conditional branches in frontend components, not in the backend actor.",
                "As DFINITY opens third-party developer access to the Cloud Engines API, swapping in real calls requires replacing demo-mode branches with real actor method calls — the backend interface is already designed for this.",
                "The backend already exposes the correct method signatures (`provisionEngine`, `migrateEngine`, `distributeAcrossProviders`, etc.) — in demo mode these return mock data; in production they will invoke real Cloud Engines substrate.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest mb-2">
                Demo → Production swap pattern
              </p>
              <CodeBlock>{`// Demo mode: return simulated result immediately
if (isDemoMode) {
  return simulateProvision(config);
}

// Production: call the real backend actor
// The actor method signature is already defined in backend.d.ts
return await actor.provisionEngine(config);

// Phase 2: actor.provisionEngine() will invoke the
// ICP Cloud Engines substrate directly — no frontend changes needed.`}</CodeBlock>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4 — Admin & Access Control */}
        <AccordionItem
          value="admin"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={ShieldCheck} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Admin &amp; Access Control
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Stable-variable persistence, RBAC, zero-latency admin check
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Admin status is stored in `stable var adminPrincipal : ?Principal` — it persists across canister upgrades without any migration step.",
                "The first principal to call `claimInitialAdmin()` is permanently assigned as admin. Subsequent calls are no-ops.",
                "For zero-latency access, the admin principal is also hardcoded client-side — the sidebar shield and the /admin route both check this instantly on sign-in with no backend round-trips.",
                "Role-based access: the backend enforces `isAdmin()` checks on all privileged methods. The frontend mirrors this check for UI-gating, using the same principal comparison.",
                "RBAC is implemented via the `authorization` Caffeine component, which provides fine-grained method-level access control on top of principal identity.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 5 — Referral Abuse Mitigation */}
        <AccordionItem
          value="referrals"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Users} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Referral Abuse Mitigation
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Backend-enforced caps, burst detection, rate limiting
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Referral cap: each affiliate is capped at 50 verified referrals, enforced as a hard limit in the Motoko backend.",
                "Burst detection: more than 10 referrals in any 24-hour window automatically flags the account for manual review in the Admin panel.",
                "Minimum activity requirement: referrals only count after the referred user completes a defined minimum action — prevents throwaway signups.",
                "Waitlist rate limiting: the backend tracks submission timestamps and rejects rapid repeat submissions from the same principal.",
                "All abuse flags are visible to admins in the Admin panel under the Affiliates tab, with principal IDs for review.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 6 — Security Model */}
        <AccordionItem
          value="security"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Lock} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Security Model
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  WebAuthn, canister sandboxing, threshold BLS, no private keys
                  on-chain
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "No private keys stored on-chain — Internet Identity uses WebAuthn (biometrics / hardware keys) with derived key pairs that are scoped per domain.",
                "Canister sandboxing: each canister runs in a WebAssembly sandbox on a dedicated subnet. No canister can read another canister's memory.",
                "All inter-canister calls are authenticated — the IC runtime attaches the caller's principal to every incoming message automatically.",
                "HTTPS is enforced at the boundary node layer; all content is signed by the subnet's threshold BLS key, making it tamper-evident end-to-end.",
                "The frontend canister itself is served over the IC HTTP gateway — no traditional web server, no single point of failure, no hosting provider dependency.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 7 — Roadmap to Production */}
        <AccordionItem
          value="roadmap"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Rocket} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Roadmap to Production
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Phase 1 → 2 → 3 — zero data loss across upgrades
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            <div className="space-y-3">
              {[
                {
                  phase: "Phase 1",
                  status: "LIVE",
                  statusColor:
                    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                  title: "Demo & Simulation",
                  desc: "All Cloud Engine logic is simulated client-side. The backend stores user, waitlist, and admin state. The production-ready method signatures are already exposed.",
                },
                {
                  phase: "Phase 2",
                  status: "UPCOMING",
                  statusColor: "bg-primary/10 text-primary border-primary/30",
                  title: "Beta API Integration",
                  desc: "The Cloud Engines API is in live production on the NNS. As DFINITY opens third-party developer access, demo-mode branches are replaced with real actor calls — the architecture is already structured for this swap. The backend gains Cloud Engines substrate bindings. Cost tracking becomes real-time. No data loss — all stable variables carry forward across the canister upgrade.",
                },
                {
                  phase: "Phase 3",
                  status: "FUTURE",
                  statusColor: "bg-muted text-muted-foreground border-border",
                  title: "Sovereign EU Infrastructure",
                  desc: "NeoCloud's physical data centre (1MW Tier III, Romania) connects as a sovereign EU compute provider via ICP Cloud Engines. LockFree Engine becomes the operator dashboard for real workloads. The Enterprise white-label tier goes live for institutional clients — governments, defence, AI labs.",
                },
              ].map(({ phase, status, statusColor, title, desc }) => (
                <div
                  key={phase}
                  className="flex gap-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono px-2 shrink-0 ${statusColor}`}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      {phase} — {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest mb-2">
                Upgrade safety note
              </p>
              <CodeBlock>{`// Phase 1 → Phase 2 canister upgrade
// All stable variables are preserved automatically.
// User records, admin principal, waitlist entries — zero data loss.
// Only the simulation branches change; the data model is unchanged.`}</CodeBlock>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 8 — NeoCloud Integration Context */}
        <AccordionItem
          value="neocloud"
          className="border border-border rounded-lg px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <SectionIcon icon={Building2} />
              <div>
                <div className="font-semibold text-sm text-foreground">
                  NeoCloud Integration Context
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  Sovereign EU infrastructure layer — the physical substrate
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "NeoCloud (PayEU NeoCloud) is a Romanian sovereign compute provider: 1MW Tier III data centre, NVIDIA H200 GPU clusters, EU AI Act and GDPR Art. 25 compliance.",
                "Target clients: governments, defence contractors, enterprise AI labs — all requiring EU-jurisdiction, vendor-independent compute with full audit trails.",
                "LockFree Engine's Enterprise white-label tier is the natural operator dashboard for NeoCloud clients — they receive a fully branded management interface without building one themselves.",
                "Phase 3 integration: NeoCloud's physical infrastructure connects to ICP Cloud Engines as a sovereign subnet provider. LockFree Engine routes workloads and surfaces cost/resilience data for real compute.",
                "The three-layer stack: NeoCloud (physical compute) + ICP Cloud Engines (protocol) + LockFree Engine (operator dashboard). No equivalent combination exists in Europe today.",
                "Node providers earn 80% of all Cloud Engine revenue at the protocol level — 20% burns ICP. For NeoCloud, this means the Romanian subnet generates primary income directly from Cloud Engine workloads routed through it.",
                "The Pakistan MoU is the first production-scale sovereign Cloud Engine deployment — a nation of 240 million citizens. The model is proven and repeatable across geographies and jurisdictions.",
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs text-primary font-semibold mb-1">
                Why this combination matters
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No equivalent infrastructure + protocol + management layer
                combination currently exists in Europe. NeoCloud provides the
                physical layer and EU compliance. DFINITY's ICP provides the
                decentralised protocol. LockFree Engine provides the operator
                interface. All three are aligned and moving toward a combined
                pitch.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Footer note */}
      <div className="text-xs text-muted-foreground/50 font-mono border-t border-border pt-4">
        LockFree Engine v1 — demo build — all Cloud Engine operations are
        simulated pending third-party developer access to the ICP Cloud Engines
        API. The API is in live production on the NNS.
      </div>
    </div>
  );
}
