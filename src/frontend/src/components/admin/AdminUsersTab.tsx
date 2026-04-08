import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardCopy,
  Download,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteUserData,
  useListAllUsers,
  useSetUserTier,
} from "../../hooks/useAdminQueries";
import {
  useClearFlaggedAffiliate,
  useGetFlaggedAffiliates,
} from "../../hooks/useReferralQueries";

const TIER_BADGE: Record<string, string> = {
  free: "bg-muted/60 text-muted-foreground border-border/60",
  pro: "bg-[oklch(0.72_0.19_145/0.12)] text-[oklch(0.82_0.19_145)] border-[oklch(0.72_0.19_145/0.3)]",
  business:
    "bg-[oklch(0.68_0.22_260/0.12)] text-[oklch(0.78_0.22_260)] border-[oklch(0.68_0.22_260/0.3)]",
  enterprise:
    "bg-[oklch(0.75_0.18_60/0.12)] text-[oklch(0.85_0.18_60)] border-[oklch(0.75_0.18_60/0.3)]",
};

function truncatePrincipal(p: string): string {
  if (p.length <= 20) return p;
  return `${p.slice(0, 12)}...${p.slice(-6)}`;
}

function CopyPrincipalButton({ principalId }: { principalId: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(principalId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={copied ? true : undefined}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-1.5 inline-flex items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            aria-label="Copy principal ID"
            data-ocid="admin.users.copy_button"
          >
            {copied ? (
              <ClipboardCheck className="w-3.5 h-3.5 text-[oklch(0.72_0.19_145)]" />
            ) : (
              <ClipboardCopy className="w-3.5 h-3.5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs px-2 py-1">
          {copied ? "Copied!" : "Copy full ID"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AdminUsersTab() {
  const { data: users, isLoading } = useListAllUsers();
  const { mutateAsync: setTier, isPending } = useSetUserTier();
  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useDeleteUserData();

  async function handleTierChange(principalId: string, tier: string) {
    try {
      await setTier({ principalId, tier });
      toast.success(`Tier updated to ${tier}`);
    } catch {
      toast.error("Failed to update tier");
    }
  }

  async function handleDeleteUser(principalId: string) {
    try {
      await deleteUser(principalId);
      toast.success("User data permanently deleted");
    } catch {
      toast.error("Failed to delete user data");
    }
  }

  return (
    <div className="rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/6 bg-background/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Registered Users
          </h3>
        </div>
        {users && users.length > 0 && (
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
            {users.length} users
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-5 space-y-2.5" data-ocid="admin.users.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <div
          data-ocid="admin.users.empty_state"
          className="flex flex-col items-center justify-center py-14 text-center"
        >
          <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No registered users yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Users who sign in will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="admin.users.table">
            <thead>
              <tr className="border-b border-white/6 bg-background/40">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-10">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Principal ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Tier
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-44">
                  Change Tier
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-24">
                  Export
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-24">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const pid = user.principalId.toString();
                const tierBadge = TIER_BADGE[user.tier] ?? TIER_BADGE.free;
                return (
                  <tr
                    key={pid}
                    data-ocid={`admin.users.row.${idx + 1}`}
                    className={`border-b border-white/5 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                  >
                    <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 bg-background/60 border border-white/8 rounded-lg px-2 py-1 w-fit">
                        <span className="font-mono text-xs text-foreground/80">
                          {truncatePrincipal(pid)}
                        </span>
                        <CopyPrincipalButton principalId={pid} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize border ${tierBadge}`}
                      >
                        {user.tier}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Select
                        defaultValue={user.tier}
                        onValueChange={(val) => handleTierChange(pid, val)}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          data-ocid={`admin.users.tier.select.${idx + 1}`}
                          className="h-7 text-xs bg-background/60 border-white/10 w-36 rounded-lg"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="free" className="text-xs">
                            Free
                          </SelectItem>
                          <SelectItem value="pro" className="text-xs">
                            Pro
                          </SelectItem>
                          <SelectItem value="business" className="text-xs">
                            Business
                          </SelectItem>
                          <SelectItem value="enterprise" className="text-xs">
                            Enterprise
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 border-white/10 hover:border-white/20 bg-transparent"
                        onClick={() => {
                          const exportData = {
                            principalId: pid,
                            tier: user.tier,
                            exportedAt: new Date().toISOString(),
                            engines: [],
                            migrations: [],
                            billingData: {
                              currentTier: user.tier,
                              invoices: [],
                            },
                            preferences: {},
                          };
                          const blob = new Blob(
                            [JSON.stringify(exportData, null, 2)],
                            { type: "application/json" },
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `lockfreeengine-user-${pid.slice(0, 8)}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success("User data exported");
                        }}
                      >
                        <Download className="w-3 h-3" />
                        Export
                      </Button>
                    </td>
                    <td className="px-4 py-3.5">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1.5 border-red-500/20 text-destructive/70 hover:text-destructive hover:bg-destructive/10 hover:border-red-500/40 bg-transparent"
                            disabled={isDeleting}
                            data-ocid={`admin.users.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete user data permanently?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              This will permanently delete all data for
                              principal{" "}
                              <span className="font-mono text-foreground">
                                {truncatePrincipal(pid)}
                              </span>
                              , including their engines, migration history,
                              billing records, and profile. This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-border">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteUser(pid)}
                            >
                              Delete permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Flagged Affiliates ──────────────────────────────────────────────────────
function FlaggedAffiliatesSection() {
  const { data: flagged, isLoading, isError } = useGetFlaggedAffiliates();
  const { mutateAsync: clearFlag, isPending: isClearing } =
    useClearFlaggedAffiliate();

  async function handleClear(code: string) {
    try {
      await clearFlag(code);
      toast.success(`Flag cleared for ${code}`);
    } catch {
      toast.error("Failed to clear flag");
    }
  }

  return (
    <div className="rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/6 bg-background/30 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[oklch(0.75_0.18_60)] mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            Flagged Affiliates
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Accounts flagged for unusual referral activity. Review and clear
            once resolved.
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="p-5 space-y-2.5"
          data-ocid="admin.flagged.loading_state"
        >
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="admin.flagged.error_state"
          className="text-xs text-destructive py-6 text-center"
        >
          Failed to load flagged affiliates.
        </div>
      ) : !flagged || flagged.length === 0 ? (
        <div
          data-ocid="admin.flagged.empty_state"
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <CheckCircle2 className="w-9 h-9 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No flagged affiliate accounts
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            All activity looks clean.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="admin.flagged.table">
            <thead>
              <tr className="border-b border-white/6 bg-background/40">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Code
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Principal
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Reason
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Flagged At
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {flagged.map((f, idx) => (
                <tr
                  key={f.code}
                  data-ocid={`admin.flagged.row.${idx + 1}`}
                  className={`border-b border-white/5 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-[oklch(0.85_0.18_60)] font-semibold">
                    {f.code}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center">
                      <span className="font-mono text-xs text-muted-foreground">
                        {truncatePrincipal(f.principal)}
                      </span>
                      <CopyPrincipalButton principalId={f.principal} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-xs truncate">
                    {f.reason}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {new Date(
                      Number(f.flaggedAt) / 1_000_000,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1.5 border-white/10 hover:border-[oklch(0.72_0.19_145/0.4)] hover:text-[oklch(0.82_0.19_145)] bg-transparent"
                      disabled={isClearing}
                      data-ocid={`admin.flagged.delete_button.${idx + 1}`}
                      onClick={() => handleClear(f.code)}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Clear
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminUsersTabWrapper() {
  return (
    <div>
      <AdminUsersTab />
      <FlaggedAffiliatesSection />
    </div>
  );
}
