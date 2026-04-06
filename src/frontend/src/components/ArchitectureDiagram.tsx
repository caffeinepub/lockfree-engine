import { Badge } from "@/components/ui/badge";

// ─── small helpers ────────────────────────────────────────────────────────────

function LayerLabel({
  label,
  sublabel,
  color,
}: {
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={`text-[10px] font-mono font-bold uppercase tracking-widest ${color}`}
      >
        {label}
      </span>
      <span className="text-[9px] text-muted-foreground/60 font-mono">
        {sublabel}
      </span>
    </div>
  );
}

function Chip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded px-2 py-1 text-[11px] font-mono leading-tight text-center border ${
        className
      }`}
    >
      {children}
    </div>
  );
}

function ArrowDown({
  label,
  labelColor = "text-muted-foreground",
}: { label: string; labelColor?: string }) {
  return (
    <div className="flex flex-col items-center gap-0">
      <div className="w-px h-3 bg-border" />
      {label && (
        <span
          className={`text-[9px] font-mono px-2 py-0.5 rounded border border-border bg-background/80 ${labelColor} whitespace-nowrap`}
        >
          {label}
        </span>
      )}
      <div className="w-px h-3 bg-border" />
      {/* arrowhead — decorative only */}
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        className="text-border"
        role="img"
        aria-label="arrow"
      >
        <title>arrow</title>
        <path
          d="M0 0 L5 6 L10 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── main diagram ─────────────────────────────────────────────────────────────

export function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto" data-ocid="arch.diagram">
      <div className="min-w-[560px] max-w-2xl mx-auto flex flex-col items-center gap-0 font-mono select-none">
        {/* ── LAYER 1: LockFreeEngine ─────────────────────────────────────── */}
        <div className="w-full rounded-xl border border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_18px_0_rgba(6,182,212,0.07)] p-4">
          <div className="flex items-center justify-between mb-3">
            <LayerLabel
              label="LockFreeEngine"
              sublabel="Operator layer"
              color="text-cyan-400"
            />
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-cyan-500/40 text-cyan-400 bg-cyan-500/5"
            >
              LIVE — demo v1
            </Badge>
          </div>

          {/* two canisters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Frontend canister */}
            <div className="rounded-lg border border-cyan-500/25 bg-cyan-950/30 p-3 space-y-2">
              <div className="text-[10px] font-semibold text-cyan-300 uppercase tracking-widest">
                Frontend Canister
              </div>
              <div className="grid grid-cols-2 gap-1">
                {["React 19", "Tailwind CSS", "React Query", "shadcn/ui"].map(
                  (t) => (
                    <Chip
                      key={t}
                      className="border-cyan-500/20 bg-cyan-950/40 text-cyan-200/70"
                    >
                      {t}
                    </Chip>
                  ),
                )}
              </div>
              <div className="text-[10px] text-muted-foreground/60 leading-snug pt-1">
                Served as static assets over the IC HTTP gateway. No traditional
                web host.
              </div>
            </div>

            {/* Backend canister */}
            <div className="rounded-lg border border-cyan-500/25 bg-cyan-950/30 p-3 space-y-2">
              <div className="text-[10px] font-semibold text-cyan-300 uppercase tracking-widest">
                Backend Canister
              </div>
              <div className="grid grid-cols-2 gap-1">
                {["Motoko actor", "Stable vars", "RBAC", "Candid IDL"].map(
                  (t) => (
                    <Chip
                      key={t}
                      className="border-cyan-500/20 bg-cyan-950/40 text-cyan-200/70"
                    >
                      {t}
                    </Chip>
                  ),
                )}
              </div>
              <div className="text-[10px] text-muted-foreground/60 leading-snug pt-1">
                Orthogonal persistence. All state survives upgrades — no
                migrations needed.
              </div>
            </div>
          </div>

          {/* Candid bridge label */}
          <div className="flex justify-center mt-2">
            <span className="text-[9px] font-mono text-cyan-400/50 border border-cyan-500/20 bg-cyan-950/30 rounded px-2 py-0.5">
              Candid RPC · auto-generated TypeScript bindings
            </span>
          </div>
        </div>

        {/* ── connector 1 → 2 ─────────────────────────────────────────────── */}
        <ArrowDown label="Internet Identity auth · Canister calls · Boundary node HTTPS" />

        {/* ── LAYER 2: Internet Computer Protocol ─────────────────────────── */}
        <div className="w-full rounded-xl border border-indigo-500/40 bg-indigo-950/20 shadow-[0_0_18px_0_rgba(99,102,241,0.06)] p-4">
          <div className="flex items-center justify-between mb-3">
            <LayerLabel
              label="Internet Computer Protocol"
              sublabel="DFINITY · Mission 70"
              color="text-indigo-400"
            />
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-indigo-500/40 text-indigo-400 bg-indigo-500/5"
            >
              ICP mainnet
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: "Internet Identity", sub: "WebAuthn · no passwords" },
              { label: "NNS Governance", sub: "Subnet mgmt · upgrades" },
              { label: "Cloud Engines API", sub: "Mission 70 · upcoming" },
              { label: "Boundary Nodes", sub: "HTTPS · threshold BLS" },
            ].map(({ label, sub }) => (
              <div
                key={label}
                className="rounded-lg border border-indigo-500/20 bg-indigo-950/30 p-2 space-y-1 flex flex-col items-center text-center"
              >
                <span className="text-[10px] font-semibold text-indigo-200">
                  {label}
                </span>
                <span className="text-[9px] text-muted-foreground/55 leading-tight">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Subnets row */}
          <div className="rounded-lg border border-indigo-500/15 bg-indigo-950/20 p-2">
            <div className="text-[9px] font-mono text-indigo-400/60 uppercase tracking-widest mb-1.5 text-center">
              Subnets
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                "Application Subnet",
                "System Subnet",
                "Fiduciary Subnet",
                "Storage Subnet",
              ].map((s) => (
                <Chip
                  key={s}
                  className="border-indigo-500/15 bg-indigo-950/40 text-indigo-200/60"
                >
                  {s}
                </Chip>
              ))}
            </div>
            <div className="text-[9px] text-muted-foreground/50 text-center mt-1.5">
              Each subnet is a decentralised group of replica nodes running
              WebAssembly sandboxed canisters
            </div>
          </div>
        </div>

        {/* ── connector 2 → 3 ─────────────────────────────────────────────── */}
        <ArrowDown
          label="Phase 3 · Sovereign subnet provider · NeoCloud registers as ICP node operator"
          labelColor="text-emerald-500/70"
        />

        {/* ── LAYER 3: NeoCloud Physical Infrastructure ────────────────────── */}
        <div className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_18px_0_rgba(16,185,129,0.07)] p-4">
          <div className="flex items-center justify-between mb-3">
            <LayerLabel
              label="NeoCloud"
              sublabel="Physical infrastructure layer · Romania"
              color="text-emerald-400"
            />
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
            >
              Phase 3 integration
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              {
                label: "1MW Tier III DC",
                sub: "Romania · sovereign EU jurisdiction",
              },
              {
                label: "NVIDIA H200 GPUs",
                sub: "Bare-metal · no hyperscaler margin",
              },
              {
                label: "Tokenised Compute",
                sub: "GPU cycles as on-chain futures",
              },
            ].map(({ label, sub }) => (
              <div
                key={label}
                className="rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2 space-y-1 flex flex-col items-center text-center"
              >
                <span className="text-[10px] font-semibold text-emerald-200">
                  {label}
                </span>
                <span className="text-[9px] text-muted-foreground/55 leading-tight">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* compliance row */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {[
              "EU AI Act",
              "GDPR Art. 25",
              "MiCA compliant",
              "NIS2",
              "FIPS 140-3",
              "Intel SGX TEE",
              "EMI-licensed settlement",
            ].map((badge) => (
              <span
                key={badge}
                className="text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/30 text-emerald-300/70"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── combined vision note ─────────────────────────────────────────── */}
        <div className="w-full mt-4 rounded-xl border border-border bg-muted/20 p-3 flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <p
              className="text-[11px] font-semibold"
              style={{ color: "oklch(0.82 0.22 195)" }}
            >
              The combined stack — no equivalent exists in Europe today
            </p>
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: "oklch(0.82 0.22 195 / 0.8)" }}
            >
              NeoCloud provides the physical compute and EU sovereign
              compliance. DFINITY's Internet Computer provides the decentralised
              protocol, governance, and Cloud Engines substrate. LockFreeEngine
              is the operator interface — the product layer that makes the
              infrastructure visible, manageable, and commercially accessible to
              enterprise clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
