import type React from "react";

export const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1c1e26, #111827)",
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    padding: 24,
    color: "#ffffff",
  },
  layout: {
    display: "flex",
    gap: 24,
    maxWidth: 900,
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

