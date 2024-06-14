document.getElementById('get-weather-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value.trim(); // Trim whitespace
    if (city) {
        showLoadingSpinner(); // Show loading spinner while fetching

        // Simulate a 1-second loading time before fetching data
        setTimeout(() => {
            fetchWeatherData(city)
                .then(data => {
                    displayWeatherData(data);
                    updateBackground(data.weather[0].main); // Update background based on weather condition
                    return fetchWeeklyForecast(city);
                })
                .then(data => {
                    displayWeeklyForecast(data);
                    hideLoadingSpinner(); // Hide loading spinner on success
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('An error occurred while fetching the weather data. Please try again later.');
                    hideLoadingSpinner(); // Hide loading spinner on error
                });
        }, 1000); 
    } else {
        alert('Please enter a city name.');
    }
});

function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideLoadingSpinner() {
    // Ensure loading spinner is hidden
    setTimeout(() => {
        document.getElementById('loading-spinner').style.display = 'none';
    }, 1000); 
}

function fetchWeatherData(city) {
    const apiKey = '52d99d543e70035f1c59afe2fc72c449';  // Your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    console.log(`Fetching daily weather data from: ${apiUrl}`);

    return fetch(apiUrl)
        .then(response => {
            console.log('Daily weather response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

function fetchWeeklyForecast(city) {
    const apiKey = '52d99d543e70035f1c59afe2fc72c449';  // Your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    console.log(`Fetching weekly forecast data from: ${apiUrl}`);

    return fetch(apiUrl)
        .then(response => {
            console.log('Weekly forecast response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weather-display');
    let tempCelsius = data.main.temp; // Ensure temp is numeric

    // Convert temp to number if it's not already
    tempCelsius = typeof tempCelsius === 'number' ? tempCelsius : parseFloat(tempCelsius);

    // Convert Celsius to Fahrenheit and round to nearest whole number
    const tempFahrenheit = Math.round((tempCelsius * 9/5) + 32);

    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

    weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p>${tempFahrenheit}°F</p>
        <p>${description}</p>
        <img src="${iconUrl}" alt="Weather icon">
    `;
}

function displayWeeklyForecast(data) {
    const weeklyForecast = document.getElementById('weekly-forecast');
    weeklyForecast.innerHTML = '<h3>Weekly Forecast</h3>';

    const forecastDays = data.list.filter((item, index) => index % 8 === 0);  // Get data for each day (3-hour intervals, 8 times per day)

    forecastDays.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(day.main.temp * 9/5 + 32); // Convert Celsius to Fahrenheit and round
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        weeklyForecast.innerHTML += `
            <div class="forecast-day">
                <div>${date}</div>
                <div><img src="${iconUrl}" alt="Weather icon"></div>
                <div>${temp}°F</div>
                <div>${description}</div>
            </div>
        `;
    });
}

function updateBackground(weatherCondition) {
    const body = document.body;
    if (weatherCondition.toLowerCase().includes('rain')) {
        body.classList.remove('default-bg', 'sunny-bg', 'snow-bg', 'fog-bg', 'cloudy-bg');
        body.classList.add('rain-bg');
    } else if (weatherCondition.toLowerCase().includes('clear') || weatherCondition.toLowerCase().includes('sun')) {
        body.classList.remove('default-bg', 'rain-bg', 'snow-bg', 'fog-bg', 'cloudy-bg');
        body.classList.add('sunny-bg');
    } else if (weatherCondition.toLowerCase().includes('snow')) {
        body.classList.remove('default-bg', 'rain-bg', 'sunny-bg', 'fog-bg', 'cloudy-bg');
        body.classList.add('snow-bg');
    } else if (weatherCondition.toLowerCase().includes('fog')) {
        body.classList.remove('default-bg', 'rain-bg', 'sunny-bg', 'snow-bg', 'cloudy-bg');
        body.classList.add('fog-bg');
    } else if (weatherCondition.toLowerCase().includes('cloud')) {
        body.classList.remove('default-bg', 'rain-bg', 'sunny-bg', 'snow-bg', 'fog-bg');
        body.classList.add('cloudy-bg');
    }
}
