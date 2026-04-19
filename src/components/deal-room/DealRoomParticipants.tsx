import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DealRoomParticipant } from "@/lib/dealRoom";

const ROLE_COLORS: Record<string, string> = {
  artist: "text-[hsl(var(--role-artist))]",
  promoter: "text-[hsl(var(--role-promoter))]",
  venue: "text-[hsl(var(--role-venue))]",
  production: "text-[hsl(var(--role-production))]",
  photo_video: "text-[hsl(var(--role-photo))]",
};

export default function DealRoomParticipants({
  participants,
}: {
  participants: DealRoomParticipant[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {participants.map((p) => {
        const initial = (p.display_name ?? "?")[0]?.toUpperCase() ?? "?";
        const colorClass =
          (p.role && ROLE_COLORS[p.role]) ??
          ROLE_COLORS[p.participant_role] ??
          "text-foreground";
        return (
          <div
            key={p.user_id}
            className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-background/50 px-2.5 py-1"
          >
            <Avatar className="h-6 w-6">
              {p.avatar_url ? <AvatarImage src={p.avatar_url} alt="" /> : null}
              <AvatarFallback className="bg-[#1C2535] text-[10px] font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-medium">
                {p.display_name ?? "Unknown"}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${colorClass}`}
              >
                {p.participant_role}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
