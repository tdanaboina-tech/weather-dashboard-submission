# Real-Time Weather Dashboard

## Overview
A responsive Weather Dashboard built with HTML5, CSS3, and Vanilla JavaScript (`fetch` + `async/await`) that retrieves live weather metrics from the public **Open-Meteo REST API** (no API key required).

## Key Features Implemented
- **Asynchronous Fetch API (`async/await`)**: Chains the Open-Meteo Geocoding API and Forecast API to convert city names into coordinates and fetch live weather data.
- **Comprehensive Error Handling**: Handles network failures, non-200 HTTP responses, empty/invalid city searches, and malformed JSON payloads using `try/catch`.
- **Nested JSON Parsing & Dynamic DOM Rendering**: Extracts `current` metrics (`temperature_2m`, `relative_humidity_2m`, `wind_speed_10m`, `apparent_temperature`, `weather_code`) and `current_units` to update the UI dynamically.
- **City Search Functionality**: Allows users to search any global city via form submission.

## How to Run
1. Extract the ZIP archive.
2. Open `index.html` in any modern web browser (or serve via VS Code Live Server).
