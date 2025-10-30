import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  fetchGeoSuggestions,
  fetchCurrentByCity,
  fetchCurrentByCoords,
  fetchAirQuality,
} from "../utils/weatherApi";

const WeatherContext = createContext();
export const useWeather = () => useContext(WeatherContext);

function useDebouncedCallback(fn, delay = 300) {
  const timeoutRef = useRef(null);
  return (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  };
}

export function WeatherProvider({ children }) {
  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("wa_last_location") || "null")
  );
  const [current, setCurrent] = useState(null);
  const [air, setAir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ REAL fixed: fetch by coordinates from OpenWeather directly
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const weather = await fetchCurrentByCoords(lat, lon);
      const airRes = await fetchAirQuality(lat, lon);
console.log("Weather data response:", weather);

      setCurrent(weather);
      setAir(airRes?.list?.[0] ?? null);

      const locObj = {
        name: weather.name,
        country: weather.sys?.country,
        lat,
        lon,
      };
      setLocation(locObj);
      localStorage.setItem("wa_last_location", JSON.stringify(locObj));
    } catch (err) {
      console.error(err);
      setError("Unable to load location weather");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Search button behavior fixed
  const fetchWeatherByCity = useCallback(
    async (city) => {
      if (!city) return;

      try {
        setLoading(true);
        setError(null);

        const weather = await fetchCurrentByCity(city);
        const { lat, lon } = weather.coord;

        await fetchWeatherByCoords(lat, lon);
      } catch (err) {
        console.error(err);
        setError("City not found");
      } finally {
        setLoading(false);
      }
    },
    [fetchWeatherByCoords]
  );

  const rawSuggest = useCallback(async (q) => {
    if (!q || q.length < 2) return setSuggestions([]);

    const results = await fetchGeoSuggestions(q, 6);

    setSuggestions(
      results?.map((r) => ({
        name: r.name,
        state: r.state || "",
        country: r.country || "",
        lat: r.lat,
        lon: r.lon,
      })) ?? []
    );
  }, []);

  const debouncedSuggest = useDebouncedCallback(rawSuggest, 300);

  useEffect(() => {
    const last = JSON.parse(localStorage.getItem("wa_last_location"));
    if (last?.lat && last?.lon) {
      fetchWeatherByCoords(last.lat, last.lon);
    }
  }, [fetchWeatherByCoords]);

  return (
    <WeatherContext.Provider
      value={{
        location,
        current,
        air,
        loading,
        error,
        suggestions,
        fetchWeatherByCity,
        fetchWeatherByCoords,
        debouncedSuggest,
        setSuggestions,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
