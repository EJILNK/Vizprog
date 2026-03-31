import React, { useMemo } from "react";
import type { PollutionEntry } from "../../utils/weather";
import { mapAqi } from "../../utils/weather";
import { styles } from "./styles";

export type AirPollutionBlockProps = {
  pollution?: PollutionEntry | undefined;
};

export const AirPollutionBlock: React.FC<AirPollutionBlockProps> = ({ pollution }) => {
  const pollutionBlock = useMemo(() => {
    if (!pollution) return null;

    const { aqi } = pollution.main;
    const { label, description } = mapAqi(aqi);
    const { pm2_5, pm10 } = pollution.components;

    return (
      <div style={styles.pollutionContainer}>
        <div style={styles.sectionTitle}>Качество воздуха</div>
        <div style={styles.pollutionRow}>
          <div style={styles.pollutionAqi}>{aqi}</div>
          <div>
            <div style={styles.pollutionLabel}>{label}</div>
            <div style={styles.pollutionDescription}>{description}</div>
          </div>
        </div>
        <div style={styles.pollutionChips}>
          <span style={styles.chip}>PM2.5: {pm2_5.toFixed(1)}</span>
          <span style={styles.chip}>PM10: {pm10.toFixed(1)}</span>
        </div>
      </div>
    );
  }, [pollution]);

  return pollutionBlock;
};

