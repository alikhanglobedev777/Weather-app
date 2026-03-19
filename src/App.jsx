import React from "react";
import { WeatherProvider, useWeather } from "./Context/WeatherContext";
import { ThemeProvider } from "./Context/ThemeContext";
import SearchBar from "./components/Searchbar/Searchbar";
import ThemeToggle from "./components/ThemeToggle";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import AirQuality from "./components/AirQuality";

function WeatherDashboard() {
  const { current, error } = useWeather();
  const cityLabel = current?.name || "Your weather hub";
  const summary = current?.weather?.[0]?.description || "Search for any city and explore a fuller forecast view.";
  const temp = Math.round(current?.main?.temp ?? 0);
  const humidity = current?.main?.humidity ?? 0;
  const wind = Math.round(current?.wind?.speed ?? 0);
  const feelsLike = Math.round(current?.main?.feels_like ?? 0);

  return (
    <div className="app-shell">
      <div className="app-glow app-glow-one" />
      <div className="app-glow app-glow-two" />

      <header className="app-header">
        <div>
          <p className="app-eyebrow">Live weather dashboard</p>
          <h1 className="app-title">Weatherly</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="app-main">
        <section className="hero-panel">
          <div className="hero-search">
            <SearchBar />
          </div>

          <div className="hero-body">
            <div className="hero-copy">
              <p className="hero-kicker">{cityLabel}</p>
              <h2 className="hero-title">Compact, clear weather at a glance</h2>
              <p className="hero-text">{summary}</p>
            </div>

            <div className="hero-side">
              <div className="hero-graphic">
                <div className="hero-sun-core" />
                <div className="hero-cloud hero-cloud-one" />
                <div className="hero-cloud hero-cloud-two" />
              </div>

              <div className="hero-metrics">
                <div className="hero-metric">
                  <span>Temp</span>
                  <strong>{current ? `${temp}°C` : "--"}</strong>
                </div>
                <div className="hero-metric">
                  <span>Feels like</span>
                  <strong>{current ? `${feelsLike}°C` : "--"}</strong>
                </div>
                <div className="hero-metric">
                  <span>Humidity</span>
                  <strong>{current ? `${humidity}%` : "--"}</strong>
                </div>
                <div className="hero-metric">
                  <span>Wind</span>
                  <strong>{current ? `${wind} m/s` : "--"}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error ? <div className="status-banner">{error}</div> : null}

        <section className="content-grid">
          <CurrentWeather />
          <AirQuality />
          <Forecast />
        </section>
      </main>

      <footer className="app-foot">
        <small>
          {new Date().getFullYear()} Weatherly. Current weather by OpenWeather, 7-day forecast by Tomorrow.io, geocoding by OpenWeather. Built by{" Ali Khan "}
        </small>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <WeatherDashboard />
      </WeatherProvider>
    </ThemeProvider>
  );
}
