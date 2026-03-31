import type { AirPollutionResponse, City, Coordinates, ForecastResponse } from "../types/openWeather";
import { makeMockForecast, mockCities, resolveCityProfile } from "../mocks/openWeatherMockData.js";

function normalizedIncludes(haystack: string, needle: string): boolean {
  return haystack.trim().toLowerCase().includes(needle.trim().toLowerCase());
}

function distance2(a: Coordinates, b: Coordinates): number {
  const dLat = a.lat - b.lat;
  const dLon = a.lon - b.lon;
  return dLat * dLat + dLon * dLon;
}

function findClosestCity(coords: Coordinates): City {
  let best = mockCities[0] as City;
  let bestD = Number.POSITIVE_INFINITY;
  for (const c of mockCities) {
    const d = distance2(coords, c);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

export async function fetchCitiesByName(query: string): Promise<City[]> {
  if (!query.trim()) return [];
  return mockCities.filter((c: City) => normalizedIncludes(c.name, query) || normalizedIncludes(query, c.name));
}

export async function fetchForecast(coords: Coordinates): Promise<ForecastResponse> {
  const now = Math.floor(Date.now() / 1000);
  const city = findClosestCity(coords);
  return makeMockForecast(now, city);
}

export async function fetchAirPollution(coords: Coordinates): Promise<AirPollutionResponse> {
  const city = findClosestCity(coords);
  return resolveCityProfile(city).pollution;
}
