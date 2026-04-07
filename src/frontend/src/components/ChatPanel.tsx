import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Info,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Engine } from "../backend.d.ts";
import { type ChatMessage, useChatHistory } from "../hooks/useChatHistory";
import { useGetUsageSummary, useListEngines } from "../hooks/useQueries";

// Re-export for backward compat
export type { ChatMessage as Message };

const SUGGESTED_PROMPTS = [
  "Migrate my AWS app to ICP via Snorkel",
  "I have a legacy Node.js app I want to migrate",
  "Add authentication to my app",
  "Deploy a sovereign ICP cloud engine",
  "Optimize my cloud costs",
  "Distribute across providers",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your AI deployment assistant for LockFreeEngine. I can deploy new apps directly to your chosen engine — or help you migrate existing workloads onto sovereign ICP infrastructure.\n\nWith *Caffeine Snorkel* coming in the v3.0 roadmap, this chat will serve as the front-end interface for automated legacy migrations. Describe an existing app — whether it's running on AWS, Azure, or your own servers — and I'll outline a migration plan.",
  timestamp: new Date(),
};

const PROVIDER_TABLE_MESSAGE: ChatMessage = {
  id: "provider-table",
  role: "assistant",
  content: "",
  timestamp: new Date(),
  isProviderTable: true,
};

// ─── Context-aware AI response ────────────────────────────────────────────────

