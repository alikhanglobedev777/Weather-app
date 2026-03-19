import React from "react";
import "./AirQuality.css";
import { useWeather } from "../Context/WeatherContext";

function aqiLabel(aqi) {
  switch (aqi) {
    case 1:
      return { text: "Good", color: "var(--aq-good)" };
    case 2:
      return { text: "Fair", color: "var(--aq-fair)" };
    case 3:
      return { text: "Moderate", color: "var(--aq-moderate)" };
    case 4:
      return { text: "Poor", color: "var(--aq-poor)" };
    case 5:
      return { text: "Very Poor", color: "var(--aq-poor)" };
    default:
      return { text: "Unavailable", color: "var(--text-muted)" };
  }
}

export default function AirQuality() {
  const { air } = useWeather();

  if (!air) {
    return (
      <section className="info-card air-card">
        <div className="panel-head">
          <p className="panel-kicker">Air quality</p>
          <h3 className="panel-title">Waiting for location data</h3>
        </div>
      </section>
    );
  }

  const aqi = air.main?.aqi;
  const pm25 = Math.round(air.components?.pm2_5 ?? 0);
  const pm10 = Math.round(air.components?.pm10 ?? 0);
  const no2 = Math.round(air.components?.no2 ?? 0);
  const label = aqiLabel(aqi);

  return (
    <section className="info-card air-card">
      <div className="panel-head">
        <p className="panel-kicker">Air quality</p>
        <h3 className="panel-title" style={{ color: label.color }}>
          {label.text}
        </h3>
      </div>

      <div className="air-grid">
        <div className="air-metric">
          <span>PM2.5</span>
          <strong>{pm25} ug/m3</strong>
        </div>
        <div className="air-metric">
          <span>PM10</span>
          <strong>{pm10} ug/m3</strong>
        </div>
        <div className="air-metric">
          <span>NO2</span>
          <strong>{no2} ug/m3</strong>
        </div>
      </div>
    </section>
  );
}
