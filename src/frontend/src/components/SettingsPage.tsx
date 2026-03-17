import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  Info,
  LogOut,
  Scale,
  Shield,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetBillingEvents,
  useGetMigrationHistory,
  useGetMySubscription,
  useListEngines,
} from "../hooks/useQueries";

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DATA_RIGHTS = [
  {
    right: "Right of Access",
    description:
      "You can request a full copy of all data we hold about you at any time. Use the export buttons below or contact an admin.",
  },
  {
    right: "Right to Erasure",
    description:
      "You can request permanent deletion of your account and all associated data. Contact an admin and they will action this from the Admin panel.",
  },
  {
    right: "Right to Portability",
    description:
      "You can download your data in JSON or CSV format at any time using the export buttons below — ready to import into another system.",
  },
  {
    right: "Right to Rectification",
    description:
      "If any data we hold about you is inaccurate, contact an admin and we will correct it promptly.",
  },
];

export function SettingsPage() {
  const { identity, clear } = useInternetIdentity();
  const { data: engines } = useListEngines();
  const { data: migrations } = useGetMigrationHistory();
  const { data: billingEvents } = useGetBillingEvents();
  const { data: subscription } = useGetMySubscription();
  const principal = identity?.getPrincipal().toString() ?? "demo-mode";

  function buildExportPayload() {
    return {
      exportedAt: new Date().toISOString(),
      account: {
        principal,
        plan: subscription ?? "free",
      },
      engines: (engines ?? []).map((e) => ({
        id: e.id.toString(),
        name: e.name,
        provider: e.provider,
        status: e.status,
        cpu: e.cpu.toString(),
        ram: e.ram.toString(),
        storage: e.storage.toString(),
        costPerHour: e.costPerHour,
        createdAt: e.createdAt.toString(),
      })),
      migrationHistory: (migrations ?? []).map((m) => ({
        id: m.id.toString(),
        engineId: m.engineId.toString(),
        fromProvider: m.fromProvider,
        toProvider: m.toProvider,
        status: m.status,
        costSavings: m.savedPerMonth,
        timestamp: m.timestamp.toString(),
      })),
      billingEvents: (billingEvents ?? []).map((b) => ({
        id: b.id.toString(),
        eventType: b.eventType,
        amount: b.amount,
        description: b.note,
        timestamp: b.timestamp.toString(),
      })),
    };
  }

  function handleExportJSON() {
    const payload = buildExportPayload();
    downloadFile(
      `lockfreeengine-export-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
  }

  function handleExportCSV() {
    const payload = buildExportPayload();
    const sections: string[] = [];

    sections.push("ACCOUNT");
    sections.push("Principal,Plan,Exported At");
    sections.push(
      `"${payload.account.principal}","${payload.account.plan}","${payload.exportedAt}"`,
    );
    sections.push("");

    sections.push("ENGINES");
    sections.push(
      "ID,Name,Provider,Status,CPU,RAM (GB),Storage (GB),Cost Per Hour",
    );
    for (const e of payload.engines) {
      sections.push(
        `"${e.id}","${e.name}","${e.provider}","${e.status}","${e.cpu}","${e.ram}","${e.storage}","${e.costPerHour}"`,
      );
    }
    sections.push("");

    sections.push("MIGRATION HISTORY");
    sections.push(
      "ID,Engine ID,From Provider,To Provider,Status,Cost Savings,Timestamp",
    );
    for (const m of payload.migrationHistory) {
      sections.push(
        `"${m.id}","${m.engineId}","${m.fromProvider}","${m.toProvider}","${m.status}","${m.costSavings}","${m.timestamp}"`,
      );
    }
    sections.push("");

    sections.push("BILLING EVENTS");
    sections.push("ID,Event Type,Amount,Description,Timestamp");
    for (const b of payload.billingEvents) {
      sections.push(
        `"${b.id}","${b.eventType}","${b.amount}","${b.description}","${b.timestamp}"`,
      );
    }

    downloadFile(
      `lockfreeengine-export-${new Date().toISOString().slice(0, 10)}.csv`,
      sections.join("\n"),
      "text/csv",
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Account */}
      <div className="console-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Account</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Internet Identity Principal
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-secondary px-2 py-1.5 rounded break-all">
                {principal}
              </code>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {principal === "demo-mode" ? "Demo" : "Authenticated"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Current Plan
            </div>
            <Badge className="capitalize text-xs">
              {subscription ?? "free"}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Sign Out</div>
              <div className="text-xs text-muted-foreground">
                Clears your local identity and session
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="gap-2"
              data-ocid="settings.signout.button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Infrastructure Summary */}
      <div className="console-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Infrastructure Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-mono font-bold">
              {engines?.length ?? 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Engines</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold">
              {engines?.filter((e) => e.status === "running").length ?? 0}
            </div>
            <div className="text-xs text-muted-foreground">Running</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold">
              {new Set(engines?.map((e) => e.provider)).size}
            </div>
            <div className="text-xs text-muted-foreground">Providers</div>
          </div>
        </div>
      </div>

      {/* Your Data Rights */}
      <div className="console-panel p-5">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Your Data Rights</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          LockFree Engine honours data rights inspired by the EU General Data
          Protection Regulation (GDPR), regardless of your location. You have
          four core rights:
        </p>

        <div className="space-y-3">
          {DATA_RIGHTS.map(({ right, description }) => (
            <div
              key={right}
              className="rounded-lg border border-border bg-muted/20 px-4 py-3"
            >
              <div className="text-xs font-semibold text-foreground mb-0.5">
                {right}
              </div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          To exercise your right to erasure, contact an admin directly. For full
          details see our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>
          , section 4.
        </p>
      </div>

      {/* Data Portability */}
      <div className="console-panel p-5">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Data Portability</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          LockFree Engine doesn't lock you in. Export your full configuration,
          migration history, and billing data at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left group"
            data-ocid="settings.export_json.button"
          >
            <FileJson className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium group-hover:text-primary transition-colors">
                Export as JSON
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Full structured export for developers and technical integrations
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left group"
            data-ocid="settings.export_csv.button"
          >
            <FileSpreadsheet className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium group-hover:text-primary transition-colors">
                Export as CSV
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Spreadsheet-friendly format for business reporting
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Exports include engine configurations, migration history, and billing
          events.
        </p>
      </div>

      {/* About */}
      <div className="console-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">About LockFree Engine</h2>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            LockFree Engine is a multi-cloud infrastructure management platform
            built entirely on the Internet Computer Protocol (ICP).
          </p>
          <p>
            Provision engines on AWS, GCP, or Azure — then migrate them
            instantly with zero downtime. Your infrastructure is always yours.
          </p>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-2">
          <a
            href="https://internetcomputer.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            Internet Computer
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            Built with caffeine.ai
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
