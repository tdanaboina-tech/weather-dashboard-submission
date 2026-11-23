const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const statusMessage = document.getElementById('status-message');
const weatherCard = document.getElementById('weather-card');

const cityNameEl = document.getElementById('city-name');
const conditionEl = document.getElementById('weather-condition');
const tempEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const apparentTempEl = document.getElementById('apparent-temp');
const lastUpdatedEl = document.getElementById('last-updated');

// Map WMO weather codes to human-readable descriptions
const weatherDescriptions = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  71: 'Slight Snowfall',
  73: 'Moderate Snowfall',
  75: 'Heavy Snowfall',
  80: 'Rain Showers',
  95: 'Thunderstorm',
};

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function hideStatus() {
  statusMessage.className = 'status-message hidden';
}

// Step 1: Fetch geographic coordinates from city name
async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error(`Geocoding service error (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
}

// Step 2: Fetch real-time weather metrics using coordinates
async function getWeatherData(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;

  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error(`Weather API error (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.current) {
    throw new Error('Malformed weather data received from server.');
  }

  return data;
}

// Step 3: Render parsed JSON values into the DOM
function renderWeather(location, weatherJson) {
  const current = weatherJson.current;
  const units = weatherJson.current_units;

  cityNameEl.textContent = `${location.name}, ${location.country}`;
  conditionEl.textContent = weatherDescriptions[current.weather_code] || 'Active Weather';
  tempEl.textContent = Math.round(current.temperature_2m);
  humidityEl.textContent = `${current.relative_humidity_2m}${units.relative_humidity_2m}`;
  windSpeedEl.textContent = `${current.wind_speed_10m} ${units.wind_speed_10m}`;
  apparentTempEl.textContent = `${Math.round(current.apparent_temperature)}${units.apparent_temperature}`;

  const formattedTime = new Date(current.time).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  lastUpdatedEl.textContent = `Last updated: ${formattedTime}`;

  hideStatus();
  weatherCard.classList.remove('hidden');
}

// Orchestrate asynchronous API workflow with error handling
async function handleCitySearch(city) {
  weatherCard.classList.add('hidden');
  showStatus(`Fetching live weather for "${city}"...`, 'loading');

  try {
    const location = await getCoordinates(city);
    const weatherJson = await getWeatherData(location.latitude, location.longitude);
    renderWeather(location, weatherJson);
  } catch (error) {
    console.error('Weather Dashboard Error:', error);
    showStatus(error.message || 'Unable to fetch weather data. Check your network connection.', 'error');
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    handleCitySearch(query);
  }
});

// Load default city on initial page load
window.addEventListener('DOMContentLoaded', () => {
  handleCitySearch('Hyderabad');
});