function generateAIResponse(content: string, engines: Engine[]): string {
  const lower = content.toLowerCase();

  // Find relevant engine by name mentions or "current" context
  const crmEngine = engines.find(
    (e) =>
      e.name.toLowerCase().includes("crm") ||
      e.name.toLowerCase().includes("lock") ||
      e.name.toLowerCase().includes("demo"),
  );
  const firstEngine = engines[0];
  const targetEngine = crmEngine ?? firstEngine;
  const engineName = targetEngine?.name ?? "your engine";
  const provider = targetEngine?.provider ?? "AWS";

  // "update my CRM with payments" or "add payments"
  if (
    (lower.includes("update") ||
      lower.includes("add") ||
      lower.includes("integrate")) &&
    (lower.includes("payment") ||
      lower.includes("stripe") ||
      lower.includes("billing"))
  ) {
    if (lower.includes("crm") || crmEngine) {
      return `Updating *${engineName}* with payment capabilities.\n\nDeploying Stripe integration module as a new canister on ${provider}...\n\n✓ Payment canister deployed\n✓ CRM webhook connected\n✓ Checkout flow live at /pay\n\nYour CRM now accepts credit cards and ICP token payments. No vendor lock-in — the payment canister can migrate with your engine anytime.`;
    }
    return `Deploying payment integration to *${engineName}* on ${provider}.\n\n✓ Stripe canister provisioned\n✓ ICP token payment module active\n✓ Webhook handlers configured\n\nPayment endpoints are live. Demand-driven compute means you only pay for actual transaction volume.`;
  }

  // "deploy a CRM" / "CRM with auth"
  if (
    lower.includes("crm") &&
    (lower.includes("deploy") ||
      lower.includes("build") ||
      lower.includes("create"))
  ) {
    return `Deploying a full CRM to *${engineName}* (${provider}).\n\nProvisioning canisters:\n✓ User auth canister (Internet Identity)\n✓ Contacts database canister\n✓ Activity feed canister\n✓ API gateway canister\n\nCRM is live. Seamless multi-cloud migration means this entire stack moves in <5s if you switch providers — as per DFINITY Mission 70.`;
  }

  // "add auth" / "authentication"
  if (
    lower.includes("auth") ||
    lower.includes("login") ||
    lower.includes("identity")
  ) {
    return `Adding Internet Identity authentication to *${engineName}*.\n\n✓ Auth canister deployed\n✓ Principal-based access control configured\n✓ Session management active\n\nYour app now supports self-sovereign identity — no passwords, no vendor lock-in.`;
  }

  // "add database" / "postgres"
  if (
    lower.includes("database") ||
    lower.includes("postgres") ||
    lower.includes("db") ||
    lower.includes("storage")
  ) {
    return `Provisioning a persistent database canister on *${engineName}* (${provider}).\n\n✓ Stable memory canister deployed\n✓ Query API live\n✓ Backup schedule configured (every 6h)\n\nData lives on ICP — no external database, no S3 costs, no provider dependency.`;
  }

  // Snorkel / legacy migration keywords
  if (
    lower.includes("snorkel") ||
    lower.includes("legacy") ||
    lower.includes("existing app") ||
    lower.includes("existing service") ||
    lower.includes("move my app") ||
    lower.includes("aws app") ||
    lower.includes("azure app") ||
    ((lower.includes("migrate") || lower.includes("migration")) &&
      (lower.includes("aws") ||
        lower.includes("azure") ||
        lower.includes("node") ||
        lower.includes("react") ||
        lower.includes("express") ||
        lower.includes("django") ||
        lower.includes("rails") ||
        lower.includes("legacy") ||
        lower.includes("existing") ||
        lower.includes("snorkel") ||
        lower.includes("icp")))
  ) {
    return `Migration request received. Here's how this works with LockFreeEngine.\n\n*LockFreeEngine's AI Deploy Chat is the conversational front-end for Caffeine Snorkel* — DFINITY's upcoming auto-migration engine, announced as part of the Caffeine v3.0 roadmap on April 7th.\n\nWhen Snorkel goes live, this chat will trigger the real migration pipeline. Here's what that journey looks like:\n\n① *Describe* — You tell me about your existing app (stack, data, integrations)\n② *Snorkel analyses* — Your legacy stack is scanned, dependencies mapped, ICP-compatible deployment generated automatically\n③ *LockFreeEngine manages* — Your migrated workload runs on a sovereign ICP Cloud Engine\n④ *Sovereign hosting* — Hosted on tamper-proof, unstoppable ICP infrastructure — optionally on EU sovereign nodes\n\n*Simulated migration plan for your workload:*\n✓ Legacy stack audit: dependencies mapped\n✓ Data export schema: normalised for ICP stable storage\n✓ Canister architecture: 3 canisters proposed (app logic, auth, data)\n✓ Destination engine: ${engineName} (${provider})\n\nSnorkel is coming. When it does, this is the interface that drives it. Join the waitlist for early access.`;
  }

  // "migrate" (provider-to-provider, not legacy)
  if (
    lower.includes("migrate") ||
    lower.includes("move") ||
    lower.includes("transfer")
  ) {
    const otherProviders = ["AWS", "GCP", "Azure"].filter(
      (p) => p !== provider,
    );
    const target = otherProviders[0] ?? "GCP";
    return `Ready to migrate *${engineName}* from ${provider} to ${target}.\n\nEstimated downtime: *0 seconds* (Mission 70 live migration)\nEstimated monthly savings: ~$73\n\nUse the Migrate Now button on the engine card, or I can trigger it directly. Your apps, data, and configs transfer atomically.`;
  }

  // "optimize" / "cheapest"
  if (
    lower.includes("optim") ||
    lower.includes("cheap") ||
    lower.includes("cost") ||
    lower.includes("save")
  ) {
    return `Analyzing your ${engines.length} engine${engines.length !== 1 ? "s" : ""} against current provider rates...\n\nRecommendation: Move 60% of workload to GCP to save ~34%.\n\nProvider rates:\n• AWS — $0.25/hr (current)\n• GCP — $0.18/hr ← cheapest\n• Azure — $0.22/hr\n\nDemand-driven compute: switch providers anytime with zero lock-in.`;
  }

  // "distribute" / "resilience"
  if (
    lower.includes("distribut") ||
    lower.includes("resilience") ||
    lower.includes("spread")
  ) {
    return `Distributing your engines across AWS, GCP, and Azure for maximum resilience.\n\nCurrent resilience score will increase from ~55% → 89% after distribution.\n\nUse the *"Distribute Across Providers"* button on the dashboard to apply this instantly.`;
  }

  // Generic deploy
  if (
    lower.includes("deploy") ||
    lower.includes("build") ||
    lower.includes("create") ||
    lower.includes("launch")
  ) {
    return `Deploying to *${engineName}* (${provider}).\n\nAnalyzing your requirements and provisioning canisters on ICP...\n\n✓ Canister deployed\n✓ Endpoints configured\n✓ Health check passing\n\nYour app is live. It can migrate to any provider in <5s — no vendor lock-in.`;
  }

  // Default
  return `I can help you deploy new apps, add auth, integrate payments, migrate engines between providers — or describe an existing legacy workload you want to move to ICP via *Caffeine Snorkel*.\n\nTry: *"Migrate my AWS app to ICP via Snorkel"* or *"Deploy a sovereign ICP cloud engine"* or *"Optimize my cloud costs"*\n\nPowered by ICP demand-driven compute — your infrastructure, your rules.`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TypingDotsProps {
  visible: boolean;
}

function TypingDots({ visible }: TypingDotsProps) {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-card border border-border w-fit">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
    </div>
  );
}

