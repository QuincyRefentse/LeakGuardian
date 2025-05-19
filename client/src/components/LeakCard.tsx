import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaMapMarkerAlt, FaInfoCircle, FaRegThumbsUp, FaClock, FaCheck } from "react-icons/fa";
import { LEAK_STATUS } from "@/lib/constants";
import { Leak } from "@shared/schema";

interface LeakCardProps {
  leak: Leak;
  onStatusChange?: (id: number, newStatus: string) => void;
  showActions?: boolean;
}

const LeakCard = ({ leak, onStatusChange, showActions = false }: LeakCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50)); // This is just for display

  const statusColor = 
    leak.status === "urgent" ? "bg-red-500" :
    leak.status === "in_progress" ? "bg-amber-500" :
    leak.status === "resolved" ? "bg-green-500" :
    leak.status === "rejected" ? "bg-red-700" :
    "bg-blue-500";
  
  const statusLabel = 
    leak.status === "urgent" ? "Urgent" :
    leak.status === "in_progress" ? "In Progress" :
    leak.status === "resolved" ? "Resolved" :
    leak.status === "rejected" ? "Rejected" :
    "Pending";

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={leak.images[0]}
            alt={leak.title}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-3 right-3 ${statusColor} text-white text-xs font-medium py-1 px-2 rounded-full`}>
            {statusLabel}
          </div>
          {leak.isValidated && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <FaCheck className="mr-1" size={10} />
              Validated
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-semibold text-lg">{leak.title}</h3>
            <span className="text-gray-500 text-sm">
              {formatDate(leak.createdAt)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{leak.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <FaMapMarkerAlt className="mr-1" />
            <span className="truncate">{leak.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <button 
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
            >
              <FaRegThumbsUp className="mr-1" />
              <span className="text-sm">{likes}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="text-primary-600"
            >
              View Details
            </Button>
          </div>
        </CardContent>
        {showActions && onStatusChange && (
          <CardFooter className="bg-gray-50 px-4 py-3 flex flex-wrap gap-2">
            {leak.status !== "resolved" && (
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => onStatusChange(leak.id, "resolved")}
              >
                Mark Resolved
              </Button>
            )}
            {leak.status !== "in_progress" && leak.status !== "resolved" && (
              <Button 
                size="sm" 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={() => onStatusChange(leak.id, "in_progress")}
              >
                Mark In Progress
              </Button>
            )}
            {leak.status !== "urgent" && leak.status !== "resolved" && (
              <Button 
                size="sm" 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => onStatusChange(leak.id, "urgent")}
              >
                Mark Urgent
              </Button>
            )}
            {leak.status !== "rejected" && (
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onStatusChange(leak.id, "rejected")}
              >
                Reject
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{leak.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge className={statusColor}>{statusLabel}</Badge>
              <span className="text-gray-500">
                Reported on {formatDate(leak.createdAt)}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={leak.images[0]} 
                  alt={leak.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {leak.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {leak.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${leak.title} - additional image ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p>{leak.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-primary-600 mr-2" />
                  <p>{leak.location}</p>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded-md text-xs font-mono">
                  Coordinates: {leak.coordinates.lat.toFixed(6)}, {leak.coordinates.lng.toFixed(6)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                  <p className="capitalize">{leak.leakType.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Severity</h4>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-1 mr-1 rounded-sm ${i < leak.severity ? 'bg-primary-600' : 'bg-gray-200'}`}
                      ></div>
                    ))}
                    <span className="ml-2 text-sm">{leak.severity}/5</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status History</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FaClock className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reported</p>
                      <p className="text-xs text-gray-500">{formatDate(leak.createdAt)}</p>
                    </div>
                  </div>
                  {leak.status !== "pending" && (
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        leak.status === "resolved" ? "bg-green-100" : 
                        leak.status === "in_progress" ? "bg-amber-100" :
                        leak.status === "urgent" ? "bg-red-100" :
                        "bg-red-100"
                      } flex items-center justify-center mr-3`}>
                        <FaInfoCircle className={
                          leak.status === "resolved" ? "text-green-600" : 
                          leak.status === "in_progress" ? "text-amber-600" :
                          leak.status === "urgent" ? "text-red-600" :
                          "text-red-600"
                        } />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status Updated</p>
                        <p className="text-xs text-gray-500">{formatDate(leak.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {showActions && onStatusChange && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {leak.status !== "resolved" && (
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          onStatusChange(leak.id, "resolved");
                          setShowDetails(false);
                        }}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {leak.status !== "in_progress" && leak.status !== "resolved" && (
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-600"
                        onClick={() => {
                          onStatusChange(leak.id, "in_progress");
                          setShowDetails(false);
                        }}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {leak.status !== "urgent" && leak.status !== "resolved" && (
                      <Button 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          onStatusChange(leak.id, "urgent");
                          setShowDetails(false);
                        }}
                      >
                        Mark Urgent
                      </Button>
                    )}
                    {leak.status !== "rejected" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => {
                          onStatusChange(leak.id, "rejected");
                          setShowDetails(false);
                        }}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeakCard;
