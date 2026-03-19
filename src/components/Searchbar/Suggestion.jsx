import React from "react";
import { MapPin } from "lucide-react";
import "./Searchbar.css";

export default function Suggestions({
  suggestions,
  activeIndex,
  onSelect,
  setActiveIndex,
}) {
  if (!suggestions?.length) return null;

  return (
    <ul className="suggestions-list" role="listbox">
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion.lat}-${suggestion.lon}-${index}`}
          className={`suggestion-item ${index === activeIndex ? "active" : ""}`}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(suggestion);
          }}
          role="option"
          aria-selected={index === activeIndex}
        >
          <div className="suggestion-copy">
            <span className="suggestion-main">{suggestion.name}</span>
            <span className="suggestion-meta">
              {[suggestion.state, suggestion.country].filter(Boolean).join(", ")}
            </span>
          </div>

          <span className="suggestion-pin">
            <MapPin size={14} />
          </span>
        </li>
      ))}
    </ul>
  );
}
