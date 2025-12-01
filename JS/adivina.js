let seriesList = [];
let currentSerie = null;


function ordenarAleatorio() {
    return Math.random() - 0.5;
}

function eventoCheck() {
    checkGuess();
}

function eventoNext() {
    nuevaSerie();
}


async function cargarSeries() {
    const res = await fetch("https://api.tvmaze.com/shows");
    const data = await res.json();

    data.sort(ordenarAleatorio);

    seriesList = data.slice(0, 50);

    nuevaSerie();
}

function nuevaSerie() {
    const img = document.getElementById("serieImg");
    const input = document.getElementById("userGuess");
    const feedback = document.getElementById("feedback");
    const nextBtn = document.getElementById("nextBtn");

    currentSerie = seriesList[Math.floor(Math.random() * seriesList.length)];

    img.src = currentSerie.image ? currentSerie.image.medium : "https://via.placeholder.com/210x295?text=Sin+Imagen";
    input.value = "";
    feedback.textContent = "";
    nextBtn.style.display = "none";
}

function checkGuess() {
    const input = document.getElementById("userGuess");
    const feedback = document.getElementById("feedback");
    const nextBtn = document.getElementById("nextBtn");

    const userInput = input.value.trim().toLowerCase();
    const name = currentSerie.name.toLowerCase();

    if (!userInput) return;

    if (userInput === name) {
        feedback.textContent = "✅ ¡Correcto!";
        nextBtn.style.display = "inline-block";
    } else {
        feedback.textContent = "❌ Incorrecto. Intenta de nuevo.";
    }
}


document.getElementById("checkBtn").addEventListener("click", eventoCheck);
document.getElementById("nextBtn").addEventListener("click", eventoNext);

cargarSeries();
