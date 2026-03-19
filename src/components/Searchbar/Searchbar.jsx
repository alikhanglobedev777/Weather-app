import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { useWeather } from "../../Context/WeatherContext";
import Suggestions from "./Suggestion";
import "./Searchbar.css";

export default function SearchBar() {
  const {
    debouncedSuggest,
    suggestions,
    setSuggestions,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    loading,
  } = useWeather();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSuggestions]);

  const onChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setActiveIndex(-1);
    debouncedSuggest(value);
  };

  const handleSelect = async (item) => {
    await fetchWeatherByCoords(item.lat, item.lon);
    setQuery(`${item.name}${item.state ? `, ${item.state}` : ""}`);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    await fetchWeatherByCity(trimmed);
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
      return;
    }

    if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = activeIndex >= 0 ? suggestions[activeIndex] : null;

      if (selected) {
        handleSelect(selected);
        return;
      }

      handleSearch();
    }
  };

  return (
    <div className="search-shell" ref={rootRef}>
      <div className="searchbar">
        <div className="searchbar-icon">
          <Search size={18} />
        </div>

        <input
          className="searchbar-input"
          value={query}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Search city, country, or region"
          aria-label="Search city"
        />

        {query ? (
          <button className="searchbar-clear" type="button" onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </button>
        ) : null}

        <button className="searchbar-btn" type="button" onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="search-hint">
        <MapPin size={14} />
        <span>Pick a suggestion for more accurate results.</span>
      </div>

      <Suggestions
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}
