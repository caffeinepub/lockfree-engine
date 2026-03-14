interface ResilienceScoreBadgeProps {
  score: bigint | number;
}

export function ResilienceScoreBadge({ score }: ResilienceScoreBadgeProps) {
  const numScore = typeof score === "bigint" ? Number(score) : score;

  if (numScore === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border">
        —
      </span>
    );
  }

  const colorClass =
    numScore < 40
      ? "text-destructive bg-destructive/10 border-destructive/20"
      : numScore < 70
        ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
        : "text-status-running bg-status-running/10 border-status-running/20";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold border tabular-nums ${colorClass}`}
    >
      {numScore}%
    </span>
  );
}
