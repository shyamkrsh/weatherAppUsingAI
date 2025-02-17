import { useQuery } from "@tanstack/react-query";
import { WeatherCard } from "@/components/weather/weather-card";
import { LoadingCard } from "@/components/weather/loading-card";
import { LocationSearch } from "@/components/weather/location-search";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number }>();
  const { toast } = useToast();
  const [locationError, setLocationError] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const requestLocation = () => {
    setLocationError(undefined);
    setSelectedLocation(undefined);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Failed to get your location.";
          if (error.code === 1) {
            errorMessage = "Location access was denied. Please enable location services.";
          } else if (error.code === 2) {
            errorMessage = "Location unavailable. Please try again.";
          } else if (error.code === 3) {
            errorMessage = "Location request timed out. Please try again.";
          }
          setLocationError(errorMessage);
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      );
    } else {
      const message = "Geolocation is not supported by your browser.";
      setLocationError(message);
      toast({
        title: "Browser Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!selectedLocation) {
      requestLocation();
    }
  }, [selectedLocation]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCoords({ lat: location.lat, lon: location.lon });
  };

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["/api/weather", coords?.lat, coords?.lon],
    queryFn: async () => {
      if (!coords) return null;
      const res = await fetch(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch weather data");
      }
      return res.json();
    },
    enabled: !!coords,
    retry: false
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <ThemeToggle />
      <div className="max-w-md mx-auto pt-16 space-y-4">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        {locationError ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-4 text-destructive">{locationError}</p>
              <Button onClick={requestLocation} className="gap-2">
                <MapPin className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <LoadingCard />
        ) : error ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-4 text-destructive">{error.message}</p>
              <Button onClick={requestLocation} className="gap-2">
                <MapPin className="h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}
      </div>
    </div>
  );
}