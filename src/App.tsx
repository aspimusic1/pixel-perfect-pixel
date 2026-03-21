import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
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
const Directory = lazy(() => import("@/pages/Directory"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const OfferFlow = lazy(() => import("@/pages/OfferFlow"));
const TourManagement = lazy(() => import("@/pages/TourManagement"));
const VenueManage = lazy(() => import("@/pages/VenueManage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
              <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
              <Route path="/artist-dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
              <Route path="/promoter-dashboard" element={<ProtectedRoute><PromoterDashboard /></ProtectedRoute>} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/venues" element={<Navigate to="/directory" replace />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/offer" element={<ProtectedRoute><OfferFlow /></ProtectedRoute>} />
              <Route path="/tours" element={<ProtectedRoute><TourManagement /></ProtectedRoute>} />
              <Route path="/venue-manage" element={<ProtectedRoute><VenueManage /></ProtectedRoute>} />
              <Route path="/p/:slug" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
