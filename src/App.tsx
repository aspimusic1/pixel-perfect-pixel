import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import ProfileSetup from "@/pages/ProfileSetup";
import ArtistDashboard from "@/pages/ArtistDashboard";
import PromoterDashboard from "@/pages/PromoterDashboard";
import Directory from "@/pages/Directory";
import Pricing from "@/pages/Pricing";
import OfferFlow from "@/pages/OfferFlow";
import TourManagement from "@/pages/TourManagement";
import VenueManage from "@/pages/VenueManage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
