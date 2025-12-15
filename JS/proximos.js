window.onload = cargarRecientes;

async function cargarRecientes() {
    const contenedor = document.getElementById("estrenosContainer");

    try {
        const res = await fetch("https://api.tvmaze.com/shows");
        const data = await res.json();


        const recientes = data
            .filter(s => s.image)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        mostrarRecientes(recientes);

    } catch (error) {
        contenedor.innerHTML = `
            <p class="text-center text-danger">
                Error al cargar las series.
            </p>`;
    }
}

function mostrarRecientes(series) {
    const contenedor = document.getElementById("estrenosContainer");
    contenedor.innerHTML = "";

    series.forEach(s => {
        const img = s.image.medium;

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card bg-secondary text-light h-100 shadow">
                <img src="${img}" class="card-img-top" alt="${s.name}">
                <div class="card-body">
                    <h5 class="card-title text-danger">${s.name}</h5>
                    <p><strong>Idioma:</strong> ${s.language}</p>
                </div>
            </div>
        `;

        contenedor.appendChild(col);
    });
}
