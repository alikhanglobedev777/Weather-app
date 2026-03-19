import React from "react";
import { useWeather } from "../Context/WeatherContext";
import ForecastCard from "./ForecastCard";
import "./Forecast.css";

export default function Forecast() {
  const { forecast } = useWeather();

  return (
    <section className="info-card forecast-panel">
      <div className="panel-head">
        <p className="panel-kicker">Forecast</p>
        <h3 className="panel-title">Next 7 days</h3>
      </div>

      <div className="forecast-scroll" role="list">
        {forecast?.length ? (
          forecast.map((day, index) => <ForecastCard key={day.dt || index} day={day} />)
        ) : (
          <div className="forecast-empty">Forecast data will appear here after weather loads.</div>
        )}
      </div>
    </section>
  );
}
