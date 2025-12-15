// Array donde se van a guardar todas las series que trae la API
let series = [];

// Variable para guardar la serie que se está adivinando actualmente
let serieActual = null;

// Función asincrónica que carga las series desde la API
async function cargarSeries() {
    // Se hace la petición a la API de TVMaze
    const res = await fetch("https://api.tvmaze.com/shows");

    // Se convierte la respuesta a formato JSON
    series = await res.json();

    // Se selecciona una serie al azar para comenzar el juego
    nuevaSerie();
}

// Función que selecciona una nueva serie aleatoria
function nuevaSerie() {
    // Se obtiene el elemento donde se muestra el mensaje al usuario
    const mensaje = document.getElementById("mensaje");

    // Se limpia el mensaje anterior
    mensaje.textContent = "";
    mensaje.style.color = "";

    // Se obtiene el input donde el usuario escribe la respuesta
    const input = document.getElementById("inputSerie");

    // Se limpia el input y se habilita
    input.value = "";
    input.disabled = false;

    // Se elige una serie al azar del array
    serieActual = series[Math.floor(Math.random() * series.length)];

    // Se obtiene el elemento de la imagen
    const img = document.getElementById("serieImg");

    // Si la serie tiene imagen, se muestra
    if (serieActual.image) {
        img.src = serieActual.image.medium;
    } else {
        // Si no tiene imagen, se muestra una imagen por defecto
        img.src = "https://via.placeholder.com/210x295?text=Sin+Imagen";
    }

    // Texto alternativo de la imagen
    img.alt = serieActual.name;
}

// Función que verifica si la respuesta del usuario es correcta
function verificar() {
    const input = document.getElementById("inputSerie");
    const mensaje = document.getElementById("mensaje");

    // Se toma la respuesta del usuario y se normaliza
    const respuesta = input.value.trim().toLowerCase();

    // Nombre correcto de la serie
    const correcto = serieActual.name.toLowerCase();

    // Comparación de la respuesta con el nombre real
    if (respuesta === correcto) {
        mensaje.textContent = "¡Correcto!";
        mensaje.style.color = "green";
    } else {
        mensaje.textContent = "Incorrecto. Era " + serieActual.name;
        mensaje.style.color = "red";
    }

    // Se desactiva el input después de responder
    input.disabled = true;
}

// Se cargan las series al iniciar la página
cargarSeries();