import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Globe, ShieldCheck, ChevronDown } from "lucide-react";
import logoColor from "@/assets/logo-color.png";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

const NAV_LINKS = [
  { label: "Browse", to: "/directory", pro: true },
  { label: "Directory", to: "/directory", pro: false },
  { label: "Pricing", to: "/pricing", pro: false },
  { label: "For Artists", to: "/auth?tab=signup&role=artist", pro: false },
  { label: "For Promoters", to: "/auth?tab=signup&role=promoter", pro: false },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadCount(count ?? 0);
    };
    const checkAdmin = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
    };
    fetchUnread();
    checkAdmin();
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => fetchUnread())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const role = profile?.role;
  const dashboardRoute = (() => {
    switch (role) {
      case "promoter": return "/promoter-dashboard";
      case "venue": return "/venue-manage";
      case "production": return "/production-dashboard";
      case "photo_video": return "/creative-dashboard";
      default: return "/artist-dashboard";
    }
  })();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-background/95 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-full px-6 md:px-8 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" onClick={closeMenu}>
            <img src={logoColor} alt="GetBooked.Live" className="h-[22px]" />
          </Link>

          {/* Center nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              if (link.pro && !user) {
                return (
                  <Link
                    key={link.label}
                    to="/pricing"
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    {link.label}
                    <span className="text-[9px] font-display font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full leading-none">PRO</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-body transition-colors ${
                    location.pathname === link.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <Link
                to={dashboardRoute}
                className={`text-sm font-body transition-colors ${
                  location.pathname === dashboardRoute ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                dashboard
              </Link>
            )}
            {!user && (
              <Link
                to="/auth"
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Login
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-body text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />

            {user ? (
              <>
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative text-muted-foreground hover:text-foreground transition-colors p-2"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate("/setup")}
                  className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center bg-secondary active:scale-[0.96]"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-display font-bold text-foreground">
                      {(profile?.display_name ?? "?")[0].toUpperCase()}
                    </span>
                  )}
                </button>
                <button
                  onClick={signOut}
                  className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.signIn")}
                </Link>
                <Link to="/auth?tab=signup">
                  <button className="bg-primary text-primary-foreground font-display font-bold text-[13px] rounded-[10px] px-5 py-2.5 hover:bg-primary/90 active:scale-[0.96] transition-all">
                    {t("nav.startFree")}
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-1">
            {user && (
              <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              className="text-foreground p-2 active:scale-[0.95] transition-transform"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile slide-out */}
      <div
        className={`fixed top-[60px] right-0 bottom-0 z-50 w-72 bg-card border-l border-white/[0.06] transform transition-transform duration-200 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(link => {
              if (link.pro && !user) {
                return (
                  <MobileLink key={link.label} to="/pricing" onClick={closeMenu}>
                    {link.label} <span className="text-[9px] font-display font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full leading-none ml-1">PRO</span>
                  </MobileLink>
                );
              }
              return (
                <MobileLink key={link.label} to={link.to} onClick={closeMenu}>
                  {link.label}
                </MobileLink>
              );
            })}
            {!user && (
              <MobileLink to="/auth" onClick={closeMenu}>
                Admin Login
              </MobileLink>
            )}

            {user ? (
              <>
                <div className="border-t border-white/[0.06] my-3" />
                <MobileLink to={dashboardRoute} onClick={closeMenu}>dashboard</MobileLink>
                <MobileLink to="/insights" onClick={closeMenu}>insights</MobileLink>
                <MobileLink to="/tours" onClick={closeMenu}>tours</MobileLink>
                {isAdmin && <MobileLink to="/admin" onClick={closeMenu}>admin</MobileLink>}

                <div className="border-t border-white/[0.06] my-3" />
                <div className="px-3 py-2">
                  <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                </div>
                <button
                  className="w-full text-left py-3 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:scale-[0.97] font-body"
                  onClick={() => { signOut(); closeMenu(); }}
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-white/[0.06] my-4" />
                <div className="px-3 py-2">
                  <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                </div>
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="outline" className="w-full text-sm h-11 font-body">
                    {t("nav.signIn")}
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={closeMenu} className="mt-2">
                  <button className="w-full bg-primary text-primary-foreground font-display font-bold text-[13px] rounded-[10px] h-11 hover:bg-primary/90 active:scale-[0.96] transition-all">
                    {t("nav.startFree")}
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="py-3 px-3 rounded-lg text-sm font-body font-medium text-foreground hover:bg-secondary transition-colors active:scale-[0.97]"
    >
      {children}
    </Link>
  );
}

function LanguageSelector({ currentLang, onChange }: { currentLang: string; onChange: (lang: string) => void }) {
  const current = LANGS.find(l => currentLang.startsWith(l.code)) ?? LANGS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]">
          <Globe className="w-3.5 h-3.5" />
          <span>{current.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGS.map(l => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onChange(l.code)}
            className={currentLang.startsWith(l.code) ? "bg-accent" : ""}
          >
            <span className="mr-2">{l.flag}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
