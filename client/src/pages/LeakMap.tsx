import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaFilter, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { INITIAL_MAP_CENTER, LEAK_STATUS } from "@/lib/constants";
import { Leak, LEAK_TYPE } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

// Placeholder map component - in a real app this would be a proper map with Leaflet
const MapPlaceholder = ({ leaks }: { leaks: Leak[] }) => (
  <div className="relative bg-gray-200 rounded-lg h-[60vh] overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center p-4 bg-white bg-opacity-80 rounded-lg">
        <h3 className="font-semibold mb-2">Map Component</h3>
        <p className="text-sm text-gray-600 mb-2">In a real implementation, this would be a Leaflet map showing leak locations</p>
        <p className="text-xs">Centered at: {INITIAL_MAP_CENTER.lat}, {INITIAL_MAP_CENTER.lng}</p>
        <p className="text-xs">Showing {leaks.length} leak reports</p>
      </div>
    </div>
    
    {/* Simulated markers */}
    {leaks.map((leak, index) => {
      // Create a deterministic position based on the leak ID to simulate map positioning
      const lat = INITIAL_MAP_CENTER.lat + (leak.id * 0.001 % 0.05);
      const lng = INITIAL_MAP_CENTER.lng + (leak.id * 0.002 % 0.05);
      
      return (
        <div
          key={leak.id}
          className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${30 + (lat - INITIAL_MAP_CENTER.lat) * 1000}%`,
            left: `${50 + (lng - INITIAL_MAP_CENTER.lng) * 1000}%`,
          }}
        >
          <div 
            className={`w-4 h-4 rounded-full ${
              leak.status === 'urgent' ? 'bg-red-500' : 
              leak.status === 'in_progress' ? 'bg-amber-500' : 
              leak.status === 'resolved' ? 'bg-green-500' : 
              'bg-blue-500'
            } shadow-md`}
          ></div>
        </div>
      );
    })}
  </div>
);

const LeakMap = () => {
  // Fetch all leaks
  const { data: leaks, isLoading, error } = useQuery({
    queryKey: ['/api/leaks'],
    staleTime: 60000, // 1 minute
  });

  const [filteredLeaks, setFilteredLeaks] = useState<Leak[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  });

  useEffect(() => {
    if (!leaks) return;
    
    // Apply filters
    let result = [...leaks];
    
    if (filters.status) {
      result = result.filter(leak => leak.status === filters.status);
    }
    
    if (filters.type) {
      result = result.filter(leak => leak.leakType === filters.type);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        leak => 
          leak.title.toLowerCase().includes(searchLower) ||
          leak.description.toLowerCase().includes(searchLower) ||
          leak.location.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredLeaks(result);
  }, [leaks, filters]);

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      type: "",
      search: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Leak Report Map</CardTitle>
          <CardDescription>View and filter all reported leaks in your area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Input
                  placeholder="Search by title, description or location"
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <Select onValueChange={handleStatusChange} value={filters.status}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {Object.values(LEAK_STATUS).map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleTypeChange} value={filters.type}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value={LEAK_TYPE.WATER_MAIN}>Water Main</SelectItem>
                <SelectItem value={LEAK_TYPE.FIRE_HYDRANT}>Fire Hydrant</SelectItem>
                <SelectItem value={LEAK_TYPE.PIPE}>Pipe Leak</SelectItem>
                <SelectItem value={LEAK_TYPE.INFRASTRUCTURE}>Infrastructure</SelectItem>
                <SelectItem value={LEAK_TYPE.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm text-gray-500">
                {filters.status || filters.type || filters.search
                  ? `Filtered results: ${filteredLeaks.length} ${filteredLeaks.length === 1 ? 'leak' : 'leaks'}`
                  : `Showing all ${leaks?.length || 0} leaks`}
              </span>
            </div>
            {(filters.status || filters.type || filters.search) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Map */}
          {isLoading ? (
            <div className="bg-gray-100 rounded-lg h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading leak reports...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
              <p>Failed to load leak reports. Please try again later.</p>
            </div>
          ) : (
            <MapPlaceholder leaks={filteredLeaks} />
          )}
          
          {/* Legend */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-sm mb-2">Map Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.values(LEAK_STATUS).map(status => (
                <div key={status.value} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${status.color} mr-2`}></div>
                  <span className="text-sm">{status.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Reports List */}
          <div>
            <h3 className="font-medium text-lg mb-3">Recent Reports</h3>
            <div className="space-y-2">
              {filteredLeaks.slice(0, 5).map(leak => (
                <div key={leak.id} className="bg-gray-50 p-3 rounded-lg flex items-start">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                    leak.status === 'urgent' ? 'bg-red-500' : 
                    leak.status === 'in_progress' ? 'bg-amber-500' : 
                    leak.status === 'resolved' ? 'bg-green-500' : 
                    'bg-blue-500'
                  } mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{leak.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(leak.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <FaMapMarkerAlt className="mr-1" />
                      {leak.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeakMap;
