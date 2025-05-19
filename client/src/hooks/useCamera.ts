import { useState, useRef, useEffect } from 'react';

interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  loading: boolean;
  permission: boolean;
}

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    loading: false,
    permission: false
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use the back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setState({
        stream,
        error: null,
        loading: false,
        permission: true
      });
      
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setState({
        stream: null,
        error: error instanceof Error ? error.message : 'Failed to access camera',
        loading: false,
        permission: false
      });
      
      return false;
    }
  };

  const stopCamera = () => {
    if (state.stream) {
      const tracks = state.stream.getTracks();
      tracks.forEach(track => track.stop());
      
      setState(prev => ({
        ...prev,
        stream: null
      }));
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !state.stream) {
      setState(prev => ({
        ...prev,
        error: 'Camera not initialized'
      }));
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a data URL (base64 encoded image)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      
      return dataUrl;
    } catch (error) {
      console.error('Error capturing image:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to capture image'
      }));
      return null;
    }
  };

  const clearCapturedImage = () => {
    setCapturedImage(null);
  };

  // Cleanup function to stop the camera when the component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    capturedImage,
    isLoading: state.loading,
    hasPermission: state.permission,
    error: state.error,
    requestCameraPermission,
    stopCamera,
    captureImage,
    clearCapturedImage
  };
};