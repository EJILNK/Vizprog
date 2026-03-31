import React, { useEffect, useMemo, useState } from "react";
import type { AirPollutionResponse, City, DailySummary, ForecastResponse } from "../../types/openWeather";
import { fetchAirPollution, fetchCitiesByName, fetchForecast } from "../../api/openWeatherClient.mjs";
import type { PollutionEntry } from "../../utils/weather";
import { buildDailyForecast } from "../../utils/weather";
import { CitySearch } from "../CitySearch/CitySearch";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import { styles } from "./styles";
import { styles as citySearchStyles } from "../CitySearch/styles";

export const App: React.FC = () => {
  const [query, setQuery] = useState("Moscow");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [pollution, setPollution] = useState<AirPollutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void searchCities();
  }, []);

  async function searchCities() {
    if (!query.trim()) return;
    try {
      setError(null);
      setLoading(true);
      const found: City[] = await fetchCitiesByName(query.trim());
      setCities(found);

      if (!found.length) {
        setSelectedCity(null);
        setForecast(null);
        setPollution(null);
        return;
      }

      const firstCity: City = found[0] as City;
      setSelectedCity(firstCity);
      await loadWeather(firstCity);
    } catch (e: any) {
      setError(e.message ?? "Ошибка при поиске города");
    } finally {
      setLoading(false);
    }
  }

  async function loadWeather(city: City) {
    try {
      setError(null);
      setLoading(true);
      const [forecastResp, pollutionResp] = await Promise.all([fetchForecast(city), fetchAirPollution(city)]);
      setForecast(forecastResp);
      setPollution(pollutionResp);
    } catch (e: any) {
      setError(e.message ?? "Ошибка при загрузке прогноза");
    } finally {
      setLoading(false);
    }
  }

  const currentItem = forecast?.list?.[0];
  const timezoneOffset = forecast?.city.timezone ?? 0;
  const daily: DailySummary[] = useMemo(() => {
    return forecast ? buildDailyForecast(forecast.list, timezoneOffset) : [];
  }, [forecast, timezoneOffset]);
  const pollutionEntry: PollutionEntry | undefined = pollution?.list?.[0];

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <CitySearch
          query={query}
          onQueryChange={setQuery}
          cities={cities}
          selectedCity={selectedCity}
          loading={loading}
          error={error}
          showInitialHint={!forecast && !loading && !error}
          onSearch={() => void searchCities()}
          onSelectCity={(city) => {
            setSelectedCity(city);
            void loadWeather(city);
          }}
        />

        {forecast && currentItem && selectedCity ? (
          <WeatherCard
            city={selectedCity.name}
            country={selectedCity.country}
            current={currentItem}
            timezoneOffset={timezoneOffset}
            daily={daily}
            pollution={pollutionEntry}
          />
        ) : (
          <div style={citySearchStyles.controlsCard}>
            <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, opacity: 0.9, marginBottom: 6 }}>
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

