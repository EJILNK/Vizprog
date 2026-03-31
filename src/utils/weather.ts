import type { AirPollutionResponse, DailySummary, OpenWeatherListItem, Theme } from "../types/openWeather";

const KELVIN_TO_CELSIUS_DELTA = 273.15;

export function kelvinToCelsius(k: number): number {
  return Math.round(k - KELVIN_TO_CELSIUS_DELTA);
}

export function formatTime(timestampSeconds: number, timezoneOffsetSeconds: number): string {
  const date = new Date((timestampSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestampSeconds: number, timezoneOffsetSeconds: number): string {
  const date = new Date((timestampSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function getThemeFromIcon(icon?: string): Theme {
  if (!icon || icon.length < 3) return "day-clear";
  const isNight = icon.endsWith("n");
  const prefix = icon.slice(0, 2);
  if (prefix === "09" || prefix === "10" || prefix === "11") {
    return isNight ? "night-rain" : "day-rain";
  }
  if (prefix === "02" || prefix === "03" || prefix === "04") {
    return isNight ? "night-clouds" : "day-clouds";
  }
  return isNight ? "night-clear" : "day-clear";
}

export function getBackgroundGradient(theme: Theme): string {
  switch (theme) {
    case "day-rain":
      return "linear-gradient(180deg, #4e8cff, #4a5cff)";
    case "day-clouds":
      return "linear-gradient(180deg, #6fb1ff, #7f8cfa)";
    case "night-clear":
      return "linear-gradient(180deg, #0c1445, #20295a)";
    case "night-rain":
      return "linear-gradient(180deg, #141a3b, #28316a)";
    case "night-clouds":
      return "linear-gradient(180deg, #1a2345, #38456b)";
    case "day-clear":
    default:
      return "linear-gradient(180deg, #4facfe, #00f2fe)";
  }
}

export function buildDailyForecast(list: OpenWeatherListItem[], timezoneOffsetSeconds: number): DailySummary[] {
  const groups = new Map<
    string,
    {
      dateKey: string;
      min: number;
      max: number;
      icon: string;
      sampleDt: number;
    }
  >();

  for (const item of list) {
    const localDate = new Date((item.dt + timezoneOffsetSeconds) * 1000);
    const dateKey = localDate.toISOString().slice(0, 10);
    const temp = kelvinToCelsius(item.main.temp);
    const existing = groups.get(dateKey);
    const icon = item.weather[0]?.icon ?? "01d";

    if (!existing) {
      groups.set(dateKey, {
        dateKey,
        min: temp,
        max: temp,
        icon,
        sampleDt: item.dt,
      });
    } else {
      existing.min = Math.min(existing.min, temp);
      existing.max = Math.max(existing.max, temp);
      // Берем "самую близкую к полудню" иконку (приблизительно).
      if (Math.abs(item.dt - 12 * 3600) < Math.abs(existing.sampleDt - 12 * 3600)) {
        existing.icon = icon;
        existing.sampleDt = item.dt;
      }
    }
  }

  const result: DailySummary[] = [];
  for (const [, value] of groups) {
    const label = formatDate(value.sampleDt, timezoneOffsetSeconds);
    result.push({
      dateKey: value.dateKey,
      label,
      min: value.min,
      max: value.max,
      icon: value.icon,
    });
  }

  result.sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
  return result;
}

export type AQIInfo = {
  label: string;
  description: string;
};

export function mapAqi(aqi: number): AQIInfo {
  switch (aqi) {
    case 1:
      return { label: "Отлично", description: "Качество воздуха отличное" };
    case 2:
      return { label: "Хорошо", description: "Качество воздуха хорошее" };
    case 3:
      return { label: "Удовлетворительно", description: "Возможен дискомфорт у чувствительных людей" };
    case 4:
      return { label: "Плохо", description: "Нежелательны длительные прогулки" };
    case 5:
      return { label: "Очень плохо", description: "Лучше оставаться в помещении" };
    default:
      return { label: "Нет данных", description: "Нет информации о качестве воздуха" };
  }
}

export type PollutionEntry = AirPollutionResponse["list"][number];

