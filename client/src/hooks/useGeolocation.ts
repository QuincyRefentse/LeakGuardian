import { useState, useEffect } from 'react';

interface Position {
  lat: number;
  lng: number;
}

interface GeolocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocation is not supported by your browser',
        loading: false
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        error: null,
        loading: false
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState({
        position: null,
        error: error.message,
        loading: false
      });
    };

    setState(prev => ({ ...prev, loading: true }));
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  return state;
};
