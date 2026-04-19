import { useState } from "react";
import { FileSignature, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SignContractDialog from "@/components/SignContractDialog";
import type {
  ContractSignature,
  DealRoomBooking,
  DealRoomParticipant,
} from "@/lib/dealRoom";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  booking: DealRoomBooking;
  participants: DealRoomParticipant[];
  signatures: ContractSignature[];
  readOnly?: boolean;
  onSigned?: () => void;
};

export default function DealContractTab({
  booking,
  participants,
  signatures,
  readOnly = false,
  onSigned,
}: Props) {
  const { user } = useAuth();
  const [signDialogOpen, setSignDialogOpen] = useState(false);

  const signerSet = new Set(signatures.map((s) => s.user_id));
  const allSigned =
    participants.length > 0 &&
    participants.every((p) => signerSet.has(p.user_id));

  const currentUserSigned = !!user && signerSet.has(user.id);
  const canSign =
    !readOnly && !!user && !currentUserSigned && !allSigned;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-background/50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <FileSignature className="h-5 w-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Performance Agreement</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Auto-generated from agreed deal terms. Legally binding e-signature.
              </p>
            </div>
          </div>
          {allSigned ? (
            <Badge className="bg-[#3EFFBE]/10 text-[#3EFFBE] border-[#3EFFBE]/20">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Fully Signed
            </Badge>
          ) : signerSet.size > 0 ? (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              {signerSet.size} of {participants.length} signed
            </Badge>
          ) : (
            <Badge className="bg-[#5A6478]/10 text-[#8892A4] border-[#5A6478]/20">
              Unsigned
            </Badge>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Venue
            </dt>
            <dd className="text-sm mt-0.5">{booking.venue_name}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Event Date
            </dt>
            <dd className="text-sm mt-0.5">
              {format(parseISO(booking.event_date), "MMM d, yyyy")}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Guarantee
            </dt>
            <dd className="text-sm mt-0.5 font-semibold">
              ${Number(booking.guarantee).toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {booking.contract_url ? (
            <Button asChild variant="outline" size="sm" className="border-white/[0.06]">
              <a
                href={booking.contract_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View contract PDF
              </a>
            </Button>
          ) : null}
          {canSign ? (
            <Button
              onClick={() => setSignDialogOpen(true)}
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
              data-testid="deal-sign-contract"
            >
              <FileSignature className="h-4 w-4 mr-1.5" /> Sign agreement
            </Button>
          ) : null}
          {currentUserSigned && !allSigned ? (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#3EFFBE]" />
              You signed. Waiting on the other party.
            </span>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
          Signature Log
        </p>
        {participants.map((p) => {
          const sig = signatures.find((s) => s.user_id === p.user_id);
          return (
            <div
              key={p.user_id}
              className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-current text-muted-foreground" />
                <span className="text-sm">{p.display_name ?? "Unknown"}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.participant_role}
                </span>
              </div>
              {sig ? (
                <span className="text-xs text-[#3EFFBE]">
                  Signed {format(parseISO(sig.signed_at), "MMM d, h:mm a")}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Pending</span>
              )}
            </div>
          );
        })}
      </div>

      {!readOnly ? (
        <SignContractDialog
          open={signDialogOpen}
          onOpenChange={setSignDialogOpen}
          bookingId={booking.id}
          venueName={booking.venue_name}
          eventDate={booking.event_date}
          guarantee={booking.guarantee}
          onSigned={() => {
            setSignDialogOpen(false);
            onSigned?.();
          }}
        />
      ) : null}
    </div>
  );
}
