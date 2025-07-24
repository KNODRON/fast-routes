let puntos = {
  comisarias: [],
  urgencias: []
};

// Cargar datos desde el archivo JSON externo
fetch('puntos-rutas-rapidas.json')
  .then(response => response.json())
  .then(data => {
    puntos = data;
  })
  .catch(error => {
    console.error("Error al cargar puntos:", error);
    alert("No se pudo cargar la base de datos de puntos.");
  });

function mostrarLista(tipo) {
  const contenedor = document.getElementById("lista");
  contenedor.innerHTML = "";

  if (!puntos[tipo] || puntos[tipo].length === 0) {
    contenedor.innerHTML = "<p>No hay datos disponibles.</p>";
    return;
  }

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
