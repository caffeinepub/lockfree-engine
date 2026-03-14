import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Info, LogOut, Shield } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useListEngines } from "../hooks/useQueries";

export function SettingsPage() {
  const { identity, clear } = useInternetIdentity();
  const { data: engines } = useListEngines();
  const principal = identity?.getPrincipal().toString() ?? "demo-mode";

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
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Engine summary */}
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
