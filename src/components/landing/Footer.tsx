import { Link } from "react-router-dom";
import { Music } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
        <div className="flex items-center gap-2 font-display font-bold text-sm text-foreground">
          <Music className="w-4 h-4 text-primary" />
          getbooked.live
        </div>
        <div className="flex gap-6">
          <Link to="/directory" className="hover:text-foreground transition-colors">directory</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">pricing</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors">sign in</Link>
        </div>
        <p>© {new Date().getFullYear()} GetBooked.Live</p>
      </div>
    </footer>
  );
}
