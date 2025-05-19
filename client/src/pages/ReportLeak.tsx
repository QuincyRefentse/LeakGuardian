import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera, FaMapMarkerAlt, FaInfoCircle, FaCheck, FaTimes, FaArrowRight, FaMapPin } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useImageValidation } from "@/hooks/useImageValidation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { leakFormSchema, LeakFormData, LEAK_TYPE } from "@shared/schema";
import { LEAK_TYPES } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

enum ReportStep {
  MEDIA = 0,
  LOCATION = 1,
  DETAILS = 2,
  REVIEW = 3
}

const ReportLeak = () => {
  const [step, setStep] = useState<ReportStep>(ReportStep.MEDIA);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateImages, isValidating } = useImageValidation();
  const { position, error: geoError, loading: geoLoading } = useGeolocation();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // Form setup with Zod validation
  const form = useForm<LeakFormData>({
    resolver: zodResolver(leakFormSchema),
    defaultValues: {
      title: "",
      description: "",
      leakType: LEAK_TYPE.OTHER,
      severity: 3,
      location: "",
      coordinates: position ? { lat: position.lat, lng: position.lng } : { lat: 0, lng: 0 },
      status: "pending",
      images: [],
      files: []
    }
  });

  // Update coordinates when geolocation is available
  if (position && form.getValues("coordinates").lat === 0) {
    form.setValue("coordinates", { lat: position.lat, lng: position.lng });
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const previousFiles = uploadedFiles;
    const allFiles = [...previousFiles, ...newFiles];
    
    // Validate files
    validateImages(allFiles).then(({ isValid, message }) => {
      if (isValid) {
        setUploadedFiles(allFiles);
        form.setValue("files", allFiles);
        
        // Generate preview URLs
        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setFilePreviewUrls(prev => [...prev, ...newUrls]);
        
        // Display success message
        toast({
          title: "Files uploaded",
          description: `${newFiles.length} file(s) added successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: message
        });
      }
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    form.setValue("files", newFiles);

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(filePreviewUrls[index]);
    const newUrls = [...filePreviewUrls];
    newUrls.splice(index, 1);
    setFilePreviewUrls(newUrls);
  };

  const goToStep = (newStep: ReportStep) => {
    // Validate the current step before proceeding
    if (step === ReportStep.MEDIA && uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Upload required",
        description: "Please upload at least one image of the leak or damage."
      });
      return;
    }

    if (step === ReportStep.LOCATION) {
      const location = form.getValues("location");
      if (!location) {
        toast({
          variant: "destructive",
          title: "Location required",
          description: "Please provide the location of the leak."
        });
        return;
      }
    }

    if (step === ReportStep.DETAILS) {
      const { title, description, leakType } = form.getValues();
      if (!title || !description || !leakType) {
        toast({
          variant: "destructive",
          title: "Information required",
          description: "Please fill in all required fields."
        });
        return;
      }
    }

    setStep(newStep);
  };

  const onSubmit = async (data: LeakFormData) => {
    setIsSubmitting(true);

    try {
      // Create a FormData object to handle the file uploads
      const formData = new FormData();
      
      // Append text fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("coordinates", JSON.stringify(data.coordinates));
      formData.append("leakType", data.leakType);
      formData.append("severity", String(data.severity));
      formData.append("status", "pending");
      
      // Append files
      data.files.forEach(file => {
        formData.append("files", file);
      });

      // Send the FormData to the server
      const response = await fetch("/api/leaks", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to submit leak report");
      }

      const result = await response.json();

      toast({
        title: "Report submitted",
        description: "Your leak report has been submitted successfully!",
      });

      // Navigate to success page
      navigate(`/success/${result.id}`);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render progress steps
  const renderProgressSteps = () => {
    const steps = [
      { icon: <FaCamera />, label: "Media" },
      { icon: <FaMapMarkerAlt />, label: "Location" },
      { icon: <FaInfoCircle />, label: "Details" },
      { icon: <FaCheck />, label: "Review" }
    ];

    return (
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center w-full">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i <= step 
                    ? "bg-primary-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s.icon}
              </div>
              <span className={`text-xs mt-2 ${
                i <= step 
                  ? "text-primary-600 font-medium" 
                  : "text-gray-500"
              }`}>
                {s.label}
              </span>
              
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`absolute top-5 left-full h-1 w-full ${
                  i < step ? "bg-primary-600" : "bg-gray-200"
                }`} style={{ width: "calc(100% - 40px)", transform: "translateX(20px)" }}>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case ReportStep.MEDIA:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Upload Photos or Videos</h4>
              <p className="text-gray-600 mb-6">
                Upload clear images or videos of the leak or infrastructure damage. This helps our system validate the issue.
              </p>
            </div>

            <div className="mb-6">
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer block">
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center">
                  <FaCamera className="text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-gray-500">Supports JPG, PNG, GIF (Max 10MB each)</p>
                </div>
              </label>
            </div>

            {filePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {filePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Uploaded leak image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeFile(index)}
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={() => goToStep(ReportStep.LOCATION)}
                disabled={uploadedFiles.length === 0 || isValidating}
                className="flex items-center"
              >
                Continue <FaArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        );

      case ReportStep.LOCATION:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Specify the Location</h4>
              <p className="text-gray-600 mb-6">
                Provide the exact location of the leak or infrastructure damage to help authorities find it.
              </p>
            </div>

            {geoError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>
                  {geoError}. Please enter the location manually.
                </AlertDescription>
              </Alert>
            )}

            {geoLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Getting your current location...</p>
              </div>
            )}

            <Form {...form}>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address or Description</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="e.g., 123 Main St, corner of 5th Ave" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a street address, intersection, or landmark
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Placeholder for map */}
              <div className="h-64 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaMapPin className="text-3xl mx-auto mb-2" />
                  <p>Map visualization would appear here</p>
                  <p className="text-xs mt-1">Showing location at coordinates:</p>
                  <p className="text-xs font-mono">
                    {position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : "Location not available"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => goToStep(ReportStep.MEDIA)}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => goToStep(ReportStep.DETAILS)}
                  disabled={!form.getValues("location")}
                >
                  Continue <FaArrowRight className="ml-2" />
                </Button>
              </div>
            </Form>
          </div>
        );

      case ReportStep.DETAILS:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Provide Details</h4>
              <p className="text-gray-600 mb-6">
                Give us more information about the leak or damage to help with assessment and repair.
              </p>
            </div>

            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fire Hydrant Leak" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you see, how long it's been there, and any safety concerns..." 
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leakType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Issue</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of leak or damage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAK_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity (1-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={5} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        1 = Minor, 5 = Severe/Dangerous
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => goToStep(ReportStep.LOCATION)}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => goToStep(ReportStep.REVIEW)}
                >
                  Review <FaArrowRight className="ml-2" />
                </Button>
              </div>
            </Form>
          </div>
        );

      case ReportStep.REVIEW:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Review Your Report</h4>
              <p className="text-gray-600 mb-6">
                Please review your information before submitting the report.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-900">Report Details</h5>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Title</p>
                    <p className="text-sm">{form.getValues("title")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm">
                      {LEAK_TYPES.find(t => t.value === form.getValues("leakType"))?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm">{form.getValues("location")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Severity</p>
                    <p className="text-sm">{form.getValues("severity")}/5</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm">{form.getValues("description")}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Images</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {filePreviewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded leak image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => goToStep(ReportStep.DETAILS)}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-secondary-500 hover:bg-secondary-600"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">◌</span> Submitting...
                  </>
                ) : (
                  <>Submit Report</>
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Report a Leak</CardTitle>
        </CardHeader>
        <CardContent>
          {renderProgressSteps()}
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportLeak;
