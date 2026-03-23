import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Globe, ShieldCheck, ChevronDown } from "lucide-react";
const logoColor = "/logo-color.png";
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
  { label: "browse", to: "/directory", pro: true },
  { label: "directory", to: "/directory", pro: false },
  { label: "pricing", to: "/pricing", pro: false },
  { label: "for artists", to: "/auth?tab=signup&role=artist", pro: false },
  { label: "for promoters", to: "/auth?tab=signup&role=promoter", pro: false },
];

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!user) { return; }
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadCount(count ?? 0);
    };
    fetchUnread();
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
    if (isAdmin) return "/admin";
    switch (role) {
      case "promoter": return "/promoter-dashboard";
      case "venue": return "/venue-manage";
      case "production": return "/production-dashboard";
      case "photo_video": return "/creative-dashboard";
      default: return "/artist-dashboard";
    }
  })();

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-background/95 backdrop-blur-2xl border-b border-white/[0.06]"
        aria-label="Main navigation"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between h-full px-6 md:px-8 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" onClick={closeMenu}>
            <img src={logoColor} alt="GetBooked.Live" className="h-[22px]" width={140} height={22} fetchPriority="high" />
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
                admin login
              </Link>
            )}
            {user && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-body text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                admin
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
                  aria-label={`View notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#FF5C8A] text-white text-[10px] font-bold flex items-center justify-center px-1" aria-hidden="true">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center bg-secondary active:scale-[0.96]" aria-label="Account menu">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" loading="lazy" width={32} height={32} />
                      ) : (
                        <span className="text-xs font-display font-bold text-foreground">
                          {(profile?.display_name ?? "?")[0].toUpperCase()}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[160px]">
                    <DropdownMenuItem onClick={() => navigate(dashboardRoute)}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="text-primary">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut}>{t("nav.signOut")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors p-2" aria-label={`View notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center" aria-hidden="true">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              className="text-foreground p-2 active:scale-[0.95] transition-transform"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile slide-out */}
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
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
                admin login
              </MobileLink>
            )}

            {user ? (
              <>
                <div className="border-t border-white/[0.06] my-3" />
                <MobileLink to={dashboardRoute} onClick={closeMenu}>dashboard</MobileLink>
                <MobileLink to="/insights" onClick={closeMenu}>insights</MobileLink>
                <MobileLink to="/tours" onClick={closeMenu}>tours</MobileLink>
                {isAdmin && <MobileLink to="/admin" onClick={closeMenu}>admin</MobileLink>}
                <MobileLink to="/settings" onClick={closeMenu}>settings</MobileLink>

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
