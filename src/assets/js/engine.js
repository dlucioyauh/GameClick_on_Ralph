const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: null,
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

// Inicializa o jogo apenas quando a página for carregada
document.addEventListener("DOMContentLoaded", () => {
    const nickname = localStorage.getItem("nickname");
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    
    if (nickname) {
        startScreen.style.display = "block";
    } else {
        window.location.href = "cadastro.html";
    }

    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        gameContainer.style.display = "block";
        init();
    });

    setupButton(); // Configura o botão de retorno
});

// Função para o timer de contagem regressiva
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0 || state.values.currentLives <= 0) {
        setTimeout(endGame, 50);
        playSound("game-over-2");
    }
}

// Função para tocar som
function playSound(audioName) {
    const audio = new Audio(`./src/assets/sounds/${audioName}.m4a`);
    audio.play();
}

// Função para iniciar o jogo
function init() {
    state.values.isGameOver = false;
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    addSquareListeners();
    playSound("start"); // Toca a música de início

    // Toca a música de fundo em loop
    const backgroundMusic = new Audio('./src/assets/sounds/game-music.m4a');
    backgroundMusic.loop = true; // Define para tocar em loop
    backgroundMusic.play(); // Inicia a música de fundo
}

// Função para finalizar o jogo
function endGame() {
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);
    state.values.isGameOver = true;
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.display = "none";
    gameOverScreen.style.display = "flex";
    document.getElementById("game-over-message").textContent = `Game Over! Pontuação: ${state.values.result}`;
    
    // Toca a música de game over
    playSound("game-over-2");
}

// Função para reiniciar o jogo
function restartGame() {
    console.log("Reiniciando o jogo..."); // Verifique se esta linha é chamada
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "none"; // Esconde a tela de game over
    state.values.result = 0; // Reinicia a pontuação
    state.view.score.textContent = state.values.result; // Atualiza a pontuação na tela
    state.values.currentLives = 3; // Reinicia as vidas
    state.view.lives.textContent = state.values.currentLives; // Atualiza a exibição de vidas
    state.values.currentTime = 60; // Reinicia o tempo
    state.view.timeLeft.textContent = state.values.currentTime; // Atualiza o tempo na tela
    init(); // Reinicia o jogo
}

document.getElementById('restart-btn').addEventListener('click', restartGame);

// Função para configurar o botão de retorno
function setupButton() {
    const botaoRetorno = document.getElementById('restart-btn');
    console.log(botaoRetorno); // Verifique se o botão é encontrado
    if (botaoRetorno) {
        botaoRetorno.removeEventListener('click', restartGame); // Remova o listener anterior se houver
        botaoRetorno.addEventListener('click', restartGame); // Chama a função de reiniciar o jogo
    } else {
        console.log("Botão de retorno não encontrado!");
    }
}

// Função para adicionar os eventos de clique aos quadrados
function addSquareListeners() {
    state.view.squares.forEach(square => {
        square.addEventListener("click", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                playSound("hit");
            } else {
                state.values.currentLives--;
                state.view.lives.textContent = state.values.currentLives;
                playSound("miss");
                if (state.values.currentLives <= 0) {
                    endGame();
                }
            }
        });
    });
}

// Função para sortear um quadrado aleatório
function randomSquare() {
    state.view.squares.forEach(square => square.classList.remove("enemy"));
    const randomSquare = state.view.squares[Math.floor(Math.random() * state.view.squares.length)];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}
function saveScore(name, score) {
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    rankings.push({ name, score });
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

// Chame esta função no final do jogo, passando o nickname e a pontuação
saveScore(nickname, state.values.result);