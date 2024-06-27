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
    const { maxTemperature, minTemperature, weatherTime, fetchWeatherData } = WeatherData();

    useEffect(() => {
        const lastSelectedCity = localStorage.getItem('lastSelectedCity');
        const storedMaxTemperature = localStorage.getItem('maxTemperature');
        const storedMinTemperature = localStorage.getItem('minTemperature');

        if (lastSelectedCity) {
            const city = JSON.parse(lastSelectedCity);
            setSelectedCity(city);
            if (storedMaxTemperature) {
                fetchWeatherData(city);
            }
            if (storedMinTemperature) {
                fetchWeatherData(city);
            }
        }
    }, [fetchWeatherData]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedCity) {
                fetchWeatherData(selectedCity);
            }
        }, 1 * 60 * 1000);

        return () => clearInterval(interval);
    }, [fetchWeatherData, selectedCity]);

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
    };

    useEffect(() => {
        const selectedCityIndex = localStorage.getItem('selectedCityIndex');
        if (selectedCityIndex !== null) {
            setSelectedCity(data[Number(selectedCityIndex)]);
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
                    onClick={() => fetchWeatherData(selectedCity)}
                    sx={{ marginTop: "4px" }}>
                    Get Weather
                </Button>
                {maxTemperature !== null && minTemperature !== null && (
                    <div className="weather-info">
                        <Typography variant="h5">Weather Forecast for {selectedCity?.city}</Typography>
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
