import { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

const API_KEY = "process.env.REACT_APP_WEATHER_API_KEY;";

export default function Weather() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
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
      fetchForecast(city);
    } catch (err) {
      setError("City not found");
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const dailyData = res.data.list.filter((item, index) => index % 8 === 0);
      setForecast(dailyData);
    } catch (err) {
      console.log("Forecast error", err);
    }
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="container mt-3 text-center">
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
      </div>

      {/* MAIN WEATHER DASHBOARD */}
      {weather && (
        <div className="weather-wrapper">
          <div className="weather-card shadow-lg">

            {/* LEFT PANEL */}
            <div className="weather-left">
              <h1>Today</h1>
              <p className="location">📍 {weather.name}</p>

              <img
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="icon"
              />

              <h2>{Math.round(weather.main.temp)}°C</h2>
              <p className="desc">{weather.weather[0].description}</p>
            </div>

            {/* RIGHT PANEL */}
            <div className="weather-right">
              <div className="stats">
                <div><span>Humidity</span><span>{weather.main.humidity}%</span></div>
                <div><span>Wind</span><span>{weather.wind.speed} km/h</span></div>
                <div><span>Pressure</span><span>{weather.main.pressure} mb</span></div>
                <div><span>Feels Like</span><span>{Math.round(weather.main.feels_like)}°C</span></div>
              </div>

              {/* 5-DAY MINI FORECAST */}
              <div className="forecast-row">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p>
                      {new Date(day.dt_txt).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>

                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt="icon"
                    />

                    <p>{Math.round(day.main.temp)}°C</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
