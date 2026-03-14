import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  Cpu,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { truncatePrincipal } from "../lib/providerUtils";
import { NavLink } from "./NavLink";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "engines", label: "Engines", icon: Cpu },
  { id: "chat", label: "AI Deploy", icon: MessageSquare },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "referrals", label: "Referrals", icon: Users },
  { id: "partners", label: "Partners", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AppSidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "demo";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={onMobileClose}
          onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-56 z-50
          flex flex-col
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-sm bg-primary/80" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              LockFree
            </span>
          </div>
          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={onMobileClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              onClick={() => {
                onNavigate(item.id);
                onMobileClose();
              }}
            />
          ))}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-sidebar-accent mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono text-primary">
                {principal.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-foreground truncate">
                {truncatePrincipal(principal)}
              </div>
              {principal === "demo" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground cursor-help">
                      Demo Mode
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    Exploring LockFree Engine in demo mode — no login required
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Authenticated
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-muted-foreground hover:text-foreground text-xs"
            onClick={clear}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}
