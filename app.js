const puntos = {
  comisarias: [
    { nombre: "1ª Comisaría Santiago", coords: "-33.437394,-70.649138" },
    { nombre: "10ª Comisaría La Cisterna", coords: "-33.532371,-70.653637" },
    { nombre: "36ª Comisaría La Florida", coords: "-33.527722,-70.567748" }
  ],
  urgencias: [
    { nombre: "Posta Central", coords: "-33.448777,-70.653952" },
    { nombre: "Hospital Sótero del Río", coords: "-33.562738,-70.590708" },
    { nombre: "CRS Cordillera", coords: "-33.579145,-70.579423" }
  ]
};

function mostrarLista(tipo) {
  const contenedor = document.getElementById("lista");
  contenedor.innerHTML = "";
  puntos[tipo].forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.nombre;
    btn.onclick = () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.coords}`, "_blank");
    };
    contenedor.appendChild(btn);
  });
}

function irAlaUrgenciaMasCercana() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      window.open(`https://www.google.com/maps/search/urgencia/@${lat},${lon},15z`, "_blank");
    }, () => {
      alert("No se pudo obtener tu ubicación.");
    });
  } else {
    alert("Geolocalización no soportada.");
  }
}
