document.addEventListener("DOMContentLoaded", () => {
  let map = L.map("map").setView([20, 0], 2);
  let marker;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

   map.setView([lat, lng], 11);

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup();
});
