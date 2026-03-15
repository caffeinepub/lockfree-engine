import { Badge } from "@/components/ui/badge";
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
import { Users } from "lucide-react";
import { toast } from "sonner";
import { useListAllUsers, useSetUserTier } from "../../hooks/useAdminQueries";

const TIER_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  business: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  enterprise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

function truncatePrincipal(p: string): string {
  if (p.length <= 20) return p;
  return `${p.slice(0, 8)}...${p.slice(-6)}`;
}

export function AdminUsersTab() {
  const { data: users, isLoading } = useListAllUsers();
  const { mutateAsync: setTier, isPending } = useSetUserTier();

  async function handleTierChange(principalId: string, tier: string) {
    try {
      await setTier({ principalId, tier });
      toast.success(`Tier updated to ${tier}`);
    } catch {
      toast.error("Failed to update tier");
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
                      <TableCell className="font-mono text-xs text-foreground">
                        {truncatePrincipal(pid)}
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
