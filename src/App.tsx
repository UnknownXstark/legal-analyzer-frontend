import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/documents/upload" element={<UploadDocument />} />
          <Route path="/documents/:id/analysis" element={<DocumentAnalysis />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/logs" element={<ActivityLogs />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
