import React from "react";
import type { ChangeEvent } from "react";
import type { City } from "../../types/openWeather";
import { styles } from "./styles";

export type CitySearchProps = {
  query: string;
  cities: City[];
  selectedCity: City | null;
  loading: boolean;
  error: string | null;
  showInitialHint: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSelectCity: (city: City) => void;
};

export const CitySearch: React.FC<CitySearchProps> = ({
  query,
  cities,
  selectedCity,
  loading,
  error,
  showInitialHint,
  onQueryChange,
  onSearch,
  onSelectCity,
}) => {
  return (
    <div style={styles.controlsCard}>
      <div>
        <div style={styles.sectionTitle}>Выбор города</div>
        <div style={styles.label}>Введите название города (по-английски)</div>
        <input
          style={styles.input}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
          placeholder="Например, Moscow"
        />
        <button
          type="button"
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          disabled={loading}
          onClick={onSearch}
        >
          {loading ? "Загрузка..." : "Найти город"}
        </button>
      </div>

      {error && <div style={styles.errorText}>{error}</div>}

      {cities.length > 0 && (
        <div>
          <div style={{ ...styles.sectionTitle, marginTop: 8 }}>Найденные варианты</div>
          <div style={styles.citiesList}>
            {cities.map((c) => {
              const active = selectedCity && c.lat === selectedCity.lat && c.lon === selectedCity.lon;
              return (
                <div
                  key={`${c.name}-${c.lat}-${c.lon}`}
                  style={{ ...styles.cityItem, ...(active ? styles.cityItemActive : {}) }}
                  onClick={() => onSelectCity(c)}
                >
                  {c.name}
                  {c.country ? `, ${c.country}` : ""} ({c.lat.toFixed(2)}, {c.lon.toFixed(2)})
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showInitialHint && <div style={styles.muted}>Введите город и нажмите «Найти город», чтобы увидеть прогноз на несколько дней и качество воздуха.</div>}
    </div>
  );
};

