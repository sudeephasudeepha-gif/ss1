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
                
                // 2. FIXED: Force the browser to reset the looping GIF animation right from frame 1
                const currentSrc = cakeImg.src;
                cakeImg.src = "";
                cakeImg.src = currentSrc;
                
                // 3. Apply the custom shake-and-fade animation class
                cakeImg.classList.add("cake-cut-effect");
            }
            
            // 4. FIXED: Reduced timer to 600ms so it cuts and seamlessly snaps right into Page 3 Gallery
            setTimeout(() => {
                nextPage(); 
            }, 600);
        }
    }
});


/* FINAL PAGE */
function showFinal(){
    nextPage();
    startConfetti();
}


/* FALLING HEARTS CONFETTI ENGINE */
function startConfetti(){
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    // Seamless full-screen responsiveness
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let hearts = [];
    // Vibrant pink, red, and rose palette for the princess theme
    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5', '#c9184a'];

    // Generate 80 unique heart particles
    for (let i = 0; i < 80; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,          // Spawns them out of view above the screen
            size: Math.random() * 14 + 10,               // Controls variation in heart scale
            speedX: Math.random() * 2 - 1,               // Gentle drift left and right
            speedY: Math.random() * 2 + 1.5,             // Custom downward velocity
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.4 + 0.6          // Provides a nice layering depth effect
        });
    }

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hearts.forEach((p) => {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            
            // Mathematical curve coordinates to draw a vector heart on canvas
            let topCurveHeight = p.size * 0.3;
            ctx.moveTo(p.x, p.y + topCurveHeight);
            
            // Top Left Curve
            ctx.bezierCurveTo(
                p.x - p.size / 2, p.y - p.size / 2, 
                p.x - p.size, p.y + p.size / 3, 
                p.x, p.y + p.size
            );

            // Top Right Curve
            ctx.bezierCurveTo(
                p.x + p.size, p.y + p.size / 3, 
                p.x + p.size / 2, p.y - p.size / 2, 
                p.x, p.y + topCurveHeight
            );
            
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

        update();
        requestAnimationFrame(draw); // High frame-rate standard loop for buttery smooth falling
    }

    function update(){
        hearts.forEach((p) => {
            p.y += p.speedY;
            p.x += p.speedX;

            // Loop hearts back to the top seamlessly when they pass the bottom border
            if (p.y > canvas.height) {
                p.y = -p.size;
                p.x = Math.random() * canvas.width;
            }
        });
    }

    // Kicks off the smooth frame loop
    requestAnimationFrame(draw);
}
