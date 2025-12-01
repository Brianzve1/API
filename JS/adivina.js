let seriesList = [];
let currentSerie = null;

// Traemos 50 series aleatorias de la API
async function cargarSeries() {
    const res = await fetch("https://api.tvmaze.com/shows");
    const data = await res.json();
    seriesList = data.sort(() => 0.5 - Math.random()).slice(0, 50); // mezclamos y tomamos 50
    nuevaSerie();
}

// Mostrar nueva serie
function nuevaSerie() {
    currentSerie = seriesList[Math.floor(Math.random() * seriesList.length)];
    const img = document.getElementById("serieImg");
    img.src = currentSerie.image ? currentSerie.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";
    document.getElementById("userGuess").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("nextBtn").style.display = "none";
}

// Comprobar respuesta
function checkGuess() {
    const userInput = document.getElementById("userGuess").value.trim().toLowerCase();
    const serieName = currentSerie.name.toLowerCase();

    if (!userInput) return;

    if (userInput === serieName) {
        document.getElementById("feedback").innerText = "✅ ¡Correcto!";
        document.getElementById("nextBtn").style.display = "inline-block";
    } else {
        document.getElementById("feedback").innerText = `❌ Incorrecto. Intenta de nuevo.`;
    }
}

// EVENTOS
document.getElementById("checkBtn").addEventListener("click", checkGuess);
document.getElementById("nextBtn").addEventListener("click", nuevaSerie);

// Cargar juego al inicio
cargarSeries();
