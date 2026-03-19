import React from "react";
import { Droplets, Gauge, Eye, Wind } from "lucide-react";
import { useWeather } from "../Context/WeatherContext";
import { IconCloud, IconDroplet, IconMoon, IconSun } from "../utils/icons";
import "./CurrentWeather.css";

function formatTime(timestamp, timezoneShift = 0) {
  if (!timestamp) return "--";

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date((timestamp + timezoneShift) * 1000));
}

export default function CurrentWeather() {
  const { current, location, loading } = useWeather();

  if (loading && !current) {
    return <section className="current-card current-card-empty">Loading weather...</section>;
  }

  if (!current) {
    return (
      <section className="current-card current-card-empty">
        Search for a city to see current conditions, local details, and the next 7 days.
      </section>
    );
  }

  const temp = Math.round(current.main?.temp ?? 0);
  const feelsLike = Math.round(current.main?.feels_like ?? 0);
  const desc = current.weather?.[0]?.description || "";
  const humidity = current.main?.humidity ?? 0;
  const wind = Math.round(current.wind?.speed ?? 0);
  const pressure = current.main?.pressure ?? 0;
  const visibility = Math.round((current.visibility ?? 0) / 1000);
  const currentTime = current.dt ?? 0;
  const sunrise = current.sys?.sunrise ?? 0;
  const sunset = current.sys?.sunset ?? 0;
  const timezoneShift = current.timezone ?? 0;
  const isDay = currentTime >= sunrise && currentTime < sunset;

  const mainWeather = current.weather?.[0]?.main?.toLowerCase() || "";
  let IconComp = isDay ? IconSun : IconMoon;
  let iconClass = isDay ? "sun-icon" : "moon-icon";

  if (mainWeather.includes("cloud")) {
    IconComp = IconCloud;
    iconClass = "";
  } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
    IconComp = IconDroplet;
    iconClass = "";
  }

  return (
    <section className="current-card">
      <div className="current-top">
        <div>
          <p className="current-label">Current weather</p>
          <h3 className="current-location">
            {location?.name ? `${location.name}, ${location.country || ""}` : "Unknown location"}
          </h3>
          <p className="current-desc">{desc}</p>
        </div>

        <div className="current-icon-wrap">
          <IconComp size={74} className={iconClass} />
        </div>
      </div>

      <div className="current-temp-row">
        <div className="current-temp">{temp}°</div>
        <div className="current-temp-meta">
          <span>Feels like {feelsLike}°C</span>
          <span>Sunrise {formatTime(sunrise, timezoneShift)}</span>
          <span>Sunset {formatTime(sunset, timezoneShift)}</span>
        </div>
      </div>

      <div className="current-stats">
        <div className="current-stat">
          <Droplets size={18} />
          <div>
            <strong>{humidity}%</strong>
            <span>Humidity</span>
          </div>
        </div>

        <div className="current-stat">
          <Wind size={18} />
          <div>
            <strong>{wind} m/s</strong>
            <span>Wind</span>
          </div>
        </div>

        <div className="current-stat">
          <Gauge size={18} />
          <div>
            <strong>{pressure} hPa</strong>
            <span>Pressure</span>
          </div>
        </div>

        <div className="current-stat">
          <Eye size={18} />
          <div>
            <strong>{visibility} km</strong>
            <span>Visibility</span>
          </div>
        </div>
      </div>
    </section>
  );
}
