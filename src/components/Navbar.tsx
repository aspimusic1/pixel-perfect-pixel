import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Music, Menu, X, Bell } from "lucide-react";
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
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
          <Music className="w-5 h-5 text-primary" />
          <span>GetBooked<span className="text-primary">.Live</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/directory" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Directory</Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          {user ? (
            <>
              <Link to={dashboardRoute} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/tours" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tours</Link>
              <button onClick={() => navigate("/notifications")} className="relative text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              <Button size="sm" variant="ghost" onClick={signOut} className="text-sm">Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/auth"><Button size="sm" variant="ghost" className="text-sm">Sign in</Button></Link>
              <Link to="/auth?tab=signup"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-4 pb-4 pt-2 space-y-2">
          <Link to="/directory" className="block py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Directory</Link>
          <Link to="/pricing" className="block py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user ? (
            <>
              <Link to={dashboardRoute} className="block py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/tours" className="block py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Tours</Link>
              <button className="block py-2 text-sm text-muted-foreground" onClick={() => { signOut(); setMenuOpen(false); }}>Sign out</button>
            </>
          ) : (
            <Link to="/auth" className="block py-2 text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
