import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar, { type NavItem } from "@/components/DashboardSidebar";
import EditProfilePanel from "@/components/EditProfilePanel";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wrench, Camera, Calendar, FileText, UserCog, Briefcase, ChevronLeft, ChevronRight, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, parseISO, isAfter, isBefore, startOfToday } from "date-fns";

type CrewView = "overview" | "bookings" | "calendar" | "profile";

type CrewAssignment = {
  id: string;
  tour_id: string;
  name: string;
  role: string;
  day_rate: number | null;
  email: string | null;
  tour_name: string;
  stops: { venue_name: string; city: string | null; date: string; show_time: string | null; load_in_time: string | null; state: string | null }[];
};

export default function CrewDashboard() {
  const { user, profile } = useAuth();
  const isCreative = profile?.role === "photo_video";
  const ACCENT = isCreative ? "#3EC8FF" : "#7B5CF0";
  const RoleIcon = isCreative ? Camera : Wrench;
  const roleLabel = isCreative ? "creative" : "production";

  const [activeView, setActiveView] = useState<CrewView>("overview");
  const [assignments, setAssignments] = useState<CrewAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date());

  const navItems: NavItem<CrewView>[] = [
    { title: "overview", value: "overview", icon: RoleIcon },
    { title: "bookings", value: "bookings", icon: Briefcase },
    { title: "calendar", value: "calendar", icon: Calendar },
    { title: "edit profile", value: "profile", icon: UserCog },
  ];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Match crew_members by the user's email from auth
      const { data: authUser } = await supabase.auth.getUser();
      const email = authUser?.user?.email;
      if (!email) { setLoading(false); return; }

      const { data: members } = await supabase
        .from("crew_members")
        .select("id, tour_id, name, role, day_rate, email")
        .ilike("email", email);

      if (!members || members.length === 0) { setLoading(false); return; }

      const tourIds = [...new Set(members.map((m) => m.tour_id))];
      const [toursRes, stopsRes] = await Promise.all([
        supabase.from("tours").select("id, name").in("id", tourIds),
        supabase.from("tour_stops").select("tour_id, venue_name, city, date, show_time, load_in_time, state").in("tour_id", tourIds).order("date"),
      ]);

      const tourMap = new Map((toursRes.data ?? []).map((t: any) => [t.id, t.name]));
      const stopMap = new Map<string, any[]>();
      (stopsRes.data ?? []).forEach((s: any) => {
        if (!stopMap.has(s.tour_id)) stopMap.set(s.tour_id, []);
        stopMap.get(s.tour_id)!.push(s);
      });

      setAssignments(members.map((m) => ({
        ...m,
        tour_name: tourMap.get(m.tour_id) ?? "Unknown tour",
        stops: stopMap.get(m.tour_id) ?? [],
      })));
      setLoading(false);
    };
    load();
  }, [user]);

  const today = startOfToday();

  // Group assignments by timeline
  const allStops = useMemo(() => {
    return assignments.flatMap((a) =>
      a.stops.map((s) => ({ ...s, assignmentRole: a.role, tourName: a.tour_name, dayRate: a.day_rate }))
    );
  }, [assignments]);

  const upcoming = allStops.filter((s) => isAfter(parseISO(s.date), today) || isSameDay(parseISO(s.date), today));
  const past = allStops.filter((s) => isBefore(parseISO(s.date), today));

  // Calendar data
  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const stopsByDate = useMemo(() => {
    const map = new Map<string, typeof allStops>();
    allStops.forEach((s) => {
      const key = s.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return map;
  }, [allStops]);

  // This week strip
  const thisWeek = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar items={navItems} activeView={activeView} onViewChange={setActiveView as (v: string) => void} accentColor={ACCENT} roleLabel={roleLabel} roleIcon={RoleIcon} displayName={profile?.display_name ?? undefined} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center gap-3 border-b border-border px-4 sm:px-6 pt-14">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="text-[11px] text-muted-foreground lowercase">{activeView === "overview" ? "dashboard" : activeView}</span>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-5">

              {/* ─── Overview ─── */}
              {activeView === "overview" && (
                <>
                  <div className="rounded-lg border border-border bg-card divide-x divide-border grid grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "upcoming gigs", value: upcoming.length, color: ACCENT },
                      { label: "completed", value: past.length, color: "hsl(var(--success))" },
                      { label: "total tours", value: assignments.length, color: "hsl(var(--primary))" },
                      { label: "avg rate", value: assignments.length > 0 ? `$${Math.round(assignments.reduce((s, a) => s + (a.day_rate ?? 0), 0) / assignments.length)}` : "—", color: "hsl(var(--warning))" },
                    ].map((stat) => (
                      <div key={stat.label} className="px-4 py-3.5 sm:py-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="font-display text-base sm:text-lg font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* This week strip */}
                  <div>
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">this week</h2>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {thisWeek.map((day) => {
                        const key = format(day, "yyyy-MM-dd");
                        const dayStops = stopsByDate.get(key) ?? [];
                        const hasGig = dayStops.length > 0;
                        return (
                          <div
                            key={key}
                            className={`shrink-0 w-20 rounded-lg border text-center py-2.5 px-1 transition-colors ${
                              hasGig ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                            }`}
                          >
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-body">
                              {format(day, "EEE")}
                            </p>
                            <p className="font-display text-sm font-bold tabular-nums mt-0.5">{format(day, "d")}</p>
                            <p className="text-[9px] text-muted-foreground font-body">{format(day, "MMM")}</p>
                            {hasGig ? (
                              <span className="inline-block w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: ACCENT }} />
                            ) : (
                              <span className="text-[8px] text-muted-foreground/40 mt-1 block">free</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {assignments.length === 0 && !loading && (
                    <div className="rounded-lg border border-border bg-card p-8 text-center">
                      <RoleIcon className="w-5 h-5 mx-auto mb-2" style={{ color: ACCENT }} />
                      <p className="text-xs text-foreground mb-1 font-medium">no assignments yet</p>
                      <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mb-3">when you're added to a tour crew, your gigs will appear here.</p>
                      <Link to={`/directory?role=${isCreative ? "photo_video" : "production"}`}>
                        <Button size="sm" variant="outline" className="text-[11px] h-7 border-border hover:border-primary/20">
                          browse {roleLabel} directory <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* ─── Bookings ─── */}
              {activeView === "bookings" && (
                <>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">assignments</h2>
                  {loading ? (
                    <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="animate-pulse rounded-lg bg-card h-20" />)}</div>
                  ) : assignments.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-8 text-center">
                      <Briefcase className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-2">no assignments yet</p>
                      <Link to="/directory?role=artist">
                        <Button size="sm" variant="outline" className="text-[11px] h-7">browse artists <ArrowRight className="w-3 h-3 ml-1" /></Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">upcoming</p>
                          <div className="space-y-1.5">
                            {upcoming.map((s, i) => (
                              <div key={`up-${i}`} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
                                <div className="w-12 text-center shrink-0">
                                  <p className="font-display text-lg font-bold tabular-nums" style={{ color: ACCENT }}>{format(parseISO(s.date), "dd")}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">{format(parseISO(s.date), "MMM")}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-display text-sm font-semibold truncate">{s.venue_name}</p>
                                  <p className="text-[11px] text-muted-foreground">{[s.city, s.state].filter(Boolean).join(", ")} · {s.tourName}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s.assignmentRole}</span>
                                  {s.show_time && <p className="text-[10px] text-muted-foreground mt-0.5">{s.show_time}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {past.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 mt-4">past</p>
                          <div className="space-y-1.5">
                            {past.slice(0, 10).map((s, i) => (
                              <div key={`past-${i}`} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3 opacity-60">
                                <div className="w-12 text-center shrink-0">
                                  <p className="font-display text-lg font-bold tabular-nums">{format(parseISO(s.date), "dd")}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">{format(parseISO(s.date), "MMM")}</p>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-display text-sm font-semibold truncate">{s.venue_name}</p>
                                  <p className="text-[11px] text-muted-foreground">{[s.city, s.state].filter(Boolean).join(", ")}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{s.assignmentRole}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ─── Calendar ─── */}
              {activeView === "calendar" && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">calendar</h2>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="p-1 text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="font-display text-sm font-semibold min-w-[120px] text-center">{format(calMonth, "MMMM yyyy")}</span>
                      <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="p-1 text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-border">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                        <div key={d} className="text-center py-2 text-[10px] text-muted-foreground uppercase tracking-widest">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} className="h-20 border-b border-r border-border" />)}
                      {days.map((day) => {
                        const key = format(day, "yyyy-MM-dd");
                        const dayStops = stopsByDate.get(key) ?? [];
                        const hasGig = dayStops.length > 0;
                        const isToday = isSameDay(day, today);

                        const cell = (
                          <div className={`h-20 border-b border-r border-border p-1.5 transition-colors ${hasGig ? "bg-primary/5" : "hover:bg-secondary/50"}`}>
                            <p className={`text-[11px] font-display font-semibold tabular-nums ${isToday ? "text-primary" : "text-foreground/70"}`}>{format(day, "d")}</p>
                            {hasGig ? (
                              <div className="mt-0.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: ACCENT }} />
                                <span className="text-[9px] text-foreground/80 truncate">{dayStops[0].venue_name.slice(0, 12)}</span>
                              </div>
                            ) : (
                              <span className="text-[8px] text-muted-foreground/30 block mt-1">available</span>
                            )}
                          </div>
                        );

                        if (hasGig) {
                          return (
                            <Popover key={key}>
                              <PopoverTrigger asChild><div className="cursor-pointer">{cell}</div></PopoverTrigger>
                              <PopoverContent className="w-60 p-3 bg-card border-border">
                                {dayStops.map((s, i) => (
                                  <div key={i} className="space-y-1 mb-2 last:mb-0">
                                    <p className="font-display text-xs font-semibold">{s.venue_name}</p>
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {[s.city, s.state].filter(Boolean).join(", ")}</p>
                                    {s.show_time && <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Show: {s.show_time}</p>}
                                    {s.load_in_time && <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Load-in: {s.load_in_time}</p>}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{s.assignmentRole}</span>
                                  </div>
                                ))}
                              </PopoverContent>
                            </Popover>
                          );
                        }
                        return <div key={key}>{cell}</div>;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} /> booked</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted" /> available</span>
                  </div>
                </>
              )}

              {/* ─── Profile ─── */}
              {activeView === "profile" && <EditProfilePanel />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
