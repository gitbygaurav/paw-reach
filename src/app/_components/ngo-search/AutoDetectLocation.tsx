import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

// Types and interfaces
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationData {
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface ReverseGeocodeResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

interface AutoDetectLocationProps {
  onLocationDetected?: (location: LocationData) => void;
  className?: string;
}

const AutoDetectLocation: React.FC<AutoDetectLocationProps> = ({ 
  onLocationDetected,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [location, setLocation] = useState<LocationData | null>(null);

  const getGeolocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      // First try with high accuracy
      navigator.geolocation.getCurrentPosition(
        resolve,
        (highAccuracyError) => {
          console.log('High accuracy failed, trying with lower accuracy...', highAccuracyError);
          
          // If high accuracy fails, try with lower accuracy as fallback
          navigator.geolocation.getCurrentPosition(
            resolve,
            (lowAccuracyError) => {
              console.log('Low accuracy also failed:', lowAccuracyError);
              reject(lowAccuracyError);
            },
            {
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 300000 // 5 minutes
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<ReverseGeocodeResponse> => {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error('Failed to get location details');
    }

    return response.json();
  };

  const handleGeolocationError = (err: GeolocationError | Error): string => {
    console.log('Geolocation error:', err);
    
    if ('code' in err) {
      switch (err.code) {
        case 1:
          return 'Location access denied. Please enable location permissions in your browser settings.';
        case 2:
          return 'Location information unavailable. This may be due to poor GPS signal or network connectivity. Try moving to an area with better signal.';
        case 3:
          return 'Location request timed out. Please try again.';
        default:
          return 'Failed to detect location';
      }
    }
    
    // Handle specific iOS CoreLocation errors
    if (err.message && (err.message.includes('kCLErrorLocationUnknown') || err.message.includes('CoreLocation'))) {
      return 'Unable to determine location. Please ensure location services are enabled and try again in an area with better GPS signal.';
    }
    
    return err.message || 'Failed to detect location';
  };

  const detectLocation = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current position
      const position = await getGeolocation();
      const { latitude, longitude } = position.coords;
      console.log(`Detected coordinates: ${latitude}, ${longitude}`);
      
      // Get location details via reverse geocoding
      const data = await reverseGeocode(latitude, longitude);
      
      const locationData: LocationData = {
        city: data.city || data.locality || 'Unknown City',
        state: data.principalSubdivision || 'Unknown State',
        country: data.countryName || 'Unknown Country',
        coordinates: { latitude, longitude }
      };

      // setLocation(locationData);
      
      // Call the callback function if provided
      if (onLocationDetected) {
        onLocationDetected(locationData);
      }

    } catch (err) {
      const errorMessage = handleGeolocationError(err as GeolocationError | Error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <div className="text-center">
        
        <button
          onClick={detectLocation}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          type="button"
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
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm">
                <p className="font-medium mb-1">Location Detection Failed</p>
                <p>{error}</p>
                <div className="mt-2 text-xs text-red-600">
                  <p className="font-medium">Troubleshooting tips:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Ensure location services are enabled in your device settings</li>
                    <li>Check that your browser has location permissions</li>
                    <li>Try refreshing the page and allowing location access</li>
                    <li>Move to an area with better GPS signal if outdoors</li>
                    <li>If on iOS, try Safari instead of other browsers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {location && (
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
        )} */}
      </div>
    </div>
  );
};

export default AutoDetectLocation;