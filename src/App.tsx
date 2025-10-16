import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import JoinOurTeam from "./pages/JoinOurTeam";
import Support from "./pages/Support";
import TechnicianApplication from "./pages/TechnicianApplication";
import TechnicianApplicationConfirmation from "./pages/TechnicianApplicationConfirmation";
import ChatWidget from "./components/ChatWidget";
import SampleChatData from "./components/SampleChatData";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, userRole } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/join-our-team" element={<JoinOurTeam />} />
        <Route path="/technician-application" element={<TechnicianApplication />} />
        <Route path="/technician-application/confirmation" element={<TechnicianApplicationConfirmation />} />
        <Route path="/support" element={<Support />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Create sample chat data for testing */}
      {user && <SampleChatData />}
      
      {/* Show chat widget for authenticated users */}
      {user && (userRole === 'client' || userRole === 'technician' || userRole === 'admin') && (
        <ChatWidget />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
