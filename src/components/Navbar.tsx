import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Globe, Lock } from "lucide-react";
import logoWhite from "@/assets/logo-white.svg";
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

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
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

  const dashboardRoute = (() => {
    switch (profile?.role) {
      case "promoter": return "/promoter-dashboard";
      case "venue": return "/venue-manage";
      case "production": return "/production-dashboard";
      case "photo_video": return "/creative-dashboard";
      default: return "/artist-dashboard";
    }
  })();
  const isFree = !profile || profile.subscription_plan === "free";
  const directoryHref = isFree ? "/pricing" : "/directory";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src={logoWhite} alt="GetBooked.Live" className="h-[18px]" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <NavItem to={directoryHref}>
              {t("nav.browse")}
              {isFree && <Lock className="w-3 h-3 text-role-venue ml-1" />}
            </NavItem>
            <NavItem to="/trending">{t("nav.trending")}</NavItem>
            <NavItem to="/pricing">{t("nav.pricing")}</NavItem>
            {user ? (
              <>
                <NavItem to={dashboardRoute}>{t("nav.dashboard")}</NavItem>
                {profile?.role === "promoter" && <NavItem to="/pipeline">{t("nav.pipeline")}</NavItem>}
                {profile?.role === "artist" && <NavItem to="/tax">{t("nav.tax")}</NavItem>}
                <NavItem to="/insights">insights</NavItem>
                <NavItem to="/tours">{t("nav.tours")}</NavItem>
                <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
                <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                <Button size="sm" variant="ghost" onClick={signOut} className="text-xs font-display lowercase">{t("nav.signOut")}</Button>
              </>
            ) : (
              <>
                <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs font-display lowercase">{t("nav.signIn")}</Button></Link>
                <Link to="/auth?tab=signup"><Button size="sm" className="text-xs font-display font-semibold lowercase">{t("nav.startFree")}</Button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors p-2 -mr-1">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
            )}
            <button
              className="text-foreground p-2 -mr-2 active:scale-[0.95] transition-transform"
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
        className={`fixed top-14 right-0 bottom-0 z-50 w-72 bg-card border-l border-border transform transition-transform duration-200 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
          <nav className="flex flex-col gap-0.5">
            <MobileLink to={directoryHref} onClick={closeMenu}>
              <span className="flex items-center gap-1">{t("nav.browse")}{isFree && <Lock className="w-3 h-3 text-role-venue" />}</span>
            </MobileLink>
            <MobileLink to="/trending" onClick={closeMenu}>{t("nav.trending")}</MobileLink>
            <MobileLink to="/pricing" onClick={closeMenu}>{t("nav.pricing")}</MobileLink>
            {user ? (
              <>
                <MobileLink to={dashboardRoute} onClick={closeMenu}>{t("nav.dashboard")}</MobileLink>
                {profile?.role === "promoter" && <MobileLink to="/pipeline" onClick={closeMenu}>{t("nav.pipeline")}</MobileLink>}
                {profile?.role === "artist" && <MobileLink to="/tax" onClick={closeMenu}>{t("nav.tax")}</MobileLink>}
                <MobileLink to="/insights" onClick={closeMenu}>insights</MobileLink>
                <MobileLink to="/tours" onClick={closeMenu}>{t("nav.tours")}</MobileLink>
                <div className="border-t border-border my-4" />
                <div className="px-3 py-2">
                  <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                </div>
                <button
                  className="w-full text-left py-3 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:scale-[0.97] font-display lowercase"
                  onClick={() => { signOut(); closeMenu(); }}
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-4" />
                <div className="px-3 py-2">
                  <LanguageSelector currentLang={i18n.language} onChange={(l) => i18n.changeLanguage(l)} />
                </div>
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="outline" className="w-full text-sm h-11 font-display lowercase">
                    {t("nav.signIn")}
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={closeMenu} className="mt-2">
                  <Button className="w-full text-sm font-display font-semibold h-11 lowercase">
                    {t("nav.startFree")}
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-display lowercase flex items-center">
      {children}
    </Link>
  );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="py-3 px-3 rounded-lg text-sm font-display font-medium text-foreground hover:bg-secondary transition-colors active:scale-[0.97] lowercase"
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
