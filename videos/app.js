export const apiid = "02b6509fb09effcd827fabe5221e388b";
import { getMoonImage } from "./moon.js";
// ---------------------------
// DOM ELEMENTS
// ---------------------------
const searchBtn = document.querySelector("#search-btn");
const cityInput = document.querySelector("#city-input");
const statusEl = document.getElementById("status");
const weatherIconContainer = document.getElementById("weather-icon-container");
const locationEl = document.getElementById("location-name");
const countryEl = document.getElementById("country-name");
const visibilityEl = document.getElementById("visibility");
const windSpeedEl = document.getElementById("wind-speed");
const pressureEl = document.getElementById("pressure");
const cloudsEl = document.getElementById("clouds");
const feelsLikeEl = document.getElementById("feels-like");
const dateEl = document.getElementById("date-display");
const backgroundVideo = document.getElementById("background-video");
const moonPhase = getMoonPhase();


// ---------------------------
// EVENTS
// ---------------------------
searchBtn.addEventListener("click", () => searchWeather());
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchWeather();
});

// ---------------------------
// MAIN SEARCH FUNCTION
// ---------------------------
function searchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  setLoadingState();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiid}&units=metric`)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => updateUI(data))
    .catch((err) => showError(err.message));
}

// ---------------------------
// UI FUNCTIONS
// ---------------------------
function setLoadingState() {
  statusEl.innerHTML = `<p class="text-4xl font-medium">Loading...</p>`;
  weatherIconContainer.innerHTML = "";
  locationEl.textContent = "";
  countryEl.textContent = "";
  visibilityEl.textContent = "--";
  windSpeedEl.textContent = "--";
  pressureEl.textContent = "--";
  cloudsEl.textContent = "--";
  feelsLikeEl.textContent = "--";
  backgroundVideo.src = "";
}

function showError(message) {
  statusEl.innerHTML = `<p class="text-4xl font-medium text-red-600">Error: ${message}</p>`;
  weatherIconContainer.innerHTML = "";
}

export function updateUI(data) {
  console.log(data);
  locationEl.textContent = data.name;
  countryEl.textContent = data.sys.country;
  getCountryName(data.sys.country);
  updateCountryUI(data.sys.country);
  updateSunriseSunset(data.sys);
  updateSunProgress(data.sys.sunrise, data.sys.sunset);
  applyDayNightTheme(data.sys.sunrise, data.sys.sunset);
  updateMoonUI(moonPhase);

  statusEl.innerHTML = `
    <p class="text-8xl font-black">${Math.round(data.main.temp)}°C</p>
    <p class="text-2xl font-medium tracking-wide">${data.weather[0].description}</p>
  `;

  weatherIconContainer.innerHTML = `
    <img class="w-60 h-60 drop-shadow-2xl" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" />
  `;

  visibilityEl.textContent = data.visibility + " m";
  windSpeedEl.textContent = data.wind.speed + " m/s";
  pressureEl.textContent = data.main.pressure + " hPa";
  cloudsEl.textContent = data.clouds.all + " %";
  feelsLikeEl.textContent = data.main.feels_like + " °C";
  backgroundVideo.src = `videos/${data.weather[0].main}.mp4`;
}

// ---------------------------
// DATE FUNCTION
// ---------------------------
function updateDate() {
  const d = new Date();
  const options = { weekday: "long", day: "numeric", month: "short" };
  dateEl.textContent = d.toLocaleDateString("en-US", options);
}
updateDate();

// ---------------------------
// COUNTRY NAME FUNCTION
// ---------------------------

function getCountryName(code) {
  //return full country name from country code
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
}

function updateCountryUI(code) {
  const fullName = getCountryName(code);
  countryEl.textContent = `${fullName} (${code})`;
}

function decodeTime(unixTime) {
  const date = new Date(unixTime * 1000);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function updateSunriseSunset(sys) {
  document.getElementById("sunrise-time").textContent =
    decodeTime(sys.sunrise);

  document.getElementById("sunset-time").textContent =
    decodeTime(sys.sunset);
}

function updateSunProgress(sunrise, sunset) {
  const now = Date.now();
  const start = sunrise * 1000;
  const end = sunset * 1000;

  let progress = ((now - start) / (end - start)) * 100;
  progress = Math.min(Math.max(progress, 0), 100);

  document.getElementById("sun-progress").style.width = progress + "%";
}

function isDayTime(sunrise, sunset) {
  const now = Date.now();
  return now >= sunrise * 1000 && now <= sunset * 1000;
}

function applyDayNightTheme(sunrise, sunset) {
  const body = document.body;

  if (isDayTime(sunrise, sunset)) {
    body.classList.remove("bg-slate-900");
    body.classList.add("bg-slate-200");
  } else {
    body.classList.remove("bg-slate-200");
    body.classList.add("bg-slate-900");
  }
}

function getMoonPhase() {
  const now = new Date();

  // Reference New Moon (UTC for accuracy)
  const newMoon = new Date(Date.UTC(2024, 0, 11, 11, 57));

  const diffTime = now.getTime() - newMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  const moonAge = diffDays % 29.530588;

  if (moonAge < 1.84566) return "New Moon";
  if (moonAge < 5.53699) return "Waxing Crescent";
  if (moonAge < 9.22831) return "First Quarter";
  if (moonAge < 12.91963) return "Waxing Gibbous";
  if (moonAge < 16.61096) return "Full Moon";
  if (moonAge < 20.30228) return "Waning Gibbous";
  if (moonAge < 23.99361) return "Last Quarter";
  return "Waning Crescent";
}


function updateMoonUI(phase) {
  const img = document.getElementById("moon-img");
  const text = document.getElementById("moon-text");

  img.classList.remove("show");

  setTimeout(() => {
    img.src = getMoonImage(phase);
    text.textContent = phase;
    img.classList.add("show");
  }, 120);
}

