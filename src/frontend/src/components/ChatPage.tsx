import type { Engine } from "../backend.d.ts";
import { ChatPanel } from "./ChatPanel";

interface ChatPageProps {
  preselectedEngine?: Engine | null;
  subscription?: string;
  onOpenPricing?: () => void;
}

export function ChatPage({
  preselectedEngine,
  subscription,
  onOpenPricing,
}: ChatPageProps) {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100dvh - 3.5rem - 2rem)", minHeight: "480px" }}
    >
      <div className="console-panel flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatPanel
          preselectedEngineId={preselectedEngine?.id ?? null}
          subscription={subscription ?? "free"}
          onOpenPricing={onOpenPricing}
        />
      </div>
    </div>
  );
}
