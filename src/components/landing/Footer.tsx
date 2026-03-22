import { Link } from "react-router-dom";
import logoBlack from "@/assets/logo-black.png";

export default function Footer() {
  return (
    <footer className="bg-primary py-10 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-primary-foreground/70 font-body">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoBlack} alt="GetBooked.Live" className="h-5 opacity-90" />
        </Link>
        <div className="flex gap-8">
          <Link to="/directory" className="hover:text-primary-foreground transition-colors font-display text-xs lowercase">directory</Link>
          <Link to="/pricing" className="hover:text-primary-foreground transition-colors font-display text-xs lowercase">pricing</Link>
          <Link to="/auth" className="hover:text-primary-foreground transition-colors font-display text-xs lowercase">sign in</Link>
        </div>
        <p className="text-primary-foreground/50">© {new Date().getFullYear()} GetBooked.Live</p>
      </div>
    </footer>
  );
}
