import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Subscriptions = lazy(() => import("@/pages/subscriptions"));
const Alerts = lazy(() => import("@/pages/alerts"));
const Team = lazy(() => import("@/pages/team"));

function RouteFallback() {
  return (
    <div className="p-6">
      <div className="animate-pulse rounded-md h-8 w-40 bg-muted mb-4" />
      <div className="animate-pulse rounded-md h-24 w-full bg-muted" />
    </div>
  );
}

function Router({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/">
            <Suspense fallback={<RouteFallback />}>
              <Dashboard />
            </Suspense>
          </Route>
          <Route path="/subscriptions">
            <Suspense fallback={<RouteFallback />}>
              <Subscriptions />
            </Suspense>
          </Route>
          <Route path="/alerts">
            <Suspense fallback={<RouteFallback />}>
              <Alerts />
            </Suspense>
          </Route>
          <Route path="/team">
            <Suspense fallback={<RouteFallback />}>
              <Team />
            </Suspense>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Sidebar width configuration - following design guidelines
  const sidebarStyle = {
    "--sidebar-width": "16rem", // 256px
    "--sidebar-width-icon": "3rem", // 48px
  };

  return (
    <ThemeProvider>
      <TooltipProvider>
        {isLoading || !isAuthenticated ? (
          <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
        ) : (
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-2 border-b h-14 flex-shrink-0">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
                </main>
              </div>
            </div>
          </SidebarProvider>
        )}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
