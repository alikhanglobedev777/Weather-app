// src/components/CurrentWeather/CurrentWeather.jsx
import React from "react";
import { useWeather } from "../Context/WeatherContext";
import {
  IconSun,
  IconMoon,
  IconCloud,
  IconDroplet,
  IconWind,
} from "../utils/icons";
import "./CurrentWeather.css";

export default function CurrentWeather() {
  const { current, location, loading } = useWeather();

  if (loading && !current) {
    return <div className="cw-card cw-loading">Loading...</div>;
  }

  if (!current) {
    return (
      <div className="cw-card cw-empty">
        Search a city or allow location
      </div>
    );
  }

  const temp = Math.round(current.main?.temp ?? 0);
  const desc = current.weather?.[0]?.description || "";
  const humidity = current.main?.humidity ?? 0;
  const wind = current.wind?.speed ?? 0;

  const currentTime = current.dt ?? 0;
  const sunrise = current.sys?.sunrise ?? 0;
  const sunset = current.sys?.sunset ?? 0;
  const isDay = currentTime >= sunrise && currentTime < sunset;

  const mainWeather = current.weather?.[0]?.main?.toLowerCase() || "";
  let IconComp;
  let iconClass = "";

  if (mainWeather.includes("cloud")) {
    IconComp = IconCloud;
  } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
    IconComp = IconDroplet;
  } else {
    IconComp = isDay ? IconSun : IconMoon;
    iconClass = isDay ? "sun-icon" : "moon-icon";
  }

  return (
    <div className="cw-card">
      <div className="cw-main">
        <div className="cw-icon">
          <IconComp size={68} className={iconClass} />
        </div>
        <div className="cw-temp">{temp}°C</div>
      </div>

      <div className="cw-desc">{desc}</div>

      <div className="cw-location">
        {location?.name
          ? `${location.name}, ${location.country || ""}`
          : "Unknown location"}
      </div>

      <div className="cw-stats">
        <div className="cw-index-row">
          <IconDroplet /> <span>{humidity}%</span>
          <small>Humidity</small>
        </div>
        <div className="cw-index-row">
          <IconWind /> <span>{wind} m/s</span>
          <small>Wind</small>
        </div>
      </div>
    </div>
  );
}
