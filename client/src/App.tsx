import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import LandingPage from "@/pages/LandingPage";
import ROICalculator from "@/pages/ROICalculator";
import QualificationForm from "@/pages/QualificationForm";
import ScopePage from "@/pages/ScopePage";
import LoginPage from "@/pages/auth/LoginPage";

import ClientDashboard from "@/pages/client/Dashboard";
import ProductCatalog from "@/pages/client/Catalog";
import LaunchKit from "@/pages/client/LaunchKit";
import MyStore from "@/pages/client/MyStore";
import ClientPayments from "@/pages/client/Payments";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import ClientDetail from "@/pages/admin/ClientDetail";
import AdminProducts from "@/pages/admin/Products";
import KitReviews from "@/pages/admin/Reviews";
import AdminSettings from "@/pages/admin/Settings";
import AdminTemplates from "@/pages/admin/Templates";
import AdminPayments from "@/pages/admin/Payments";

import ClientInvoices from "@/pages/client/Invoices";
import ClientChecklist from "@/pages/client/Checklist";
import ClientSupport from "@/pages/client/Support";
import ClientProfile from "@/pages/client/Profile";
import OrderTracking from "@/pages/client/OrderTracking";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicLayout>
          <LandingPage />
        </PublicLayout>
      </Route>
      <Route path="/roi-calculator">
        <PublicLayout>
          <ROICalculator />
        </PublicLayout>
      </Route>
      <Route path="/scope">
        <PublicLayout>
          <ScopePage />
        </PublicLayout>
      </Route>
      <Route path="/qualify">
        <QualificationForm />
      </Route>
      <Route path="/login" component={LoginPage} />

      <Route path="/client/dashboard">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/catalog">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ProductCatalog />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/launch-kit">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <LaunchKit />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/store">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <MyStore />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/payments">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientPayments />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/invoices">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientInvoices />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/checklist">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientChecklist />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/support">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientSupport />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/profile">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <ClientProfile />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/client/orders">
        <ProtectedRoute requiredRole="client">
          <DashboardLayout userType="client">
            <OrderTracking />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/admin/dashboard">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/clients/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <ClientDetail />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/clients">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminClients />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/products">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminProducts />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/reviews">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <KitReviews />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/templates">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminTemplates />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/payments">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminPayments />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout userType="admin">
            <AdminSettings />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/client">
        <Redirect to="/client/dashboard" />
      </Route>
      <Route path="/admin">
        <Redirect to="/admin/dashboard" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
