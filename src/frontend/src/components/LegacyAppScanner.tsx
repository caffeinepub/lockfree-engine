import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Loader2,
  MapPin,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MappedComponent {
  original: string;
  icpEquivalent: string;
  notes: string;
}

export interface ScanResult {
  components: MappedComponent[];
  complexity: "Low" | "Medium" | "High" | "Enterprise";
  currentCostMin: number;
  currentCostMax: number;
  icpCostMin: number;
  icpCostMax: number;
  savingsPercent: number;
  isEnterpriseSovereign: boolean;
}

// ─── Stack mapping table ─────────────────────────────────────────────────────

const STACK_MAPPINGS: Array<{
  keywords: string[];
  original: string;
  icpEquivalent: string;
  notes: string;
}> = [
  // Infrastructure / Hosting
  {
    keywords: ["aws", "ec2", "lambda"],
    original: "AWS / EC2 / Lambda",
    icpEquivalent: "ICP Canister + NNS Subnets",
    notes: "Tamperproof, no DevOps needed",
  },
  {
    keywords: ["s3"],
    original: "AWS S3",
    icpEquivalent: "ICP Blob Storage (Caffeine)",
    notes: "World's best $/GB, on-chain",
  },
  {
    keywords: ["azure"],
    original: "Microsoft Azure",
    icpEquivalent: "ICP Sovereign Subnet",
    notes: "Data residency selectable by geography",
  },
  {
    keywords: ["gcp", "google cloud", "google-cloud"],
    original: "Google Cloud",
    icpEquivalent: "ICP Canister",
    notes: "Auto-scaled, no cold starts",
  },
  {
    keywords: ["heroku", "digitalocean", "vps"],
    original: "Heroku / DigitalOcean / VPS",
    icpEquivalent: "ICP Canister",
    notes: "Deploy once, runs forever",
  },
  // Databases
  {
    keywords: ["postgres", "postgresql", "mysql", "sqlite"],
    original: "PostgreSQL / MySQL / SQLite",
    icpEquivalent: "Orthogonal Persistence (stable memory)",
    notes: "Native canister state, no ORM needed",
  },
  {
    keywords: ["mongodb", "dynamodb", "firestore"],
    original: "MongoDB / DynamoDB / Firestore",
    icpEquivalent: "Stable B-Tree Map",
    notes: "Queryable, persistent across upgrades",
  },
  {
    keywords: ["redis", "memcache"],
    original: "Redis / Memcached",
    icpEquivalent: "In-memory canister state",
    notes: "Sub-millisecond, no cache invalidation",
  },
  // Auth
  {
    keywords: ["auth0", "oauth", "jwt", "firebase auth"],
    original: "Auth0 / OAuth / JWT",
    icpEquivalent: "Internet Identity",
    notes: "Zero-knowledge, no passwords",
  },
  {
    keywords: ["cognito"],
    original: "AWS Cognito",
    icpEquivalent: "Internet Identity",
    notes: "Self-sovereign identity, GDPR-native",
  },
  // Backend languages
  {
    keywords: [
      "node.js",
      "nodejs",
      "node js",
      "express",
      "fastapi",
      "django",
      "rails",
    ],
    original: "Node.js / Express / Django / Rails",
    icpEquivalent: "Motoko Canister",
    notes: "Actor model, orthogonal persistence",
  },
  {
    keywords: ["golang", "go lang"],
    original: "Go / Golang",
    icpEquivalent: "Motoko or CDK Rust",
    notes: "ICP-native, no infra management",
  },
  {
    keywords: ["java", "spring"],
    original: "Java / Spring",
    icpEquivalent: "Motoko Canister",
    notes: "Compiled to Wasm, runs on-chain",
  },
  {
    keywords: ["python", "flask"],
    original: "Python / Flask",
    icpEquivalent: "Motoko Canister",
    notes: "Full stack compiled to Wasm",
  },
  {
    keywords: ["rust"],
    original: "Rust",
    icpEquivalent: "CDK Rust Canister",
    notes: "Native ICP Rust CDK support",
  },
  // Frontend
  {
    keywords: ["next.js", "nextjs"],
    original: "Next.js",
    icpEquivalent: "React on ICP (asset canister)",
    notes: "Served directly from chain, no CDN",
  },
  {
    keywords: ["react"],
    original: "React",
    icpEquivalent: "React on ICP (asset canister)",
    notes: "Served directly from chain, no CDN",
  },
  {
    keywords: ["vue", "angular", "svelte"],
    original: "Vue / Angular / Svelte",
    icpEquivalent: "React on ICP (asset canister)",
    notes: "Rebuilt as React, same UX",
  },
  // Messaging / Queues
  {
    keywords: ["nats", "nats queue"],
    original: "NATS Queue",
    icpEquivalent: "Canister-to-canister messaging",
    notes: "Native async messaging, no broker",
  },
  {
    keywords: ["kafka", "rabbitmq", "sqs"],
    original: "Kafka / RabbitMQ / SQS",
    icpEquivalent: "Canister-to-canister messaging",
    notes: "Native async messaging, no broker",
  },
  {
    keywords: ["websocket", "socket.io"],
    original: "WebSockets / Socket.io",
    icpEquivalent: "Polling / IC streaming",
    notes: "Long-polling supported natively",
  },
  // Container / Orchestration
  {
    keywords: ["kubernetes", "k8s"],
    original: "Kubernetes / K8s",
    icpEquivalent: "ICP Subnet + NNS governance",
    notes: "Subnet = your cluster, NNS = your ops team",
  },
  {
    keywords: ["docker", "helm"],
    original: "Docker / Helm",
    icpEquivalent: "ICP Canister deployment",
    notes: "No containers, no runtime config",
  },
  {
    keywords: ["terraform", "ansible", "pulumi"],
    original: "Terraform / Ansible",
    icpEquivalent: "NNS Proposals + Candid API",
    notes: "Infrastructure-as-governance",
  },
  // Payments
  {
    keywords: ["stripe"],
    original: "Stripe",
    icpEquivalent: "ICP Stripe Extension",
    notes: "Same Stripe API, hosted on-chain",
  },
  {
    keywords: ["paypal", "braintree"],
    original: "PayPal / Braintree",
    icpEquivalent: "HTTP outcalls + ICP",
    notes: "External APIs via certified outcalls",
  },
  // Storage
  {
    keywords: ["ceph", "minio", "blob storage"],
    original: "Ceph / MinIO / Blob Storage",
    icpEquivalent: "ICP Blob Storage (Caffeine)",
    notes: "World's best $/GB, on-chain",
  },
  {
    keywords: ["ipfs"],
    original: "IPFS",
    icpEquivalent: "ICP Asset Canister",
    notes: "Decentralised, faster than IPFS",
  },
  // Security
  {
    keywords: ["tee", "bft", "tee bft", "hsm", "zero-trust", "zerotrust"],
    original: "TEE BFT Mesh / HSM / Zero-Trust",
    icpEquivalent: "ICP Threshold ECDSA + Vetkeys",
    notes: "Cryptographic security, no HSM hardware",
  },
  {
    keywords: ["vault", "secrets manager"],
    original: "HashiCorp Vault / Secrets Manager",
    icpEquivalent: "ICP Vetkeys",
    notes: "On-chain key management",
  },
  // Blockchain
  {
    keywords: ["sui move", "sui"],
    original: "Sui Move",
    icpEquivalent: "ICP Native (Motoko)",
    notes: "Smart contracts = canisters, native on ICP",
  },
  {
    keywords: ["solidity", "ethereum", "evm"],
    original: "Solidity / Ethereum / EVM",
    icpEquivalent: "Chain-key integration",
    notes: "Cross-chain via ICP threshold signatures",
  },
  {
    keywords: ["solana"],
    original: "Solana",
    icpEquivalent: "Chain-key integration",
    notes: "Cross-chain via ICP threshold sigs",
  },
  // AI / ML
  {
    keywords: ["openai", "gpt", "claude"],
    original: "OpenAI / GPT / Claude",
    icpEquivalent: "IIN (Internet Intelligence Network)",
    notes: "On-chain verifiable AI inference (coming soon)",
  },
  {
    keywords: ["huggingface", "tensorflow", "pytorch"],
    original: "HuggingFace / TensorFlow",
    icpEquivalent: "IIN / HTTP outcalls",
    notes: "Verifiable inference, open weights",
  },
];

