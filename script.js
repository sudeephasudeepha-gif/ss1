/* =========================
FILE: script.js
========================= */

let currentPage = 1;

/* LOADING SCREEN */

setTimeout(() => {

  document.getElementById("loading-screen").style.display = "none";

  document.getElementById("main-content").classList.remove("hidden");

},3000);


/* NEXT PAGE */

function nextPage(){

  document.getElementById(`page${currentPage}`).classList.remove("active");

  currentPage++;

  document.getElementById(`page${currentPage}`).classList.add("active");
}

/* SWIPE DETECTION */

let startX = 0;

document.addEventListener("touchstart",(e)=>{

  startX = e.touches[0].clientX;
});

document.addEventListener("touchend",(e)=>{

  let endX = e.changedTouches[0].clientX;

  if(currentPage === 2){

    if(Math.abs(startX - endX) > 50){

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

  for(let i=0;i<150;i++){

    pieces.push({

      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*6+2,
      d:Math.random()*150
    });
  }

  function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#ff4fa0";

    pieces.forEach((p)=>{

      ctx.beginPath();

      ctx.arc(p.x,p.y,p.r,0,Math.PI*2,true);

      ctx.fill();
    });

    update();
  }

  function update(){

    pieces.forEach((p)=>{

      p.y += 2;

      if(p.y > canvas.height){

        p.y = 0;
      }
    });
  }

  setInterval(draw,20);
}
