import { useState, useCallback } from 'react';
import axios from 'axios';
import CityData from '../../Types/Types';

const WeatherData = () => {
    const [maxTemperature, setMaxTemperature] = useState<number | null>(null);
    const [minTemperature, setMinTemperature] = useState<number | null>(null);
    const [weatherTime, setWeatherTime] = useState<number | null>(null);

    const fetchWeatherData = useCallback(async (selectCity: CityData | null) => {
        if (selectCity) {
            try {
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${selectCity.lat}&longitude=${selectCity.lng}&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`;
                const response = await axios.get(apiUrl);
                const weatherData = response.data;

                setMaxTemperature(weatherData.daily.temperature_2m_max[0]);
                setMinTemperature(weatherData.daily.temperature_2m_min[0]);
                setWeatherTime(weatherData.daily.time[0]);
                

                localStorage.setItem('lastSelectedCity', JSON.stringify(selectCity));
                localStorage.setItem('maxTemperature', JSON.stringify(weatherData.daily.temperature_2m_max[0]));
                localStorage.setItem('minTemperature', JSON.stringify(weatherData.daily.temperature_2m_min[0]));
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
    }, []);

    return {
        maxTemperature,
        minTemperature,
        weatherTime,
        fetchWeatherData
    };
};

export default WeatherData;
