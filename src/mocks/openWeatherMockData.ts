import type { AirPollutionResponse, City, ForecastResponse, OpenWeatherListItem } from "../types/openWeather";

export const mockCities: City[] = [
  { name: "Moscow", country: "RU", lat: 55.7558, lon: 37.6173 },
  { name: "Moskva", country: "RU", lat: 55.7558, lon: 37.6173 },
  { name: "Saint Petersburg", country: "RU", lat: 59.9311, lon: 30.3609 },
  { name: "Kazan", country: "RU", lat: 55.7961, lon: 49.1064 },
  { name: "Novosibirsk", country: "RU", lat: 55.0084, lon: 82.9357 },
  { name: "Sochi", country: "RU", lat: 43.5855, lon: 39.7231 },
  { name: "Yekaterinburg", country: "RU", lat: 56.8389, lon: 60.6057 },
  { name: "Moscow", country: "US", lat: 46.7324, lon: -117.0002 },
];

export type WeatherPreset = {
  id: number;
  main: string;
  descriptionDay: string;
  descriptionNight: string;
  iconDay: string;
  iconNight: string;
};

export const weatherPresets = {
  clear: { id: 800, main: "Clear", descriptionDay: "солнечно", descriptionNight: "ясно", iconDay: "01d", iconNight: "01n" },
  fewClouds: { id: 801, main: "Clouds", descriptionDay: "переменная облачность", descriptionNight: "облачно", iconDay: "02d", iconNight: "02n" },
  overcast: { id: 804, main: "Clouds", descriptionDay: "пасмурно", descriptionNight: "пасмурно", iconDay: "04d", iconNight: "04n" },
  lightRain: { id: 500, main: "Rain", descriptionDay: "небольшой дождь", descriptionNight: "дождь", iconDay: "10d", iconNight: "10n" },
  thunder: { id: 200, main: "Thunderstorm", descriptionDay: "гроза", descriptionNight: "гроза", iconDay: "11d", iconNight: "11n" },
  snow: { id: 600, main: "Snow", descriptionDay: "снег", descriptionNight: "снег", iconDay: "13d", iconNight: "13n" },
  fog: { id: 741, main: "Fog", descriptionDay: "туман", descriptionNight: "туман", iconDay: "50d", iconNight: "50n" },
} satisfies Record<string, WeatherPreset>;

export type CityWeatherProfile = {
  cityName: string;
  country: string;
  timezoneOffsetSeconds: number;
  baseTempC: number;
  pattern: WeatherPreset[];
  pollution: AirPollutionResponse;
};

export const cityProfiles: Record<string, CityWeatherProfile> = {
  "Moscow,RU": {
    cityName: "Moscow",
    country: "RU",
    timezoneOffsetSeconds: 3 * 3600,
    baseTempC: 11,
    pattern: [weatherPresets.fewClouds, weatherPresets.overcast, weatherPresets.lightRain, weatherPresets.fewClouds, weatherPresets.clear, weatherPresets.fog],
    pollution: {
      list: [{ main: { aqi: 3 }, components: { pm2_5: 18.5, pm10: 28.1, no2: 22.0, so2: 3.3, o3: 24.1, co: 340.0 } }],
    },
  },
  "Saint Petersburg,RU": {
    cityName: "Saint Petersburg",
    country: "RU",
    timezoneOffsetSeconds: 3 * 3600,
    baseTempC: 7,
    pattern: [weatherPresets.overcast, weatherPresets.lightRain, weatherPresets.overcast, weatherPresets.fog, weatherPresets.lightRain],
    pollution: {
      list: [{ main: { aqi: 2 }, components: { pm2_5: 9.2, pm10: 16.4, no2: 12.4, so2: 2.0, o3: 30.1, co: 210.0 } }],
    },
  },
  "Kazan,RU": {
    cityName: "Kazan",
    country: "RU",
    timezoneOffsetSeconds: 3 * 3600,
    baseTempC: 10,
    pattern: [weatherPresets.clear, weatherPresets.fewClouds, weatherPresets.thunder, weatherPresets.lightRain, weatherPresets.clear],
    pollution: {
      list: [{ main: { aqi: 2 }, components: { pm2_5: 7.4, pm10: 12.8, no2: 10.2, so2: 1.4, o3: 42.6, co: 180.0 } }],
    },
  },
  "Novosibirsk,RU": {
    cityName: "Novosibirsk",
    country: "RU",
    timezoneOffsetSeconds: 7 * 3600,
    baseTempC: 2,
    pattern: [weatherPresets.snow, weatherPresets.overcast, weatherPresets.snow, weatherPresets.fog, weatherPresets.overcast],
    pollution: {
      list: [{ main: { aqi: 4 }, components: { pm2_5: 25.1, pm10: 41.6, no2: 18.3, so2: 4.0, o3: 18.2, co: 520.0 } }],
    },
  },
  "Sochi,RU": {
    cityName: "Sochi",
    country: "RU",
    timezoneOffsetSeconds: 3 * 3600,
    baseTempC: 16,
    pattern: [weatherPresets.clear, weatherPresets.clear, weatherPresets.fewClouds, weatherPresets.lightRain, weatherPresets.clear],
    pollution: {

      list: [{ main: { aqi: 1 }, components: { pm2_5: 4.3, pm10: 7.9, no2: 6.1, so2: 1.0, o3: 46.8, co: 120.0 } }],
    },
  },
  "Yekaterinburg,RU": {
    cityName: "Yekaterinburg",
    country: "RU",
    timezoneOffsetSeconds: 5 * 3600,
    baseTempC: 6,
    pattern: [weatherPresets.overcast, weatherPresets.fewClouds, weatherPresets.lightRain, weatherPresets.overcast, weatherPresets.clear],
    pollution: {
      list: [{ main: { aqi: 3 }, components: { pm2_5: 16.1, pm10: 24.7, no2: 14.8, so2: 2.7, o3: 26.4, co: 290.0 } }],
    },
  },
  "Moscow,US": {
    cityName: "Moscow",
    country: "US",
    timezoneOffsetSeconds: -7 * 3600,
    baseTempC: 9,
    pattern: [weatherPresets.fewClouds, weatherPresets.clear, weatherPresets.lightRain, weatherPresets.fewClouds, weatherPresets.overcast],
    pollution: {
      list: [{ main: { aqi: 1 }, components: { pm2_5: 3.8, pm10: 6.2, no2: 4.1, so2: 0.8, o3: 48.1, co: 110.0 } }],
    },
  },
};

