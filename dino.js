
let y = 0
let isjumping = false
let vy = 0
const dinoEl = document.getElementById("dino")
const endEl = document.getElementById("end")
const scoreEl = document.getElementById("score")
const gameEl = document.getElementById("game")
let paused = 1
let score = 0
let highest = 0;
let timer;
let startTime;
let nextspawn;

const animationManager =  {
    ids: new Set(),
    
    add(id) {
        this.ids.add(id)
        return id
    },

    clearAll() {
        this.ids.forEach(id => cancelAnimationFrame(id))
        this.ids.clear();
    },
}

function dino() {
    vy -= 1;
    y += vy;
    if (y <= 0) {
        y = 0;
        vy = 0;
        isjumping = false;
    }
    dinoEl.style.bottom = (y * gameEl.offsetHeight / 250) + 20 + "px"
    timer = Math.floor((Date.now() - startTime) / 100)
    score = `HI  ${highest}  ${timer}`
    scoreEl.textContent = score
}

let isvisible = 1
let pauseTime;
document.addEventListener ("visibilitychange", () => {
    if (paused) return;
    if (document.visibilityState === "hidden") {
        isvisible = 0
        pauseTime = Date.now()
    } else if ((document.visibilityState === "visible") && isvisible === 0) {
        isvisible = 1
        startTime += Date.now() - pauseTime
    }
})

document.addEventListener("touchstart", (e) => {
    jump();
});

document.addEventListener ("mousedown", (e) => {
    if (e.button === 0) jump();
})

document.addEventListener ("keydown", (e) => {
    if (e.key === " " || e.key == "ArrowUp") jump();
})

function jump() {
    if (paused) {
        init();
        return;
    }
    if (!isjumping) {
        vy = 18;
        isjumping = true;
    }
}

class Cactus {
    constructor() {
        this.el = document.createElement("div");
        this.el.classList.add("cactus");
        gameEl.appendChild(this.el);
        this.x = gameEl.offsetWidth;
        this.move();
    }

    move() {
        this.x -= Math.max(6, gameEl.offsetWidth / 100)
        this.el.style.left = this.x + "px"
        if (this.x < -20) {
            this.el.remove();
            return;
        }
        animationManager.add(requestAnimationFrame(() => this.move()));
        this.detect()
    }

    detect() {
        const cactusRect = this.el.getBoundingClientRect()
        const dinoRect = dinoEl.getBoundingClientRect()
        if (dinoRect.x < cactusRect.x + cactusRect.width &&
            dinoRect.x + dinoRect.width > cactusRect.x &&
            dinoRect.y < cactusRect.y + cactusRect.height &&
            dinoRect.y + dinoRect.height > cactusRect.y) {
                gameOver()
        }
    }
}

function addCactus() {
    new Cactus()
    nextspawn = timer + 5 + Math.random() * 15
}

function gameOver() {
    highest = timer > highest ? timer : highest
    score = `HI  ${highest}  ${timer}`
    scoreEl.textContent = score
    paused = 1
    endEl.style.display = "block"
    animationManager.clearAll();
}

function animate() {
    if (isvisible) {
        dino();
        if (timer >= nextspawn) addCactus()
    }
    animationManager.add(requestAnimationFrame(animate));
}

function init () {
    score = 0
    paused = 0
    startTime = Date.now()
    document.querySelectorAll(".cactus").forEach(el => el.remove());
    animate()
    endEl.style.display = "none"
    nextspawn = 5 + Math.random() * 15
}

endEl.style.display = "none"


