// Array donde se almacenan las series obtenidas desde la API
let series = [];

// Esperar a que el DOM termine de cargarse
document.addEventListener("DOMContentLoaded", iniciar);

// Función inicial que se ejecuta al cargar la página
function iniciar() {
    cargarSeries(); // Llamar a la función que trae las series
}

// Función que obtiene las series desde la API de TVMaze
function cargarSeries() {
    fetch("https://api.tvmaze.com/shows")
        .then(res => res.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Guardar solo las primeras 20 series
            series = data.slice(0, 20);
            mostrarSeries(); // Llamar a la función para mostrar las series
        })
        .catch(() => {
            // En caso de error, mostrar mensaje
            const contenedor = document.getElementById("seriesContainer");
            contenedor.replaceChildren(); // Limpiar contenedor

            const error = document.createElement("p");
            error.textContent = "Error al cargar las series"; // Mensaje de error
            error.className = "text-danger text-center"; // Estilo con Bootstrap

            contenedor.appendChild(error); // Agregar al contenedor
        });
}

// Función que recorre el array de series y las muestra en cards
function mostrarSeries() {
    const contenedor = document.getElementById("seriesContainer");

    // Limpiar contenedor antes de agregar nuevas cards
    contenedor.replaceChildren();

    // Recorrer todas las series
    for (let i = 0; i < series.length; i++) {
        const s = series[i];

        // Imagen de la serie, si no tiene se usa un placeholder
        const imagen = s.image
            ? s.image.medium
            : "https://via.placeholder.com/210x295";

        // Rating de la serie, si no tiene se muestra "N/A"
        const rating = s.rating.average
            ? s.rating.average
            : "N/A";

        // Crear columna para la card
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        // Crear card
        const card = document.createElement("div");
        card.className = "card text-light h-100 shadow";

        // Imagen de la card
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = imagen;
        img.alt = s.name;

        // Body de la card
        const body = document.createElement("div");
        body.className = "card-body";

        // Título de la serie
        const title = document.createElement("h5");
        title.className = "text-danger";
        title.textContent = s.name;

        // Género de la serie
        const genero = document.createElement("p");
        const generoStrong = document.createElement("strong");
        generoStrong.textContent = "Género: ";
        genero.appendChild(generoStrong);
        genero.appendChild(
            document.createTextNode(s.genres.join(", ") || "Desconocido")
        );

        // Rating de la serie
        const ratingP = document.createElement("p");
        const ratingStrong = document.createElement("strong");
        ratingStrong.textContent = "Rating: ";
        ratingP.appendChild(ratingStrong);
        ratingP.appendChild(document.createTextNode(rating));

        // Agregar título, género y rating al body
        body.append(title, genero, ratingP);

        // Botón de sitio oficial, si existe
        if (s.officialSite) {
            const link = document.createElement("a");
            link.href = s.officialSite;
            link.target = "_blank"; // Abrir en nueva pestaña
            link.className = "btn btn-danger btn-sm";
            link.textContent = "Sitio oficial";
            body.appendChild(link); // Agregar al body
        }

        // Armar la card completa
        card.append(img, body);
        col.appendChild(card);
        contenedor.appendChild(col); // Agregar al contenedor principal
    }
}