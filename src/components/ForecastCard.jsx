import React from "react";
import { Droplets } from "lucide-react";
import { IconCloud, IconDroplet, IconSun } from "../utils/icons";
import "./ForecastCard.css";

function dayName(dt) {
  return new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
  });
}

export default function ForecastCard({ day }) {
  const weather = (day.weather?.[0]?.main || "").toLowerCase();
  const Icon = weather.includes("cloud")
    ? IconCloud
    : weather.includes("rain") || weather.includes("drizzle")
      ? IconDroplet
      : IconSun;

  const max = Math.round(day.temp?.max ?? 0);
  const min = Math.round(day.temp?.min ?? 0);
  const rainChance = Math.round(day.pop ?? 0);

  return (
    <article className="fc-card" role="listitem">
      <div className="fc-top">
        <div className="fc-day">{dayName(day.dt)}</div>
        <div className="fc-icon">
          <Icon size={30} />
        </div>
      </div>

      <div className="fc-temp">{max}°</div>
      <div className="fc-low">Low {min}°</div>
      <div className="fc-desc">{day.weather?.[0]?.description || day.weather?.[0]?.main}</div>

      <div className="fc-rain">
        <Droplets size={14} />
        <span>{rainChance}%</span>
      </div>
    </article>
  );
}
