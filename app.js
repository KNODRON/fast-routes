document.addEventListener("DOMContentLoaded", () => {
  const comisariasBtn = document.getElementById("comisariasBtn");
  const urgenciasBtn = document.getElementById("urgenciasBtn");
  const emergenciaBtn = document.getElementById("emergenciaBtn");
  const botonesContainer = document.getElementById("botonesContainer");

  comisariasBtn.addEventListener("click", async () => {
    const response = await fetch("https://raw.githubusercontent.com/KNODRON/fast-routes/main/comisarias_por_prefectura.json");
    const data = await response.json();
    botonesContainer.innerHTML = "";

    // Mostrar botones por prefectura
    Object.keys(data).forEach(prefectura => {
      const btn = document.createElement("button");
      btn.className = "boton-prefectura";
      btn.innerText = prefectura;
      btn.onclick = () => mostrarComisarias(data[prefectura]);
      botonesContainer.appendChild(btn);
    });
  });

  function mostrarComisarias(comisarias) {
    botonesContainer.innerHTML = ""; // Limpiar prefecturas

    comisarias.forEach(c => {
      const btn = document.createElement("button");
      btn.className = "boton-comisaria";
      btn.innerText = c.nombre;
      btn.onclick = () => {
        const coords = c.coords.split(",").map(x => x.trim());
        const [lat, lng] = coords;
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, "_blank");
      };
      botonesContainer.appendChild(btn);
    });

    // Botón para volver atrás
    const volverBtn = document.createElement("button");
    volverBtn.className = "boton-volver";
    volverBtn.innerText = "⬅️ Volver";
    volverBtn.onclick = () => comisariasBtn.click();
    botonesContainer.appendChild(document.createElement("br"));
    botonesContainer.appendChild(volverBtn);
  }

  urgenciasBtn.addEventListener("click", async () => {
    const response = await fetch("https://raw.githubusercontent.com/KNODRON/fast-routes/main/puntos-rutas-rapidas.json");
    const data = await response.json();
    const urgencias = data.hospitales || [];
    botonesContainer.innerHTML = "";

    urgencias.forEach(p => {
      const btn = document.createElement("button");
      btn.innerText = p.nombre;
      btn.onclick = () => {
        const coords = p.coords.split(",").map(x => x.trim());
        const url = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
        window.open(url, "_blank");
      };
      botonesContainer.appendChild(btn);
    });
  });

  emergenciaBtn.addEventListener("click", () => {
    const query = encodeURIComponent("SAR");
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  });
});
