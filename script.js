/* =========================
FILE: script.js
========================= */

let currentPage = 1;

// 1. Setup background music in memory
const bgMusic = new Audio('song.mp3');
bgMusic.loop = false;
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
function startConfetti() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let hearts = [];

    // Create hearts
    for (let i = 0; i < 120; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,

            // ❤️ size
            size: Math.random() * 2 + 16,

            speedX: Math.random() * 1.2 - 0.6,
            speedY: Math.random() * 1.5 + 0.8,

            opacity: Math.random() * 0.4 + 0.6
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hearts.forEach((heart) => {
            ctx.save();

            ctx.globalAlpha = heart.opacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${heart.size}px Arial`;

            // Position heart
            ctx.translate(heart.x, heart.y);

            // Make heart slightly taller
            ctx.scale(1, 1.4);

            // Draw actual emoji
            ctx.fillText("❤️", 0, 0);

            ctx.restore();
        });

        update();
        requestAnimationFrame(draw);
    }

    function update() {
        hearts.forEach((heart) => {
            heart.y += heart.speedY;
            heart.x += heart.speedX;

            // Respawn at top
            if (heart.y > canvas.height + 50) {
                heart.y = -50;
                heart.x = Math.random() * canvas.width;
            }

            // Wrap horizontally
            if (heart.x < -50) {
                heart.x = canvas.width + 50;
            }

            if (heart.x > canvas.width + 50) {
                heart.x = -50;
            }
        });
    }

    requestAnimationFrame(draw);
}
