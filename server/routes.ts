import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { weatherResponseSchema } from "@shared/schema";
import dotenv from 'dotenv'
dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function registerRoutes(app: Express) {
  app.get("/api/locations", async (req, res) => {
    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({
        message: "OpenWeather API key is not configured"
      });
    }

    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        message: "Missing search query"
      });
    }

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q.toString())}&limit=5&appid=${"07de7b0f305fe356e7a70ebfef42d840"}`
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Geocoding API error: ${error}`);
      }

      const data = await response.json();
      const locations = data.map((item: any) => ({
        name: `${item.name}${item.state ? `, ${item.state}` : ""}${item.country ? `, ${item.country}` : ""}`,
        lat: item.lat,
        lon: item.lon
      }));

      res.json(locations);
    } catch (error) {
      console.error("Geocoding API error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to search locations"
      });
    }
  });

  app.get("/api/weather", async (req, res) => {
    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({
        message: "OpenWeather API key is not configured"
      });
    }

    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        message: "Missing latitude or longitude parameters"
      });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Weather API error: ${error}`);
      }

      const data = await response.json();

      if (!data.name || !data.main || !data.weather?.[0]) {
        throw new Error("Invalid weather data format received");
      }

      const weatherData = {
        location: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: Date.now()
      };

      const parsed = weatherResponseSchema.parse(weatherData);
      await storage.saveWeather(parsed);

      res.json(parsed);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to fetch weather data"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}