let series = [];
let serieActual = null;

async function cargarSeries() {
    const res = await fetch("https://api.tvmaze.com/shows");
    series = await res.json();
    nuevaSerie();
}

function nuevaSerie() {
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "";
    mensaje.style.color = "";

    const input = document.getElementById("inputSerie");
    input.value = "";
    input.disabled = false;

    serieActual = series[Math.floor(Math.random() * series.length)];

    const img = document.getElementById("serieImg");
    if (serieActual.image) {
        img.src = serieActual.image.medium;
    } else {
        img.src = "https://via.placeholder.com/210x295?text=Sin+Imagen";
    }
    img.alt = serieActual.name;
}

function verificar() {
    const input = document.getElementById("inputSerie");
    const mensaje = document.getElementById("mensaje");

    const respuesta = input.value.trim().toLowerCase();
    const correcto = serieActual.name.toLowerCase();

    if (respuesta === correcto) {
        mensaje.textContent = "¡Correcto!";
        mensaje.style.color = "green";
    } else {
        mensaje.textContent = "Incorrecto. Era " + serieActual.name;
        mensaje.style.color = "red";
    }

    input.disabled = true;
}

cargarSeries();
