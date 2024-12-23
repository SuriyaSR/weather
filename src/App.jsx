import { useEffect, useState } from 'react'
import './App.css';
import PropTypes from "prop-types";

/*Images*/
import clearIcon from './assets/clear.png';
import cloudIcon from './assets/cloud.png';
import drizzleIcon from './assets/drizzle.png';
import humidityIcon from './assets/humidity.png';
import rainIcon from './assets/rain.png';
import searchIcon from './assets/search.png';
import snowIcon from './assets/snow.png';
import windIcon from './assets/wind.png';
import scatteredCloudsIcon from './assets/scatterdClouds.png';
import thunderIcon from './assets/thunderstorm.png';
import mistIcon from './assets/mist.png';

const WeatherDetails = ({icon, temp, city, country, lat, long, humidity, wind, iconName}) =>{
  return (<>
  <div className='image'>
    <img src={icon} alt="Image" title={iconName}/>
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className="lat">latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="long">longitude</span>
      <span>{long}</span>
    </div>
  </div>
  <div className="data-container">
    <div className="element">
      <img src={humidityIcon} alt="humidity" className="icon" />
      <div className="data">
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>
    <div className="element">
      <img src={windIcon} alt="wind" className="icon" />
      <div className="data">
        <div className="wind-percent">{wind} km/h</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>
  </div>
  </>);
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  iconName: PropTypes.string.isRequired,
}

function App() {  
  let api_key = "788afe1eea13d30b58e822fa9179fffc";
  
  const [text, setText] = useState("London");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [iconName, setIconName] = useState("");

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d" : clearIcon,
    "01n" : clearIcon,
    "02d" : cloudIcon,
    "02n" : cloudIcon,
    "03d" : scatteredCloudsIcon,
    "03n" : scatteredCloudsIcon,
    "04d" : scatteredCloudsIcon,
    "04n" : scatteredCloudsIcon,
    "09d" : drizzleIcon,
    "09n" : drizzleIcon,
    "10d" : rainIcon,
    "10n" : rainIcon,
    "11d" : thunderIcon,
    "11n" : thunderIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
    "50d" : mistIcon,
    "50n" : mistIcon,
  }

  const search = async () => {
    setLoading(true);
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();

      if(data.cod==="404"){
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
      setLong(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
      setIconName((data.weather[0].description).toUpperCase());
    }catch(error){
      console.log("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    }
    finally{
      setLoading(false);
    }
  };
  
  const handleCity =(e) => {
    setText(e.target.value);
  };

  const handleKeyDown =(e) => {
    if(e.key === "Enter"){
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className="cityInput" 
          placeholder="Search City" onChange={handleCity} 
          value={text} onKeyDown={handleKeyDown}/>
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>
        
      
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}
      
      { !loading && !cityNotFound &&
        <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind} iconName={iconName} />
      }
      <p className="copyright">
        Designed By <span>Suriya J</span>
      </p>
      </div>
    </>
  )
}

export default App
