import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Building2,
  Cpu,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useIsAdmin } from "../hooks/useAdminQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { truncatePrincipal } from "../lib/providerUtils";
import { NavLink } from "./NavLink";

interface AppSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onSignOut: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "engines", label: "Engines", icon: Cpu },
  { id: "chat", label: "AI Deploy", icon: MessageSquare },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "referrals", label: "Referrals", icon: Users },
  { id: "partners", label: "Partners", icon: Building2 },
  { id: "settings", label: "Account Settings", icon: Settings },
  { id: "userguide", label: "User Guide", icon: BookOpen },
  { id: "changelog", label: "Changelog", icon: ScrollText },
];

export function AppSidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onMobileClose,
  onSignOut,
}: AppSidebarProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "demo";
  const { data: isAdmin } = useIsAdmin();

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
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/lockfree-logo-transparent.dim_200x200.png"
              alt="LockFreeEngine"
              className="w-6 h-6 object-contain flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-display text-xs font-bold tracking-tight text-foreground">
              LockFreeEngine
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
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
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
          {isAdmin && (
            <NavLink
              icon={ShieldCheck}
              label="Admin"
              active={activePage === "admin"}
              data-ocid="admin.nav.link"
              onClick={() => {
                onNavigate("admin");
                onMobileClose();
              }}
            />
          )}
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
            onClick={onSignOut}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}
