import React, { useEffect, useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';  // Corrected import

import searchIcon from './assets/search.png';
import clearIcon from './assets/clear.png';
import cloudIcon from './assets/cloud.png';
import drizzleIcon from './assets/drizzle.png';
import rainIcon from './assets/rain.png';
import windIcon from './assets/wind.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.png';

// Rest of your code...


const WeatherDetail = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude:</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">Longitude:</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" className='icon' />
          <div className="wind-percent">{wind} km/hr</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </>
  );
};

WeatherDetail.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired
}

function App() {
  let api_key = 'c33bab6ac3e6571e09f0f85a26414b3e';
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState("0");
  const [lon, setLon] = useState("0");
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define the weather icon map object
  const weatherIconMap = {
    '01d': clearIcon,      // Clear sky (day)
    '01n': clearIcon,      // Clear sky (night)
    '02d': cloudIcon,      // Few clouds (day)
    '02n': cloudIcon,      // Few clouds (night)
    '03d': cloudIcon,      // Scattered clouds (day)
    '03n': cloudIcon,      // Scattered clouds (night)
    '04d': cloudIcon,      // Broken clouds (day)
    '04n': cloudIcon,      // Broken clouds (night)
    '09d': drizzleIcon,    // Shower rain (day)
    '09n': drizzleIcon,    // Shower rain (night)
    '10d': rainIcon,       // Rain (day)
    '10n': rainIcon,       // Rain (night)
    '11d': rainIcon,       // Thunderstorm (day)
    '11n': rainIcon,       // Thunderstorm (night)
    '13d': snowIcon,       // Snow (day)
    '13n': snowIcon,       // Snow (night)
    '50d': windIcon,       // Mist (day)
    '50n': windIcon,       // Mist (night)
  };

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);

      // Set the icon based on the weather icon code from API
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
      setError(null);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An Error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          type="text"
          className='CityInput'
          placeholder='Search City'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className='search-icon' onClick={() => search()}>
          <img src={searchIcon} alt="search" />
        </div>
      </div>

      {loading && <div className='Loading-message'>Loading...</div>}
      {error && <div className='Error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City not found</div>}

      {!loading && !cityNotFound && <WeatherDetail
        icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        lon={lon}
        humidity={humidity}
        wind={wind}
      />}

      <p className='copyright'>
        Designed by <span>Viper</span>
      </p>
    </div>
  );
}

export default App;
