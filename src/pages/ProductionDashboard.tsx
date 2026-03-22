import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProductionSidebar, { type ProductionView } from "@/components/ProductionSidebar";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Wrench, CheckCircle, DollarSign, TrendingUp, Users, Calendar, FileText, FolderOpen } from "lucide-react";

export default function ProductionDashboard() {
  const { profile } = useAuth();
  const [activeView, setActiveView] = useState<ProductionView>("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ProductionSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 sm:px-6 pt-16">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#7B5CF0]/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#7B5CF0]" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold lowercase leading-tight">{profile?.display_name ?? "production"}</h1>
                <p className="text-[10px] text-muted-foreground lowercase">production dashboard</p>
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
                      <div className="w-9 h-9 rounded-xl bg-[#7B5CF0]/10 flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-[#7B5CF0]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">active gigs</p>
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
                        <Users className="w-4 h-4 text-[#FFB83E]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">crew size</p>
                      <p className="font-display text-2xl font-bold tabular-nums">—</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#7B5CF0]/10 flex items-center justify-center mx-auto mb-3">
                      <Wrench className="w-5 h-5 text-[#7B5CF0]" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">welcome to your production hub</p>
                    <p className="text-xs text-muted-foreground">manage your gigs, crew, and availability from here. when promoters or artists book you, gigs will appear in your dashboard.</p>
                  </div>
                </>
              )}

              {/* Gigs */}
              {activeView === "gigs" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">gigs</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Wrench className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no gigs yet</p>
                    <p className="text-xs text-muted-foreground">when you're booked for production work, your gigs will show here.</p>
                  </div>
                </>
              )}

              {/* Crew */}
              {activeView === "crew" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">crew management</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no crew members added</p>
                    <p className="text-xs text-muted-foreground">add your crew members here to manage assignments across gigs and tours.</p>
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

              {/* Documents */}
              {activeView === "documents" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">documents</h2>
                  <div className="rounded-2xl bg-card border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">no documents yet</p>
                    <p className="text-xs text-muted-foreground">contracts, riders, and tech specs for your gigs will appear here.</p>
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
