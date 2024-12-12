import React, { useEffect, useState } from 'react';
import axios from "axios";
import './index.scss';

const Home = () => {
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const API_KEY = "9589fed1e485f8c0b62e0f328612ccaf";

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, () => {
            setError("Unable to retrieve location.");
        });
    }, []);

    const fetchWeatherByCity = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
                setWeatherData(response.data);
                setError("");
            } catch (err) {
                setError("City not found. Please try again.");
            }
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            setWeatherData(response.data);
            setError("");
        } catch (error) {
            setError("Coordinates are not found");
        }
    };

    return (
        <div className='main'>
            <h1>Weather Information</h1>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={fetchWeatherByCity} 
                />
                <button onClick={fetchWeatherByCity}>
                    <i className="fa-solid fa-magnifying-glass fa-lg" style={{ color: "#74C0FC" }}></i>
                </button>
            </div>

            {error && <p className='error'>{error}</p>}

            {weatherData && (
                <div className='weather'>
                    <h2>{weatherData.name}</h2>
                    <p>Temperature: {(weatherData.main.temp).toFixed(0)}°C</p>
                    <p>Weather Conditions: {weatherData.weather[0].description}</p>
                    <p>Humidity: {(weatherData.main.humidity).toFixed(0)}%</p>
                    <p>Wind Speed: {(weatherData.wind.speed * 3.6).toFixed(0)} km/h</p>
                </div>
            )}
        </div>
    );
};

export default Home;
