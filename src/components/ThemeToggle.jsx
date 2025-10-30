// src/components/ThemeToggle/ThemeToggle.jsx
import React, { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { useWeather } from "../Context/WeatherContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { fetchWeatherByCoords } = useWeather();
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude, "Your Location");
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve your location.");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="navbar-actions">
      {/* 🌙 / ☀️ Theme toggle */}
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* 📍 Current Location button */}
      <button
        className="location-navbar-btn"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        title="Use current location"
      >
        {isLocating ? "📶" : "📍"}
      </button>
    </div>
  );
}
