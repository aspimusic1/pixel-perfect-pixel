import { Link } from "react-router-dom";
import logoBlack from "@/assets/logo-black.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/[0.06] py-10 px-4 relative z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground font-body">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoBlack} alt="GetBooked.Live" className="h-5 opacity-90 brightness-0 invert" />
        </Link>
        <div className="flex gap-8">
          <Link to="/pricing" className="hover:text-foreground transition-colors font-display text-xs lowercase">pricing</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors font-display text-xs lowercase">sign in</Link>
        </div>
        <p className="text-muted-foreground/50">© {new Date().getFullYear()} GetBooked.Live</p>
      </div>
    </footer>
  );
}
