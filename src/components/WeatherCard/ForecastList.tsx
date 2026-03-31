import React from "react";
import type { DailySummary } from "../../types/openWeather";
import { styles } from "./styles";

export type ForecastListProps = {
  daily: DailySummary[];
};

export const ForecastList: React.FC<ForecastListProps> = ({ daily }) => {
  return (
    <div>
      {daily.map((day) => (
        <div key={day.dateKey} style={styles.dailyRow}>
          <div style={styles.dailyDate}>{day.label}</div>
          <div style={styles.dailyRight}>
            <img
              style={styles.dailyIcon}
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.label}
            />
            <div style={styles.dailyTemps}>
              <span>{day.max}°</span>
              <span style={styles.dailyMinTemp}>{day.min}°</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

