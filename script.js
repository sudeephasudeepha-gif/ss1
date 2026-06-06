/* =========================
FILE: script.js
========================= */

let currentPage = 1;

// 1. Create the audio element immediately in memory
const bgMusic = new Audio('song.mp3');
bgMusic.loop = true;
bgMusic.volume = 1.0;

/* --- THE LOADING SCREEN AUTOMATIC TRICK --- */
document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const textElement = loadingScreen.querySelector("h2");

    // A. Change the loading text to something exciting that Sarah will want to tap
    if (textElement) {
        textElement.innerHTML = "Click anywhere to open Sarah's Birthday Box! ✨🎁";
    }

    // B. The exact millisecond she taps the loading screen, the music starts, 
    // and the 3-second loading countdown begins!
    loadingScreen.addEventListener("click", () => {
        
        // Start the song immediately on the loading page!
        bgMusic.play().catch(err => console.log("Audio blocked by browser:", err));
        
        if (textElement) {
            textElement.innerHTML = "Loading your birthday surprise.... 💖";
        }

        // Keep her on the loading screen with the music playing for 3 seconds
        setTimeout(() => {
            loadingScreen.style.display = "none";
            document.getElementById("main-content").classList.remove("hidden");
        }, 3000);
        
    }, { once: true }); // Ensure this tap trigger only runs once
});


/* NEXT PAGE */
function nextPage(){
    document.getElementById(`page${currentPage}`).classList.remove("active");
    currentPage++;
    document.getElementById(`page${currentPage}`).classList.add("active");
}


/* SWIPE DETECTION */
let startX = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (currentPage === 2) {
        if (Math.abs(startX - endX) > 50) {
            nextPage();
        }
    }
});


/* FINAL PAGE */
function showFinal(){
    nextPage();
    startConfetti();
}


/* CONFETTI */
function startConfetti(){
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pieces = [];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 150
        });
    }

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff4fa0";

        pieces.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            ctx.fill();
        });

        update();
    }

    function update(){
        pieces.forEach((p) => {
            p.y += 2;
            if (p.y > canvas.height) {
                p.y = 0;
            }
        });
    }

    setInterval(draw, 20);
}
