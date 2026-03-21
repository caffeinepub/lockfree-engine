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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const TIER_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  business: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  enterprise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
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
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
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
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Registered Users
          </CardTitle>
          {users && users.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {users.length} users
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" data-ocid="admin.users.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <div
            data-ocid="admin.users.empty_state"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No registered users yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Users who sign in will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.users.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground font-medium w-12">
                    #
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Principal ID
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Current Tier
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium w-44">
                    Change Tier
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium w-24">
                    Export
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium w-24">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, idx) => {
                  const pid = user.principalId.toString();
                  const tierClass = TIER_COLORS[user.tier] ?? TIER_COLORS.free;
                  return (
                    <TableRow
                      key={pid}
                      data-ocid={`admin.users.row.${idx + 1}`}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wide leading-none">
                            Principal ID
                          </span>
                          <div className="flex items-center">
                            <span className="font-mono text-xs text-foreground">
                              {truncatePrincipal(pid)}
                            </span>
                            <CopyPrincipalButton principalId={pid} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize border ${tierClass}`}
                        >
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.tier}
                          onValueChange={(val) => handleTierChange(pid, val)}
                          disabled={isPending}
                        >
                          <SelectTrigger
                            data-ocid={`admin.users.tier.select.${idx + 1}`}
                            className="h-7 text-xs bg-muted border-border w-36"
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
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
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
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
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
    <Card className="bg-card border-border mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <CardTitle className="text-base font-semibold">
            Flagged Affiliates
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Accounts flagged for unusual referral activity. Review and clear flags
          once resolved.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" data-ocid="admin.flagged.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div
            data-ocid="admin.flagged.error_state"
            className="text-xs text-destructive py-4 text-center"
          >
            Failed to load flagged affiliates.
          </div>
        ) : !flagged || flagged.length === 0 ? (
          <div
            data-ocid="admin.flagged.empty_state"
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <CheckCircle2 className="w-9 h-9 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No flagged affiliate accounts
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              All activity looks clean.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.flagged.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Code
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Principal
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Reason
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Flagged At
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium w-28">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flagged.map((f, idx) => (
                  <TableRow
                    key={f.code}
                    data-ocid={`admin.flagged.row.${idx + 1}`}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-amber-400 font-semibold">
                      {f.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-mono text-xs text-muted-foreground">
                          {truncatePrincipal(f.principal)}
                        </span>
                        <CopyPrincipalButton principalId={f.principal} />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {f.reason}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(
                        Number(f.flaggedAt) / 1_000_000,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5"
                        disabled={isClearing}
                        data-ocid={`admin.flagged.delete_button.${idx + 1}`}
                        onClick={() => handleClear(f.code)}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Clear
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
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
