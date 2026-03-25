import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import InstallBanner from "@/components/InstallBanner";
import AuthPage from "@/pages/AuthPage";

// ── COMING SOON ──
const ComingSoonPage = lazy(() => import("@/pages/ComingSoonPage"));

// ── PUBLIC PAGES ──
const HomePage = lazy(() => import("@/pages/HomePage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const DirectoryPage = lazy(() => import("@/pages/DirectoryPage"));
const PublicProfilePage = lazy(() => import("@/pages/PublicProfilePage"));
const PresalePage = lazy(() => import("@/pages/PresalePage"));
const DemoDashboardPage = lazy(() => import("@/pages/DemoDashboardPage"));
const TrendingPage = lazy(() => import("@/pages/TrendingPage"));
const BrowsePage = lazy(() => import("@/pages/BrowsePage"));
const ForArtistsPage = lazy(() => import("@/pages/ForArtistsPage"));
const ForPromotersPage = lazy(() => import("@/pages/ForPromotersPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

// ── PROTECTED PAGES ──
const WelcomePage = lazy(() => import("@/pages/WelcomePage"));
const ProfileSetupPage = lazy(() => import("@/pages/ProfileSetupPage"));
const DashboardArtist = lazy(() => import("@/pages/DashboardArtist"));
const DashboardPromoter = lazy(() => import("@/pages/DashboardPromoter"));
const DashboardVenue = lazy(() => import("@/pages/DashboardVenue"));
const DashboardCrew = lazy(() => import("@/pages/DashboardCrew"));
const DashboardProduction = lazy(() => import("@/pages/DashboardProduction"));
const DashboardCreative = lazy(() => import("@/pages/DashboardCreative"));
const OfferFlowPage = lazy(() => import("@/pages/OfferFlowPage"));
const TourManagementPage = lazy(() => import("@/pages/TourManagementPage"));
const PipelinePage = lazy(() => import("@/pages/PipelinePage"));
const TaxDashboardPage = lazy(() => import("@/pages/TaxDashboardPage"));
const InsightsPage = lazy(() => import("@/pages/InsightsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ReviewPage = lazy(() => import("@/pages/ReviewPage"));

// ── ADMIN PAGES ──
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AdminClaimsPage = lazy(() => import("@/pages/AdminClaimsPage"));

// ── CATCH-ALL ──
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const queryClient = new QueryClient();

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
    </div>
  );
}

/** Renders the correct dashboard based on user role */
function DashboardRouter() {
  const { profile, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  switch (profile?.role) {
    case "promoter": return <DashboardPromoter />;
    case "venue": return <DashboardVenue />;
    case "production": return <DashboardProduction />;
    case "photo_video": return <DashboardCreative />;
    default: return <DashboardArtist />;
  }
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── COMING SOON (public landing) ── */}
        <Route path="/" element={<ComingSoonPage />} />

        {/* ── FULL APP (hidden behind /app) ── */}
        <Route path="/app" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/artists" element={<ForArtistsPage />} />
        <Route path="/promoters" element={<ForPromotersPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/venues" element={<DirectoryPage initialRole="venue" />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/p/:slug" element={<PublicProfilePage />} />
        <Route path="/presale/:bookingId" element={<PresalePage />} />
        <Route path="/demo-dashboard" element={<DemoDashboardPage />} />

        {/* ── PROTECTED ROUTES ── */}
        <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        {/* Legacy role-specific dashboard routes → redirect to unified /dashboard */}
        <Route path="/artist-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/promoter-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/venue-manage" element={<Navigate to="/dashboard" replace />} />
        <Route path="/production-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/creative-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/offer" element={<ProtectedRoute><OfferFlowPage /></ProtectedRoute>} />
        <Route path="/tours" element={<ProtectedRoute><TourManagementPage /></ProtectedRoute>} />
        <Route path="/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
        <Route path="/tax" element={<ProtectedRoute><TaxDashboardPage /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/review/:bookingId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />

        {/* ── ADMIN ROUTES ── */}
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/claims" element={<ProtectedRoute><AdminClaimsPage /></ProtectedRoute>} />

        {/* ── CATCH-ALL ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const location = useLocation();
  const isComingSoon = location.pathname === "/";

  return (
    <>
      {!isComingSoon && (
        <>
          <a href="#main-content" className="skip-to-main">Skip to main content</a>
          <Navbar />
        </>
      )}
      <main id="main-content" className={isComingSoon ? "" : "overflow-x-hidden"}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      {!isComingSoon && <InstallBanner />}
      <Toaster />
      <Sonner />
      <HotToaster position="bottom-right" toastOptions={{ duration: 3500, style: { background: '#0E1420', color: '#F0F2F7', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }, success: { iconTheme: { primary: '#C8FF3E', secondary: '#080C14' } } }} containerStyle={{}} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
