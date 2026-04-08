import type { Engine } from "../backend.d.ts";
import { ChatPanel } from "./ChatPanel";

interface ChatPageProps {
  preselectedEngine?: Engine | null;
  subscription?: string;
  onOpenPricing?: () => void;
  onOpenDashboard?: () => void;
}

export function ChatPage({
  preselectedEngine,
  subscription,
  onOpenPricing,
  onOpenDashboard,
}: ChatPageProps) {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100dvh - 3.5rem - 2rem)", minHeight: "480px" }}
    >
      <div className="console-panel flex flex-col min-h-0 overflow-hidden h-full">
        <ChatPanel
          preselectedEngineId={preselectedEngine?.id ?? null}
          subscription={subscription ?? "free"}
          onOpenPricing={onOpenPricing}
          onOpenDashboard={onOpenDashboard}
        />
      </div>
    </div>
  );
}
