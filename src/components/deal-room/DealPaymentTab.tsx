import { CreditCard, CheckCircle2, Clock4 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import DepositPaymentButton from "@/components/DepositPaymentButton";
import type { DealRoomBooking } from "@/lib/dealRoom";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  booking: DealRoomBooking;
  readOnly?: boolean;
};

function paymentStatusLabel(status?: string | null): {
  label: string;
  tone: "neutral" | "warn" | "success";
} {
  switch (status) {
    case "fully_paid":
      return { label: "Fully Paid", tone: "success" };
    case "deposit_paid":
      return { label: "Deposit Paid", tone: "warn" };
    case "refunded":
      return { label: "Refunded", tone: "neutral" };
    case "unpaid":
    default:
      return { label: "Unpaid", tone: "neutral" };
  }
}

export default function DealPaymentTab({ booking, readOnly = false }: Props) {
  const { user } = useAuth();
  const { label, tone } = paymentStatusLabel(booking.payment_status);
  const deposit = Math.round(Number(booking.guarantee) * 0.25);
  const balance = Number(booking.guarantee) - deposit;

  const depositPaid = !!booking.deposit_paid_at;
  const finalPaid = !!booking.final_paid_at;
  const isPromoter = !!user && user.id === booking.promoter_id;

  const toneClass =
    tone === "success"
      ? "bg-[#3EFFBE]/10 text-[#3EFFBE] border-[#3EFFBE]/20"
      : tone === "warn"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-[#5A6478]/10 text-[#8892A4] border-[#5A6478]/20";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-background/50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Payment Schedule</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                25% deposit on confirmation, balance due on show day.
              </p>
            </div>
          </div>
          <Badge className={toneClass}>{label}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-background/60 border border-white/[0.06] p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="font-display font-bold text-xl mt-1">
              ${Number(booking.guarantee).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-background/60 border border-white/[0.06] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Deposit (25%)
              </p>
              {depositPaid ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#3EFFBE]" />
              ) : (
                <Clock4 className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <p className="font-display font-bold text-xl mt-1">
              ${deposit.toLocaleString()}
            </p>
            {booking.deposit_paid_at ? (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Paid {format(parseISO(booking.deposit_paid_at), "MMM d")}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg bg-background/60 border border-white/[0.06] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Balance
              </p>
              {finalPaid ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#3EFFBE]" />
              ) : (
                <Clock4 className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <p className="font-display font-bold text-xl mt-1">
              ${balance.toLocaleString()}
            </p>
            {booking.final_paid_at ? (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Paid {format(parseISO(booking.final_paid_at), "MMM d")}
              </p>
            ) : null}
          </div>
        </div>

        {!readOnly && isPromoter && !depositPaid ? (
          <div className="mt-5">
            <DepositPaymentButton
              bookingId={booking.id}
              guarantee={Number(booking.guarantee)}
            />
          </div>
        ) : null}

        {!readOnly && !isPromoter && !depositPaid ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Waiting on promoter to release deposit via Stripe.
          </p>
        ) : null}

        {readOnly ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Demo mode — payment actions disabled.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
          Platform Commission
        </p>
        <p className="text-sm text-muted-foreground">
          GetBooked.Live takes a flat 10% platform fee (${Math.round(
            Number(booking.guarantee) * 0.1,
          ).toLocaleString()}) on completed shows. Artists net{" "}
          <span className="text-foreground font-semibold">
            ${Math.round(Number(booking.guarantee) * 0.9).toLocaleString()}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
