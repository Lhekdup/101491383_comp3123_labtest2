import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "b2d23b9f2394055be5f6bcc795cd55c6";

export default function Weather() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setError("");
    } catch (err) {
      setError("City not found");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 text-center shadow">
        <h2 className="mb-3">🌤 Weather App</h2>

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="btn btn-primary mb-3" onClick={fetchWeather}>
          Search
        </button>

        {error && <p className="text-danger">{error}</p>}

        {weather && (
          <>
            <h3>{weather.name}</h3>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <h4>{weather.main.temp}°C</h4>
            <p>{weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>
          </>
        )}
      </div>
    </div>
  );
}
