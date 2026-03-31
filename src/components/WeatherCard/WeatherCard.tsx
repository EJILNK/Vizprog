import React from "react";
import type { DailySummary, OpenWeatherListItem } from "../../types/openWeather";
import type { PollutionEntry } from "../../utils/weather";
import { getBackgroundGradient, getThemeFromIcon, kelvinToCelsius, formatDate, formatTime } from "../../utils/weather";
import { ForecastList } from "./ForecastList";
import { AirPollutionBlock } from "./AirPollutionBlock";
import { styles } from "./styles";

export type WeatherCardProps = {
  city: string;
  country: string | undefined;
  current: OpenWeatherListItem;
  timezoneOffset: number;
  daily: DailySummary[];
  pollution?: PollutionEntry | undefined;
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  country,
  current,
  timezoneOffset,
  daily,
  pollution,
}) => {
  const icon = current.weather[0]?.icon ?? "01d";
  const theme = getThemeFromIcon(icon);
  const gradient = getBackgroundGradient(theme);

  const temp = kelvinToCelsius(current.main.temp);
  const feelsLike = kelvinToCelsius(current.main.feels_like);
  const description = current.weather[0]?.description ?? "";
  const dateLabel = formatDate(current.dt, timezoneOffset);
  const timeLabel = formatTime(current.dt, timezoneOffset);

  return (
    <div style={{ ...styles.card, backgroundImage: gradient }}>
      <div style={styles.topSection}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.dateText}>{dateLabel}</div>
            <div style={styles.cityText}>
              {city}
              {country ? `, ${country}` : ""}
            </div>
          </div>
          <div style={styles.timeText}>{timeLabel}</div>
        </div>

        <div style={styles.mainInfoRow}>
          <div>
            <div style={styles.mainTemp}>{temp}°</div>
            <div style={styles.mainDescription}>{description}</div>
            <div style={styles.feelsLikeText}>Ощущается как {feelsLike}°</div>
          </div>
          <div style={styles.iconWrapper}>
            <img style={styles.mainIcon} src={`https://openweathermap.org/img/wn/${icon}@4x.png`} alt={description} />
          </div>
        </div>

        <div style={styles.metricsRow}>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Влажность</div>
            <div style={styles.metricValue}>{current.main.humidity}%</div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Ветер</div>
            <div style={styles.metricValue}>{current.wind.speed.toFixed(1)} м/с</div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Давление</div>
            <div style={styles.metricValue}>{current.main.pressure} гПа</div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Видимость</div>
            <div style={styles.metricValue}>{(current.visibility / 1000).toFixed(1)} км</div>
          </div>
        </div>
      </div>

      <AirPollutionBlock pollution={pollution} />

      <div style={styles.bottomSection}>
        <div style={styles.sectionTitle}>Прогноз на несколько дней</div>
        <ForecastList daily={daily} />
      </div>
    </div>
  );
};