export function resolveCityProfile(city: City): CityWeatherProfile {
  const key = `${city.name},${city.country ?? ""}`;
  if (key in cityProfiles) return cityProfiles[key]!;
  if (city.name === "Moskva" && (city.country ?? "") === "RU") return cityProfiles["Moscow,RU"]!;
  return cityProfiles["Moscow,RU"]!;
}

function makeListItem(params: {
  dt: number;
  tempK: number;
  feelsLikeK: number;
  humidity: number;
  pressure: number;
  wind: number;
  visibility: number;
  icon: string;
  description: string;
  weatherId: number;
  weatherMain: string;
}): OpenWeatherListItem {
  return {
    dt: params.dt,
    main: { temp: params.tempK, feels_like: params.feelsLikeK, humidity: params.humidity, pressure: params.pressure },
    weather: [{ id: params.weatherId, main: params.weatherMain, description: params.description, icon: params.icon }],
    wind: { speed: params.wind },
    visibility: params.visibility,
  };
}

export function makeMockForecast(nowUnixSeconds: number, city: City): ForecastResponse {
  const profile = resolveCityProfile(city);
  const step = 3 * 3600;
  const list: OpenWeatherListItem[] = [];

  for (let i = 0; i < 40; i++) {
    const dt = nowUnixSeconds + i * step;
    const hourLocal = new Date((dt + profile.timezoneOffsetSeconds) * 1000).getUTCHours();
    const isNight = hourLocal < 6 || hourLocal >= 21;

    const preset = profile.pattern[i % profile.pattern.length]!;
    const icon = isNight ? preset.iconNight : preset.iconDay;
    const description = isNight ? preset.descriptionNight : preset.descriptionDay;

    const tempShiftC = preset.main === "Snow" ? -8 : preset.main === "Rain" ? -2 : preset.main === "Thunderstorm" ? -1 : 0;
    const baseK = 273.15 + profile.baseTempC + Math.sin(i / 3) * 4 + tempShiftC;

    list.push(
      makeListItem({
        dt,
        tempK: baseK,
        feelsLikeK: baseK - 1.2,
        humidity: preset.main === "Rain" || preset.main === "Fog" ? 75 + (i % 10) : 50 + (i % 12),
        pressure: 1010 + (i % 8),
        wind: preset.main === "Thunderstorm" ? 6.2 : 2.4 + (i % 6) * 0.25,
        visibility: preset.main === "Fog" ? 1800 : preset.main === "Snow" ? 6000 : 10000,
        icon,
        description,
        weatherId: preset.id,
        weatherMain: preset.main,
      })
    );
  }

  return {
    list,
    city: { name: profile.cityName, country: profile.country, timezone: profile.timezoneOffsetSeconds },
  };
}
