import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Directory", to: "/directory" },
  { label: "Pricing", to: "/pricing" },
  { label: "Trending", to: "/trending" },
];

const INFO_LINKS = [
  { label: "Sign In", to: "/auth" },
  { label: "Sign Up", to: "/auth?tab=signup" },
  { label: "Privacy Policy", to: "#" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 pt-0 pb-8 px-4">
      {/* Top separator */}
      <div className="h-px mb-12" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Logo + tagline */}
          <div>
            <Link to="/" className="font-display font-bold text-lg text-foreground lowercase">
              getbooked.live
            </Link>
            <p className="text-[13px] font-body mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              the all-in-one platform for artists, promoters, venues, and crew.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="font-display text-xs font-medium uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}
            >
              Navigation
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-body transition-colors duration-150 hover:text-primary lowercase"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <p
              className="font-display text-xs font-medium uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}
            >
              Information
            </p>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-body transition-colors duration-150 hover:text-primary lowercase"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-body" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} GetBooked.Live. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
