import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

interface AutoDetectLocationProps {
  onLocationDetected?: (locationData: {
    city: string;
    state: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  }) => void;
}

const AutoDetectLocation: React.FC<AutoDetectLocationProps> = ({ onLocationDetected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    city: string;
    state: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  } | null>(null);

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000 // 10 minutes
          }
        );
      });

      const { latitude, longitude } = (position as GeolocationPosition).coords;

      // Use reverse geocoding to get city and state
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) {
        throw new Error('Failed to get location details');
      }

      const data = await response.json();
      
      const locationData = {
        city: data.city || data.locality || 'Unknown City',
        state: data.principalSubdivision || 'Unknown State',
        country: data.countryName || 'Unknown Country',
        coordinates: { latitude, longitude }
      };

      setLocation(locationData);
      
      // Call the callback function if provided
      if (onLocationDetected) {
        onLocationDetected(locationData);
      }

    } catch (err) {
      let errorMessage = 'Failed to detect location';

      if (typeof err === 'object' && err !== null) {
        if ('code' in err && typeof (err as any).code === 'number') {
          if ((err as any).code === 1) {
            errorMessage = 'Location access denied. Please enable location permissions.';
          } else if ((err as any).code === 2) {
            errorMessage = 'Location information unavailable.';
          } else if ((err as any).code === 3) {
            errorMessage = 'Location request timed out.';
          }
        } else if ('message' in err && typeof (err as any).message === 'string') {
          errorMessage = (err as any).message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Auto Detect Location
        </h2>
        
        <button
          onClick={detectLocation}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Detecting...' : 'Detect My Location'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {location && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Location Detected:</h3>
            <div className="text-left space-y-1">
              <p className="text-green-700">
                <span className="font-medium">City:</span> {location.city}
              </p>
              <p className="text-green-700">
                <span className="font-medium">State:</span> {location.state}
              </p>
              <p className="text-green-700">
                <span className="font-medium">Country:</span> {location.country}
              </p>
              <p className="text-green-600 text-sm">
                <span className="font-medium">Coordinates:</span> {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoDetectLocation;