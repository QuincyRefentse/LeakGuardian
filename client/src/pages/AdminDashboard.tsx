import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { FaMapMarkerAlt, FaCheckCircle, FaCalendarAlt, FaExclamationTriangle, FaWater, FaToolbox, FaCheck, FaTimes } from "react-icons/fa";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { LEAK_STATUS } from "@/lib/constants";
import { Leak } from "@shared/schema";
import DataTable from "@/components/DataTable";
import LeakCard from "@/components/LeakCard";

const AdminDashboard = () => {
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Fetch all leaks
  const { data: leaks, isLoading, error } = useQuery({
    queryKey: ['/api/leaks'],
    staleTime: 60000, // 1 minute
  });

  // Mutation for updating leak status
  const updateLeakStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/leaks/${id}/status`, { status });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaks'] });
      toast({
        title: "Status updated",
        description: "The leak status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update leak status",
      });
    }
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateLeakStatus.mutate({ id, newStatus: newStatus });
  };

  // Filter leaks based on status
  const filterLeaksByStatus = (reports: Leak[], status?: string) => {
    if (!status || status === "all") return reports;
    return reports.filter(report => report.status === status);
  };

  // Get summary counts for dashboard
  const getSummary = (data: Leak[] = []) => {
    return {
      total: data.length,
      pending: data.filter(leak => leak.status === "pending").length,
      inProgress: data.filter(leak => leak.status === "in_progress").length,
      resolved: data.filter(leak => leak.status === "resolved").length,
      urgent: data.filter(leak => leak.status === "urgent").length,
      validated: data.filter(leak => leak.isValidated).length,
    };
  };

  const summary = getSummary(leaks);

  // Define columns for data table
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (row: Leak) => `#${row.id.toString().padStart(4, '0')}`
    },
    {
      key: "title",
      label: "Title",
      sortable: true
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (row: Leak) => (
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>{row.location}</span>
        </div>
      )
    },
    {
      key: "leakType",
      label: "Type",
      sortable: true,
      render: (row: Leak) => (
        <span className="capitalize">{row.leakType.replace('_', ' ')}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: Leak) => {
        const color = 
          row.status === "urgent" ? "bg-red-500" :
          row.status === "in_progress" ? "bg-amber-500" :
          row.status === "resolved" ? "bg-green-500" :
          row.status === "rejected" ? "bg-red-700" :
          "bg-blue-500";
        
        const label = 
          row.status === "urgent" ? "Urgent" :
          row.status === "in_progress" ? "In Progress" :
          row.status === "resolved" ? "Resolved" :
          row.status === "rejected" ? "Rejected" :
          "Pending";
        
        return <Badge className={color}>{label}</Badge>;
      }
    },
    {
      key: "isValidated",
      label: "Validated",
      sortable: true,
      render: (row: Leak) => (
        row.isValidated 
          ? <FaCheck className="text-green-500" />
          : <FaTimes className="text-red-500" />
      )
    },
    {
      key: "createdAt",
      label: "Date Reported",
      sortable: true,
      render: (row: Leak) => (
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    }
  ];

  const renderTableActions = (row: Leak) => (
    <div className="flex space-x-2">
      <Select 
        value={row.status} 
        onValueChange={(value) => handleStatusChange(row.id, value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Manage and respond to community leak reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load leak reports. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Admin Dashboard</CardTitle>
          <CardDescription>Manage and respond to community leak reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-primary-50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-full mb-2">
                  <FaWater size={24} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.total}</p>
                  <p className="text-sm text-gray-600">Total Reports</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-2">
                  <FaCalendarAlt size={24} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-full mb-2">
                  <FaToolbox size={24} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.inProgress}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-red-100 text-red-600 p-3 rounded-full mb-2">
                  <FaExclamationTriangle size={24} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.urgent}</p>
                  <p className="text-sm text-gray-600">Urgent</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="bg-green-100 text-green-600 p-3 rounded-full mb-2">
                  <FaCheckCircle size={24} />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.resolved}</p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="font-heading text-xl">Leak Reports</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewType === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("list")}
              >
                List View
              </Button>
              <Button
                variant={viewType === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("grid")}
              >
                Grid View
              </Button>
            </div>
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
            
            {Object.keys(LEAK_STATUS).map(status => {
              const statusValue = status.toLowerCase();
              const filteredData = activeTab === "all" 
                ? leaks 
                : filterLeaksByStatus(leaks, activeTab);
              
              return (
                <TabsContent key={activeTab === "all" ? "all" : statusValue} value={activeTab === "all" ? "all" : statusValue}>
                  {viewType === "list" ? (
                    <DataTable 
                      columns={columns} 
                      data={filteredData}
                      actions={renderTableActions}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredData.length > 0 ? (
                        filteredData.map(leak => (
                          <LeakCard 
                            key={leak.id} 
                            leak={leak} 
                            onStatusChange={handleStatusChange}
                            showActions
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-12">
                          <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} reports found</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
