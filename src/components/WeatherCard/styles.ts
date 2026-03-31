import type React from "react";

export const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: 360,
    borderRadius: 36,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
    color: "#ffffff",
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  bottomSection: {
    marginTop: 16,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dateText: {
    fontSize: 16,
    opacity: 0.9,
  },
  cityText: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: 600,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 500,
  },
  mainInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  mainTemp: {
    fontSize: 56,
    fontWeight: 700,
  },
  mainDescription: {
    fontSize: 18,
    textTransform: "capitalize",
  },
  feelsLikeText: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.9,
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainIcon: {
    width: 120,
    height: 120,
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 8,
    marginTop: 8,
  },
  metricItem: {
    background: "rgba(15, 23, 42, 0.25)",
    borderRadius: 16,
    padding: "8px 10px",
  },
  metricLabel: {
    fontSize: 11,
    opacity: 0.8,
  },
  metricValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.9,
    marginBottom: 6,
  },
  dailyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  dailyDate: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  dailyRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  dailyIcon: {
    width: 38,
    height: 38,
  },
  dailyTemps: {
    display: "flex",
    gap: 8,
    fontSize: 14,
  },
  dailyMinTemp: {
    opacity: 0.8,
  },
  pollutionContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.3)",
  },
  pollutionRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  pollutionAqi: {
    width: 40,
    height: 40,
    borderRadius: 20,
    border: "2px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },
  pollutionLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  pollutionDescription: {
    fontSize: 12,
    opacity: 0.9,
  },
  pollutionChips: {
    marginTop: 8,
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  chip: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.35)",
  },
};

