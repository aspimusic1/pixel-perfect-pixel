import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, ArrowRight, Check, DollarSign, Music, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

type ArtistOption = { user_id: string; display_name: string | null; genre: string | null; city: string | null };

const STEPS = [
  { label: "Artist", icon: Music },
  { label: "Venue", icon: MapPin },
  { label: "Date & Time", icon: CalendarIcon },
  { label: "Financials", icon: DollarSign },
  { label: "Details", icon: Clock },
  { label: "Review", icon: Check },
];

const COMMISSION_RATE = 0.10;

export default function OfferFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedArtist = searchParams.get("artist");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [artistSearch, setArtistSearch] = useState("");

  // Form state
  const [recipientId, setRecipientId] = useState(preselectedArtist ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [venueName, setVenueName] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventTime, setEventTime] = useState("");
  const [guarantee, setGuarantee] = useState("");
  const [doorSplit, setDoorSplit] = useState("");
  const [merchSplit, setMerchSplit] = useState("");
  const [hospitality, setHospitality] = useState("");
  const [backline, setBackline] = useState("");
  const [notes, setNotes] = useState("");

  // Restore draft from localStorage
  const draftKey = `offer-draft-${recipientId || "new"}`;
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.venueName) setVenueName(draft.venueName);
        if (draft.eventDate) setEventDate(new Date(draft.eventDate));
        if (draft.eventTime) setEventTime(draft.eventTime);
        if (draft.guarantee) setGuarantee(draft.guarantee);
        if (draft.doorSplit) setDoorSplit(draft.doorSplit);
        if (draft.merchSplit) setMerchSplit(draft.merchSplit);
        if (draft.hospitality) setHospitality(draft.hospitality);
        if (draft.backline) setBackline(draft.backline);
        if (draft.notes) setNotes(draft.notes);
      } catch {}
    }
  }, [draftKey]);

  // Save draft on form changes
  useEffect(() => {
    const draft = { venueName, eventDate: eventDate?.toISOString(), eventTime, guarantee, doorSplit, merchSplit, hospitality, backline, notes };
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [venueName, eventDate, eventTime, guarantee, doorSplit, merchSplit, hospitality, backline, notes, draftKey]);

  const guaranteeNum = parseFloat(guarantee) || 0;
  const commission = guaranteeNum * COMMISSION_RATE;
  const artistPayout = guaranteeNum - commission;

  useEffect(() => {
    const fetchArtists = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, genre, city")
        .eq("role", "artist" as any)
        .eq("profile_complete", true);
      setArtists((data as ArtistOption[]) ?? []);
      if (preselectedArtist && data) {
        const found = data.find((a: any) => a.user_id === preselectedArtist);
        if (found) setRecipientName((found as any).display_name ?? "");
      }
    };
    fetchArtists();
  }, [preselectedArtist]);

  const filteredArtists = artists.filter((a) => {
    if (!artistSearch) return true;
    const s = artistSearch.toLowerCase();
    return a.display_name?.toLowerCase().includes(s) || a.genre?.toLowerCase().includes(s) || a.city?.toLowerCase().includes(s);
  });

  const [stepError, setStepError] = useState("");

  const canProceed = () => {
    switch (step) {
      case 0: return !!recipientId;
      case 1: return venueName.trim().length > 0;
      case 2: return !!eventDate;
      case 3: return guaranteeNum > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const validateStep = () => {
    setStepError("");
    // No step-specific validation beyond canProceed for now
    return true;
  };

  const goNext = () => {
    if (!canProceed() || !validateStep()) return;
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user || !eventDate) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("offers").insert({
        sender_id: user.id,
        recipient_id: recipientId,
        venue_name: venueName.trim(),
        event_date: format(eventDate, "yyyy-MM-dd"),
        event_time: eventTime || null,
        guarantee: guaranteeNum,
        door_split: parseFloat(doorSplit) || null,
        merch_split: parseFloat(merchSplit) || null,
        hospitality: hospitality.trim() || null,
        backline: backline.trim() || null,
        notes: notes.trim() || null,
        commission_rate: COMMISSION_RATE,
      });
      if (error) throw error;
      localStorage.removeItem(draftKey);
      toast.success("Offer sent successfully!");
      navigate("/promoter-dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-24 sm:pb-12">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="font-display text-2xl font-bold mb-1">Send an Offer</h1>
          <p className="text-muted-foreground text-sm">Walk through each step to build your offer.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  i === step ? "bg-primary text-primary-foreground" :
                  i < step ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20" :
                  "bg-secondary text-muted-foreground"
                )}
              >
                <s.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < STEPS.length - 1 && <div className={cn("w-4 h-px mx-0.5", i < step ? "bg-primary/40" : "bg-border")} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-xl bg-card border border-border p-4 sm:p-6 mb-6">
          {/* Step 0: Select Artist */}
          {step === 0 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Who are you booking?</h2>
              <p className="text-sm text-muted-foreground mb-4">Search and select an artist from the directory.</p>
              <Input
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                placeholder="Search by name, genre, or city..."
                className="bg-background border-border mb-3 h-11 sm:h-10 text-base sm:text-sm"
              />
              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {filteredArtists.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No artists found.</p>
                ) : (
                  filteredArtists.map((a) => (
                    <button
                      key={a.user_id}
                      onClick={() => { setRecipientId(a.user_id); setRecipientName(a.display_name ?? ""); }}
                      className={cn(
                        "w-full text-left px-4 py-3.5 sm:py-3 rounded-lg border transition-all active:scale-[0.98]",
                        recipientId === a.user_id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80 bg-background"
                      )}
                    >
                      <span className="font-medium text-sm">{a.display_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {[a.genre, a.city].filter(Boolean).join(" · ")}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 1: Venue */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Where's the show?</h2>
              <p className="text-sm text-muted-foreground mb-4">Enter the venue name for this booking.</p>
              <Label className="text-sm">Venue name</Label>
              <Input
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="The Ryman Auditorium"
                className="mt-1.5 bg-background border-border"
                maxLength={200}
              />
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">When's the show?</h2>
              <p className="text-sm text-muted-foreground mb-4">Pick the event date and optionally set a time.</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Event date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1.5 bg-background border-border", !eventDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm">Show time (optional)</Label>
                  <Input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="mt-1.5 bg-background border-border" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financials */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Set the deal terms</h2>
              <p className="text-sm text-muted-foreground mb-4">Enter the financial details for this offer.</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Guarantee ($)</Label>
                  <Input type="number" min="0" step="50" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} placeholder="2500" className="mt-1.5 bg-background border-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Door split (%)</Label>
                    <Input type="number" min="0" max="100" value={doorSplit} onChange={(e) => setDoorSplit(e.target.value)} placeholder="80" className="mt-1.5 bg-background border-border" />
                  </div>
                  <div>
                    <Label className="text-sm">Merch split (%)</Label>
                    <Input type="number" min="0" max="100" value={merchSplit} onChange={(e) => setMerchSplit(e.target.value)} placeholder="100" className="mt-1.5 bg-background border-border" />
                  </div>
                </div>

                {/* Commission calculator */}
                {guaranteeNum > 0 && (
                  <div className="rounded-lg bg-background border border-border p-4 space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Commission Breakdown</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Guarantee</span>
                      <span className="font-medium">${guaranteeNum.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform fee ({(COMMISSION_RATE * 100).toFixed(0)}%)</span>
                      <span className="font-medium text-destructive">-${commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-border my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">Artist payout</span>
                      <span className="font-bold text-primary">${artistPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Additional details</h2>
              <p className="text-sm text-muted-foreground mb-4">Optional info to include with the offer.</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Hospitality</Label>
                  <Textarea value={hospitality} onChange={(e) => setHospitality(e.target.value)} placeholder="Dressing room, catering, drink tickets..." className="mt-1.5 bg-background border-border" rows={2} maxLength={500} />
                </div>
                <div>
                  <Label className="text-sm">Backline provided</Label>
                  <Textarea value={backline} onChange={(e) => setBackline(e.target.value)} placeholder="Full drum kit, bass amp, guitar amps..." className="mt-1.5 bg-background border-border" rows={2} maxLength={500} />
                </div>
                <div>
                  <Label className="text-sm">Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any other details or special requests..." className="mt-1.5 bg-background border-border" rows={3} maxLength={1000} />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">Review your offer</h2>
              <p className="text-sm text-muted-foreground mb-4">Confirm everything looks good before sending.</p>
              <div className="space-y-3">
                <ReviewRow label="Artist" value={recipientName} />
                <ReviewRow label="Venue" value={venueName} />
                <ReviewRow label="Date" value={eventDate ? format(eventDate, "MMMM d, yyyy") : "—"} />
                {eventTime && <ReviewRow label="Time" value={eventTime} />}
                <ReviewRow label="Guarantee" value={`$${guaranteeNum.toLocaleString()}`} />
                {doorSplit && <ReviewRow label="Door split" value={`${doorSplit}%`} />}
                {merchSplit && <ReviewRow label="Merch split" value={`${merchSplit}%`} />}
                {hospitality && <ReviewRow label="Hospitality" value={hospitality} />}
                {backline && <ReviewRow label="Backline" value={backline} />}
                {notes && <ReviewRow label="Notes" value={notes} />}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span className="text-destructive font-medium">-${commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-semibold">Artist receives</span>
                    <span className="font-bold text-primary">${artistPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation — fixed bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:p-0">
          <div className="flex justify-between gap-3 container mx-auto max-w-2xl">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="border-border active:scale-[0.97] transition-transform h-11 sm:h-10 flex-1 sm:flex-none">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform h-11 sm:h-10 flex-1 sm:flex-none">
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform h-11 sm:h-10 flex-1 sm:flex-none">
                {loading ? "Sending..." : "Send Offer"} <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
