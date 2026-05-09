import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  BROWSE_PROFILES,
  FEATURE_HIGHLIGHTS,
  OFFER_SEEDS,
  ROLE_CONFIG,
  ROLE_ORDER,
  WAITLIST_OPTIONS,
  type BrowseRole,
  type OfferStatus,
  type Role,
} from "@shared/getbooked";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  Filter,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

const PUBLIC_NAV = [
  { label: "Browse", href: "/browse" },
  { label: "Artists", href: "/browse/artists" },
  { label: "Venues", href: "/browse/venues" },
  { label: "Crews", href: "/browse/crews" },
  { label: "Creatives", href: "/browse/creatives" },
];

const APP_NAV: Array<{ label: string; href: string; icon: typeof LayoutDashboard }> = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Browse", href: "/browse", icon: Compass },
  { label: "Offers", href: "/offers", icon: Mail },
  { label: "Deal room", href: "/deals/demo-deal", icon: CalendarDays },
];

function roleCopy(role: Role) {
  return ROLE_CONFIG[role];
}

function useBookmarkedModal(role: Role | null) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!role) return;
    const key = `getbooked-welcome-${role}`;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(key)) return;
    setOpen(true);
    window.sessionStorage.setItem(key, "seen");
  }, [role]);

  return { open, setOpen };
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/72">
      {status}
    </Badge>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-[radial-gradient(circle_at_top,_rgba(200,255,62,0.35),_rgba(10,14,22,0.95))] shadow-[0_10px_40px_rgba(200,255,62,0.16)]">
        <Sparkles className="h-4 w-4 text-[#C8FF3E]" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.24em] text-white">GETBOOKED.LIVE</p>
        <p className="text-xs text-white/46">Booking operating system</p>
      </div>
    </div>
  );
}

