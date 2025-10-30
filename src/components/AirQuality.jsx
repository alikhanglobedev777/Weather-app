// src/components/AirQuality/AirQuality.jsx
import React from "react";
import { useWeather } from "../Context/WeatherContext";
import "./AirQuality.css";

function aqiLabel(aqi) {
  // OpenWeather: 1 Good -> 5 Very Poor
  switch (aqi) {
    case 1: return { txt: "Good", color: "var(--good)" };
    case 2: return { txt: "Fair", color: "var(--ok)" };
    case 3: return { txt: "Moderate", color: "var(--warn)" };
    case 4: return { txt: "Poor", color: "var(--bad)" };
    case 5: return { txt: "Very Poor", color: "var(--bad)" };
    default: return { txt: "N/A", color: "var(--muted)" };
  }
}

export default function AirQuality() {
  const { air } = useWeather();
  if (!air) return null;

  const aqi = air.main?.aqi;
  const pm2_5 = air.components?.pm2_5;
  const label = aqiLabel(aqi);

  return (
    <div className="aq-card">
      <div className="aq-left">
        <div className="aq-title">Air Quality</div>
        <div className="aq-aqi" style={{ color: label.color }}>{label.txt}</div>
      </div>
      <div className="aq-right">
        <div className="aq-row"><span>PM2.5</span><strong>{pm2_5 ?? "—"} μg/m³</strong></div>
      </div>
    </div>
  );
}
