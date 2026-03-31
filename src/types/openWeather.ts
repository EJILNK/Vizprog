export type Coordinates = {
  lat: number;
  lon: number;
};

export type City = Coordinates & {
  name: string;
  country?: string;
};

export type OpenWeatherListItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
};

export type ForecastResponse = {
  list: OpenWeatherListItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
};

export type AirPollutionResponse = {
  list: {
    main: {
      aqi: number;
    };
    components: {
      pm2_5: number;
      pm10: number;
      no2: number;
      so2: number;
      o3: number;
      co: number;
    };
  }[];
};

export type Theme = "day-clear" | "day-rain" | "day-clouds" | "night-clear" | "night-rain" | "night-clouds";

export type DailySummary = {
  dateKey: string;
  label: string;
  min: number;
  max: number;
  icon: string;
};

