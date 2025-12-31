export function getMoonImage(phase) {
 const map = {
  "New Moon": "images/moon/new.png",
  "Waxing Crescent": "images/moon/waxing-crescent.png",
  "First Quarter": "images/moon/first-quarter.png",
  "Waxing Gibbous": "images/moon/waxing-gibbous.png",
  "Full Moon": "images/moon/full.png",
  "Waning Gibbous": "images/moon/waning-gibbous.png",
  "Last Quarter": "images/moon/last-quarter.png",
  "Waning Crescent": "images/moon/waning-crescent.png"
 };

 return map[phase] || "images/moon/full.png";
}
