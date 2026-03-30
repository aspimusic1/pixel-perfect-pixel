import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * LaunchGate — pre-launch site lock.
 *
 * Rules:
 * - Everyone lands on /coming-soon (the root / also renders ComingSoonPage).
 * - The only routes accessible to non-admins are:
 *     /coming-soon  — the gate page itself
 *     /admin-login  — so admins can authenticate
 * - Admins (isAdmin === true) can access every route normally.
 * - While auth is still loading we render nothing to avoid a flash redirect.
 */

const ALWAYS_ALLOWED = ["/coming-soon", "/admin-login"];

export default function LaunchGate({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const { pathname } = useLocation();

  // Wait for auth to resolve so we don't flash-redirect admins
  if (loading) return null;

  // Admins bypass the gate entirely
  if (isAdmin) return <>{children}</>;

  // Everyone else: only /coming-soon and /admin-login are allowed
  if (ALWAYS_ALLOWED.includes(pathname)) return <>{children}</>;

  // Any other path → redirect to coming soon
  return <Navigate to="/coming-soon" replace />;
}
