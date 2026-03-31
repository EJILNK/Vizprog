import type { AirPollutionResponse, City, Coordinates, ForecastResponse } from "../types/openWeather.js";
import * as realApi from "./openWeather.js";
import * as mockApi from "./openWeatherMock.js";

function shouldUseMocks(): boolean {

  const viteValue = (import.meta as unknown as { env?: Record<string, unknown> }).env?.VITE_USE_MOCKS;
  if (String(viteValue ?? "").trim() === "1") return true;

  const nodeValue = (globalThis as any)?.process?.env?.USE_MOCKS;
  return String(nodeValue ?? "").trim() === "1";
}

function getApi() {
  return shouldUseMocks() ? mockApi : realApi;
}

export async function fetchCitiesByName(query: string): Promise<City[]> {
  return await getApi().fetchCitiesByName(query);
}

export async function fetchForecast(coords: Coordinates): Promise<ForecastResponse> {
  return await getApi().fetchForecast(coords);
}

export async function fetchAirPollution(coords: Coordinates): Promise<AirPollutionResponse> {
  return await getApi().fetchAirPollution(coords);
}

