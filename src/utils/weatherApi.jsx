const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "API Error");
  return data;
}

export async function fetchCurrentByCity(city) {
  const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchCurrentByCoords(lat, lon) {
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchGeoSuggestions(query, limit = 5) {
  if (!query || query.length < 2) return [];
  const url = `${GEOCODE_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  const res = await fetch(url);
  return res.ok ? res.json() : [];
}

export async function fetchAirQuality(lat, lon) {
  if (!lat || !lon) return null;
  const url = `${AIR_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}

function weatherCodeToSummary(code) {
  if ([0].includes(code)) return { main: "Clear", description: "clear sky" };
  if ([1, 2].includes(code)) return { main: "Partly Cloudy", description: "partly cloudy" };
  if ([3].includes(code)) return { main: "Cloudy", description: "overcast clouds" };
  if ([45, 48].includes(code)) return { main: "Fog", description: "foggy" };
  if ([51, 53, 55, 56, 57].includes(code)) return { main: "Drizzle", description: "light drizzle" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { main: "Rain", description: "rain showers" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { main: "Snow", description: "snow showers" };
  if ([95, 96, 99].includes(code)) return { main: "Storm", description: "thunderstorm" };
  return { main: "Clear", description: "clear sky" };
}

export async function fetchSevenDayForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: "auto",
    forecast_days: "7",
    daily:
      "weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  const data = await handleResponse(res);
  const daily = data?.daily;

  if (!daily?.time?.length) return [];

  return daily.time.map((time, index) => {
    const dt = Math.floor(new Date(time).getTime() / 1000);
    const summary = weatherCodeToSummary(daily.weathercode?.[index]);

    return {
      dt,
      temp: {
        max: daily.temperature_2m_max?.[index],
        min: daily.temperature_2m_min?.[index],
      },
      pop: daily.precipitation_probability_max?.[index] ?? 0,
      weather: [
        {
          main: summary.main,
          description: summary.description,
        },
      ],
    };
  });
}
