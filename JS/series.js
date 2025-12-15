// Array donde se almacenan las series obtenidas desde la API
let series = [];

// Cuando el DOM termina de cargarse, se ejecuta la función iniciar
document.addEventListener("DOMContentLoaded", iniciar);

// Función inicial del programa
function iniciar() {
    cargarSeries();
}

// Función que obtiene las series desde la API de TVMaze
function cargarSeries() {
    fetch("https://api.tvmaze.com/shows")
        .then(res => res.json())
        .then(data => {
            // Se guardan solo las primeras 20 series
            series = data.slice(0, 20);
            mostrarSeries();
        })
        .catch(() => {
            const contenedor = document.getElementById("seriesContainer");
            contenedor.replaceChildren();

            const error = document.createElement("p");
            error.textContent = "Error al cargar las series";
            error.className = "text-danger text-center";

            contenedor.appendChild(error);
        });
}

// Función que recorre el array de series y las muestra en cards
function mostrarSeries() {
    const contenedor = document.getElementById("seriesContainer");

    // Limpia el contenedor
    contenedor.replaceChildren();

    for (let i = 0; i < series.length; i++) {
        const s = series[i];

        const imagen = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295";

        const rating = s.rating.average
            ? s.rating.average
            : "N/A";

        // Columna
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        // Card
        const card = document.createElement("div");
        card.className = "card text-light h-100 shadow";

        // Imagen
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = imagen;
        img.alt = s.name;

        // Body
        const body = document.createElement("div");
        body.className = "card-body";

        // Título
        const title = document.createElement("h5");
        title.className = "text-danger";
        title.textContent = s.name;

        // Género
        const genero = document.createElement("p");
        const generoStrong = document.createElement("strong");
        generoStrong.textContent = "Género: ";
        genero.appendChild(generoStrong);
        genero.appendChild(
            document.createTextNode(s.genres.join(", ") || "Desconocido")
        );

        // Rating
        const ratingP = document.createElement("p");
        const ratingStrong = document.createElement("strong");
        ratingStrong.textContent = "Rating: ";
        ratingP.appendChild(ratingStrong);
        ratingP.appendChild(document.createTextNode(rating));

        // Agregar elementos al body
        body.append(title, genero, ratingP);

        // Botón sitio oficial (si existe)
        if (s.officialSite) {
            const link = document.createElement("a");
            link.href = s.officialSite;
            link.target = "_blank";
            link.className = "btn btn-danger btn-sm";
            link.textContent = "Sitio oficial";
            body.appendChild(link);
        }

        // Armar la card
        card.append(img, body);
        col.appendChild(card);
        contenedor.appendChild(col);
    }
}