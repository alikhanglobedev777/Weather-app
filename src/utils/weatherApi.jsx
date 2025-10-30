// ✅ src/utils/weatherApi.js
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "API Error");
  return data;
}

// ✅ Fetch by city name
export async function fetchCurrentByCity(city) {
  const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// ✅ ✅ ✅ Fetch by coordinates (MISSING before!)
export async function fetchCurrentByCoords(lat, lon) {
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// ✅ City search autosuggest
export async function fetchGeoSuggestions(query, limit = 5) {
  if (!query || query.length < 2) return [];
  const url = `${GEOCODE_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  const res = await fetch(url);
  return res.ok ? res.json() : [];
}

// ✅ Optional Air Quality
export async function fetchAirQuality(lat, lon) {
  if (!lat || !lon) return null;
  const url = `${AIR_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  return res.ok ? res.json() : null;
}
