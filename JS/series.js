// Array donde se almacenan las series obtenidas desde la API
let series = [];

// Cuando el DOM termina de cargarse, se ejecuta la función iniciar
document.addEventListener("DOMContentLoaded", iniciar);

// Función inicial del programa
function iniciar() {
    // Se cargan las series desde la API
    cargarSeries();
}

// Función que obtiene las series desde la API de TVMaze
function cargarSeries() {
    fetch("https://api.tvmaze.com/shows")
        // Se convierte la respuesta a JSON
        .then(res => res.json())
        .then(data => {
            // Se guardan solo las primeras 20 series
            series = data.slice(0, 20);

            // Se muestran las series en pantalla
            mostrarSeries();
        })
        .catch(() => {
            // Mensaje de error si falla la carga
            document.getElementById("seriesContainer").innerHTML =
                "<p class='text-danger text-center'>Error al cargar las series</p>";
        });
}

// Función que recorre el array de series y las muestra en cards
function mostrarSeries() {
    const contenedor = document.getElementById("seriesContainer");

    // Se limpia el contenedor antes de renderizar
    contenedor.innerHTML = "";

    // Se recorre el array de series
    for (let i = 0; i < series.length; i++) {
        const s = series[i];

        // Si la serie tiene imagen se usa, si no una imagen por defecto
        const imagen = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295";

        // Si la serie tiene rating se muestra, si no se indica N/A
        const rating = s.rating.average
            ? s.rating.average
            : "N/A";

        // Se agrega una card por cada serie
        contenedor.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card text-light h-100 shadow">
                    <img src="${imagen}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="text-danger">${s.name}</h5>
                        <p><strong>Género:</strong> ${s.genres.join(", ") || "Desconocido"}</p>
                        <p><strong>Rating:</strong> ${rating}</p>

                        ${
                            // Si la serie tiene sitio oficial, se muestra el botón
                            s.officialSite
                                ? `<a href="${s.officialSite}" target="_blank" class="btn btn-danger btn-sm">
                                      Sitio oficial
                                   </a>`
                                : ""
                        }
                    </div>
                </div>
            </div>
        `;
    }
}