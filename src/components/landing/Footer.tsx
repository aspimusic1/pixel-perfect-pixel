import { Link } from "react-router-dom";
import logoWhite from "@/assets/logo-white.svg";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground font-body">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoWhite} alt="GetBooked.Live" className="h-4 opacity-80" />
        </Link>
        <div className="flex gap-8">
          <Link to="/directory" className="hover:text-foreground transition-colors font-display text-xs lowercase">directory</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors font-display text-xs lowercase">pricing</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors font-display text-xs lowercase">sign in</Link>
        </div>
        <p className="text-muted-foreground/60">© {new Date().getFullYear()} GetBooked.Live</p>
      </div>
    </footer>
  );
}
