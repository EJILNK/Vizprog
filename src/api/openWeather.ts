import type { AirPollutionResponse, City, Coordinates, ForecastResponse } from "../types/openWeather";
import { OPEN_WEATHER_API_KEY } from "../config/openWeather";

export async function fetchCitiesByName(query: string): Promise<City[]> {
  console.log("KEY:", OPEN_WEATHER_API_KEY, "LEN:", OPEN_WEATHER_API_KEY?.length);
  if (!OPEN_WEATHER_API_KEY) {
    throw new Error("API_ERR");
  }

  const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("appid", OPEN_WEATHER_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
     const body = await response.text();
     throw new Error(`OpenWeather ${response.status}: ${body}`);
   }

  const data = (await response.json()) as any[];
  return data.map((item) => ({
    name: item.name,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
}

export async function fetchForecast(coords: Coordinates): Promise<ForecastResponse> {
  if (!OPEN_WEATHER_API_KEY) {
    throw new Error("API_ERR");
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");
  url.searchParams.set("lat", coords.lat.toString());
  url.searchParams.set("lon", coords.lon.toString());
  url.searchParams.set("appid", OPEN_WEATHER_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Не удалось получить прогноз погоды");
  }

  return (await response.json()) as ForecastResponse;
}

export async function fetchAirPollution(coords: Coordinates): Promise<AirPollutionResponse> {
  if (!OPEN_WEATHER_API_KEY) {
    throw new Error("API_ERR");
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/air_pollution");
  url.searchParams.set("lat", coords.lat.toString());
  url.searchParams.set("lon", coords.lon.toString());
  url.searchParams.set("appid", OPEN_WEATHER_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Не удалось получить данные о загрязнении воздуха");
  }

  return (await response.json()) as AirPollutionResponse;
}