const GENERIC_FALLBACK: MappedComponent[] = [
  {
    original: "Backend API layer",
    icpEquivalent: "Motoko Canister",
    notes: "Actor model, orthogonal persistence",
  },
  {
    original: "Frontend application",
    icpEquivalent: "React on ICP (asset canister)",
    notes: "Served directly from chain, no CDN",
  },
  {
    original: "Database / Storage",
    icpEquivalent: "Orthogonal Persistence (stable memory)",
    notes: "Native canister state, no ORM needed",
  },
  {
    original: "Authentication",
    icpEquivalent: "Internet Identity",
    notes: "Zero-knowledge, no passwords",
  },
  {
    original: "Cloud hosting",
    icpEquivalent: "ICP Canister + NNS Subnets",
    notes: "Tamperproof, auto-scaled",
  },
  {
    original: "Infrastructure config",
    icpEquivalent: "NNS Proposals + Candid API",
    notes: "Infrastructure-as-governance",
  },
];

const ENTERPRISE_KEYWORDS = [
  "kubernetes",
  "sui move",
  "nats",
  "ceph",
  "tee bft",
  "postgresql",
  "node.js",
  "nodejs",
  "golang",
  "react",
];

// ─── Analysis logic ───────────────────────────────────────────────────────────

function analyseStack(input: string): ScanResult {
  const lower = input.toLowerCase();
  const matched: MappedComponent[] = [];
  const seenEquivalents = new Set<string>();

  for (const mapping of STACK_MAPPINGS) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      if (!seenEquivalents.has(mapping.icpEquivalent)) {
        seenEquivalents.add(mapping.icpEquivalent);
        matched.push({
          original: mapping.original,
          icpEquivalent: mapping.icpEquivalent,
          notes: mapping.notes,
        });
      }
    }
  }

  const components =
    matched.length >= 3
      ? matched
      : [
          ...matched,
          ...GENERIC_FALLBACK.slice(0, Math.max(5 - matched.length, 3)),
        ];

  // Check enterprise sovereign preset
  const enterpriseHits = ENTERPRISE_KEYWORDS.filter((kw) => lower.includes(kw));
  const isEnterpriseSovereign = enterpriseHits.length >= 4;

  let complexity: ScanResult["complexity"];
  if (isEnterpriseSovereign) complexity = "Enterprise";
  else if (components.length >= 8) complexity = "High";
  else if (components.length >= 5) complexity = "Medium";
  else complexity = "Low";

  // Cost model
  let currentCostMin: number;
  let currentCostMax: number;
  let icpCostMin: number;
  let icpCostMax: number;
  let savingsPercent: number;

  if (isEnterpriseSovereign) {
    currentCostMin = 8900;
    currentCostMax = 8900;
    icpCostMin = 3200;
    icpCostMax = 3200;
    savingsPercent = 64;
  } else if (complexity === "High") {
    currentCostMin = 4800;
    currentCostMax = 6200;
    icpCostMin = 1800;
    icpCostMax = 2400;
    savingsPercent = 62;
  } else if (complexity === "Medium") {
    currentCostMin = 3200;
    currentCostMax = 4800;
    icpCostMin = 1100;
    icpCostMax = 1800;
    savingsPercent = 60;
  } else {
    currentCostMin = 1200;
    currentCostMax = 2400;
    icpCostMin = 480;
    icpCostMax = 900;
    savingsPercent = 58;
  }

  return {
    components,
    complexity,
    currentCostMin,
    currentCostMax,
    icpCostMin,
    icpCostMax,
    savingsPercent,
    isEnterpriseSovereign,
  };
}

