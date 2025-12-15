// Cuando la página termina de cargar, se ejecuta la función cargarRecientes
window.onload = cargarRecientes;

// Función asincrónica que obtiene series recientes desde la API
async function cargarRecientes() {
    // Contenedor donde se van a mostrar las series
    const contenedor = document.getElementById("estrenosContainer");

    try {
        // Petición a la API de TVMaze
        const res = await fetch("https://api.tvmaze.com/shows");

        // Conversión de la respuesta a JSON
        const data = await res.json();

        // Se filtran las series que tienen imagen,
        // se mezclan de forma aleatoria y se seleccionan solo 3
        const recientes = data
            .filter(s => s.image)        // Solo series con imagen
            .sort(() => Math.random() - 0.5) // Mezclar aleatoriamente
            .slice(0, 3);                // Tomar solo 3

        // Se muestran las series seleccionadas en pantalla
        mostrarRecientes(recientes);

    } catch (error) {
        // Si ocurre un error al cargar los datos, se muestra un mensaje
        contenedor.replaceChildren(); // Limpiar contenedor

        const p = document.createElement("p"); // Crear párrafo de error
        p.textContent = "Error al cargar las series."; // Texto del mensaje
        p.className = "text-center text-danger"; // Clases de Bootstrap

        contenedor.appendChild(p); // Agregar mensaje al contenedor
    }
}

// Función que recibe un array de series y las muestra en cards
function mostrarRecientes(series) {
    const contenedor = document.getElementById("estrenosContainer");

    // Se limpia el contenido anterior
    contenedor.replaceChildren();

    // Se recorre cada serie del array
    series.forEach(s => {
        const img = s.image.medium; // Obtener imagen de la serie

        // Crear columna para Bootstrap
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        // Crear card
        const card = document.createElement("div");
        card.className = "card bg-secondary text-light h-100 shadow";

        // Crear imagen de la card
        const imgEl = document.createElement("img");
        imgEl.src = img;
        imgEl.alt = s.name;
        imgEl.className = "card-img-top";

        // Crear body de la card
        const body = document.createElement("div");
        body.className = "card-body";

        // Título de la serie
        const h5 = document.createElement("h5");
        h5.textContent = s.name;
        h5.className = "card-title text-danger";

        // Idioma de la serie
        const pIdioma = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = "Idioma: ";
        pIdioma.appendChild(strong);
        pIdioma.appendChild(document.createTextNode(s.language));

        // Agregar título y idioma al body
        body.append(h5, pIdioma);

        // Armar la card completa
        card.append(imgEl, body);

        // Agregar la card a la columna
        col.appendChild(card);

        // Agregar columna al contenedor principal
        contenedor.appendChild(col);
    });
}