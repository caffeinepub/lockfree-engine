import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Settings2, ShieldOff, Users } from "lucide-react";
import { useIsAdmin } from "../../hooks/useAdminQueries";
import { AdminAnalyticsTab } from "./AdminAnalyticsTab";
import { AdminContentTab } from "./AdminContentTab";
import { AdminUsersTab } from "./AdminUsersTab";
import { AdminWaitlistTab } from "./AdminWaitlistTab";

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="admin.loading_state">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isAdmin === false) {
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
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users, waitlist, analytics, and content settings.
        </p>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="bg-card border border-border h-10 p-1">
          <TabsTrigger
            value="analytics"
            data-ocid="admin.analytics_tab"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="waitlist"
            data-ocid="admin.waitlist_tab"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="w-3.5 h-3.5" />
            Waitlist
          </TabsTrigger>
          <TabsTrigger
            value="users"
            data-ocid="admin.users_tab"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-3.5 h-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="content"
            data-ocid="admin.content_tab"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <AdminAnalyticsTab />
        </TabsContent>

        <TabsContent value="waitlist" className="mt-6">
          <AdminWaitlistTab />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <AdminUsersTab />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <AdminContentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
