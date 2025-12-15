
let series = [];


document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
    cargarSeries();
}


function cargarSeries() {
    fetch("https://api.tvmaze.com/shows")
        .then(res => res.json())
        .then(data => {
            series = data.slice(0, 20);
            mostrarSeries();
        })
        .catch(() => {
            document.getElementById("seriesContainer").innerHTML =
                "<p class='text-danger text-center'>Error al cargar las series</p>";
        });
}


function mostrarSeries() {
    const contenedor = document.getElementById("seriesContainer");
    contenedor.innerHTML = "";

    for (let i = 0; i < series.length; i++) {
        const s = series[i];

        const imagen = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295";

        const rating = s.rating.average
            ? s.rating.average
            : "N/A";

        contenedor.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card text-light h-100 shadow">
                    <img src="${imagen}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="text-danger">${s.name}</h5>
                        <p><strong>Género:</strong> ${s.genres.join(", ") || "Desconocido"}</p>
                        <p><strong>Rating:</strong> ${rating}</p>

                        ${s.officialSite
                ? `<a href="${s.officialSite}" target="_blank" class="btn btn-danger btn-sm">Sitio oficial</a>`
                : ""
            }
                    </div>
                </div>
            </div>
        `;
    }
}
