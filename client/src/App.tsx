import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ReportLeak from "@/pages/ReportLeak";
import ReportSuccess from "@/pages/ReportSuccess";
import LeakMap from "@/pages/LeakMap";
import MyReports from "@/pages/MyReports";
import AdminDashboard from "@/pages/AdminDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/report" component={ReportLeak} />
      <Route path="/success/:id" component={ReportSuccess} />
      <Route path="/map" component={LeakMap} />
      <Route path="/my-reports" component={MyReports} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<{id: number, username: string} | null>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header currentUser={currentUser} />
          <div className="flex-grow">
            <Router />
          </div>
          <MobileNav />
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
