import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@shared/schema";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherCardProps {
  weather: WeatherResponse;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg transition-all hover:shadow-xl">
        <CardHeader className="pb-2">
          <motion.div 
            variants={item}
            className="flex items-center justify-between"
          >
            <CardTitle className="text-2xl font-bold">{weather.location}</CardTitle>
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-20 h-20"
            />
          </motion.div>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.div 
            variants={item}
            className="grid gap-6"
          >
            <motion.div 
              className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              variants={item}
            >
              <Thermometer className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-semibold">{weather.temperature.toFixed(1)}°C</p>
                <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="flex flex-col gap-2 bg-primary/5 p-4 rounded-lg hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                variants={item}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Humidity</span>
                </div>
                <p className="text-xl font-semibold">{Math.round(weather.humidity)}%</p>
              </motion.div>

              <motion.div 
                className="flex flex-col gap-2 bg-primary/5 p-4 rounded-lg hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                variants={item}
              >
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Wind Speed</span>
                </div>
                <p className="text-xl font-semibold">{weather.windSpeed.toFixed(1)} m/s</p>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}