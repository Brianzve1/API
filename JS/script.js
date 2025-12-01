// VARIABLES GLOBALES

let series = [];
let resultadosActuales = [];

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const suggestions = document.getElementById("suggestions");

// EVENTOS

searchBtn.onclick = buscarSerie;
searchInput.onkeyup = (e) => e.key === "Enter" && buscarSerie();
searchInput.oninput = mostrarSugerencias;

// SUGERENCIAS

function mostrarSugerencias() {
    const query = searchInput.value.trim();

    if (query.length < 3) {
        suggestions.innerHTML = "";
        return;
    }

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
            suggestions.innerHTML = "";
            data.slice(0, 5).forEach((item) => {
                const li = document.createElement("li");
                li.className =
                    "list-group-item list-group-item-action bg-dark text-light";
                li.textContent = item.show.name;

                li.onclick = () => {
                    searchInput.value = item.show.name;
                    suggestions.innerHTML = "";
                    buscarSerie();
                };

                suggestions.appendChild(li);
            });
        })
        .catch(() => (suggestions.innerHTML = ""));
}

// BUSCAR SERIES

function buscarSerie() {
    const query = searchInput.value.trim();
    suggestions.innerHTML = "";

    if (!query) {
        results.innerHTML = `<p class="text-center text-warning">Escribí una serie para buscar.</p>`;
        return;
    }

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
            resultadosActuales = data;
            mostrarResultados();
        })
        .catch(() => {
            results.innerHTML = `<p class="text-center text-danger">Error al obtener los datos.</p>`;
        });
}

// MOSTRAR RESULTADOS

function mostrarResultados() {
    results.innerHTML = "";

    if (resultadosActuales.length === 0) {
        results.innerHTML = `<p class="text-center text-muted">No se encontraron resultados.</p>`;
        return;
    }

    resultadosActuales.forEach((item) => {
        const s = item.show;
        const img = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295?text=Sin+Imagen";
        const genres = s.genres.length ? s.genres.join(", ") : "No especificado";

        results.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card bg-secondary text-light h-100 shadow">
                    <img src="${img}" class="card-img-top" alt="${s.name}">
                    <div class="card-body">
                        <h5 class="card-title text-danger">${s.name}</h5>
                        <p><strong>Géneros:</strong> ${genres}</p>
                        <p><strong>Rating:</strong> ${s.rating.average || "N/A"
            }</p>

                        <button class="btn btn-outline-light btn-sm"
                            onclick="verMas('${encodeURIComponent(
                JSON.stringify(s)
            )}')">
                            Ver más
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

// MODAL — VER MÁS

function verMas(serie) {
    const s = JSON.parse(decodeURIComponent(serie));

    document.getElementById("modalTitle").textContent = s.name;

    document.getElementById("modalBody").innerHTML = `
        <img src="${s.image
            ? s.image.original
            : "https://via.placeholder.com/400x600?text=Sin+Imagen"
        }"
             class="img-fluid mb-3 rounded">

        <p><strong>Estrenada:</strong> ${s.premiered || "Desconocido"}</p>
        <p><strong>Idioma:</strong> ${s.language}</p>
        <p><strong>Géneros:</strong> ${s.genres.join(", ") || "No especificado"
        }</p>
        <p><strong>Rating:</strong> ${s.rating.average || "N/A"}</p>
        <p>${s.summary
            ? s.summary.replace(/<[^>]+>/g, "")
            : "Sin descripción disponible."
        }</p>

        ${s.officialSite
            ? `<a href="${s.officialSite}" target="_blank" class="btn btn-danger mt-2">Sitio oficial</a>`
            : ""
        }
    `;

    new bootstrap.Modal(document.getElementById("infoModal")).show();
}
