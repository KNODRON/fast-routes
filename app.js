// app.js - Controla la carga y visualización de comisarías y subunidades
const map = L.map('map').setView([-33.447867, -70.657181], 12);

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let comisariaLayer = L.layerGroup().addTo(map);
let subunidadLayer = L.layerGroup().addTo(map);

document.getElementById('btnComisarias').addEventListener('click', () => {
  fetch('unidades_carabineros.json')
    .then(res => res.json())
    .then(data => {
      comisariaLayer.clearLayers();
      subunidadLayer.clearLayers();

      data.forEach(com => {
        const [lat, lon] = com.coords.split(',').map(Number);

        const marker = L.marker([lat, lon], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/128/4875/4875484.png',
            iconSize: [30, 30]
          })
        }).addTo(comisariaLayer);

        const popup = document.createElement('div');
        popup.innerHTML = '<strong>' + com.nombre + '</strong><br>';

        if (com.subunidades && com.subunidades.length > 0) {
          const ul = document.createElement('ul');
          com.subunidades.forEach(sub => {
            const li = document.createElement('li');
            const subCoords = sub.coords.split(',').map(Number);
            li.innerHTML = `
              <a href="#" onclick="map.setView([${subCoords}], 17); return false;">
                ${sub.nombre}
              </a>
            `;
            ul.appendChild(li);

            L.marker(subCoords, {
              icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/128/685/685815.png',
                iconSize: [24, 24]
              })
            }).addTo(subunidadLayer);
          });
          popup.appendChild(ul);
        }

        marker.bindPopup(popup);
      });
    });
});
