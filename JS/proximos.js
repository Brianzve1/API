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
        // se mezclan de forma aleatoria
        // y se seleccionan solo 3
        const recientes = data
            .filter(s => s.image)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Se muestran las series seleccionadas en pantalla
        mostrarRecientes(recientes);

    } catch (error) {
        // Si ocurre un error al cargar los datos, se muestra un mensaje
        contenedor.innerHTML = `
            <p class="text-center text-danger">
                Error al cargar las series.
            </p>`;
    }
}

// Función que recibe un array de series y las muestra en cards
function mostrarRecientes(series) {
    const contenedor = document.getElementById("estrenosContainer");

    // Se limpia el contenido anterior
    contenedor.innerHTML = "";

    // Se recorre cada serie del array
    series.forEach(s => {
        // Se obtiene la imagen de la serie
        const img = s.image.medium;

        // Se crea una columna para Bootstrap
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        // Se arma la card con los datos de la serie
        col.innerHTML = `
            <div class="card bg-secondary text-light h-100 shadow">
                <img src="${img}" class="card-img-top" alt="${s.name}">
                <div class="card-body">
                    <h5 class="card-title text-danger">${s.name}</h5>
                    <p><strong>Idioma:</strong> ${s.language}</p>
                </div>
            </div>
        `;

        // Se agrega la card al contenedor principal
        contenedor.appendChild(col);
    });
}