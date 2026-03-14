import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { truncatePrincipal } from "../lib/providerUtils";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  isDemoMode?: boolean;
}

export function TopBar({ title, onMenuClick, isDemoMode }: TopBarProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "demo";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden w-8 h-8"
        onClick={onMenuClick}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Page title */}
      <div className="font-display font-semibold text-base tracking-tight text-foreground">
        {title}
      </div>

      {isDemoMode && (
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-provisioning/10 border border-status-provisioning/20 text-status-provisioning text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-status-provisioning animate-pulse" />
          Demo Mode
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center relative">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search engines..."
          className="h-8 pl-8 w-48 text-xs bg-secondary/50 border-border"
        />
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="w-8 h-8 relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
      </Button>

      {/* User avatar */}
      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-xs font-mono text-primary font-bold">
            {principal.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-xs font-mono text-muted-foreground">
          {truncatePrincipal(principal)}
        </span>
      </div>
    </header>
  );
}