function ProviderComparisonTable({
  onMigrate,
}: { onMigrate: (provider: string) => void }) {
  const providers = [
    { name: "AWS", cost: "$0.25/hr", latency: "12ms", cheapest: false },
    { name: "GCP", cost: "$0.18/hr", latency: "9ms", cheapest: true },
    { name: "Azure", cost: "$0.22/hr", latency: "11ms", cheapest: false },
  ];

  return (
    <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
      <div className="px-3 py-2 border-b border-border bg-secondary/50 flex items-center gap-2">
        <TrendingDown className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">
          Provider Cost Comparison
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          AI Recommendation
        </span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">
              Provider
            </th>
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">
              Monthly Cost
            </th>
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">
              Latency
            </th>
            <th className="text-left px-3 py-2 text-muted-foreground font-medium">
              Recommendation
            </th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr
              key={p.name}
              className={`border-b border-border last:border-0 ${p.cheapest ? "bg-[oklch(0.72_0.19_145/0.06)]" : ""}`}
            >
              <td className="px-3 py-2 font-mono font-semibold">{p.name}</td>
              <td className="px-3 py-2 font-mono">{p.cost}</td>
              <td className="px-3 py-2 font-mono">{p.latency}</td>
              <td className="px-3 py-2">
                {p.cheapest ? (
                  <span className="inline-flex items-center gap-1 text-[oklch(0.72_0.19_145)] font-semibold">
                    ← Cheapest
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 border-t border-border bg-secondary/50">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5 text-[oklch(0.72_0.19_145)] border-[oklch(0.72_0.19_145/0.3)] hover:bg-[oklch(0.72_0.19_145/0.1)]"
          onClick={() => onMigrate("GCP")}
        >
          <ArrowRight className="w-3 h-3" />
          Migrate to GCP (save ~28%)
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onMigrate,
}: {
  message: ChatMessage;
  onMigrate: (provider: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={`
          w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
          ${isUser ? "bg-primary/20 border border-primary/30" : "bg-secondary border border-border"}
        `}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>

      <div
        className={`
          max-w-[85%] rounded-lg px-3 py-2.5 text-sm leading-relaxed
          ${
            isUser
              ? "bg-primary/15 border border-primary/20 text-foreground"
              : "bg-card border border-border text-foreground"
          }
        `}
      >
        {message.isProviderTable ? (
          <div className="space-y-2">
            <p className="text-sm">
              Here's the current cost comparison across providers for your
              workload:
            </p>
            <ProviderComparisonTable onMigrate={onMigrate} />
          </div>
        ) : (
          message.content.split("\n").map((line, i) => {
            const parts = line.split(/\*([^*]+)\*/g);
            return (
              <span key={`${message.id}-line-${i}`} className="block">
                {parts.map((part, j) => {
                  const key = `${message.id}-part-${j}`;
                  return j % 2 === 1 ? (
                    <em
                      key={key}
                      className="text-primary not-italic font-medium"
                    >
                      {part}
                    </em>
                  ) : (
                    <span key={key}>{part}</span>
                  );
                })}
              </span>
            );
          })
        )}
        <div className="text-xs text-muted-foreground/70 mt-1.5">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ChatPanelProps {
  preselectedEngineId?: bigint | null;
  subscription?: string;
  onOpenPricing?: () => void;
}

export function ChatPanel({
  preselectedEngineId,
  subscription = "free",
  onOpenPricing,
}: ChatPanelProps) {
  const [messages, setMessages, clearHistory] = useChatHistory(WELCOME_MESSAGE);
  const [input, setInput] = useState("");
  const [selectedEngineId, setSelectedEngineId] = useState<string>(
    preselectedEngineId?.toString() ?? "none",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: engines } = useListEngines();
  const { data: usage } = useGetUsageSummary();

  const isPro = subscription === "pro" || subscription === "enterprise";
  const deploymentsThisMonth = Number(usage?.deploymentsThisMonth ?? 0);

  useEffect(() => {
    if (preselectedEngineId) {
      setSelectedEngineId(preselectedEngineId.toString());
    }
  }, [preselectedEngineId]);

  const messagesCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll when count or typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesCount, isTyping]);

  async function handleSend(content?: string) {
    const text = (content ?? input).trim();
    if (!text) return;

    // Check deployment limit for free tier
    if (subscription === "free" && deploymentsThisMonth >= 5) {
      toast.error("Deployment limit reached", {
        description:
          "Free tier allows 5 deployments/month. Upgrade to Pro for unlimited.",
        action: {
          label: "Upgrade",
          onClick: () => onOpenPricing?.(),
        },
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay, then respond with context-aware AI
    await new Promise((r) => setTimeout(r, 1500));
    setIsTyping(false);

    const aiResponse = generateAIResponse(text, engines ?? []);
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleSuggestCheapest() {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: "Suggest the cheapest cloud provider for my workloads",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          ...PROVIDER_TABLE_MESSAGE,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  }

  function handleMigrateSuggestion(provider: string) {
    const engineId =
      selectedEngineId !== "none" ? BigInt(selectedEngineId) : null;
    if (!engineId) {
      toast.info("Select an engine first to trigger a migration.");
      return;
    }
    toast.promise(
      (async () => {
        await new Promise((r) => setTimeout(r, 1500));
      })(),
      {
        loading: `Migrating to ${provider}...`,
        success: `Successfully migrated to ${provider}!`,
        error: "Migration failed",
      },
    );
  }

  const atDeployLimit = subscription === "free" && deploymentsThisMonth >= 5;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0"
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">AI Deploy Assistant</div>
            <div className="text-xs text-muted-foreground/70">
              Demand-driven deployment to any engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear history button — hover-revealed */}
          <AnimatePresence>
            {headerHovered && messages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        clearHistory();
                        toast.success("Chat history cleared");
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-40">
                    Clear chat history
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pro: Suggest cheapest provider button */}
          {isPro && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1.5 text-[oklch(0.72_0.19_145)] border-[oklch(0.72_0.19_145/0.3)] hover:bg-[oklch(0.72_0.19_145/0.1)]"
                  onClick={handleSuggestCheapest}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  Cheapest Provider
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-52">
                AI-powered cost analysis across AWS, GCP, and Azure
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-64">
              <p>
                Deploy new apps or describe an existing workload to migrate to
                ICP. When Caffeine Snorkel goes live, this chat will trigger
                real automated migrations. Chat history persists across
                sessions.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Engine selector */}
      <div className="px-4 py-2.5 border-b border-border bg-secondary/20 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Deploy to:</span>
          <Select value={selectedEngineId} onValueChange={setSelectedEngineId}>
            <SelectTrigger className="h-7 text-xs flex-1 max-w-52">
              <SelectValue placeholder="Select an engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No engine selected</SelectItem>
              {engines?.map((e) => (
                <SelectItem key={e.id.toString()} value={e.id.toString()}>
                  {e.name} ({e.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deployment limit warning */}
      {atDeployLimit && (
        <div className="mx-4 mt-3 flex items-center gap-2.5 p-2.5 rounded-lg bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)] flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-[oklch(0.72_0.18_55)] flex-shrink-0" />
          <p className="text-xs text-[oklch(0.82_0.18_55)] flex-1">
            You've reached the Free tier limit (5 deployments/month).
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs px-2 text-[oklch(0.72_0.18_55)] hover:bg-[oklch(0.72_0.18_55/0.1)] flex-shrink-0"
            onClick={onOpenPricing}
          >
            Upgrade
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-5">
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onMigrate={handleMigrateSuggestion}
              />
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <TypingDots visible />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Suggestions — show on first load or after welcome */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-border flex-shrink-0">
          <div className="text-xs text-muted-foreground/70 mb-2">
            Suggested prompts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => void handleSend(p)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 hover:text-primary transition-colors active:scale-[0.97]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            placeholder={
              atDeployLimit
                ? "Upgrade to Pro to continue deploying..."
                : "Deploy a new app, or describe an existing workload to migrate via Snorkel..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="resize-none text-sm leading-relaxed min-h-[64px]"
            disabled={atDeployLimit}
          />
          <Button
            size="icon"
            className="h-9 w-9 flex-shrink-0 active:scale-[0.97]"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isTyping || atDeployLimit}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-1.5">
          Enter to send · Shift+Enter for new line
          {!isPro && (
            <span className="ml-2">
              · {5 - deploymentsThisMonth} deployments remaining
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
