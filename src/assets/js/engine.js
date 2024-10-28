const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        currentLives: 3,
        isGameOver: false,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

const startBtn = document.querySelector("#start-btn");
const startScreen = document.querySelector("#start-screen");
const gameOverScreen = document.querySelector("#game-over-screen");
const restartBtn = document.querySelector("#restart-btn");

startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    playSound("start");
    init();
});

restartBtn.addEventListener("click", () => {
    restartGame(); 
});

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0 || state.values.currentLives <= 0) {
        setTimeout(endGame, 50);
        playSound("game-over-2");
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/assets/sounds/${audioName}.m4a`);
    audio.volume = 1;
    audio.play();
}

let lastSquare = null;

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    if (state.values.isGameOver) return;

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 9);
    } while (randomNumber === lastSquare);
    
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;

    lastSquare = randomNumber;
}

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.replaceWith(square.cloneNode(true));
    });
    
    state.view.squares = document.querySelectorAll(".square");

    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.isGameOver || state.values.hitPosition === null) { 
                return;
            }
               
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            } else {
                playSound("miss");
                
                if (state.values.currentLives > 0) {
                    state.values.currentLives--;
                    state.view.lives.textContent = state.values.currentLives;
                 
                    if (state.values.currentLives === 0) { 
                        setTimeout(endGame, 100);
                        playSound("game-over");
                    }
                }
            }
        });        
    });
}

const gameMusic = new Audio("./src/assets/sounds/game-music.m4a");

function restartGame() {
    state.values.currentTime = 60;
    state.values.result = 0;
    state.values.currentLives = 3;
    state.values.isGameOver = false;

    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.currentLives;
    state.view.timeLeft.textContent = state.values.currentTime;

    gameOverScreen.style.display = "none";

    init();
}

function endGame() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.values.isGameOver = true;
    gameMusic.pause();
    gameMusic.currentTime = 0;
    gameOverScreen.style.display = "flex";
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.textContent = "Game Over! O seu resultado foi: " + state.values.result;
}

function playGameMusic() {
    gameMusic.volume = 0.15;
    gameMusic.loop = true;
    gameMusic.play();
}

function init() {
    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    addListenerHitbox();
    playGameMusic();
}
