// Array donde se guardan los resultados obtenidos de la API
let resultados = [];

async function buscarSerie() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("results");
    const suggestions = document.getElementById("suggestions");

    const texto = input.value.trim();

    suggestions.innerHTML = "";
    results.innerHTML = "";

    if (texto === "") {
        const p = document.createElement("p");
        p.textContent = "Escribí una serie para buscar.";
        p.className = "text-warning text-center";
        results.appendChild(p);
        return;
    }

    try {
        // fetch + await: espera la respuesta de la API antes de continuar
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${texto}`);
        resultados = await res.json();

        // Se guarda la respuesta en un array global para usarla en otra función
        mostrarResultados();
    } catch (error) {
        const p = document.createElement("p");
        p.textContent = "Error al obtener los datos.";
        p.className = "text-danger text-center";
        results.appendChild(p);
    }
}

async function mostrarSugerencias() {
    const input = document.getElementById("searchInput");
    const suggestions = document.getElementById("suggestions");
    const texto = input.value.trim();

    suggestions.innerHTML = "";

    // Evita hacer llamadas a la API si el texto es muy corto
    if (texto.length < 3) return;

    try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${texto}`);
        const data = await res.json();

        // slice limita la cantidad de sugerencias mostradas
        data.slice(0, 5).forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.show.name;
            li.className = "list-group-item list-group-item-action bg-dark text-light";

            // Al seleccionar una sugerencia se reutiliza la función buscarSerie
            li.onclick = function () {
                input.value = item.show.name;
                suggestions.innerHTML = "";
                buscarSerie();
            };

            suggestions.appendChild(li);
        });
    } catch {
        suggestions.innerHTML = "";
    }
}

function mostrarResultados() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (resultados.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No se encontraron resultados.";
        p.className = "text-muted text-center";
        results.appendChild(p);
        return;
    }

    resultados.forEach(item => {
        const s = item.show;

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card bg-secondary text-light h-100 shadow";

        const img = document.createElement("img");
        img.className = "card-img-top";
        // Operador ternario para evitar errores si no hay imagen
        img.src = s.image ? s.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";
        img.alt = s.name;

        const body = document.createElement("div");
        body.className = "card-body";

        const h5 = document.createElement("h5");
        h5.textContent = s.name;
        h5.className = "card-title text-danger";

        const pGenero = document.createElement("p");
        pGenero.innerHTML = "<strong>Géneros:</strong> " +
            (s.genres.length ? s.genres.join(", ") : "No especificado");

        const pRating = document.createElement("p");
        pRating.innerHTML = "<strong>Rating:</strong> " + (s.rating.average || "N/A");

        const btn = document.createElement("button");
        btn.textContent = "Ver más";
        btn.className = "btn btn-outline-light btn-sm";

        // Se pasa el objeto completo de la serie al modal
        btn.onclick = function () {
            verMas(s);
        };

        body.append(h5, pGenero, pRating, btn);
        card.append(img, body);
        col.appendChild(card);
        results.appendChild(col);
    });
}

function verMas(s) {
    document.getElementById("modalTitle").textContent = s.name;

    const body = document.getElementById("modalBody");
    body.innerHTML = "";

    const img = document.createElement("img");
    img.src = s.image ? s.image.original : "https://via.placeholder.com/400x600?text=Sin+Imagen";
    img.className = "img-fluid mb-3 rounded";

    const p1 = document.createElement("p");
    p1.innerHTML = "<strong>Estrenada:</strong> " + (s.premiered || "Desconocido");

    const p2 = document.createElement("p");
    p2.innerHTML = "<strong>Idioma:</strong> " + s.language;

    const p3 = document.createElement("p");
    p3.innerHTML = "<strong>Géneros:</strong> " +
        (s.genres.join(", ") || "No especificado");

    const p4 = document.createElement("p");
    p4.innerHTML = "<strong>Rating:</strong> " + (s.rating.average || "N/A");

    const p5 = document.createElement("p");
    // Se eliminan las etiquetas HTML que vienen desde la API
    p5.textContent = s.summary
        ? s.summary.replace(/<[^>]+>/g, "")
        : "Sin descripción disponible.";

    body.append(img, p1, p2, p3, p4, p5);

    if (s.officialSite) {
        const a = document.createElement("a");
        a.href = s.officialSite;
        a.target = "_blank";
        a.className = "btn btn-danger mt-2";
        a.textContent = "Sitio oficial";
        body.appendChild(a);
    }

    // Uso del modal de Bootstrap desde JavaScript
    new bootstrap.Modal(document.getElementById("infoModal")).show();
}

// Eventos
document.getElementById("searchBtn").onclick = buscarSerie;

document.getElementById("searchInput").onkeyup = function (e) {
    if (e.key === "Enter") buscarSerie();
};

document.getElementById("searchInput").oninput = mostrarSugerencias;
