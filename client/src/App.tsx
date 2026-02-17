import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import ROICalculator from "@/pages/ROICalculator";
import LoginPage from "@/pages/auth/LoginPage";

// Client Pages
import ClientDashboard from "@/pages/client/Dashboard";
import ProductCatalog from "@/pages/client/Catalog";
import LaunchKit from "@/pages/client/LaunchKit";
import MyStore from "@/pages/client/MyStore";
import ClientPayments from "@/pages/client/Payments";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import ClientDetail from "@/pages/admin/ClientDetail";
import AdminProducts from "@/pages/admin/Products";
import KitReviews from "@/pages/admin/Reviews";
import AdminSettings from "@/pages/admin/Settings";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
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
      <Route path="/login" component={LoginPage} />

      {/* Client Routes */}
      <Route path="/client/dashboard">
        <DashboardLayout userType="client">
          <ClientDashboard />
        </DashboardLayout>
      </Route>
      <Route path="/client/catalog">
        <DashboardLayout userType="client">
          <ProductCatalog />
        </DashboardLayout>
      </Route>
      <Route path="/client/launch-kit">
        <DashboardLayout userType="client">
          <LaunchKit />
        </DashboardLayout>
      </Route>
      <Route path="/client/store">
        <DashboardLayout userType="client">
          <MyStore />
        </DashboardLayout>
      </Route>
      <Route path="/client/payments">
        <DashboardLayout userType="client">
          <ClientPayments />
        </DashboardLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <DashboardLayout userType="admin">
          <AdminDashboard />
        </DashboardLayout>
      </Route>
      <Route path="/admin/clients/:id">
        <DashboardLayout userType="admin">
          <ClientDetail />
        </DashboardLayout>
      </Route>
      <Route path="/admin/clients">
        <DashboardLayout userType="admin">
          <AdminClients />
        </DashboardLayout>
      </Route>
      <Route path="/admin/products">
        <DashboardLayout userType="admin">
          <AdminProducts />
        </DashboardLayout>
      </Route>
      <Route path="/admin/reviews">
        <DashboardLayout userType="admin">
          <KitReviews />
        </DashboardLayout>
      </Route>
      <Route path="/admin/settings">
        <DashboardLayout userType="admin">
          <AdminSettings />
        </DashboardLayout>
      </Route>

      {/* Redirects */}
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
