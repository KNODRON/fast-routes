
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

                const navBtn = document.createElement('button');
                navBtn.textContent = 'Navegar';
                navBtn.onclick = () => {
                    const gmaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
                    window.open(gmaps, '_blank');
                };
                popup.appendChild(navBtn);

                if (com.subunidades && com.subunidades.length > 0) {
                    const subBtn = document.createElement('button');
                    subBtn.textContent = 'Mostrar subunidades';
                    subBtn.style.marginLeft = '10px';
                    subBtn.onclick = () => {
                        subunidadLayer.clearLayers();
                        com.subunidades.forEach(sub => {
                            const [subLat, subLon] = sub.coords.split(',').map(Number);
                            L.marker([subLat, subLon], {
                                icon: L.icon({
                                    iconUrl: 'https://cdn-icons-png.flaticon.com/128/3038/3038789.png',
                                    iconSize: [26, 26]
                                })
                            })
                                .bindPopup(`<strong>${sub.nombre}</strong>`)
                                .addTo(subunidadLayer);
                        });
                    };
                    popup.appendChild(subBtn);
                }

                marker.bindPopup(popup);
            });
        });
});
