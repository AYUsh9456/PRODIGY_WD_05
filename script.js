const API_KEY = "2dfkksofkspsf";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");

const weatherBox = document.getElementById("weather");
const errorBox = document.getElementById("error");
const loader = document.getElementById("loader");

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
    }

});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        const city = cityInput.value.trim();

        if (city !== "") {
            getWeather(city);
        }

    }

});

locationBtn.addEventListener("click", () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            position => {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                getWeatherByCoords(lat, lon);

            },
            () => {
                alert("Location access denied.");
            }
        );

    }

});

async function getWeather(city) {

    loader.classList.remove("hidden");
    weatherBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log(data);

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        showWeather(data);

    } catch (error) {

        console.log(error);

        errorBox.innerText = "City not found ❌";
        errorBox.classList.remove("hidden");

    }

    loader.classList.add("hidden");

}

async function getWeatherByCoords(lat, lon) {

    loader.classList.remove("hidden");
    weatherBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log(data);

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        showWeather(data);

    } catch (error) {

        console.log(error);

        errorBox.innerText = "Unable to fetch weather ❌";
        errorBox.classList.remove("hidden");

    }

    loader.classList.add("hidden");

}

function showWeather(data) {

    document.getElementById("city").innerText =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temp").innerText =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("condition").innerText =
        data.weather[0].description;

    document.getElementById("humidity").innerText =
        `${data.main.humidity}%`;

    document.getElementById("wind").innerText =
        `${data.wind.speed} m/s`;

    document.getElementById("feels").innerText =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("date").innerText =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    weatherBox.classList.remove("hidden");
}

// Default Weather on Page Load
window.addEventListener("load", () => {
    getWeather("Dehradun");
});