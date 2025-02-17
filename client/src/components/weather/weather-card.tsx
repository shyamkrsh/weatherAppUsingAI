import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@shared/schema";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherCardProps {
  weather: WeatherResponse;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{weather.location}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Thermometer className="h-5 w-5 text-primary" />
          <span>{weather.temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center gap-4">
          <Cloud className="h-5 w-5 text-primary" />
          <span className="capitalize">{weather.description}</span>
        </div>
        <div className="flex items-center gap-4">
          <Droplets className="h-5 w-5 text-primary" />
          <span>{Math.round(weather.humidity)}% Humidity</span>
        </div>
        <div className="flex items-center gap-4">
          <Wind className="h-5 w-5 text-primary" />
          <span>{weather.windSpeed.toFixed(1)} m/s Wind</span>
        </div>
      </CardContent>
    </Card>
  );
}