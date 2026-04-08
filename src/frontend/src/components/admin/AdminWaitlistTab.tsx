import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="rounded-2xl backdrop-blur-md bg-card/60 border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/6 bg-background/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Waitlist Entries
          </h3>
        </div>
        {entries && entries.length > 0 && (
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
            {entries.length} total
          </Badge>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="p-5 space-y-2.5"
          data-ocid="admin.waitlist.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : !entries || entries.length === 0 ? (
        <div
          data-ocid="admin.waitlist.empty_state"
          className="flex flex-col items-center justify-center py-14 text-center"
        >
          <Inbox className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No waitlist entries yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Signups from the landing page will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="admin.waitlist.table">
            <thead>
              <tr className="border-b border-white/6 bg-background/40">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 w-12">
                  #
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr
                  key={entry.id.toString()}
                  data-ocid={`admin.waitlist.row.${idx + 1}`}
                  className={`border-b border-white/5 transition-colors hover:bg-muted/20 ${idx % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                >
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                    {entry.name}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {entry.email}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {formatDate(entry.submittedAt)}
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
