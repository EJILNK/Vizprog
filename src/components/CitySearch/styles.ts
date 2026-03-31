import type React from "react";

export const styles: { [key: string]: React.CSSProperties } = {
  controlsCard: {
    width: 320,
    padding: 24,
    borderRadius: 32,
    background: "rgba(15, 23, 42, 0.9)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.55)",
    backdropFilter: "blur(24px)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.9,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    opacity: 0.9,
  },
  input: {
    marginTop: 4,
    width: "100%",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.6)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#e5e7eb",
    fontSize: 14,
    outline: "none",
  },
  smallHint: {
    marginTop: 4,
    fontSize: 11,
    color: "#9ca3af",
  },
  button: {
    marginTop: 8,
    width: "100%",
    borderRadius: 999,
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #4f46e5, #6366f1)",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "default",
  },
  citiesList: {
    marginTop: 8,
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    maxHeight: 170,
    overflowY: "auto",
  },
  cityItem: {
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: 14,
  },
  cityItemActive: {
    background: "rgba(79, 70, 229, 0.7)",
  },
  muted: {
    fontSize: 13,
    color: "#9ca3af",
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: "#fecaca",
  },
};

