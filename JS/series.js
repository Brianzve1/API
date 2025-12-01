// VARIABLES GLOBALES
let seriesPopulares = [];

// INICIO AUTOMÁTICO
document.addEventListener("DOMContentLoaded", cargarSeriesPopulares);

// CARGAR SERIES POPULARES
function cargarSeriesPopulares() {
    fetch("https://api.tvmaze.com/shows")
        .then((res) => res.json())
        .then((data) => {
            // guardo las primeras 20
            seriesPopulares = data.slice(0, 20);
            mostrarSeriesPopulares();
        })
        .catch(() => {
            document.getElementById("seriesContainer").innerHTML = `
                <p class="text-center text-danger">Error al cargar las series populares.</p>
            `;
        });
}

// MOSTRAR SERIES POPULARES
function mostrarSeriesPopulares() {
    const contenedor = document.getElementById("seriesContainer");
    contenedor.innerHTML = "";

    seriesPopulares.forEach((s) => {
        const image = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295?text=Sin+Imagen";

        const rating = s.rating.average ? s.rating.average + "/10" : "N/A";

        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        col.innerHTML = `
            <div class="card text-light h-100 shadow">
                <img src="${image}" class="card-img-top" alt="${s.name}">
                <div class="card-body">
                    <h5 class="card-title text-danger">${s.name}</h5>
                    <p><strong>Género:</strong> ${s.genres.join(", ") || "Desconocido"
            }</p>
                    <p><strong>Rating:</strong> ${rating}</p>

                    ${s.officialSite
                ? `<a href="${s.officialSite}" target="_blank" class="btn btn-danger btn-sm">Sitio oficial</a>`
                : ""
            }
                </div>
            </div>
        `;

        contenedor.appendChild(col);
    });
}
