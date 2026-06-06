/* =========================
FILE: script.js
========================= */

let currentPage = 1;

// 1. Setup background music in memory
const bgMusic = new Audio('song.mp3');
bgMusic.loop = true;
bgMusic.volume = 1.0;

/* --- THE INTRO -> LOADING SCREEN PIPELINE --- */
document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const textElement = loadingScreen.querySelector("h2");
    const imgElement = loadingScreen.querySelector(".kitty");

    // STEP A: Prepare the Intro Page State right away
    if (textElement) {
        textElement.innerHTML = "Click anywhere to open Sarah's Birthday Box! ✨🎁";
    }
    if (imgElement) {
        // Change this to whatever image/gif you want her to see BEFORE the loading page starts
        imgElement.src = "https://media.tenor.com/7UJ8w7E2l2AAAAAi/cute-love.gif"; 
    }

    // STEP B: The exact millisecond she clicks this intro screen...
    loadingScreen.addEventListener("click", () => {
        
        // 1. Play the music instantly!
        bgMusic.play().catch(err => console.log("Audio pipeline waiting:", err));
        
        // 2. NOW change the screen into the actual loading page state (load1.png)
        if (textElement) {
            textElement.innerHTML = "Loading your birthday surprise.... 💖";
        }
        if (imgElement) {
            imgElement.src = "load1.png"; // Puts your original kitty loader back
        }

        // 3. Keep her on this loading screen with the music playing for 3 seconds, then reveal Page 1
        setTimeout(() => {
            // FIXED: Uses classList instead of style.display to align perfectly with your 4:3 CSS structure
            loadingScreen.classList.add("hidden"); 
            document.getElementById("main-content").classList.remove("hidden");
        }, 3000);
        
    }, { once: true }); // Guarantees the click handler only runs once
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
