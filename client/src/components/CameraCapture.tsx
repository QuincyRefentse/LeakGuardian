import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaCamera, FaUndo, FaCheck } from 'react-icons/fa';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '@/hooks/use-toast';
import OpenAI from 'openai';
import { Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CameraCaptureProps {
  onImageCapture: (imageData: string, analysis: LeakAnalysis | null) => void;
  coordinates: { lat: number; lng: number } | null;
}

export interface LeakAnalysis {
  isLeak: boolean;
  confidence: number;
  leakType: string;
  description: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, coordinates }) => {
  const { toast } = useToast();
  const {
    videoRef,
    capturedImage,
    isLoading,
    hasPermission,
    error,
    requestCameraPermission,
    stopCamera,
    captureImage,
    clearCapturedImage
  } = useCamera();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LeakAnalysis | null>(null);

  // Request camera access when component mounts
  useEffect(() => {
    const initCamera = async () => {
      const result = await requestCameraPermission();
      if (!result) {
        toast({
          title: 'Camera Access Required',
          description: 'Please allow camera access to capture leak images',
          variant: 'destructive'
        });
      }
    };

    initCamera();
  }, []);

  // Function to analyze the image using OpenAI
  const analyzeImage = async (imageDataUrl: string) => {
    setAnalyzing(true);
    
    try {
      // Remove the data URL prefix to get just the base64 data
      const base64Image = imageDataUrl.split(',')[1];
      
      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        dangerouslyAllowBrowser: true // For client-side usage (in production, this should be handled by the server)
      });

      const locationInfo = coordinates 
        ? `Image captured at coordinates: Latitude ${coordinates.lat.toFixed(6)}, Longitude ${coordinates.lng.toFixed(6)}.` 
        : 'Location data unavailable.';

      // Make request to OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert in identifying water leaks and infrastructure damage from images. Analyze the image and determine if it shows a water leak or infrastructure damage. If it does, provide details about the type and severity."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Analyze this image for water leaks or infrastructure damage. ${locationInfo} Respond with JSON in this format: { "isLeak": boolean, "confidence": number (0-1), "leakType": string, "description": string }. Use "isLeak": true only if you are confident that the image shows a leak or infrastructure damage.` 
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      // Parse the response
      const result = JSON.parse(response.choices[0].message.content) as LeakAnalysis;
      setAnalysis(result);
      
      // Show success or info based on analysis
      if (result.isLeak) {
        toast({
          title: 'Leak Detected!',
          description: `${result.leakType} detected with ${Math.round(result.confidence * 100)}% confidence.`,
          variant: 'default'
        });
      } else {
        toast({
          title: 'Analysis Complete',
          description: 'No leak detected. You can still submit this report if you believe there is an issue.',
          variant: 'default'
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error analyzing image:', err);
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze the image. You can still submit the report.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCapture = async () => {
    const imageData = captureImage();
    if (imageData) {
      const analysisResult = await analyzeImage(imageData);
      onImageCapture(imageData, analysisResult);
    } else {
      toast({
        title: 'Capture Failed',
        description: 'Failed to capture image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleRetake = () => {
    clearCapturedImage();
    setAnalysis(null);
    requestCameraPermission();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onImageCapture(capturedImage, analysis);
    }
  };

  if (error) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-lg font-medium mb-2">Camera Error</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={() => requestCameraPermission()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        {!capturedImage ? (
          // Camera preview
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
              style={{ display: hasPermission ? 'block' : 'none' }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            
            {!hasPermission && !isLoading && (
              <div className="bg-gray-100 w-full aspect-video flex flex-col items-center justify-center p-4">
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Camera access is needed to capture images of the leak
                </p>
                <Button onClick={() => requestCameraPermission()}>
                  Enable Camera
                </Button>
              </div>
            )}

            {hasPermission && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={handleCapture}
                  variant="secondary"
                  size="lg"
                  className="rounded-full w-16 h-16 flex items-center justify-center bg-white shadow-lg"
                >
                  <FaCamera className="w-6 h-6 text-primary-600" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Captured image view
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full aspect-video object-cover" 
            />
            
            {analyzing ? (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Analyzing image...</p>
              </div>
            ) : analysis ? (
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Analysis Results</h3>
                    <Badge variant={analysis.isLeak ? "destructive" : "outline"}>
                      {analysis.isLeak ? "Leak Detected" : "No Leak Detected"}
                    </Badge>
                  </div>
                  {analysis.isLeak && (
                    <>
                      <p className="text-sm mb-1"><span className="font-medium">Type:</span> {analysis.leakType}</p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Confidence:</span> {Math.round(analysis.confidence * 100)}%
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-600">{analysis.description}</p>
                </div>
              </div>
            ) : null}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button
                onClick={handleRetake}
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-white shadow-md"
              >
                <FaUndo className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="default"
                size="icon"
                className="rounded-full w-12 h-12 bg-primary-600 shadow-md"
                disabled={analyzing}
              >
                <FaCheck className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraCapture;