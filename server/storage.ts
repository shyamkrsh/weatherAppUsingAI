import { type Weather, type WeatherResponse } from "@shared/schema";

export interface IStorage {
  saveWeather(weather: WeatherResponse): Promise<Weather>;
  getLastWeather(): Promise<Weather | undefined>;
}

export class MemStorage implements IStorage {
  private weather: Weather[];
  private currentId: number;

  constructor() {
    this.weather = [];
    this.currentId = 1;
  }

  async saveWeather(weatherData: WeatherResponse): Promise<Weather> {
    const weather: Weather = {
      id: this.currentId++,
      temperature: weatherData.temperature.toString(),
      humidity: weatherData.humidity.toString(),
      windSpeed: weatherData.windSpeed.toString(),
      description: weatherData.description,
      location: weatherData.location,
      icon: weatherData.icon,
      timestamp: weatherData.timestamp.toString()
    };
    this.weather.push(weather);
    return weather;
  }

  async getLastWeather(): Promise<Weather | undefined> {
    return this.weather[this.weather.length - 1];
  }
}

export const storage = new MemStorage();