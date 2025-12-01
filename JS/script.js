
let series = [];
let resultadosActuales = [];


const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const suggestions = document.getElementById("suggestions");


searchBtn.addEventListener("click", buscarSerie);
searchInput.addEventListener("keyup", detectarEnter);
searchInput.addEventListener("input", mostrarSugerencias);



function limpiar(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function crearTexto(parent, texto) {
    parent.appendChild(document.createTextNode(texto));
}

function crearParrafo(texto) {
    const p = document.createElement("p");
    crearTexto(p, texto);
    return p;
}

function convertirJSON(res) {
    return res.json();
}



function detectarEnter(e) {
    if (e.key === "Enter") {
        buscarSerie();
    }
}



function mostrarSugerencias() {
    const query = searchInput.value.trim();
    limpiar(suggestions);

    if (query.length < 3) return;

    fetch("https://api.tvmaze.com/search/shows?q=" + query)
        .then(convertirJSON)
        .then(pintarSugerencias)
        .catch(limpiarSugerencias);
}

function limpiarSugerencias() {
    limpiar(suggestions);
}

function pintarSugerencias(data) {
    limpiar(suggestions);

    const primeros = data.slice(0, 5);

    for (const item of primeros) {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action bg-dark text-light";

        crearTexto(li, item.show.name);

        li.addEventListener("click", function () {
            seleccionarSugerencia(item.show.name);
        });

        suggestions.appendChild(li);
    }
}

function seleccionarSugerencia(nombre) {
    searchInput.value = nombre;
    limpiar(suggestions);
    buscarSerie();
}



function buscarSerie() {
    const query = searchInput.value.trim();

    limpiar(results);
    limpiar(suggestions);

    if (!query) {
        const p = crearParrafo("Escribí una serie para buscar.");
        p.className = "text-center text-warning";
        results.appendChild(p);
        return;
    }

    fetch("https://api.tvmaze.com/search/shows?q=" + query)
        .then(convertirJSON)
        .then(guardarResultados)
        .catch(errorBusqueda);
}

function guardarResultados(data) {
    resultadosActuales = data;
    mostrarResultados();
}

function errorBusqueda() {
    const p = crearParrafo("Error al obtener los datos.");
    p.className = "text-center text-danger";
    results.appendChild(p);
}



function mostrarResultados() {
    limpiar(results);

    if (resultadosActuales.length === 0) {
        const p = crearParrafo("No se encontraron resultados.");
        p.className = "text-center text-muted";
        results.appendChild(p);
        return;
    }

    for (const item of resultadosActuales) {
        const s = item.show;

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card bg-secondary text-light h-100 shadow";

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = s.image ? s.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title text-danger";
        crearTexto(title, s.name);

        const genres = s.genres.length ? s.genres.join(", ") : "No especificado";
        const pGenres = crearParrafo("Géneros: " + genres);

        const rating = s.rating.average || "N/A";
        const pRating = crearParrafo("Rating: " + rating);

        const btn = document.createElement("button");
        btn.className = "btn btn-outline-light btn-sm";
        crearTexto(btn, "Ver más");

        btn.addEventListener("click", function () {
            verMas(s);
        });

        body.appendChild(title);
        body.appendChild(pGenres);
        body.appendChild(pRating);
        body.appendChild(btn);

        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);
        results.appendChild(col);
    }
}



function verMas(s) {
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    limpiar(modalTitle);
    limpiar(modalBody);

    crearTexto(modalTitle, s.name);

    const img = document.createElement("img");
    img.className = "img-fluid mb-3 rounded";
    img.src = s.image ? s.image.original : "https://via.placeholder.com/400x600?text=Sin+Imagen";
    modalBody.appendChild(img);

    modalBody.appendChild(crearParrafo("Estrenada: " + (s.premiered || "Desconocido")));
    modalBody.appendChild(crearParrafo("Idioma: " + s.language));
    modalBody.appendChild(crearParrafo("Géneros: " + (s.genres.join(", ") || "No especificado")));
    modalBody.appendChild(crearParrafo("Rating: " + (s.rating.average || "N/A")));

    const resumen = s.summary
        ? s.summary.replace(/<[^>]+>/g, "")
        : "Sin descripción disponible.";
    modalBody.appendChild(crearParrafo(resumen));

    if (s.officialSite) {
        const a = document.createElement("a");
        a.setAttribute("href", s.officialSite);
        a.setAttribute("target", "_blank");
        a.className = "btn btn-danger mt-2";
        crearTexto(a, "Sitio oficial");
        modalBody.appendChild(a);
    }

    new bootstrap.Modal(document.getElementById("infoModal")).show();
}
