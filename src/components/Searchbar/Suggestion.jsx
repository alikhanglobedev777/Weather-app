import React from "react";
import "./Searchbar.css";

export default function Suggestions({
  suggestions,
  activeIndex,
  onSelect,
  setActiveIndex,
}) {
  if (!suggestions?.length) return null;

  return (
    <ul className="suggestions-list visible">
      {suggestions.map((s, idx) => (
        <li
          key={`${s.lat}-${s.lon}-${idx}`}
          className={`suggestion-item ${idx === activeIndex ? "active" : ""}`}
          onMouseEnter={() => setActiveIndex(idx)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(s);
          }}
        >
          <span className="suggestion-main">
            {s.name}
            {s.state ? `, ${s.state}` : ""}
          </span>
          <span className="suggestion-country">{s.country}</span>
        </li>
      ))}
    </ul>
  );
}
