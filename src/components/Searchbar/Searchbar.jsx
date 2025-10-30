import React, { useState, useRef, useEffect } from "react";
import { useWeather } from "../../Context/WeatherContext";
import Suggestions from "./Suggestion";
import "./Searchbar.css";

export default function SearchBar() {
  const { debouncedSuggest, suggestions, setSuggestions, fetchWeatherByCity } = useWeather();

  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef();

  useEffect(() => {
    return () => setSuggestions([]);
  }, [setSuggestions]);

  const onChange = (e) => {
    const val = e.target.value;
    setQ(val);
    debouncedSuggest(val);
  };

  const handleSelect = (item) => {
    fetchWeatherByCity(item.name);
    setQ("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleSearch = () => {
    if (!q.trim()) return;
    fetchWeatherByCity(q.trim());
    setSuggestions([]);
    setActiveIndex(-1);
    setQ("");
  };

  const onKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown")
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    else if (e.key === "ArrowUp")
      setActiveIndex((i) => Math.max(i - 1, 0));
    else if (e.key === "Enter") {
      e.preventDefault();
      const sel = activeIndex >= 0 ? suggestions[activeIndex] : null;
      if (sel) handleSelect(sel);
      else handleSearch();
    }
  };

  return (
    <div className="searchbar">
      <input
        ref={inputRef}
        className="searchbar-input"
        value={q}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Search city (e.g. Karachi, London)..."
        aria-label="Search city"
      />
      <button className="searchbar-btn" onClick={handleSearch}>
        Search
      </button>

      <Suggestions
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}
const handleVoiceSearch = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported!");
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const query = event.results[0][0].transcript;
    setQuery(query);
    fetchWeather(query);
  };
};
