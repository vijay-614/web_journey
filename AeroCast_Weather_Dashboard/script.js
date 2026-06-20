const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityElement = document.getElementById("city");
const tempElement = document.getElementById("temp");
const conditionElement = document.getElementById("condition");

const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const pressureElement = document.getElementById("pressure");
const visibilityElement = document.getElementById("visibility");

const forecastList = document.querySelector(".forecast-list");
const hourlyList = document.querySelector(".hourly-list");


// ====================
// GET COORDINATES
// ====================

async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data.results) {
        throw new Error("City not found");
    }

    return data.results[0];
}


// ====================
// GET WEATHER
// ====================

async function getWeather(lat, lon) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
}


// ====================
// WEATHER ICON
// ====================

function getWeatherIcon(temp) {

    if (temp >= 35) {
        return "☀️";
    }

    if (temp >= 25) {
        return "⛅";
    }

    if (temp >= 15) {
        return "☁️";
    }

    return "🌧️";
}


// ====================
// 7 DAY FORECAST
// ====================

function renderForecast(data) {

    forecastList.innerHTML = "";

    const days =
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {

        const date =
            new Date(data.daily.time[i]);

        const day =
            days[date.getDay()];

        const div =
            document.createElement("div");

        div.classList.add("forecast-item");

        div.innerHTML = `
            <strong>${day}</strong>
            <br>
            ${data.daily.temperature_2m_max[i]}°
            /
            ${data.daily.temperature_2m_min[i]}°
        `;

        forecastList.appendChild(div);
    }
}


// ====================
// HOURLY FORECAST
// ====================

function renderHourly(data) {

    hourlyList.innerHTML = "";

    const now = new Date();

    const currentHour = now.getHours();

    let startIndex = 0;

    for (let i = 0; i < data.hourly.time.length; i++) {

        const hour =
            new Date(data.hourly.time[i]).getHours();

        if (hour >= currentHour) {
            startIndex = i;
            break;
        }
    }

    for (
        let i = startIndex;
        i < startIndex + 6 &&
        i < data.hourly.time.length;
        i++
    ) {

        const time =
            data.hourly.time[i]
            .split("T")[1]
            .slice(0, 5);

        const temp =
            data.hourly.temperature_2m[i];

        const label =
            i === startIndex
                ? "Now"
                : time;

        const div =
            document.createElement("div");

        div.innerHTML = `
            <strong>${label}</strong>
            <br>
            ${temp}°
        `;

        hourlyList.appendChild(div);
    }
}


// ====================
// SEARCH WEATHER
// ====================

async function searchWeather() {

    const city =
        cityInput.value.trim();

    if (city === "") {
        alert("Enter city name");
        return;
    }

    try {

        tempElement.textContent =
            "Loading...";

        const location =
            await getCoordinates(city);

        const data =
            await getWeather(
                location.latitude,
                location.longitude
            );

        const weather =
            data.current;

        cityElement.textContent =
            location.name;

        tempElement.textContent =
            `${weather.temperature_2m}°C`;

        conditionElement.textContent =
            "Live Weather";

        humidityElement.textContent =
            `${weather.relative_humidity_2m}%`;

        windElement.textContent =
            `${weather.wind_speed_10m} km/h`;

        pressureElement.textContent =
            `${weather.pressure_msl} hPa`;

        visibilityElement.textContent =
            "Available";

        document.querySelector(
            ".weather-icon"
        ).textContent =
            getWeatherIcon(
                weather.temperature_2m
            );

        renderForecast(data);

        renderHourly(data);
        document.getElementById(
        "weatherMap"
    ).src =
    `https://embed.windy.com/embed2.html?lat=${location.latitude}&lon=${location.longitude}&zoom=6&level=surface&overlay=rain`;


        localStorage.setItem(
            "recentCity",
            city
        );

    }
    catch (error) {

        console.log(error);

        alert("City not found");
    }
}


// ====================
// CURRENT LOCATION
// ====================

async function getCurrentLocation() {

    navigator.geolocation.getCurrentPosition(

        async position => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            const data =
                await getWeather(lat, lon);

            const weather =
                data.current;

            cityElement.textContent =
                "Current Location";

            tempElement.textContent =
                `${weather.temperature_2m}°C`;

            humidityElement.textContent =
                `${weather.relative_humidity_2m}%`;

            windElement.textContent =
                `${weather.wind_speed_10m} km/h`;

            pressureElement.textContent =
                `${weather.pressure_msl} hPa`;

            document.querySelector(
                ".weather-icon"
            ).textContent =
                getWeatherIcon(
                    weather.temperature_2m
                );

            renderForecast(data);

            renderHourly(data);
                document.getElementById(
            "weatherMap"
        ).src =
        `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=6&level=surface&overlay=rain`;
                }

            );

}


// ====================
// LOAD LAST SEARCH
// ====================

const recentCity =
    localStorage.getItem("recentCity");

if (recentCity) {

    cityInput.value =
        recentCity;

}


// ====================
// EVENTS
// ====================

searchBtn.addEventListener(
    "click",
    searchWeather
);

locationBtn.addEventListener(
    "click",
    getCurrentLocation
);

cityInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);