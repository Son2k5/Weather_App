import React, { useState, useEffect } from 'react';

const API_KEY = "be7a52b6e16192505783673c8cee4d16";

function WeatherCard() {
  const [city, setCity] = useState("Hanoi");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect (() => {fetchWeather(city)},[]);


  const fetchWeather = async (cityName) =>{
    try{
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if(!response.ok) throw new Error("City not found");
      const data = await response.json();
      setWeather(data);
      setCity(cityName);
      updateHistory(cityName);
      document.body.style.backgroundImage= `url('https://picsum.photos/seed/${cityName}/1600/900')`;
    }catch(err){
        alert(err.message);
    }
  };
  const fetchMyLocation = ()=>{
    if(!navigator.geolocation){
      alert("Geolocation no supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try{
          const response = await fetch(
             `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
          const data = await response.json();
          setWeather(data);
          setCity(data.name)
          updateHistory(data.name);
          document.body.style.backgroundImage = `url('https://picsum.photos/seed/${data.name}/1600/900')`;
      }catch(err){
        alert("Unable to get weather for your location.");
      }

    });
  }
  const updateHistory =(cityName) =>{
    setHistory((prev) =>{
      const updated = [...new Set([cityName,...prev])].slice(0,5);
      return updated;
    })
  }

  const clearHistory = () => {
    setHistory([]);
  };


  const handleSearch = () =>{
    if(query.trim() !== null){
      fetchWeather(query);
    }
  }
  const handleKeyUp = (e) =>{
    if(e.key === "Enter") handleSearch();
  }

  return(
    <div className='card'>
      <h1 className='title'>Weather App</h1>

      <div className='search'>
        <input type='search' placeholder='Find your city'
                className='search-bar' value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyUp={handleKeyUp} 
        />
        <button onClick={handleSearch}>🔍</button>
        <button onClick={fetchMyLocation}>📍</button>
      </div>


      <div className={`weather ${!weather ? "loading" : ""}`}>
        {weather ? (
          <>
            <h2 className="city">Weather in {weather.name}</h2>
            <h1 className="temp">{weather.main.temp}°C </h1>
            <div className="flex">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt= ""
                  className="icon"
                />
                <div className="description">{weather.weather[0].description}</div>

            </div>
            <div className='other-info'>
                <div className="humidity">Humidity: {weather.main.humidity}%</div>
                <div className="wind">Wind speed: {weather.wind.speed} km/h</div>
            </div>
          </>
        ):(
          <span> LOading ...</span>
        )}
        
      </div>
      {history.length > 0 && (
        <div className="history">
          <h3>Recent Searches</h3>
          <ul>
            {history.map((item, idx) => (
              <li key={idx} onClick={() => fetchWeather(item)}>
                {item}
              </li>
            ))}
          </ul>
          <button onClick={clearHistory}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: 'grey',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.4rem 1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: 'fit-content',
                    textAlign: 'center'
                  }}
          >🗑️ Clear History</button>
        </div>
      )}
    </div>
  );
}
export default WeatherCard;