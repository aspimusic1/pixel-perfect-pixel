import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CreativeSidebar, { type CreativeView } from "@/components/CreativeSidebar";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Camera, CheckCircle, DollarSign, TrendingUp, FolderOpen, Star, FileText } from "lucide-react";

export default function CreativeDashboard() {
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState<CreativeView>("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CreativeSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 sm:px-6 pt-16">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#3EC8FF]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#3EC8FF]" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold lowercase leading-tight">{profile?.display_name ?? "creative"}</h1>
                <p className="text-[10px] text-muted-foreground lowercase">photo / video dashboard</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Overview */}
              {activeView === "overview" && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#3EC8FF]/10 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-[#3EC8FF]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">bookings</p>
                      <p className="font-display text-2xl font-bold tabular-nums">0</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">completed</p>
                      <p className="font-display text-2xl font-bold tabular-nums">0</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">earnings</p>
                      <p className="font-display text-2xl font-bold tabular-nums">$0</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#FFB83E]/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-[#FFB83E]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">avg rating</p>
                      <p className="font-display text-2xl font-bold tabular-nums">—</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#3EC8FF]/10 flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-5 h-5 text-[#3EC8FF]" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">welcome to your creative hub</p>
                    <p className="text-xs text-muted-foreground">manage your portfolio, bookings, and availability from here. when promoters or artists book you, jobs will appear in your dashboard.</p>
                  </div>
                </>
              )}

              {/* Portfolio */}
              {activeView === "portfolio" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">portfolio</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <FolderOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no portfolio items yet</p>
                    <p className="text-xs text-muted-foreground">upload your best work — photos, videos, and highlight reels — to attract bookings.</p>
                  </div>
                </>
              )}

              {/* Bookings */}
              {activeView === "bookings" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">bookings</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no bookings yet</p>
                    <p className="text-xs text-muted-foreground">when you're booked for photo or video work, your jobs will show here.</p>
                  </div>
                </>
              )}

              {/* Calendar */}
              {activeView === "calendar" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">availability</h2>
                  <AvailabilityCalendar />
                </>
              )}

              {/* Reviews */}
              {activeView === "reviews" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">reviews</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Star className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no reviews yet</p>
                    <p className="text-xs text-muted-foreground">after completing bookings, clients can leave you reviews that will appear here.</p>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
