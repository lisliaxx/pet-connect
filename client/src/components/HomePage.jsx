import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import '../style/home.css';

function HomePage() {
  const { user, isAuthenticated } = useAuth0();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('Vancouver');

  useEffect(() => {
    const fetchWeather = async () => {
      const options = {
        method: 'GET',
        url: 'https://yahoo-weather5.p.rapidapi.com/weather',
        params: {
          location: location,
          format: 'json',
          u: 'f' 
        },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setWeather(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [location]); 
  
  return (
    <div className="home-background">
      <div className="home-container">
        {isAuthenticated ? (
          <>
            <h2 className='welcome'>Welcome back, {user.name}! Here's today's weather...</h2>
              <div>
      {weather && (
        <div>
          <h4 className='weather'>Weather in {location}</h4>
          <h4 className='weather'>Current Condition: {weather.current_observation.condition.text}</h4>
          <h4 className='weather'>Temperature: {weather.current_observation.condition.temperature}°F</h4>
        </div>
        )}
      </div>
          </>
        ) : (
          <p>Discover the perfect buddy for your pet. Join our community now!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
