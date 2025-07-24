let comisariasPorPrefectura = {};
let seleccion = document.getElementById("lista");

// Cargar el archivo JSON desde GitHub (RAW)
fetch('https://raw.githubusercontent.com/KNODRON/fast-routes/main/comisarias_por_prefectura.json')
  .then(response => response.json())
  .then(data => {
    comisariasPorPrefectura = data;
    mostrarPrefecturas();
  })
  .catch(error => {
    console.error("Error al cargar comisarías:", error);
    seleccion.innerHTML = "<p>No se pudo cargar la información de comisarías.</p>";
  });

function mostrarPrefecturas() {
  seleccion.innerHTML = "";
  for (const prefectura in comisariasPorPrefectura) {
    const btn = document.createElement("button");
    btn.textContent = prefectura;
    btn.onclick = () => mostrarComisarias(prefectura);
    seleccion.appendChild(btn);
  }
}

function mostrarComisarias(prefectura) {
  seleccion.innerHTML = "";

  const volver = document.createElement("button");
  volver.textContent = "⬅️ Volver";
  volver.onclick = mostrarPrefecturas;
  seleccion.appendChild(volver);

  comisariasPorPrefectura[prefectura].forEach(com => {
    const btn = document.createElement("button");
    btn.textContent = com.nombre;
    btn.onclick = () => {
      const direccion = `${com.nombre}, ${com.direccion}, ${com.comuna}`;
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(direccion)}`, "_blank");
    };
    seleccion.appendChild(btn);
  });
}

function mostrarLista(tipo) {
  seleccion.innerHTML = "<p>Esta función está en desarrollo.</p>";
}

function irAlaUrgenciaMasCercana() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      window.open(`https://www.google.com/maps/search/SAR/@${lat},${lon},15z`, "_blank");
    }, () => {
      alert("No se pudo obtener tu ubicación.");
    });
  } else {
    alert("Geolocalización no soportada.");
  }
}
