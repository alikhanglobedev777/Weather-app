import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fetchAirQuality,
  fetchCurrentByCity,
  fetchCurrentByCoords,
  fetchGeoSuggestions,
  fetchSevenDayForecast,
} from "../utils/weatherApi";

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

function useDebouncedCallback(fn, delay = 300) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [delay, fn]
  );
}

export function WeatherProvider({ children }) {
  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("wa_last_location") || "null")
  );
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [air, setAir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const [weather, airRes, forecastRes] = await Promise.all([
        fetchCurrentByCoords(lat, lon),
        fetchAirQuality(lat, lon),
        fetchSevenDayForecast(lat, lon),
      ]);

      setCurrent(weather);
      setAir(airRes?.list?.[0] ?? null);
      setForecast(forecastRes);

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
      setError("Unable to load weather for this location.");
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
        setError("City not found. Try a more specific search.");
        setLoading(false);
      }
    },
    [fetchWeatherByCoords]
  );

  const rawSuggest = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const results = await fetchGeoSuggestions(query.trim(), 7);
    const uniqueResults = results?.filter(
      (item, index, arr) =>
        arr.findIndex(
          (candidate) =>
            candidate.name === item.name &&
            candidate.country === item.country &&
            candidate.state === item.state
        ) === index
    );

    setSuggestions(
      uniqueResults?.map((item) => ({
        name: item.name,
        state: item.state || "",
        country: item.country || "",
        lat: item.lat,
        lon: item.lon,
      })) ?? []
    );
  }, []);

  const debouncedSuggest = useDebouncedCallback(rawSuggest, 260);

  useEffect(() => {
    const last = JSON.parse(localStorage.getItem("wa_last_location") || "null");

    if (last?.lat && last?.lon) {
      fetchWeatherByCoords(last.lat, last.lon);
      return;
    }

    fetchWeatherByCity("Karachi");
  }, [fetchWeatherByCity, fetchWeatherByCoords]);

  return (
    <WeatherContext.Provider
      value={{
        location,
        current,
        forecast,
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
