import { pgTable, text, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  temperature: numeric("temperature").notNull(),
  humidity: numeric("humidity").notNull(),
  windSpeed: numeric("wind_speed").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  timestamp: numeric("timestamp").notNull(),
});

export const insertWeatherSchema = createInsertSchema(weatherData).omit({ 
  id: true 
});

export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type Weather = typeof weatherData.$inferSelect;

export const weatherResponseSchema = z.object({
  location: z.string(),
  temperature: z.number().transform(val => Number(val.toFixed(1))),
  humidity: z.number().transform(val => Math.round(val)),
  windSpeed: z.number().transform(val => Number(val.toFixed(1))),
  description: z.string(),
  icon: z.string(),
  timestamp: z.number()
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;