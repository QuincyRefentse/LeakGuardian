import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FaCheckCircle, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import { Leak } from '@shared/schema';

const ReportSuccess = () => {
  const [match, params] = useRoute('/success/:id');
  const [leak, setLeak] = useState<Leak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeakData = async () => {
      if (!params?.id) return;
      
      try {
        const response = await fetch(`/api/leaks/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch leak data');
        }
        
        const data = await response.json();
        setLeak(data);
      } catch (err) {
        console.error('Error fetching leak data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeakData();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading your report details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !leak) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-red-100 text-red-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Report</h2>
              <p className="text-gray-600 mb-6">{error || 'Could not find the requested report'}</p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-green-100 text-green-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Report Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for helping your community by reporting this issue.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
              <h3 className="font-medium text-gray-800 mb-2">{leak.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{leak.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FaMapMarkerAlt className="mr-2" />
                <span>{leak.location}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-1">What happens next?</h3>
              <p className="text-sm text-blue-600">Your report will be reviewed by local authorities. You can track the status of your report in "My Reports" section.</p>
            </div>
            
            <p className="text-gray-500 text-sm mb-1">Reference ID</p>
            <p className="font-mono text-gray-800 font-medium mb-6">#{leak.id.toString().padStart(6, '0')}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Return to Home</Button>
          </Link>
          <Link href="/my-reports" className="w-full sm:w-auto">
            <Button className="w-full flex items-center justify-center">
              <FaClipboardList className="mr-2" />
              Track Your Reports
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportSuccess;
