// src/App.jsx
import React from "react";
import  {WeatherProvider}  from "./Context/WeatherContext";
import  {ThemeProvider } from "./Context/ThemeContext";
import SearchBar from "./components/Searchbar/Searchbar";
import ThemeToggle from "./components/ThemeToggle";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import AirQuality from "./components/AirQuality";
import "./App.css";

export default function App(){
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="app-shell">
          <header className="app-header">
            <h1 className="app-title">Weatherly</h1>
            <ThemeToggle />
          </header>

          <main className="app-main">
            <SearchBar />
            <CurrentWeather />
            <AirQuality />
            <Forecast />
          </main>

    <footer className="app-foot">
  <small className="footer-content">
    <span className="footer-icon" role="img" aria-label="weather">
      🌤️
    </span>
    &copy; {new Date().getFullYear()} Weatherly • Weather data by{" "}
    <a
      href="https://openweathermap.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Weathrely
    </a>{" "}
    • Built with Vite & React
  </small>
</footer>


        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
}
