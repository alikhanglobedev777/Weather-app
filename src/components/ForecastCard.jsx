// src/components/Forecast/ForecastCard.jsx
import React from "react";
import { IconSun, IconCloud, IconDroplet } from "../utils/icons";
import "./ForecastCard.css";

function dayName(dt) {
  return new Date(dt * 1000).toLocaleDateString(undefined, { weekday: "short" });
}

export default function ForecastCard({ day }) {
  const icon = (day.weather?.[0]?.main || "").toLowerCase();
  const Icon = icon.includes("cloud") ? IconCloud : icon.includes("rain") ? IconDroplet : IconSun;
  const max = Math.round(day.temp.max);
  const min = Math.round(day.temp.min);

  return (
    <div className="fc-card" role="listitem">
      <div className="fc-day">{dayName(day.dt)}</div>
      <div className="fc-icon"><Icon size={34} /></div>
      <div className="fc-temp">{max}° / {min}°</div>
      <div className="fc-desc">{day.weather?.[0]?.main}</div>
    </div>
  );
}
