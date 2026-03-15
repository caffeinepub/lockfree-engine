import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox, Mail } from "lucide-react";
import { useWaitlistEntries } from "../../hooks/useAdminQueries";

function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminWaitlistTab() {
  const { data: entries, isLoading } = useWaitlistEntries();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Waitlist Entries
          </CardTitle>
          {entries && entries.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {entries.length} total
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" data-ocid="admin.waitlist.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div
            data-ocid="admin.waitlist.empty_state"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Inbox className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No waitlist entries yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Signups from the landing page will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.waitlist.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground font-medium w-12">
                    #
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Email
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">
                    Submitted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, idx) => (
                  <TableRow
                    key={entry.id.toString()}
                    data-ocid={`admin.waitlist.row.${idx + 1}`}
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">
                      {entry.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.email}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(entry.submittedAt)}
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
