/* =========================
FILE: script.js
========================= */

let currentPage = 1;

// 1. Setup background music in memory
const bgMusic = new Audio('song.mp3');
bgMusic.loop = false; // Audio will no longer loop
bgMusic.volume = 1.0;

// 2. Setup crisp slicing sound effect in memory for the cake page
const sliceSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2596/2596-84.wav');
sliceSound.volume = 1.0;

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
        imgElement.src = "load2_circle-crop.png"; 
        // Dynamically applies the larger size class for the cropped circle image
        imgElement.className = "kitty load2_circle-crop-img";
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
            imgElement.src = "load1.png"; 
            // Dynamically switches to the larger size class for load1
            imgElement.className = "kitty load1-img";
        }

        // 3. Keep her on this loading screen with the music playing for 3 seconds, then reveal Page 1
        setTimeout(() => {
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


/* SWIPE DETECTION & INTERACTIVE CAKE CUTTING ENGINE */
let startX = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    // Only run this cake-cutting logic if she is currently looking at Page 2
    if (currentPage === 2) {
        // Check if the swipe movement crossed the threshold (50px width)
        if (Math.abs(startX - endX) > 50) {
            const cakeImg = document.getElementById("birthday-cake");
            
            if (cakeImg) {
                // 1. Play the cutting slice sound asset instantly
                sliceSound.play().catch(err => console.log("Audio waiting for user gesture:", err));
                
                // 2. FIXED: Removed the line changing .src to load2_circle-crop.png
                // Instead, we just trigger the visual cut/shake effect on the cake itself!
                cakeImg.classList.add("cake-cut-effect");
            }
            
            // 3. Leave the cake visible on screen with the slice effect for 1.2 seconds, then turn to Page 3 Gallery
            setTimeout(() => {
                nextPage(); 
            }, 1200);
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
