document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los botones principales y al contenedor de los botones secundarios
    const comisariasBtn = document.getElementById("comisariasBtn");
    const urgenciasBtn = document.getElementById("urgenciasBtn");
    const emergenciaBtn = document.getElementById("emergenciaBtn");
    const botonesContainer = document.getElementById("botonesContainer");

    // Función para crear un botón genérico con un estilo base
    function crearBoton(text, className, onClickHandler) {
        const btn = document.createElement("button");
        btn.className = className; // Puedes añadir clases específicas para cada tipo de botón
        btn.innerText = text;
        btn.onclick = onClickHandler;
        return btn;
    }

    // --- Lógica para "Comisarías" ---
    comisariasBtn.addEventListener("click", async () => {
        // Limpiar el contenedor antes de mostrar nuevos botones
        botonesContainer.innerHTML = "";

        try {
            const response = await fetch("https://raw.githubusercontent.com/KNODRON/fast-routes/main/comisarias_por_prefectura.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Crear un botón para cada Prefectura
            Object.keys(data).forEach(prefectura => {
                const btn = crearBoton(prefectura, "boton-prefectura", () => mostrarComisarias(data[prefectura]));
                botonesContainer.appendChild(btn);
            });
        } catch (error) {
            console.error("Error al cargar las prefecturas:", error);
            botonesContainer.innerHTML = "<p>Error al cargar las prefecturas. Inténtelo de nuevo más tarde.</p>";
        }
    });

    // Función para mostrar las Comisarías de una Prefectura seleccionada
    function mostrarComisarias(comisarias) {
        botonesContainer.innerHTML = ""; // Limpiar el contenedor

        // Crear un botón para cada Comisaría
        comisarias.forEach(c => {
            const btn = crearBoton(c.nombre, "boton-comisaria", () => {
                const coords = c.coords.split(",").map(x => x.trim());
                const [lat, lng] = coords;
                // URL corregida para Google Maps
                const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                window.open(url, "_blank"); // Abrir en una nueva pestaña
            });
            botonesContainer.appendChild(btn);
        });

        // Botón para volver a la lista de Prefecturas
        const volverBtn = crearBoton("⬅️ Volver", "boton-volver", () => comisariasBtn.click());
        botonesContainer.appendChild(document.createElement("br")); // Salto de línea para separar
        botonesContainer.appendChild(volverBtn);
    }

    // --- Lógica para "Urgencias" ---
    urgenciasBtn.addEventListener("click", async () => {
        botonesContainer.innerHTML = ""; // Limpiar el contenedor

        try {
            const response = await fetch("https://raw.githubusercontent.com/KNODRON/fast-routes/main/puntos-rutas-rapidas.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const urgencias = data.urgencias || []; // Asegurarse de que 'urgencias' existe

            // Crear un botón para cada punto de Urgencia
            urgencias.forEach(p => {
                const btn = crearBoton(p.nombre, "boton-urgencia", () => {
                    const coords = p.coords.split(",").map(x => x.trim());
                    // URL corregida para Google Maps
                    const url = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
                    window.open(url, "_blank");
                });
                botonesContainer.appendChild(btn);
            });

            // Botón para volver al menú principal (si lo deseas, o si no, el usuario puede hacer clic en "Comisarías" de nuevo)
            const volverBtn = crearBoton("⬅️ Volver", "boton-volver", () => {
                botonesContainer.innerHTML = ""; // Simplemente limpia el contenedor
                // Si quieres que al "volver" se muestren los botones iniciales (Comisarias, Urgencias, Emergencia),
                // necesitarías una función para renderizar esos botones principales.
                // Por ahora, solo limpia.
            });
             botonesContainer.appendChild(document.createElement("br"));
             botonesContainer.appendChild(volverBtn);

        } catch (error) {
            console.error("Error al cargar los puntos de urgencia:", error);
            botonesContainer.innerHTML = "<p>Error al cargar los puntos de urgencia. Inténtelo de nuevo más tarde.</p>";
        }
    });

    // --- Lógica para "Emergencia" ---
    emergenciaBtn.addEventListener("click", () => {
        // Opción 1: Buscar "hospital de urgencia" en el mapa cerca de la ubicación actual del usuario (si la permite)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Búsqueda de "hospital de urgencia" cerca de la ubicación del usuario
                const url = `https://www.google.com/maps/search/hospital+de+urgencia/@${lat},${lng},14z`;
                window.open(url, "_blank");
            }, (error) => {
                console.error("Error obteniendo la ubicación:", error);
                // Si la geolocalización falla o es denegada, abre una búsqueda general en Santiago
                const defaultQuery = encodeURIComponent("hospital de urgencia Santiago");
                const url = `https://www.google.com/maps/search/?api=1&query=${defaultQuery}`;
                window.open(url, "_blank");
                alert("No se pudo obtener tu ubicación actual. Abriendo búsqueda de hospitales de urgencia en Santiago.");
            });
        } else {
            // Si el navegador no soporta geolocalización
            const defaultQuery = encodeURIComponent("hospital de urgencia Santiago");
            const url = `https://www.google.com/maps/search/?api=1&query=${defaultQuery}`;
            window.open(url, "_blank");
            alert("Tu navegador no soporta geolocalización. Abriendo búsqueda de hospitales de urgencia en Santiago.");
        }

        // Opción 2: Si quieres un punto fijo para emergencia (por ejemplo, Posta Central)
        /*
        const postaCentralCoords = "-33.448777,-70.653952"; // Coordenadas de la Posta Central
        const url = `https://www.google.com/maps/search/?api=1&query=${postaCentralCoords}`;
        window.open(url, "_blank");
        */
    });
});
