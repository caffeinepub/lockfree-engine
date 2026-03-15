import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}

export function NavLink({
  icon: Icon,
  label,
  active,
  onClick,
  "data-ocid": dataOcid,
}: NavLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={dataOcid}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150
        ${
          active
            ? "bg-primary/12 text-primary font-semibold"
            : "text-muted-foreground font-medium hover:text-foreground hover:bg-sidebar-accent"
        }
      `}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-primary" : "opacity-70"}`}
      />
      {label}
      {active && (
        <span className="ml-auto w-1 h-4 rounded-full bg-primary opacity-70 flex-shrink-0" />
      )}
    </button>
  );
}
