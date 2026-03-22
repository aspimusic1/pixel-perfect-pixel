import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

// Route-level code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const ProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const ArtistDashboard = lazy(() => import("@/pages/ArtistDashboard"));
const PromoterDashboard = lazy(() => import("@/pages/PromoterDashboard"));
const ProductionDashboard = lazy(() => import("@/pages/ProductionDashboard"));
const CreativeDashboard = lazy(() => import("@/pages/CreativeDashboard"));
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
const NotFound = lazy(() => import("@/pages/NotFound"));
const Welcome = lazy(() => import("@/pages/Welcome"));

const queryClient = new QueryClient();

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
              <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
              <Route path="/artist-dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
              <Route path="/promoter-dashboard" element={<ProtectedRoute><PromoterDashboard /></ProtectedRoute>} />
              <Route path="/production-dashboard" element={<ProtectedRoute><ProductionDashboard /></ProtectedRoute>} />
              <Route path="/creative-dashboard" element={<ProtectedRoute><CreativeDashboard /></ProtectedRoute>} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/venues" element={<Directory initialRole="venue" />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/offer" element={<ProtectedRoute><OfferFlow /></ProtectedRoute>} />
              <Route path="/tours" element={<ProtectedRoute><TourManagement /></ProtectedRoute>} />
              <Route path="/venue-manage" element={<ProtectedRoute><VenueManage /></ProtectedRoute>} />
              <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
              <Route path="/tax" element={<ProtectedRoute><TaxDashboard /></ProtectedRoute>} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
              <Route path="/p/:slug" element={<ProfilePage />} />
              <Route path="/admin/claims" element={<ProtectedRoute><AdminClaims /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/presale/:bookingId" element={<PresalePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
      <HotToaster position="bottom-right" toastOptions={{ duration: 3500, style: { background: '#0E1420', color: '#F0F2F7', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px' }, success: { iconTheme: { primary: '#C8FF3E', secondary: '#080C14' } } }} />
  </QueryClientProvider>
);

export default App;
