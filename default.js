import { apiid } from "./app.js";
import { updateUI } from "./app.js";


if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
  (position) => {
   const lat = position.coords.latitude;
   const lon = position.coords.longitude;
   console.log("Latitude:", lat);
   console.log("Longitude:", lon);

   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiid}&units=metric`)
    .then(res => res.json())
    .then(data => updateUI(data))
    .catch(err => console.error(err));

  },
  (error) => {
   console.error("Error getting location:", error.message);
  }
 );
} else {
 console.error("Geolocation is not supported by this browser.");
}
