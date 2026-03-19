import React, { useState } from "react";
import { MapPin, MoonStar, SunMedium } from "lucide-react";
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
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude);
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
      <button className="control-btn" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
        {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
      </button>

      <button
        className="control-btn control-btn-location"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        title="Use current location"
      >
        <MapPin size={18} />
        <span>{isLocating ? "Locating" : "Current"}</span>
      </button>
    </div>
  );
}
