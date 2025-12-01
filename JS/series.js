let seriesPopulares = [];

document.addEventListener("DOMContentLoaded", cargarSeriesPopulares);

function cargarSeriesPopulares() {
    fetch("https://api.tvmaze.com/shows")
        .then((res) => res.json())
        .then((data) => {
            seriesPopulares = data.slice(0, 20);
            mostrarSeriesPopulares();
        })
        .catch(() => {
            const contenedor = document.getElementById("seriesContainer");
            contenedor.textContent = ""; 

            const p = document.createElement("p");
            p.classList.add("text-center", "text-danger");
            p.textContent = "Error al cargar las series populares.";

            contenedor.appendChild(p);
        });
}

function mostrarSeriesPopulares() {
    const contenedor = document.getElementById("seriesContainer");
    contenedor.textContent = ""; 

    seriesPopulares.forEach((s) => {
        const col = crearColumnaSerie(s);
        contenedor.appendChild(col);
    });
}

function crearColumnaSerie(serie) {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

    const card = crearCardSerie(serie);
    col.appendChild(card);

    return col;
}

function crearCardSerie(serie) {
    const card = document.createElement("div");
    card.classList.add("card", "text-light", "h-100", "shadow");

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = serie.image ? serie.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";
    img.alt = serie.name;

    const body = crearCardBody(serie);

    card.appendChild(img);
    card.appendChild(body);

    return card;
}

function crearCardBody(serie) {
    const body = document.createElement("div");
    body.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-title", "text-danger");
    title.textContent = serie.name;

    const genero = document.createElement("p");
    genero.innerHTML = `<strong>Género:</strong> ${serie.genres.join(", ") || "Desconocido"}`;

    const rating = document.createElement("p");
    rating.innerHTML = `<strong>Rating:</strong> ${serie.rating.average ? serie.rating.average + "/10" : "N/A"}`;

    body.appendChild(title);
    body.appendChild(genero);
    body.appendChild(rating);

    if (serie.officialSite) {
        const btn = document.createElement("a");
        btn.classList.add("btn", "btn-danger", "btn-sm");
        btn.href = serie.officialSite;
        btn.target = "_blank";
        btn.textContent = "Sitio oficial";

        body.appendChild(btn);
    }

    return body;
}
