import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { DealRoomMessage, DealRoomParticipant } from "@/lib/dealRoom";

type Props = {
  dealRoomId: string;
  participants: DealRoomParticipant[];
  readOnly?: boolean;
  initialMessages?: DealRoomMessage[];
};

export default function DealMessagesTab({
  dealRoomId,
  participants,
  readOnly = false,
  initialMessages,
}: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DealRoomMessage[]>(initialMessages ?? []);
  const [loading, setLoading] = useState(!initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDemo = !!initialMessages;

  useEffect(() => {
    if (isDemo) return;
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from("deal_room_messages" as never)
        .select("*")
        .eq("deal_room_id", dealRoomId)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) {
        toast.error("Could not load messages");
      } else {
        setMessages((data ?? []) as unknown as DealRoomMessage[]);
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel(`deal-room-${dealRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "deal_room_messages",
          filter: `deal_room_id=eq.${dealRoomId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const next = payload.new as unknown as DealRoomMessage;
            if (prev.some((m) => m.id === next.id)) return prev;
            return [...prev, next];
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [dealRoomId, isDemo]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !user || readOnly) return;
    setSending(true);
    const { data, error } = await supabase
      .from("deal_room_messages" as never)
      .insert({
        deal_room_id: dealRoomId,
        sender_id: user.id,
        content,
        message_type: "text",
      } as never)
      .select("*")
      .single();
    setSending(false);
    if (error) {
      toast.error(error.message || "Failed to send message");
      return;
    }
    setDraft("");
    // Optimistically add in case realtime hasn't fired yet.
    if (data) {
      setMessages((prev) =>
        prev.some((m) => m.id === (data as { id: string }).id)
          ? prev
          : [...prev, data as unknown as DealRoomMessage],
      );
    }
  };

  const participantMap = new Map(participants.map((p) => [p.user_id, p]));

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-white/[0.06] bg-background/30">
      <ScrollArea className="flex-1" data-testid="deal-messages-scroll">
        <div ref={scrollRef} className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Sparkles className="h-5 w-5 mb-2" />
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs">
                Kick things off — everything stays in one thread, with a full
                audit trail.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              if (msg.message_type === "system") {
                return (
                  <div
                    key={msg.id}
                    className="flex justify-center"
                    data-testid="deal-message-system"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {msg.content}
                    </span>
                  </div>
                );
              }
              const isMe = msg.sender_id === user?.id;
              const sender = participantMap.get(msg.sender_id);
              const initial =
                (sender?.display_name ?? "?")[0]?.toUpperCase() ?? "?";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 items-end",
                    isMe ? "justify-end" : "justify-start",
                  )}
                  data-testid="deal-message"
                >
                  {!isMe ? (
                    <Avatar className="h-6 w-6 shrink-0">
                      {sender?.avatar_url ? (
                        <AvatarImage src={sender.avatar_url} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-[#1C2535] text-[10px] font-semibold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm",
                      isMe
                        ? "bg-[hsl(var(--primary))]/15 text-foreground border border-[hsl(var(--primary))]/20"
                        : "bg-background/60 border border-white/[0.06] text-foreground",
                      msg.message_type === "offer_update" &&
                        "border-amber-500/20 bg-amber-500/5",
                    )}
                  >
                    {msg.message_type === "offer_update" ? (
                      <p className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">
                        Offer update
                      </p>
                    ) : null}
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(parseISO(msg.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {!readOnly ? (
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message the other party… (⌘/Ctrl + Enter to send)"
              className="min-h-[44px] resize-none bg-background/60 border-white/[0.06]"
              data-testid="deal-message-input"
              disabled={sending}
            />
            <Button
              onClick={handleSend}
              disabled={sending || !draft.trim()}
              className="h-11 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
              data-testid="deal-message-send"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-t border-white/[0.06] p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Read-only demo — sign in to send messages.
          </p>
        </div>
      )}
    </div>
  );
}
