import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell } from "lucide-react";
import logoWhite from "@/assets/logo-white.svg";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const dashboardRoute = profile?.role === "promoter" ? "/promoter-dashboard" : "/artist-dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center">
          <img src={logoWhite} alt="GetBooked.Live" className="h-[18px]" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/directory" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">browse</Link>
          <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">pricing</Link>
          {user ? (
            <>
              <Link to={dashboardRoute} className="text-xs text-muted-foreground hover:text-foreground transition-colors lowercase">dashboard</Link>
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
          {user ? (
            <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors mr-1">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
          ) : (
            <>
              <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs lowercase h-8">sign in</Button></Link>
              <Link to="/auth?tab=signup"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium lowercase h-8">start free</Button></Link>
            </>
          )}
          <button className="text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-4 pb-4 pt-2 space-y-2">
          <Link to="/directory" className="block py-2 text-xs text-muted-foreground lowercase" onClick={() => setMenuOpen(false)}>browse</Link>
          <Link to="/pricing" className="block py-2 text-xs text-muted-foreground lowercase" onClick={() => setMenuOpen(false)}>pricing</Link>
          {user ? (
            <>
              <Link to={dashboardRoute} className="block py-2 text-xs text-muted-foreground lowercase" onClick={() => setMenuOpen(false)}>dashboard</Link>
              <Link to="/tours" className="block py-2 text-xs text-muted-foreground lowercase" onClick={() => setMenuOpen(false)}>tours</Link>
              <button className="block py-2 text-xs text-muted-foreground lowercase" onClick={() => { signOut(); setMenuOpen(false); }}>sign out</button>
            </>
          ) : null}
        </div>
      )}
    </nav>
  );
}
