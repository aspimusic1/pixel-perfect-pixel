import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  MapPin, Save, Upload, Trash2, CalendarIcon, Plus, Image as ImageIcon, Building2, Clock
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type VenueListing = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  capacity: number | null;
  amenities: string[] | null;
  claim_status: string;
};

type VenuePhoto = {
  id: string;
  file_path: string;
  caption: string | null;
  sort_order: number;
};

type AvailableDate = {
  id: string;
  available_date: string;
  notes: string | null;
};

const AMENITY_OPTIONS = [
  "Sound System", "Lighting Rig", "Stage", "Green Room", "Bar",
  "Kitchen", "Parking", "Loading Dock", "WiFi", "A/C",
  "Outdoor Space", "VIP Area", "Coat Check", "ADA Accessible"
];

export default function VenueManage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [venues, setVenues] = useState<VenueListing[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueListing | null>(null);
  const [photos, setPhotos] = useState<VenuePhoto[]>([]);
  const [availability, setAvailability] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateNote, setDateNote] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "", address: "", phone: "", email: "", website: "",
    description: "", capacity: "", amenities: [] as string[],
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    loadVenues();
  }, [user, authLoading]);

  const loadVenues = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("venue_listings")
      .select("*")
      .eq("claimed_by", user.id)
      .eq("claim_status", "approved");
    const venueData = (data as VenueListing[]) ?? [];
    setVenues(venueData);
    if (venueData.length > 0 && !selectedVenue) {
      selectVenue(venueData[0]);
    }
    setLoading(false);
  };

  const selectVenue = async (v: VenueListing) => {
    setSelectedVenue(v);
    setForm({
      name: v.name || "",
      address: v.address || "",
      phone: v.phone || "",
      email: v.email || "",
      website: v.website || "",
      description: v.description || "",
      capacity: v.capacity?.toString() || "",
      amenities: v.amenities || [],
    });

    // Load photos & availability
    const [photosRes, availRes] = await Promise.all([
      supabase.from("venue_photos").select("*").eq("venue_id", v.id).order("sort_order"),
      supabase.from("venue_availability").select("*").eq("venue_id", v.id).order("available_date"),
    ]);
    setPhotos((photosRes.data as VenuePhoto[]) ?? []);
    setAvailability((availRes.data as AvailableDate[]) ?? []);
  };

  const handleSave = async () => {
    if (!selectedVenue) return;
    setSaving(true);
    const { error } = await supabase
      .from("venue_listings")
      .update({
        name: form.name,
        address: form.address,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        description: form.description || null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        amenities: form.amenities.length > 0 ? form.amenities : null,
      } as any)
      .eq("id", selectedVenue.id);

    if (error) toast.error(error.message);
    else toast.success("Venue updated!");
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedVenue || !user) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${selectedVenue.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("venue-photos")
      .upload(path, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("venue-photos").getPublicUrl(path);

    const { error: insertError } = await supabase.from("venue_photos").insert({
      venue_id: selectedVenue.id,
      file_path: urlData.publicUrl,
      uploaded_by: user.id,
      sort_order: photos.length,
    } as any);

    if (insertError) toast.error(insertError.message);
    else {
      toast.success("Photo uploaded!");
      // Reload photos
      const { data } = await supabase.from("venue_photos").select("*").eq("venue_id", selectedVenue.id).order("sort_order");
      setPhotos((data as VenuePhoto[]) ?? []);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = async (photo: VenuePhoto) => {
    const { error } = await supabase.from("venue_photos").delete().eq("id", photo.id);
    if (error) toast.error(error.message);
    else {
      setPhotos(photos.filter((p) => p.id !== photo.id));
      toast.success("Photo removed");
    }
  };

  const handleAddDate = async () => {
    if (!selectedDate || !selectedVenue) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    const { error } = await supabase.from("venue_availability").insert({
      venue_id: selectedVenue.id,
      available_date: dateStr,
      notes: dateNote || null,
    } as any);

    if (error) {
      if (error.code === "23505") toast.error("Date already added");
      else toast.error(error.message);
    } else {
      toast.success("Date added!");
      setSelectedDate(undefined);
      setDateNote("");
      const { data } = await supabase.from("venue_availability").select("*").eq("venue_id", selectedVenue.id).order("available_date");
      setAvailability((data as AvailableDate[]) ?? []);
    }
  };

  const handleRemoveDate = async (id: string) => {
    await supabase.from("venue_availability").delete().eq("id", id);
    setAvailability(availability.filter((a) => a.id !== id));
  };

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4 pb-12">
        <div className="container mx-auto max-w-2xl text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-role-venue/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-role-venue" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">no claimed venues yet</h1>
          <p className="text-muted-foreground font-body text-sm mb-6">
            Once your venue claim is approved, you'll be able to manage your listing here.
          </p>
          <Button onClick={() => navigate("/venues")} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform font-body">
            browse venues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold mb-6">manage your venue</h1>

        {/* Venue selector if multiple */}
        {venues.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {venues.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVenue(v)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
                  selectedVenue?.id === v.id
                    ? "bg-role-venue/15 text-role-venue border border-role-venue/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {selectedVenue && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="rounded-xl bg-card border border-border p-5">
              <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-role-venue" /> venue details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-body">venue name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 bg-background border-border font-body" />
                </div>
                <div>
                  <Label className="text-xs font-body">address</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 bg-background border-border font-body" />
                </div>
                <div>
                  <Label className="text-xs font-body">phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 bg-background border-border font-body" />
                </div>
                <div>
                  <Label className="text-xs font-body">email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 bg-background border-border font-body" />
                </div>
                <div>
                  <Label className="text-xs font-body">website</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="mt-1 bg-background border-border font-body" />
                </div>
                <div>
                  <Label className="text-xs font-body">capacity</Label>
                  <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="mt-1 bg-background border-border font-body" placeholder="e.g. 500" />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-xs font-body">description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-background border-border font-body min-h-[80px]" placeholder="Tell promoters and artists about your venue..." maxLength={1000} />
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-xl bg-card border border-border p-5">
              <h2 className="font-display font-semibold text-sm mb-4">amenities</h2>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.97] ${
                      form.amenities.includes(a)
                        ? "bg-role-venue/15 text-role-venue border border-role-venue/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="rounded-xl bg-card border border-border p-5">
              <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-role-venue" /> photos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {photos.map((p) => (
                  <div key={p.id} className="relative group rounded-lg overflow-hidden aspect-video bg-secondary">
                    <img src={p.file_path} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeletePhoto(p)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/80 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-role-venue/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-role-venue transition-colors"
                >
                  {uploading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-role-venue border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-[10px] font-body">add photo</span>
                    </>
                  )}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            {/* Availability */}
            <div className="rounded-xl bg-card border border-border p-5">
              <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-role-venue" /> available dates
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[200px] justify-start text-left font-body text-xs", !selectedDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {selectedDate ? format(selectedDate, "PPP") : "pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  value={dateNote}
                  onChange={(e) => setDateNote(e.target.value)}
                  placeholder="optional note (e.g. evening only)"
                  className="bg-background border-border font-body text-xs flex-1"
                  maxLength={200}
                />
                <Button
                  onClick={handleAddDate}
                  disabled={!selectedDate}
                  size="sm"
                  className="bg-role-venue text-primary-foreground hover:bg-role-venue/90 active:scale-[0.97] transition-transform font-body"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> add
                </Button>
              </div>

              {availability.length === 0 ? (
                <p className="text-xs text-muted-foreground font-body">No available dates set yet.</p>
              ) : (
                <div className="space-y-2">
                  {availability.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-role-venue" />
                        <span className="text-xs font-body font-medium">{format(new Date(a.available_date + "T12:00:00"), "MMM d, yyyy")}</span>
                        {a.notes && <span className="text-xs text-muted-foreground font-body">— {a.notes}</span>}
                      </div>
                      <button onClick={() => handleRemoveDate(a.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 active:scale-[0.97] transition-transform font-body"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "saving..." : "save changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
