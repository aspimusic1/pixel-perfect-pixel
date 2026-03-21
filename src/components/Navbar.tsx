import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import logoWhite from "@/assets/logo-white.svg";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Close menu on route change / resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const dashboardRoute = profile?.role === "promoter" ? "/promoter-dashboard" : "/artist-dashboard";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src={logoWhite} alt="GetBooked.Live" className="h-[18px]" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/directory" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">browse</Link>
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">pricing</Link>
            {user ? (
              <>
                <Link to={dashboardRoute} className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">dashboard</Link>
                {profile?.role === "promoter" && <Link to="/pipeline" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">pipeline</Link>}
                <Link to="/tours" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">tours</Link>
                <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
                <Button size="sm" variant="ghost" onClick={signOut} className="text-xs lowercase">sign out</Button>
              </>
            ) : (
              <>
                <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs lowercase">sign in</Button></Link>
                <Link to="/auth?tab=signup"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium lowercase">start free</Button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors p-2 -mr-1">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
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

      {/* Mobile slide-out overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile slide-out panel */}
      <div
        className={`fixed top-14 right-0 bottom-0 z-50 w-64 bg-card border-l border-border transform transition-transform duration-200 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <MobileLink to="/directory" onClick={closeMenu}>Browse</MobileLink>
            <MobileLink to="/pricing" onClick={closeMenu}>Pricing</MobileLink>
            {user ? (
              <>
                <MobileLink to={dashboardRoute} onClick={closeMenu}>Dashboard</MobileLink>
                {profile?.role === "promoter" && <MobileLink to="/pipeline" onClick={closeMenu}>Pipeline</MobileLink>}
                <MobileLink to="/tours" onClick={closeMenu}>Tours</MobileLink>
                <div className="border-t border-border my-3" />
                <button
                  className="w-full text-left py-3 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors active:scale-[0.97]"
                  onClick={() => { signOut(); closeMenu(); }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-3" />
                <Link to="/auth" onClick={closeMenu}>
                  <Button variant="outline" className="w-full border-border text-sm h-11 active:scale-[0.97] transition-transform">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={closeMenu} className="mt-2">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium h-11 active:scale-[0.97] transition-transform">
                    Start free
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

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="py-3 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-white/[0.03] transition-colors active:scale-[0.97]"
    >
      {children}
    </Link>
  );
}
