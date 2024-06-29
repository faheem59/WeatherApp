import { useEffect, useState, useMemo } from 'react';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import data from "../data.json";
import CityData from '../Types/Types';
import WeatherData from './apiData/WeatherData';
import CloudIcon from '@mui/icons-material/Cloud';
import "../App.css"

const WeatherPage = () => {
    const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
    const [displayCity, setDisplayCity] = useState<CityData | null>(null);
    const { maxTemperature, minTemperature, weatherTime, fetchWeatherData } = WeatherData();

    useEffect(() => {
        const lastSelectedCity = localStorage.getItem('lastSelectedCity');
        if (lastSelectedCity) {
            const city: CityData = JSON.parse(lastSelectedCity);
            setSelectedCity(city);
            setDisplayCity(city);
            fetchWeatherData(city);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (displayCity) {
                console.log('1114', displayCity);
                fetchWeatherData(displayCity);

            }
        }, 10 * 1000);

        return () => clearInterval(interval);
    }, []);

    const averageTemperature = useMemo(() => {
        if (maxTemperature !== null && minTemperature !== null) {
            return (maxTemperature + minTemperature) / 2;
        }
        return null;
    }, [maxTemperature, minTemperature]);

    const handleCityChange = (event: SelectChangeEvent<number>) => {
        const cityIndex = Number(event.target.value);
        const city = data[cityIndex];
        setSelectedCity(city);
        localStorage.setItem('selectedCityIndex', JSON.stringify(cityIndex));
        localStorage.setItem('lastSelectedCity', JSON.stringify(city));
    };

    const handleGetWeather = () => {
        if (selectedCity) {
            setDisplayCity(selectedCity);
            fetchWeatherData(selectedCity);
        }
    };

    useEffect(() => {
        const selectedCityIndex = localStorage.getItem('selectedCityIndex');
        if (selectedCityIndex !== null) {
            const cityIndex = Number(selectedCityIndex);
            const city = data[cityIndex];
            setSelectedCity(city);
            setDisplayCity(city);
        }
    }, []);

    return (
        <>
            <div className="weather-container">
                <FormControl fullWidth>
                    <InputLabel>Select City</InputLabel>
                    <Select
                        value={selectedCity ? data.indexOf(selectedCity) : ''}
                        onChange={handleCityChange}
                        label="Select City"
                    >
                        {data.map((city, index) => (
                            <MenuItem key={index} value={index}>{city.city}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained"
                    onClick={handleGetWeather}
                    sx={{ marginTop: "2px" }}>
                    Get Weather
                </Button>
                {displayCity && maxTemperature !== null && minTemperature !== null && (
                    <div className="weather-info">
                        <Typography variant="h5">Weather Forecast for {displayCity.city}</Typography>
                        <CloudIcon className="cloud-icon" />
                        <Typography>Weather Time: {weatherTime}</Typography>
                        <Typography>Max Temperature: {maxTemperature} °C</Typography>
                        <Typography>Min Temperature: {minTemperature} °C</Typography>
                        <Typography>Average Temperature: {averageTemperature !== null ? averageTemperature.toFixed(2) : "N/A"} °C</Typography>
                    </div>
                )}
            </div>
        </>
    );
};

export default WeatherPage;
