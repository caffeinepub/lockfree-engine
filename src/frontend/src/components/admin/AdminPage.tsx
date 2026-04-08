import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, FileText, Settings2, ShieldOff, Users } from "lucide-react";
import { useState } from "react";
import { useIsAdmin } from "../../hooks/useAdminQueries";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { AdminAnalyticsTab } from "./AdminAnalyticsTab";
import { AdminContentTab } from "./AdminContentTab";
import { AdminUsersTabWrapper } from "./AdminUsersTab";
import { AdminWaitlistTab } from "./AdminWaitlistTab";

const HARDCODED_ADMIN_PRINCIPAL =
  "7xb3p-r7kxo-tjbki-fkmcf-buzj5-i5ux2-tcaye-tkujv-zmd6t-whrx7-lqe";

const TABS = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    ocid: "admin.analytics_tab",
  },
  {
    id: "waitlist",
    label: "Waitlist",
    icon: FileText,
    ocid: "admin.waitlist_tab",
  },
  { id: "users", label: "Users", icon: Users, ocid: "admin.users_tab" },
  {
    id: "content",
    label: "Content",
    icon: Settings2,
    ocid: "admin.content_tab",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<TabId>("analytics");

  const callerIsHardcodedAdmin =
    identity?.getPrincipal().toText() === HARDCODED_ADMIN_PRINCIPAL;
  const effectiveIsAdmin = !!(isAdmin || callerIsHardcodedAdmin);

  if (isLoading && !callerIsHardcodedAdmin) {
    return (
      <div className="space-y-4" data-ocid="admin.loading_state">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!effectiveIsAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        data-ocid="admin.error_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5">
          <ShieldOff className="w-8 h-8 text-destructive/60" />
        </div>
        <h2 className="font-display font-bold text-xl mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          You don't have permission to view this page. Admin access is required.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users, waitlist, analytics, and content settings.
        </p>
      </div>

      {/* Glass pill tab navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl backdrop-blur-md bg-card/60 border border-white/8 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={tab.ocid}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "analytics" && <AdminAnalyticsTab />}
        {activeTab === "waitlist" && <AdminWaitlistTab />}
        {activeTab === "users" && <AdminUsersTabWrapper />}
        {activeTab === "content" && <AdminContentTab />}
      </div>
    </div>
  );
}
