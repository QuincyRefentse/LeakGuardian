import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { FaPlus, FaClipboardList, FaCheck, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import LeakCard from "@/components/LeakCard";
import { Leak } from "@shared/schema";

const EmptyState = () => (
  <div className="text-center py-12 px-4">
    <div className="bg-gray-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
      <FaClipboardList className="text-3xl text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
    <p className="text-gray-600 max-w-sm mx-auto mb-6">
      You haven't submitted any leak reports yet. Help your community by reporting water leaks and infrastructure issues.
    </p>
    <Link href="/report">
      <Button className="flex items-center">
        <FaPlus className="mr-2" /> Report a Leak
      </Button>
    </Link>
  </div>
);

const MyReports = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Fetch reports from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/leaks'],
    staleTime: 60000, // 1 minute
  });

  const filterReportsByStatus = (reports: Leak[], status?: string) => {
    if (!status || status === "all") return reports;
    return reports.filter(report => report.status === status);
  };

  const renderReportsList = (reports: Leak[]) => {
    if (reports.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <LeakCard key={report.id} leak={report} />
        ))}
      </div>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">My Reports</CardTitle>
            <CardDescription>Track and manage your leak reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load your reports. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get reports and filter by userId if authentication were implemented
  // For now, just show all reports since we don't have authentication
  const reports = data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="font-heading text-2xl">My Reports</CardTitle>
              <CardDescription>Track and manage your leak reports</CardDescription>
            </div>
            <Link href="/report">
              <Button className="flex items-center">
                <FaPlus className="mr-2" /> Report a Leak
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderReportsList(reports)}
            </TabsContent>
            
            <TabsContent value="pending">
              {renderReportsList(filterReportsByStatus(reports, "pending"))}
            </TabsContent>
            
            <TabsContent value="in_progress">
              {renderReportsList(filterReportsByStatus(reports, "in_progress"))}
            </TabsContent>
            
            <TabsContent value="resolved">
              {renderReportsList(filterReportsByStatus(reports, "resolved"))}
            </TabsContent>
            
            <TabsContent value="urgent">
              {renderReportsList(filterReportsByStatus(reports, "urgent"))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReports;