function GradientSurface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function PublicHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#080C14]/88 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {PUBLIC_NAV.map(item => (
            <Link key={item.href} href={item.href} className={`text-sm transition-colors ${location === item.href ? "text-white" : "text-white/62 hover:text-white"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="outline"
            className="border-white/12 bg-transparent text-white hover:bg-white/8 hover:text-white"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            Log in
          </Button>
          <Button
            className="bg-[#C8FF3E] text-[#080C14] hover:bg-[#d7ff78]"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            Start free
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-white/12 bg-transparent text-white lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-white/10 bg-[#080C14] text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Navigate</SheetTitle>
              <SheetDescription className="text-white/60">Explore the multi-role booking platform.</SheetDescription>
            </SheetHeader>
            <div className="mt-8 space-y-3">
              {PUBLIC_NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/84"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function WaitlistForm() {
  const utils = trpc.useUtils();
  const mutation = trpc.waitlist.join.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setSubmitted(true);
      setForm({ name: "", email: "", roleInterest: "Artist", notes: "" });
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleInterest: "Artist",
    notes: "",
  });

  return (
    <GradientSurface className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8FF3E]">Waitlist access</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Start with a premium first impression.</h3>
        </div>
        <Badge className="rounded-full bg-white/8 px-3 py-1 text-white/72">No credit card required</Badge>
      </div>
      <form
        className="space-y-4"
        onSubmit={event => {
          event.preventDefault();
          mutation.mutate(form);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            value={form.name}
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            placeholder="Your name"
            className="h-12 border-white/12 bg-white/6 text-white placeholder:text-white/36"
          />
          <Input
            value={form.email}
            onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
            placeholder="Email address"
            type="email"
            className="h-12 border-white/12 bg-white/6 text-white placeholder:text-white/36"
          />
        </div>
        <Select value={form.roleInterest} onValueChange={value => setForm(current => ({ ...current, roleInterest: value }))}>
          <SelectTrigger className="h-12 border-white/12 bg-white/6 text-white">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {WAITLIST_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          value={form.notes}
          onChange={event => setForm(current => ({ ...current, notes: event.target.value }))}
          placeholder="What are you trying to book, manage, or grow?"
          className="min-h-[110px] border-white/12 bg-white/6 text-white placeholder:text-white/36"
        />
        <Button type="submit" className="h-12 w-full bg-[#C8FF3E] text-[#080C14] hover:bg-[#d7ff78]" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Join the waitlist
        </Button>
        <p className="text-sm text-white/48">We review every submission and follow up with early-access onboarding instructions.</p>
        {submitted ? <p className="text-sm text-[#C8FF3E]">You are on the list. We will reach out with the next access window.</p> : null}
      </form>
    </GradientSurface>
  );
}

function RoleHighlightStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {ROLE_ORDER.map(role => {
        const config = roleCopy(role);
        return (
          <GradientSurface key={role} className="p-5">
            <div className="flex items-center justify-between">
              <Badge className="rounded-full border-0 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#080C14]" style={{ backgroundColor: config.accent }}>
                {config.label}
              </Badge>
              <Star className="h-4 w-4 text-white/38" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{config.hero}</h3>
            <p className="mt-3 text-sm leading-6 text-white/58">{config.description}</p>
          </GradientSurface>
        );
      })}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,255,62,0.16),transparent_32%),radial-gradient(circle_at_top_right,_rgba(255,92,138,0.14),transparent_28%),radial-gradient(circle_at_bottom,_rgba(62,200,255,0.14),transparent_35%)]" />
          <div className="container relative grid gap-10 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
            <div>
              <Badge className="rounded-full border border-white/10 bg-white/6 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
                Premium booking infrastructure for live music teams
              </Badge>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl xl:text-7xl">
                One elegant platform for artists, promoters, venues, crews, and creatives.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60 sm:text-xl">
                GetBooked.Live turns scattered booking conversations into a polished operating system with structured offers, role-based dashboards, deal rooms, and reputation signals that help great teams move faster.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button className="h-12 bg-[#C8FF3E] px-6 text-[#080C14] hover:bg-[#d7ff78]" onClick={() => { window.location.href = getLoginUrl(); }}>
                  Enter the platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/browse" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/12 px-6 text-sm text-white/78 transition hover:bg-white/8 hover:text-white">
                  Explore the directory
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Structured offers", "Clear terms, deposits, and logistics"],
                  ["Deal rooms", "Contracts, payments, and messaging in one place"],
                  ["BookScore", "Performance signals for confident booking decisions"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/54">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <WaitlistForm />
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="container">
            <RoleHighlightStrip />
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="container grid gap-6 lg:grid-cols-2">
            <GradientSurface className="p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-white/46">Why teams switch</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">A more composed workflow from first contact to final payment.</h2>
              <div className="mt-8 space-y-5">
                {FEATURE_HIGHLIGHTS.map(item => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">{item.description}</p>
                  </div>
                ))}
              </div>
            </GradientSurface>
            <GradientSurface className="p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-white/46">Platform posture</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Built to feel trusted, fast, and premium.</h2>
              <div className="mt-8 space-y-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified workflows",
                    copy: "Offers, deal rooms, and timeline events keep booking decisions auditable and shared.",
                  },
                  {
                    icon: Bell,
                    title: "Immediate notifications",
                    copy: "Route-triggered alerts keep artists and promoters aware of every major change.",
                  },
                  {
                    icon: Compass,
                    title: "Role-aware discovery",
                    copy: "A richer browse experience helps each role find the right people faster.",
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8">
                        <Icon className="h-5 w-5 text-[#C8FF3E]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/56">{item.copy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GradientSurface>
          </div>
        </section>
      </main>
    </div>
  );
}

export function RoleOnboardingPage() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const viewerQuery = trpc.platform.viewer.useQuery(undefined, { enabled: Boolean(user) });
  const mutation = trpc.onboarding.setRole.useMutation({
    onSuccess: result => {
      setLocation(result.redirectTo);
    },
  });
  const [selectedRole, setSelectedRole] = useState<Role>("artist");

  useEffect(() => {
    if (viewerQuery.data?.role && viewerQuery.data.onboardingComplete) {
      setLocation(`/app/${viewerQuery.data.role}`);
    }
  }, [viewerQuery.data, setLocation]);

  if (loading || viewerQuery.isLoading) {
    return <FullPageLoading label="Preparing onboarding" />;
  }

  return (
    <div className="min-h-screen bg-[#080C14] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <BrandMark />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <GradientSurface className="p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#C8FF3E]">Step 1 of onboarding</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">Choose the role that matches your work.</h1>
            <p className="mt-4 text-base leading-7 text-white/58">
              Your stored role determines your dashboard, browsing actions, quick links, and onboarding path. You can change it later from account settings.
            </p>
            <div className="mt-8 space-y-4">
              {ROLE_ORDER.map(role => {
                const config = ROLE_CONFIG[role];
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full rounded-[24px] border p-5 text-left transition ${isActive ? "border-white/16 bg-white/[0.08]" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-medium text-white">{config.label}</p>
                        <p className="mt-2 text-sm leading-6 text-white/54">{config.description}</p>
                      </div>
                      <div className="h-3 w-14 rounded-full" style={{ backgroundColor: config.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </GradientSurface>

          <GradientSurface className="p-8">
            <Badge className="rounded-full border-0 px-3 py-1 text-[#080C14]" style={{ backgroundColor: ROLE_CONFIG[selectedRole].accent }}>
              {ROLE_CONFIG[selectedRole].label}
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold text-white">{ROLE_CONFIG[selectedRole].hero}</h2>
            <p className="mt-4 text-base leading-7 text-white/58">{ROLE_CONFIG[selectedRole].description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Metric-led dashboard", "Role-aware navigation", "Targeted inbox modules", "Structured offers and deal rooms"].map(point => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/72">
                  <CheckCircle2 className="mb-3 h-5 w-5" style={{ color: ROLE_CONFIG[selectedRole].accent }} />
                  {point}
                </div>
              ))}
            </div>
            <Button
              className="mt-10 h-12 bg-[#C8FF3E] px-6 text-[#080C14] hover:bg-[#d7ff78]"
              onClick={() => mutation.mutate({ role: selectedRole })}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue as {ROLE_CONFIG[selectedRole].label}
            </Button>
          </GradientSurface>
        </div>
      </div>
    </div>
  );
}

function FullPageLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080C14] text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-[#C8FF3E]" />
        <span className="text-sm text-white/72">{label}</span>
      </div>
    </div>
  );
}

export function AppRoleRouterPage() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const viewerQuery = trpc.platform.viewer.useQuery(undefined, { enabled: Boolean(user) });

  useEffect(() => {
    if (!viewerQuery.data) return;
    if (!viewerQuery.data.role || !viewerQuery.data.onboardingComplete) {
      setLocation("/signup/role");
      return;
    }
    setLocation(`/app/${viewerQuery.data.role}`);
  }, [setLocation, viewerQuery.data]);

  if (loading || viewerQuery.isLoading) {
    return <FullPageLoading label="Opening your workspace" />;
  }

  return <FullPageLoading label="Redirecting to your dashboard" />;
}

function AppChrome({ role, children }: { role: Role; children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const notificationsQuery = trpc.notifications.list.useQuery();
  const viewerQuery = trpc.platform.viewer.useQuery();
  const config = roleCopy(role);
  const profileCompletion = viewerQuery.data?.profileCompletion ?? 58;
  const welcomeModal = useBookmarkedModal(role);

  return (
    <>
      <Dialog open={welcomeModal.open} onOpenChange={welcomeModal.setOpen}>
        <DialogContent className="border-white/10 bg-[#0C1220] text-white">
          <DialogHeader>
            <DialogTitle>Welcome to your {config.label.toLowerCase()} workspace</DialogTitle>
            <DialogDescription className="text-white/58">
              We prepared a role-aware dashboard with quick actions, inbox context, and profile signals to help you move faster.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/64">
            Complete your profile, review your inbox, and move your next conversation into an offer or deal room.
          </div>
        </DialogContent>
      </Dialog>

      <DashboardLayout>
        <div className="space-y-6 text-white">
          <GradientSurface className="p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Badge className="rounded-full border-0 px-3 py-1 text-[#080C14]" style={{ backgroundColor: config.accent }}>
                  {config.label}
                </Badge>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{config.dashboardTitle}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">{config.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {APP_NAV.map(item => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => setLocation(item.href === "/app" ? `/app/${role}` : item.href)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${location.startsWith(item.href) ? "border-white/16 bg-white/[0.08]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                  >
                    <item.icon className="mb-2 h-4 w-4 text-white/78" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </GradientSurface>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div>{children}</div>
            <div className="space-y-6">
              <GradientSurface className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Profile completion</p>
                    <p className="mt-1 text-xs text-white/48">Visible until your profile reaches 100%.</p>
                  </div>
                  <span className="text-lg font-semibold text-white">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="mt-4 h-2 bg-white/10" />
              </GradientSurface>
              <GradientSurface className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Notifications</p>
                    <p className="mt-1 text-xs text-white/48">In-app alerts mirrored with email triggers.</p>
                  </div>
                  <Bell className="h-4 w-4 text-white/44" />
                </div>
                <div className="mt-5 space-y-3">
                  {(notificationsQuery.data ?? []).slice(0, 3).map(item => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/54">{item.body}</p>
                    </div>
                  ))}
                </div>
              </GradientSurface>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export function RoleDashboardPage({ role }: { role: Role }) {
  const dashboardQuery = trpc.platform.dashboard.useQuery();

  if (dashboardQuery.isLoading) {
    return <FullPageLoading label="Loading dashboard" />;
  }

  const dashboard = dashboardQuery.data?.dashboard;
  if (!dashboard) {
    return <FullPageLoading label="Preparing workspace" />;
  }

  return (
    <AppChrome role={role}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.metrics.map(metric => (
            <GradientSurface key={metric.label} className="p-5">
              <p className="text-sm text-white/52">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{metric.value}</p>
              <p className="mt-2 text-sm text-white/42">{metric.change}</p>
            </GradientSurface>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GradientSurface className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-white">{dashboard.inboxLabel}</p>
                <p className="mt-1 text-sm text-white/48">Recent workflow updates tailored to your role.</p>
              </div>
              <StatusBadge status="Live" />
            </div>
            <div className="mt-5 space-y-3">
              {dashboard.inbox.map(item => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/54">{item.subtitle}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">{item.dateLabel}</p>
                </div>
              ))}
            </div>
          </GradientSurface>

          <GradientSurface className="p-5">
            <p className="text-lg font-medium text-white">Quick actions</p>
            <div className="mt-5 space-y-3">
              {dashboard.quickLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78 transition hover:bg-white/[0.06]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <Separator className="my-5 bg-white/10" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">BookScore impact</p>
              <p className="mt-2 text-sm leading-6 text-white/54">
                Profile completion, response speed, and completed deal quality all strengthen how you appear across the platform.
              </p>
            </div>
          </GradientSurface>
        </div>
      </div>
    </AppChrome>
  );
}

function FilterPanel({
  role,
  filters,
  setFilters,
  options,
}: {
  role: BrowseRole;
  filters: BrowseFilters;
  setFilters: React.Dispatch<React.SetStateAction<BrowseFilters>>;
  options: {
    cities: string[];
    genres: string[];
    venueTypes: string[];
    skills: string[];
    creativeTypes: string[];
  };
}) {
  return (
    <div className="space-y-4">
      <GradientSurface className="p-5">
        <p className="text-sm font-medium text-white">Search</p>
        <Input
          value={filters.search}
          onChange={event => setFilters(current => ({ ...current, search: event.target.value }))}
          placeholder="Search names, cities, and profile details"
          className="mt-4 h-11 border-white/12 bg-white/6 text-white placeholder:text-white/36"
        />
      </GradientSurface>
      <GradientSurface className="p-5">
        <p className="text-sm font-medium text-white">City</p>
        <Select value={filters.city || "all-cities"} onValueChange={value => setFilters(current => ({ ...current, city: value === "all-cities" ? "" : value }))}>
          <SelectTrigger className="mt-4 h-11 border-white/12 bg-white/6 text-white">
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cities">Any city</SelectItem>
            {options.cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GradientSurface>
      {role === "artist" ? (
        <GradientSurface className="p-5">
          <p className="text-sm font-medium text-white">Genre</p>
          <Select value={filters.genre || "all-genres"} onValueChange={value => setFilters(current => ({ ...current, genre: value === "all-genres" ? "" : value }))}>
            <SelectTrigger className="mt-4 h-11 border-white/12 bg-white/6 text-white"><SelectValue placeholder="Any genre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-genres">Any genre</SelectItem>
              {options.genres.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={filters.minScore}
            onChange={event => setFilters(current => ({ ...current, minScore: event.target.value }))}
            placeholder="Minimum BookScore"
            className="mt-4 h-11 border-white/12 bg-white/6 text-white placeholder:text-white/36"
          />
        </GradientSurface>
      ) : null}
      {role === "venue" ? (
        <GradientSurface className="p-5">
          <p className="text-sm font-medium text-white">Venue type</p>
          <Select value={filters.venueType || "all-venue-types"} onValueChange={value => setFilters(current => ({ ...current, venueType: value === "all-venue-types" ? "" : value }))}>
            <SelectTrigger className="mt-4 h-11 border-white/12 bg-white/6 text-white"><SelectValue placeholder="Any venue type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-venue-types">Any venue type</SelectItem>
              {options.venueTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </GradientSurface>
      ) : null}
      {role === "crew" ? (
        <GradientSurface className="p-5">
          <p className="text-sm font-medium text-white">Skill</p>
          <Select value={filters.skill || "all-skills"} onValueChange={value => setFilters(current => ({ ...current, skill: value === "all-skills" ? "" : value }))}>
            <SelectTrigger className="mt-4 h-11 border-white/12 bg-white/6 text-white"><SelectValue placeholder="Any skill" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-skills">Any skill</SelectItem>
              {options.skills.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </GradientSurface>
      ) : null}
      {role === "creative" ? (
        <GradientSurface className="p-5">
          <p className="text-sm font-medium text-white">Creative type</p>
          <Select value={filters.creativeType || "all-creative-types"} onValueChange={value => setFilters(current => ({ ...current, creativeType: value === "all-creative-types" ? "" : value }))}>
            <SelectTrigger className="mt-4 h-11 border-white/12 bg-white/6 text-white"><SelectValue placeholder="Any creative type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-creative-types">Any creative type</SelectItem>
              {options.creativeTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </GradientSurface>
      ) : null}
    </div>
  );
}

type BrowseFilters = {
  city: string;
  genre: string;
  venueType: string;
  skill: string;
  creativeType: string;
  minScore: string;
  priceMax: string;
  search: string;
};

function profileListTitle(role: BrowseRole) {
  if (role === "all") return "All profiles";
  return `${ROLE_CONFIG[role].label} directory`;
}

export function BrowseDirectoryPage({ role }: { role: BrowseRole }) {
  const [location, setLocation] = useLocation();
  const [filters, setFilters] = useState<BrowseFilters>({
    city: "",
    genre: "",
    venueType: "",
    skill: "",
    creativeType: "",
    minScore: "",
    priceMax: "",
    search: "",
  });

  const queryInput = useMemo(
    () => ({
      role,
      city: filters.city || undefined,
      genre: filters.genre || undefined,
      venueType: filters.venueType || undefined,
      skill: filters.skill || undefined,
      creativeType: filters.creativeType || undefined,
      minScore: filters.minScore ? Number(filters.minScore) : undefined,
      priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
      search: filters.search || undefined,
    }),
    [filters.city, filters.creativeType, filters.genre, filters.minScore, filters.priceMax, filters.search, filters.skill, filters.venueType, role],
  );

  const browseQuery = trpc.browse.list.useQuery(queryInput);
  const profiles = browseQuery.data?.profiles ?? BROWSE_PROFILES.filter(profile => role === "all" || profile.role === role);
  const options = {
    cities: browseQuery.data?.availableCities ?? [],
    genres: browseQuery.data?.availableGenres ?? [],
    venueTypes: browseQuery.data?.availableVenueTypes ?? [],
    skills: browseQuery.data?.availableSkills ?? [],
    creativeTypes: browseQuery.data?.availableCreativeTypes ?? [],
  };
  const roleTabs: Array<{ label: string; value: BrowseRole; href: string }> = [
    { label: "All", value: "all", href: "/browse" },
    { label: "Artists", value: "artist", href: "/browse/artists" },
    { label: "Venues", value: "venue", href: "/browse/venues" },
    { label: "Crews", value: "crew", href: "/browse/crews" },
    { label: "Creatives", value: "creative", href: "/browse/creatives" },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-white">
      <PublicHeader />
      <main className="container py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/62">
              Live directory
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white">{profileListTitle(role)}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-white/56">
              Filter profiles by role, city, expertise, and reputation to find the right collaborator faster.
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-white/12 bg-transparent text-white lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[82vh] border-white/10 bg-[#080C14] text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Refine directory</SheetTitle>
                <SheetDescription className="text-white/58">Every filter updates the query and profile result set.</SheetDescription>
              </SheetHeader>
              <ScrollArea className="mt-6 h-[65vh] pr-4">
                <FilterPanel role={role} filters={filters} setFilters={setFilters} options={options} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-3">
          <Tabs value={role} onValueChange={value => {
            const match = roleTabs.find(item => item.value === value);
            if (match) setLocation(match.href);
          }}>
            <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
              {roleTabs.map(item => (
                <TabsTrigger
                  key={item.href}
                  value={item.value}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 data-[state=active]:bg-white data-[state=active]:text-[#080C14]"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[300px_1fr]">
          <div className="hidden xl:block">
            <FilterPanel role={role} filters={filters} setFilters={setFilters} options={options} />
          </div>
          <div className="space-y-4">
            {browseQuery.isFetching ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/62">
                <Loader2 className="h-4 w-4 animate-spin text-[#C8FF3E]" />
                Updating directory results
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              {profiles.map(profile => (
                <GradientSurface key={profile.id} className="overflow-hidden">
                  <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,12,20,0.05), rgba(8,12,20,0.72)), url(${profile.imageUrl})` }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge className="rounded-full border-0 px-3 py-1 text-[#080C14]" style={{ backgroundColor: profile.accent }}>
                          {ROLE_CONFIG[profile.role].label}
                        </Badge>
                        <h3 className="mt-4 text-xl font-semibold text-white">{profile.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/54">{profile.tagline}</p>
                      </div>
                      {typeof profile.score === "number" ? <StatusBadge status={`BookScore ${profile.score}`} /> : null}
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                        <MapPin className="mb-2 h-4 w-4 text-white/40" />
                        {profile.city}, {profile.country}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                        <CalendarDays className="mb-2 h-4 w-4 text-white/40" />
                        {profile.primaryMeta}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/62">
                      <span>{profile.secondaryMeta}</span>
                      <span>{profile.priceLabel}</span>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Button className="flex-1 bg-white text-[#080C14] hover:bg-white/90">View profile</Button>
                      <Button className="flex-1 bg-[#C8FF3E] text-[#080C14] hover:bg-[#d7ff78]" onClick={() => setLocation("/offers/new")}>
                        {profile.role === "venue" ? "Request booking" : "Send offer"}
                      </Button>
                    </div>
                  </div>
                </GradientSurface>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function OffersIndexPage() {
  const offersQuery = trpc.offers.list.useQuery();
  const [activeTab, setActiveTab] = useState<OfferStatus | "all">("all");
  const offers = (offersQuery.data ?? OFFER_SEEDS).filter(offer => activeTab === "all" || offer.status === activeTab);

  return (
    <AppChrome role="promoter">
      <div className="space-y-6">
        <GradientSurface className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/46">Offer management</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Offers index</h2>
              <p className="mt-2 text-sm leading-6 text-white/54">Review sent, received, accepted, and countered offers in one place.</p>
            </div>
            <Link href="/offers/new" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#C8FF3E] px-5 text-sm font-medium text-[#080C14]">
              Create new offer
            </Link>
          </div>
        </GradientSurface>
        <div className="flex flex-wrap gap-2">
          {["all", "sent", "countered", "accepted", "declined"].map(tab => (
            <Button
              key={tab}
              variant="outline"
              className={`border-white/10 bg-transparent text-white ${activeTab === tab ? "bg-white text-[#080C14]" : "hover:bg-white/8 hover:text-white"}`}
              onClick={() => setActiveTab(tab as OfferStatus | "all")}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="space-y-4">
          {offers.map(offer => (
            <GradientSurface key={offer.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-medium text-white">{offer.eventName}</p>
                  <p className="mt-2 text-sm leading-6 text-white/54">
                    {offer.artistName} · {offer.venueName} · {offer.city} · {offer.eventDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={offer.status} />
                  <Link href={`/offers/${offer.id}`} className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 px-4 text-sm text-white/78 transition hover:bg-white/8 hover:text-white">
                    View details
                  </Link>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[offer.feeLabel, offer.depositLabel, offer.dealType].map(item => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/66">{item}</div>
                ))}
              </div>
            </GradientSurface>
          ))}
        </div>
      </div>
    </AppChrome>
  );
}

export function OfferComposerPage() {
  const [, setLocation] = useLocation();
  const mutation = trpc.offers.create.useMutation({
    onSuccess: data => setLocation(`/offers/${data.id}`),
  });
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    artistName: "Midnight Sonar",
    eventName: "Neon Nights Festival",
    eventDate: "2026-07-19",
    venueName: "Lantern Hall",
    city: "Nashville",
    feeLabel: "$6,000 guarantee",
    depositLabel: "$1,500 deposit",
    dealType: "Flat fee",
  });
  const steps = ["Artist", "Event", "Deal terms", "Schedule", "Additional terms", "Review"];

  return (
    <AppChrome role="promoter">
      <div className="space-y-6">
        <GradientSurface className="p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/46">Offer builder</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Create a structured offer</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-6">
            {steps.map((label, index) => (
              <div key={label} className={`rounded-2xl border px-3 py-3 text-center text-sm ${index + 1 === step ? "border-white/16 bg-white text-[#080C14]" : "border-white/10 bg-white/[0.03] text-white/60"}`}>
                {index + 1}. {label}
              </div>
            ))}
          </div>
        </GradientSurface>
        <GradientSurface className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input value={form.artistName} onChange={event => setForm(current => ({ ...current, artistName: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Artist" />
            <Input value={form.eventName} onChange={event => setForm(current => ({ ...current, eventName: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Event name" />
            <Input value={form.eventDate} onChange={event => setForm(current => ({ ...current, eventDate: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Event date" />
            <Input value={form.venueName} onChange={event => setForm(current => ({ ...current, venueName: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Venue" />
            <Input value={form.city} onChange={event => setForm(current => ({ ...current, city: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="City" />
            <Input value={form.dealType} onChange={event => setForm(current => ({ ...current, dealType: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Deal type" />
            <Input value={form.feeLabel} onChange={event => setForm(current => ({ ...current, feeLabel: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Fee" />
            <Input value={form.depositLabel} onChange={event => setForm(current => ({ ...current, depositLabel: event.target.value }))} className="h-12 border-white/12 bg-white/6 text-white" placeholder="Deposit" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/8" onClick={() => setStep(current => Math.max(1, current - 1))}>Previous step</Button>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/8" onClick={() => setStep(current => Math.min(6, current + 1))}>Next step</Button>
              <Button className="bg-[#C8FF3E] text-[#080C14] hover:bg-[#d7ff78]" onClick={() => mutation.mutate(form)} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send offer
              </Button>
            </div>
          </div>
        </GradientSurface>
      </div>
    </AppChrome>
  );
}

export function OfferDetailPage({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const offerQuery = trpc.offers.get.useQuery({ id });
  const respond = trpc.offers.respond.useMutation({
    onSuccess: async () => {
      await offerQuery.refetch();
    },
  });
  const offer = offerQuery.data;

  if (offerQuery.isLoading || !offer) {
    return <FullPageLoading label="Loading offer details" />;
  }

  return (
    <AppChrome role="artist">
      <div className="space-y-6">
        <GradientSurface className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/46">Offer detail</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{offer.eventName}</h2>
              <p className="mt-2 text-sm leading-6 text-white/54">{offer.artistName} · {offer.promoterName} · {offer.venueName}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/8" onClick={() => respond.mutate({ id, status: "countered" })}>Counter</Button>
              <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/8" onClick={() => respond.mutate({ id, status: "declined" })}>Decline</Button>
              <Button className="bg-[#C8FF3E] text-[#080C14] hover:bg-[#d7ff78]" onClick={() => respond.mutate({ id, status: "accepted" })}>Accept</Button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[offer.feeLabel, offer.depositLabel, offer.dealType].map(item => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/66">{item}</div>
            ))}
          </div>
        </GradientSurface>
        <GradientSurface className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-white">Activity timeline</p>
            {offer.status === "accepted" ? (
              <Button className="bg-white text-[#080C14] hover:bg-white/90" onClick={() => setLocation("/deals/demo-deal")}>Open deal room</Button>
            ) : null}
          </div>
          <div className="mt-5 space-y-3">
            {offer.activity.map(item => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/54">{item.subtitle}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/34">{item.dateLabel}</p>
              </div>
            ))}
          </div>
        </GradientSurface>
      </div>
    </AppChrome>
  );
}

export function DealRoomPage({ id }: { id: string }) {
  const dealQuery = trpc.deals.get.useQuery({ id });
  const deal = dealQuery.data;

  if (dealQuery.isLoading || !deal) {
    return <FullPageLoading label="Loading deal room" />;
  }

  return (
    <AppChrome role="promoter">
      <div className="space-y-6">
        <GradientSurface className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/46">Deal room</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{deal.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/54">{deal.venue} · {deal.city} · {deal.eventDate}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status={deal.status} />
              <StatusBadge status={deal.contractStatus} />
              <StatusBadge status={deal.paymentStatus} />
            </div>
          </div>
        </GradientSurface>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GradientSurface className="p-5">
            <p className="text-lg font-medium text-white">Contract</p>
            <div className="mt-5 space-y-3">
              {deal.contractChecklist.map(item => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#C8FF3E]" />
                  {item}
                </div>
              ))}
            </div>
          </GradientSurface>
          <GradientSurface className="p-5">
            <p className="text-lg font-medium text-white">Payment</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {deal.paymentMilestones.map(item => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white/52">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/34">{item.status}</p>
                </div>
              ))}
            </div>
          </GradientSurface>
        </div>
        <GradientSurface className="p-5">
          <p className="text-lg font-medium text-white">Messaging</p>
          <div className="mt-5 space-y-3">
            {deal.messages.map(message => (
              <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10 bg-white/8">
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{message.sender}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/34">{message.sentAt}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/58">{message.body}</p>
              </div>
            ))}
          </div>
        </GradientSurface>
      </div>
    </AppChrome>
  );
}
