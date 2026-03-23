import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import InstallBanner from "@/components/InstallBanner";

// Route-level code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const ProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const ArtistDashboard = lazy(() => import("@/pages/ArtistDashboard"));
const PromoterDashboard = lazy(() => import("@/pages/PromoterDashboard"));
const CrewDashboard = lazy(() => import("@/pages/CrewDashboard"));
const Directory = lazy(() => import("@/pages/Directory"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const OfferFlow = lazy(() => import("@/pages/OfferFlow"));
const TourManagement = lazy(() => import("@/pages/TourManagement"));
const VenueManage = lazy(() => import("@/pages/VenueManage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Pipeline = lazy(() => import("@/pages/Pipeline"));
const TaxDashboard = lazy(() => import("@/pages/TaxDashboard"));
const Trending = lazy(() => import("@/pages/Trending"));
const Insights = lazy(() => import("@/pages/Insights"));
const AdminClaims = lazy(() => import("@/pages/AdminClaims"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const PresalePage = lazy(() => import("@/pages/PresalePage"));
const ReviewPage = lazy(() => import("@/pages/ReviewPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const Settings = lazy(() => import("@/pages/Settings"));

const queryClient = new QueryClient();

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <a href="#main-content" className="skip-to-main">Skip to main content</a>
          <Navbar />
          <main id="main-content">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
                <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                <Route path="/artist-dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
                <Route path="/promoter-dashboard" element={<ProtectedRoute><PromoterDashboard /></ProtectedRoute>} />
                <Route path="/production-dashboard" element={<ProtectedRoute><CrewDashboard /></ProtectedRoute>} />
                <Route path="/creative-dashboard" element={<ProtectedRoute><CrewDashboard /></ProtectedRoute>} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/venues" element={<Directory initialRole="venue" />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/offer" element={<ProtectedRoute><OfferFlow /></ProtectedRoute>} />
                <Route path="/tours" element={<ProtectedRoute><TourManagement /></ProtectedRoute>} />
                <Route path="/venue-manage" element={<ProtectedRoute><VenueManage /></ProtectedRoute>} />
                <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
                <Route path="/tax" element={<ProtectedRoute><TaxDashboard /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/p/:slug" element={<ProfilePage />} />
                <Route path="/admin/claims" element={<ProtectedRoute><AdminClaims /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/presale/:bookingId" element={<PresalePage />} />
                <Route path="/review/:bookingId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <InstallBanner />
          <Toaster />
          <Sonner />
          <HotToaster position="bottom-right" toastOptions={{ duration: 3500, style: { background: '#0E1420', color: '#F0F2F7', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }, success: { iconTheme: { primary: '#C8FF3E', secondary: '#080C14' } } }} containerStyle={{}} />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
