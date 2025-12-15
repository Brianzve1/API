// Array donde se guardan los resultados obtenidos de la API
let resultados = [];

// Función para buscar series cuando el usuario hace clic o presiona Enter
async function buscarSerie() {
    // Obtener elementos del DOM
    const input = document.getElementById("searchInput");
    const results = document.getElementById("results");
    const suggestions = document.getElementById("suggestions");

    const texto = input.value.trim(); // Limpiar espacios

    // Limpiar contenedores de sugerencias y resultados
    suggestions.replaceChildren();
    results.replaceChildren();

    // Si el input está vacío, mostrar un mensaje
    if (texto === "") {
        const p = document.createElement("p");
        p.textContent = "Escribí una serie para buscar."; // Texto del mensaje
        p.className = "text-warning text-center"; // Clases de Bootstrap
        results.appendChild(p); // Agregar al contenedor
        return; // Salir de la función
    }

    try {
        // Llamar a la API de TVMaze con el texto ingresado
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${texto}`);
        resultados = await res.json(); // Guardar los resultados en el array global

        mostrarResultados(); // Llamar a la función para mostrar los resultados
    } catch (error) {
        // En caso de error, mostrar mensaje
        const p = document.createElement("p");
        p.textContent = "Error al obtener los datos.";
        p.className = "text-danger text-center";
        results.appendChild(p);
    }
}

// Función que muestra sugerencias mientras el usuario escribe
async function mostrarSugerencias() {
    const input = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");
    const texto = input.value.trim();

    // Limpiar lista de sugerencias
    suggestions.replaceChildren();

    // No mostrar sugerencias si el texto es muy corto
    if (texto.length < 3) return;

    try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${texto}`);
        const data = await res.json();

        // Mostrar hasta 5 sugerencias
        data.slice(0, 5).forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.show.name; // Nombre de la serie
            li.className = "list-group-item list-group-item-action bg-dark text-light";

            // Al hacer clic en la sugerencia, se busca la serie
            li.onclick = function () {
                input.value = item.show.name;
                suggestions.replaceChildren();
                buscarSerie();
            };

            suggestions.appendChild(li); // Agregar la sugerencia al DOM
        });
    } catch {
        // Limpiar en caso de error
        suggestions.replaceChildren();
    }
}

// Función para mostrar los resultados de la búsqueda
function mostrarResultados() {
    const results = document.getElementById("results");
    results.replaceChildren(); // Limpiar resultados anteriores

    // Si no hay resultados, mostrar mensaje
    if (resultados.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No se encontraron resultados.";
        p.className = "text-muted text-center";
        results.appendChild(p);
        return;
    }

    // Recorrer todos los resultados
    resultados.forEach(item => {
        const s = item.show;

        // Crear columna para la card
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        // Crear card
        const card = document.createElement("div");
        card.className = "card bg-secondary text-light h-100 shadow";

        // Imagen de la serie
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = s.image ? s.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";
        img.alt = s.name;

        // Cuerpo de la card
        const body = document.createElement("div");
        body.className = "card-body";

        // Título de la serie
        const h5 = document.createElement("h5");
        h5.textContent = s.name;
        h5.className = "card-title text-danger";

        // Géneros de la serie
        const pGenero = document.createElement("p");
        const strongGenero = document.createElement("strong");
        strongGenero.textContent = "Géneros: ";
        pGenero.appendChild(strongGenero);
        pGenero.appendChild(document.createTextNode(s.genres.length ? s.genres.join(", ") : "No especificado"));

        // Rating de la serie
        const pRating = document.createElement("p");
        const strongRating = document.createElement("strong");
        strongRating.textContent = "Rating: ";
        pRating.appendChild(strongRating);
        pRating.appendChild(document.createTextNode(s.rating.average || "N/A"));

        // Botón "Ver más"
        const btn = document.createElement("button");
        btn.textContent = "Ver más";
        btn.className = "btn btn-outline-light btn-sm";
        btn.onclick = function () { verMas(s); }; // Abrir modal con más info

        // Agregar elementos al cuerpo de la card
        body.append(h5, pGenero, pRating, btn);

        // Armar card completa
        card.append(img, body);
        col.appendChild(card);
        results.appendChild(col);
    });
}

// Función para mostrar más información en un modal
function verMas(s) {
    // Título del modal
    document.getElementById("modalTitle").textContent = s.name;

    const body = document.getElementById("modalBody");
    body.replaceChildren(); // Limpiar contenido anterior

    // Imagen grande
    const img = document.createElement("img");
    img.src = s.image ? s.image.original : "https://via.placeholder.com/400x600?text=Sin+Imagen";
    img.className = "img-fluid mb-3 rounded";

    // Información adicional
    const p1 = document.createElement("p");
    const strong1 = document.createElement("strong");
    strong1.textContent = "Estrenada: ";
    p1.appendChild(strong1);
    p1.appendChild(document.createTextNode(s.premiered || "Desconocido"));

    const p2 = document.createElement("p");
    const strong2 = document.createElement("strong");
    strong2.textContent = "Idioma: ";
    p2.appendChild(strong2);
    p2.appendChild(document.createTextNode(s.language));

    const p3 = document.createElement("p");
    const strong3 = document.createElement("strong");
    strong3.textContent = "Géneros: ";
    p3.appendChild(strong3);
    p3.appendChild(document.createTextNode(s.genres.join(", ") || "No especificado"));

    const p4 = document.createElement("p");
    const strong4 = document.createElement("strong");
    strong4.textContent = "Rating: ";
    p4.appendChild(strong4);
    p4.appendChild(document.createTextNode(s.rating.average || "N/A"));

    const p5 = document.createElement("p");
    p5.textContent = s.summary ? s.summary.replace(/<[^>]+>/g, "") : "Sin descripción disponible.";

    // Agregar todos los elementos al modal
    body.append(img, p1, p2, p3, p4, p5);

    // Botón de sitio oficial si existe
    if (s.officialSite) {
        const a = document.createElement("a");
        a.href = s.officialSite;
        a.target = "_blank";
        a.className = "btn btn-danger mt-2";
        a.textContent = "Sitio oficial";
        body.appendChild(a);
    }

    // Abrir modal usando Bootstrap
    new bootstrap.Modal(document.getElementById("infoModal")).show();
}

// Eventos de búsqueda
document.getElementById("searchBtn").onclick = buscarSerie;
document.getElementById("searchInput").onkeyup = function (e) {
    if (e.key === "Enter") buscarSerie();
};
document.getElementById("searchInput").oninput = mostrarSugerencias;