import React from "react";
import { motion } from "framer-motion";
import { useWeather } from "../Context/WeatherContext";
import ForecastCard from "./ForecastCard";
import "./Forecast.css";

export default function Forecast() {
  const { forecast } = useWeather();

  if (!forecast || forecast.length === 0) return null;

  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // delay between each card
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="forecast-wrap"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <h3 className="forecast-title">7-Day Forecast</h3>

      <motion.div
        className="forecast-scroll"
        role="list"
        variants={containerVariants}
      >
        {forecast.map((day, idx) => (
          <motion.div key={day.dt || idx} variants={cardVariants}>
            <ForecastCard day={day} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
