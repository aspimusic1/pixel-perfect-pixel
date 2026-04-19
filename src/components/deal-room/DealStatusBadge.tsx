import { cn } from "@/lib/utils";
import {
  DEAL_STATUS_COLORS,
  DEAL_STATUS_LABELS,
  type DealStatus,
} from "@/lib/dealRoom";

type DealStatusBadgeProps = {
  status: DealStatus;
  className?: string;
};

export default function DealStatusBadge({ status, className }: DealStatusBadgeProps) {
  return (
    <span
      data-testid="deal-status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        DEAL_STATUS_COLORS[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {DEAL_STATUS_LABELS[status]}
    </span>
  );
}