// ─── Scanning steps ───────────────────────────────────────────────────────────

const SCAN_STEPS = [
  { label: "Parsing stack components...", durationMs: 800 },
  { label: "Mapping to ICP equivalents...", durationMs: 1200 },
  { label: "Calculating migration complexity...", durationMs: 900 },
  { label: "Generating sovereign deployment plan...", durationMs: 1100 },
];

function ComplexityBadge({
  complexity,
}: { complexity: ScanResult["complexity"] }) {
  if (complexity === "Enterprise") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
        ⭐ Enterprise
      </span>
    );
  }
  if (complexity === "High") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
        High
      </span>
    );
  }
  if (complexity === "Medium") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
      Low
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LegacyAppScannerProps {
  onDeployWithChat: (msg: string, scanResult?: ScanResult) => void;
}

export function LegacyAppScanner({ onDeployWithChat }: LegacyAppScannerProps) {
  const [stackInput, setStackInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  function resetScan() {
    setResult(null);
    setCompletedSteps([]);
    setCurrentStepIdx(null);
  }

  async function handleScan() {
    if (!stackInput.trim()) return;
    resetScan();
    setScanning(true);

    let accumulated = 0;
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setCurrentStepIdx(i);
      await new Promise((r) => setTimeout(r, SCAN_STEPS[i].durationMs));
      accumulated += SCAN_STEPS[i].durationMs;
      setCompletedSteps((prev) => [...prev, i]);
    }

    // Small pause before showing result
    await new Promise((r) => setTimeout(r, 200));
    setCurrentStepIdx(null);
    setScanning(false);
    setResult(analyseStack(stackInput));
    // suppress unused variable warning
    void accumulated;
  }

  function handleDeployWithChat() {
    onDeployWithChat(stackInput, result ?? undefined);
  }

  function handleDownloadBrief() {
    toast.success("Migration brief saved to your account", {
      description: "Full migration plan available in your account dashboard.",
    });
  }

  const formatCost = (min: number, max: number) =>
    min === max
      ? `€${min.toLocaleString()}/mo`
      : `€${min.toLocaleString()}–€${max.toLocaleString()}/mo`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        {/* ── Input state ── */}
        {!scanning && !result && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 p-4"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Analyse your existing stack
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste your current tech stack, infrastructure, or app
                description. LockFreeEngine will map each component to its ICP
                equivalent and generate a sovereign migration plan.
              </p>
            </div>

            <Textarea
              placeholder={
                "e.g. Node.js backend, PostgreSQL database, React frontend, hosted on AWS EC2\n\nOr paste your full stack: Kubernetes 1.28, Sui Move, NATS Queue, Ceph NVMe, TEE BFT Mesh..."
              }
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              rows={6}
              className="resize-none text-xs leading-relaxed font-mono placeholder:font-sans"
              data-ocid="scanner.input"
            />

            <div className="space-y-2">
              <Button
                className="w-full h-10 font-semibold text-sm gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-[0_0_16px_oklch(0.72_0.19_145/0.3)] hover:shadow-[0_0_24px_oklch(0.72_0.19_145/0.5)] transition-all duration-300"
                onClick={handleScan}
                disabled={!stackInput.trim()}
                data-ocid="scanner.scan_btn"
              >
                <Sparkles className="w-4 h-4" />
                Scan &amp; Generate Migration Plan
              </Button>
              <p className="text-center text-[11px] text-muted-foreground/60">
                All analysis is simulated — powered by Caffeine Snorkel (coming
                soon)
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Scanning state ── */}
        {scanning && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 p-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-3">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Scanning your stack...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Caffeine Snorkel analysis in progress
              </p>
            </div>

            <div className="space-y-3">
              {SCAN_STEPS.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                const isActive = currentStepIdx === idx && !isDone;
                return (
                  <motion.div
                    key={step.label}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors duration-300",
                      isDone
                        ? "bg-cyan-500/5 border-cyan-500/20"
                        : isActive
                          ? "bg-secondary/60 border-border"
                          : "bg-secondary/20 border-border/50 opacity-50",
                    ].join(" ")}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isActive || isDone ? 1 : 0.4, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {isDone ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-border/60" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${isDone ? "text-cyan-300" : isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>
                    {isDone && (
                      <span className="ml-auto text-[10px] text-cyan-500/70 font-mono">
                        done
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Result state ── */}
        {result && !scanning && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 p-4"
          >
            {/* A. Summary header */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300">
                    Stack Analysis Complete
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetScan}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
                >
                  Scan again
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <strong className="text-foreground">
                    {result.components.length}
                  </strong>{" "}
                  components detected
                </span>
                <span className="flex items-center gap-1.5">
                  Complexity: <ComplexityBadge complexity={result.complexity} />
                </span>
              </div>
            </div>

            {/* NeoCloud sovereign callout */}
            {result.isEnterpriseSovereign && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-amber-300">
                    Sovereign EU Deployment Detected
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  This stack is eligible for{" "}
                  <strong>NeoCloud's Romania AI Neocloud subnet</strong>.
                  LockFreeEngine will manage your workloads with full
                  GDPR-compliant node selection, giving you complete control
                  over data residency.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80">
                  <MapPin className="w-3 h-3" />
                  Sovereign EU node infrastructure · NNS-governed · GDPR-native
                </div>
              </motion.div>
            )}

            {/* B. Component mapping table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/50">
                <span className="text-xs font-semibold text-foreground">
                  Component Mapping
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {result.components.length} mapped
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[480px]">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium w-[32%]">
                        Your Stack
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium w-[36%]">
                        ICP Equivalent
                      </th>
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.components.map((comp, i) => (
                      <tr
                        key={`${comp.original}-${i}`}
                        className={`border-b border-border/60 last:border-0 ${i % 2 === 0 ? "bg-background/40" : "bg-secondary/20"}`}
                      >
                        <td className="px-3 py-2 font-mono text-foreground/90">
                          {comp.original}
                        </td>
                        <td className="px-3 py-2 font-semibold text-cyan-400">
                          {comp.icpEquivalent}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {comp.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* C. Migration Timeline */}
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Migration Timeline
                </span>
              </div>
              <div className="relative pl-5 space-y-4">
                {/* vertical line */}
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
                {[
                  {
                    phase: "Phase 1",
                    title: "Architecture & Design",
                    duration: "1–2 weeks",
                    detail:
                      "Canister design, data schema mapping, Internet Identity integration",
                  },
                  {
                    phase: "Phase 2",
                    title: "Build & Migration",
                    duration: "2–4 weeks",
                    detail:
                      "Snorkel-assisted auto-migration (coming soon), manual canister development if needed",
                  },
                  {
                    phase: "Phase 3",
                    title: "Deploy & Validate",
                    duration: "1 week",
                    detail:
                      "NNS subnet selection, sovereign node configuration, LockFreeEngine management setup",
                  },
                ].map((p) => (
                  <div key={p.phase} className="flex items-start gap-3">
                    <div className="relative z-10 w-3 h-3 rounded-full bg-cyan-500 border-2 border-background flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">
                          {p.phase}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {p.duration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {p.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* D. Cost comparison */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
                <div className="text-[10px] text-red-400/80 font-medium mb-1">
                  Estimated Current Cost
                </div>
                <div className="text-sm font-bold text-red-400">
                  {formatCost(result.currentCostMin, result.currentCostMax)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Cloud vendor billing
                </div>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <div className="text-[10px] text-emerald-400/80 font-medium mb-1">
                  Estimated ICP Cost
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  {formatCost(result.icpCostMin, result.icpCostMax)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Sovereign ICP hosting
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 px-3 py-2 flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">
                Save ~{result.savingsPercent}% monthly
              </span>
              <span className="text-xs text-muted-foreground">
                by migrating to sovereign ICP infrastructure
              </span>
            </div>

            {/* E. CTAs */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                className="w-full h-10 font-semibold text-sm gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-[0_0_16px_oklch(0.72_0.19_145/0.25)] hover:shadow-[0_0_24px_oklch(0.72_0.19_145/0.45)] transition-all duration-300"
                onClick={handleDeployWithChat}
                data-ocid="scanner.deploy_btn"
                data-tour-id="snorkel-migration-progress"
              >
                <Rocket className="w-4 h-4" />
                Start Migration with Snorkel
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full h-9 text-sm gap-2"
                onClick={handleDownloadBrief}
                data-ocid="scanner.download_btn"
              >
                <Download className="w-3.5 h-3.5" />
                Download Migration Brief
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-muted-foreground/50 pb-1">
              All analysis is simulated. Powered by Caffeine Snorkel (coming
              soon) · LockFreeEngine v3.0
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
