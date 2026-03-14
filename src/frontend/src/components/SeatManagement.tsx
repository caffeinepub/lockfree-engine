import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Crown, Loader2, Lock, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useInviteSeat,
  useListSeats,
  useRemoveSeat,
} from "../hooks/useQueries";

interface SeatManagementProps {
  subscription: string;
  onUpgradeToEnterprise: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Admin:
    "bg-[oklch(0.75_0.18_60/0.15)] text-[oklch(0.85_0.18_60)] border-[oklch(0.75_0.18_60/0.3)]",
  Editor: "bg-primary/10 text-primary border-primary/20",
  Viewer: "bg-muted/50 text-muted-foreground border-border",
  admin:
    "bg-[oklch(0.75_0.18_60/0.15)] text-[oklch(0.85_0.18_60)] border-[oklch(0.75_0.18_60/0.3)]",
  editor: "bg-primary/10 text-primary border-primary/20",
  viewer: "bg-muted/50 text-muted-foreground border-border",
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncatePrincipal(p: string): string {
  if (p.length <= 20) return p;
  return `${p.slice(0, 10)}...${p.slice(-8)}`;
}

export function SeatManagement({
  subscription,
  onUpgradeToEnterprise,
}: SeatManagementProps) {
  const isEnterprise = subscription === "enterprise";
  const [principalId, setPrincipalId] = useState("");
  const [role, setRole] = useState("Viewer");

  const { data: seats = [], isLoading } = useListSeats();
  const { mutateAsync: inviteSeat, isPending: isInviting } = useInviteSeat();
  const { mutateAsync: removeSeat, isPending: isRemoving } = useRemoveSeat();
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleInvite() {
    if (!principalId.trim()) {
      toast.error("Please enter a principal ID");
      return;
    }
    try {
      await inviteSeat({ member: principalId.trim(), role });
      toast.success(`Invited ${truncatePrincipal(principalId)} as ${role}`);
      setPrincipalId("");
    } catch {
      toast.error("Failed to invite member. Check the principal ID format.");
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await removeSeat(id);
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  }

  // Locked state for non-Enterprise
  if (!isEnterprise) {
    return (
      <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="font-display font-bold text-foreground mb-1.5">
          Team Seats
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
          Team seat management requires an Enterprise plan. Invite colleagues by
          principal ID and assign roles.
        </p>
        <Button
          size="sm"
          className="gap-2 bg-[oklch(0.75_0.18_60)] hover:bg-[oklch(0.68_0.18_60)] text-background"
          onClick={onUpgradeToEnterprise}
        >
          <Crown className="w-3.5 h-3.5" />
          Upgrade to Enterprise
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[oklch(0.75_0.18_60/0.15)] border border-[oklch(0.75_0.18_60/0.3)] flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-[oklch(0.75_0.18_60)]" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-foreground">
            Team Seats
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage team access by principal ID
          </p>
        </div>
        <div className="ml-auto">
          <Badge className="bg-[oklch(0.75_0.18_60/0.12)] text-[oklch(0.85_0.18_60)] border border-[oklch(0.75_0.18_60/0.3)] text-xs">
            {seats.length} / 10 seats
          </Badge>
        </div>
      </div>

      {/* Invite form */}
      <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" />
          Invite New Member
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2.5 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">Principal ID</Label>
            <Input
              placeholder="aaaaa-bbbbb-ccccc-ddddd-cai"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              className="h-9 text-sm font-mono"
              onKeyDown={(e) => e.key === "Enter" && void handleInvite()}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            className="h-9 gap-2"
            onClick={() => void handleInvite()}
            disabled={isInviting || !principalId.trim()}
          >
            {isInviting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            {isInviting ? "Inviting..." : "Send Invite"}
          </Button>
        </div>
      </div>

      {/* Members table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading members...</span>
        </div>
      ) : seats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No team members yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Invite your first member above.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Principal ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Invited
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seats.map((seat) => {
                  const pid = seat.principalId.toString();
                  const isCurrentlyRemoving = removingId === pid || isRemoving;
                  return (
                    <TableRow key={pid} className="border-border">
                      <TableCell className="font-mono text-xs">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-foreground/80">
                              {truncatePrincipal(pid)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs font-mono text-xs"
                          >
                            {pid}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize
                          ${ROLE_COLORS[seat.role] ?? ROLE_COLORS.Viewer}
                        `}
                        >
                          {seat.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(seat.invitedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => void handleRemove(pid)}
                          disabled={isCurrentlyRemoving}
                        >
                          {removingId === pid ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
