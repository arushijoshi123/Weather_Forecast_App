import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "9f82ecf11410a93e7856d53d49d27aeb";

const getWeatherImage = (description) => {
  switch (description.toLowerCase()) {
    case "clear sky":
      return "/assets/clear.svg";
    case "few clouds":
    case "scattered clouds":
    case "broken clouds":
    case "overcast clouds":
      return "/assets/clouds.svg";
    case "light rain":
      return "/assets/rain.svg";
    case "moderate rain":
    case "heavy intensity rain":
    case "very heavy rain":
      return "/assets/moderate_heavy_rain.svg";
    case "snow":
      return "/assets/snow.svg";
    case "light thunderstorm":
      return "/assets/thunder.svg";
    case "thunderstorm with rain":
      return "/assets/thunder_rain.svg";
    case "haze":
      return "/assets/mist.svg";
    default:
      return "/assets/clear.svg";
  }
};

const Forecast = ({ city, onForecastLoad, unit }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fetchedCityName, setfetchedCityName] = useState([]);
  const [fetchedCountryName, setfetchedCountryName] = useState([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    if (city) {
      fetchFavorites(); // First fetch the favorites list
    }
  }, [city]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3001/favoriteCities");

      setFavorites(response.data);
      setFavoritesLoaded(true);
    } catch (error) {
      console.error("Error fetching favorite cities:", error);
    }
  };

  useEffect(() => {
    if (favoritesLoaded && city) {
      getCityCoordinates(city);
    }
  }, [favoritesLoaded, city, unit]);

  const getCityCoordinates = async (city) => {
    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    try {
      const response = await axios.get(geoApiUrl);
      const data = response.data;
      setfetchedCityName(data[0].name);
      setfetchedCountryName(data[0].country);

      if (data.length > 0) {
        const { lat, lon } = data[0];
        getCurrentWeather(lat, lon);
        getWeatherForecast(lat, lon);

        const cityExists = favorites.some(
          (fav) => fav.name.toLowerCase() === city.toLowerCase()
        );

        if (!cityExists) {
          setTimeout(() => {
            onForecastLoad(city);
          }, 3000);
        }
      } else {
        console.error("City not found");
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  };

  const getCurrentWeather = async (lat, lon) => {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
    try {
      const response = await axios.get(weatherApiUrl);
      setCurrentWeather(response.data);
    } catch (error) {
      console.error("Error fetching current weather:", error);
    }
  };

  const getWeatherForecast = async (lat, lon) => {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
    try {
      const response = await axios.get(forecastApiUrl);
      setForecast(response.data.list);
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    }
  };

  const getTemperature = (temp) => {
    return unit === "metric" ? temp : (temp * 9) / 5 + 32;
  };

  const getTodaysForecast = () => {
    const today = new Date();
    return forecast.filter((item) => {
      const forecastDate = new Date(item.dt * 1000);
      return (
        forecastDate.getFullYear() === today.getFullYear() &&
        forecastDate.getMonth() === today.getMonth() &&
        forecastDate.getDate() === today.getDate()
      );
    });
  };

  const getNextDaysForecastAt11AM = () => {
    const today = new Date();
    return forecast.filter((item) => {
      const forecastDate = new Date(item.dt * 1000);
      return (
        forecastDate.getFullYear() !== today.getFullYear() ||
        forecastDate.getMonth() !== today.getMonth() ||
        (forecastDate.getDate() !== today.getDate() &&
          forecastDate.getHours() === 2)
      );
    });
  };

  return (
    <div className="forecast-outer-div">
      <div className="current-weather-div">
        <h2>
          Current Weather for {fetchedCityName}, {fetchedCountryName}
        </h2>
        {currentWeather && (
          <>
            <p
              style={{
                color: "#353935",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {new Date(currentWeather.dt * 1000).toLocaleDateString()}
              <br></br>
              <span style={{ fontsize: "0.5rem" }}>
                {" "}
                {new Date(currentWeather.dt * 1000).toLocaleString("en-US", {
                  weekday: "long",
                })}
              </span>
            </p>
            <img
              src={getWeatherImage(currentWeather.weather[0].description)}
              alt={currentWeather.weather[0].description}
              className="weather-icon"
            />

            <div className="weather-data">
              <div className="data-left">
                <h2 style={{ fontSize: "1rem", color: "charcoal" }}>
                  Temperature:{" "}
                  {getTemperature(currentWeather.main.temp).toFixed(1)}°
                  {unit === "metric" ? "C" : "F"}
                </h2>

                <p style={{ fontSize: "1rem", color: "charcoal" }}>
                  Humidity: {currentWeather.main.humidity}%
                </p>
              </div>
              <div className="data-right">
                <p style={{ fontSize: "1rem", color: "charcoal" }}>
                  Wind Speed: {currentWeather.wind.speed}{" "}
                  {unit === "metric" ? "m/s" : "mph"}
                </p>

                <p style={{ fontSize: "1rem", color: "charcoal" }}>
                  Pressure: {currentWeather.main.pressure} Pa
                </p>
              </div>{" "}
            </div>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#353935",
              }}
            >
              {" "}
              {currentWeather.weather[0].description}
            </p>
          </>
        )}
      </div>

      <div className="forecast-right-div">
        <h2>Today's Hourly Forecast </h2>
        <div className="hourly-forecast-div">
          {getTodaysForecast().map((item) => (
            <div className="daywise-divs" key={item.dt}>
              <h3>
                {new Date(item.dt * 1000).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              <img
                src={getWeatherImage(item.weather[0].description)}
                alt={item.weather[0].description}
                className="weather-icon"
              />

              <h6>
                {getTemperature(item.main.temp).toFixed(1)}°{" "}
                {unit === "metric" ? "C" : "F"}
                <br></br>
                <p> {item.weather[0].description}</p>
              </h6>
            </div>
          ))}
        </div>

        <h2>Forecast for Next 5 Days</h2>
        <div className="hourly-forecast-div">
          {getNextDaysForecastAt11AM().map((item) => (
            <div className="daywise-divs" key={item.dt}>
              <h3>{new Date(item.dt * 1000).toLocaleDateString()}</h3>
              <p>
                {new Date(item.dt * 1000).toLocaleString("en-US", {
                  weekday: "long",
                })}
              </p>
              <img
                src={getWeatherImage(item.weather[0].description)}
                alt={item.weather[0].description}
                className="weather-icon"
              />
              <h6>
                {getTemperature(item.main.temp).toFixed(1)}°{" "}
                {unit === "metric" ? "C" : "F"}
                <br></br>
                <p>{item.weather[0].description}</p>
              </h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
