import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { truncatePrincipal } from "../lib/providerUtils";

interface Notification {
  id: string;
  type: "cost" | "migration" | "resilience" | "info";
  message: string;
  time: string;
  read: boolean;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "cost",
    message: "AWS cost alert: Demo — CRM Platform exceeded $90/mo threshold",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "migration",
    message: "Migration to GCP completed successfully — 23% cost savings",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "resilience",
    message: "Resilience score for Azure Storage Cluster dropped to 61",
    time: "3h ago",
    read: true,
  },
  {
    id: "n4",
    type: "cost",
    message: "Azure engine cost alert: Storage Cluster nearing monthly budget",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    type: "info",
    message:
      "LockFreeEngine platform update deployed — new AI optimization features",
    time: "2d ago",
    read: true,
  },
];

const NOTIFICATION_POOL: Array<Pick<Notification, "type" | "message">> = [
  { type: "info", message: "Engine prod-us-east-1 scaled up to 8 vCPU" },
  { type: "cost", message: "AWS cost alert: spend up 12% this week" },
  {
    type: "migration",
    message: "Migration to GCP completed — 18% cost savings",
  },
  {
    type: "resilience",
    message: "Resilience score for Demo — CRM Platform improved to 79",
  },
  {
    type: "cost",
    message: "Monthly budget threshold reached: Azure Storage Cluster at 94%",
  },
  {
    type: "info",
    message:
      "LockFreeEngine: new AI cost optimization recommendations available",
  },
  {
    type: "migration",
    message: "Live migration initiated: AWS → Azure (estimated 4 min)",
  },
  {
    type: "resilience",
    message: "Resilience alert: Demo — Dev/Staging dropped to 38",
  },
  {
    type: "cost",
    message: "GCP engine cost down 7% after auto-scaling adjustment",
  },
  {
    type: "info",
    message: "Engine Demo — Analytics Engine (GCP) restarted successfully",
  },
  {
    type: "migration",
    message: "Cross-region snapshot completed for Demo — CRM Platform",
  },
  {
    type: "info",
    message: "ICP Cloud Engines API: new compute quota available",
  },
];

const TYPE_COLORS: Record<Notification["type"], string> = {
  cost: "bg-yellow-500",
  migration: "bg-green-500",
  resilience: "bg-orange-500",
  info: "bg-blue-500",
};

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  isDemoMode?: boolean;
  onNavigate?: (page: string) => void;
  onSignOut?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export function TopBar({
  title,
  onMenuClick,
  isDemoMode,
  onNavigate,
  onSignOut,
  theme = "dark",
  onToggleTheme,
}: TopBarProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "demo";
  const [notifications, setNotifications] =
    useState<Notification[]>(DEMO_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDemoMode) return;

    function scheduleNext() {
      // 3–5 minutes between notifications (silent — bell only, no toast)
      const delay = Math.floor(Math.random() * 120000) + 180000;
      intervalRef.current = setTimeout(() => {
        const pool = NOTIFICATION_POOL;
        const item = pool[Math.floor(Math.random() * pool.length)];
        const newNotif: Notification = {
          id: Date.now().toString(),
          type: item.type,
          message: item.message,
          time: "just now",
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isDemoMode]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4 lg:px-6"
      style={{
        background: "oklch(0.1 0.014 245 / 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid oklch(0.82 0.22 195 / 0.08)",
      }}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden w-8 h-8 hover:bg-card/60 transition-colors duration-200"
        onClick={onMenuClick}
        data-ocid="topbar.menu.button"
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
          className="h-8 pl-8 w-48 text-xs bg-secondary/50 border-border/60 focus:border-primary/40 transition-colors"
          data-ocid="topbar.search_input"
        />
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-muted-foreground hover:text-foreground hover:ring-2 hover:ring-primary/20 transition-all duration-200 rounded-lg"
        onClick={onToggleTheme}
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        data-ocid="topbar.theme.toggle"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>

      {/* Notifications dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 relative text-muted-foreground hover:text-foreground hover:ring-2 hover:ring-primary/20 transition-all duration-200 rounded-lg"
            data-ocid="topbar.notifications.button"
            data-tour-id="notification-bell"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-80"
          data-ocid="topbar.notifications.dropdown_menu"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
                data-ocid="topbar.notifications.mark_all_read.button"
              >
                Mark all read
              </button>
            )}
          </div>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div
              className="px-3 py-6 text-center text-xs text-muted-foreground"
              data-ocid="topbar.notifications.empty_state"
            >
              No notifications
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left flex gap-2.5 px-3 py-2.5 hover:bg-muted/50 transition-colors ${
                    !n.read ? "bg-muted/20" : ""
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${TYPE_COLORS[n.type]} ${
                      n.read ? "opacity-30" : ""
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-snug ${
                        n.read ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {n.time}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 pl-2 border-l border-border/40 hover:opacity-90 transition-opacity"
            data-ocid="topbar.profile.button"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "oklch(0.82 0.22 195 / 0.15)",
                border: "1px solid oklch(0.82 0.22 195 / 0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(0.82 0.22 195 / 0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(0.82 0.22 195 / 0.25)";
              }}
            >
              <span className="text-xs font-mono text-primary font-bold">
                {principal.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block text-xs font-mono text-muted-foreground">
              {truncatePrincipal(principal)}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52"
          data-ocid="topbar.profile.dropdown_menu"
        >
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs font-mono text-muted-foreground truncate">
              {truncatePrincipal(principal)}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onNavigate?.("settings")}
            className="cursor-pointer"
            data-ocid="topbar.profile.settings.button"
          >
            <Settings className="w-3.5 h-3.5 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onNavigate?.("billing")}
            className="cursor-pointer"
            data-ocid="topbar.profile.billing.button"
          >
            <CreditCard className="w-3.5 h-3.5 mr-2" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSignOut}
            className="cursor-pointer text-destructive focus:text-destructive"
            data-ocid="topbar.profile.signout.button"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
