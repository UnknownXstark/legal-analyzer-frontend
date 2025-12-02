import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LawyerSignup from "./pages/auth/LawyerSignup";
import GoogleCallback from "./pages/auth/GoogleCallback";
import LandingPage from "./pages/home/LandingPage";
import PricingPage from "./pages/pricing/PricingPage";
import ManageSubscription from "./pages/subscription/ManageSubscription";
import UpgradeRequired from "./pages/dashboard/UpgradeRequired";
import Dashboard from "./pages/Dashboard";
import DocumentList from "./pages/documents/DocumentList";
import UploadDocument from "./pages/documents/UploadDocument";
import DocumentDetail from "./pages/documents/DocumentDetail";
import DocumentAnalysis from "./pages/documents/DocumentAnalysis";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/reports/ReportDetail";
import Notifications from "./pages/Notifications";
import ActivityLogs from "./pages/notifications/ActivityLogs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/lawyer-signup" element={<LawyerSignup />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/individual-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/lawyer-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/documents" element={<ProtectedRoute><DocumentList /></ProtectedRoute>} />
          <Route path="/documents/upload" element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} />
          <Route path="/documents/:id/analysis" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
          <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
          
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
          
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/notifications/logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
          
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Subscription Routes */}
          <Route path="/manage-subscription" element={<ProtectedRoute><ManageSubscription /></ProtectedRoute>} />
          <Route path="/upgrade-required" element={<ProtectedRoute><UpgradeRequired /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
