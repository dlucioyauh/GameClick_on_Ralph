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
        backgroundMusic: null,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

// Inicializa o jogo
document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const nickname = localStorage.getItem("nickname");

    // Verificação para redirecionamento
    if (!nickname) {
        console.log("Nickname não encontrado, redirecionando para cadastro.");
        window.location.href = "cadastro.html";
    } else {
        startScreen.style.display = "block";
    }

    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        gameContainer.style.display = "block";
        init();
    });
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
    console.log("Iniciando o jogo..."); // Log para verificar a inicialização
    state.values.isGameOver = false;
    state.values.result = 0; // Reinicia a pontuação
    state.values.currentTime = 60; // Reinicia o tempo
    state.values.currentLives = 3; // Reinicia as vidas

    // Atualiza a interface do usuário
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.lives.textContent = state.values.currentLives;

    // Inicia a música de fundo
    if (state.values.backgroundMusic) {
        state.values.backgroundMusic.pause(); // Para a música anterior
    }
    state.values.backgroundMusic = new Audio('./src/assets/sounds/game-music.m4a');
    state.values.backgroundMusic.loop = true; // Define para tocar em loop
    state.values.backgroundMusic.play(); // Inicia a música de fundo

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    addSquareListeners();
    playSound("start"); // Toca a música de início
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

    // Chama a função para salvar a pontuação
    const nickname = localStorage.getItem("nickname");
    saveScore(nickname, state.values.result);

    // Adiciona o evento de clique para o botão de ver ranking
    document.getElementById('view-ranking-btn').addEventListener('click', function() {
        window.location.href = 'ranking.html'; // Redireciona para a página de ranking
    });
}



// Função para salvar a pontuação
function saveScore(name, score) {
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    rankings.push({ name, score });
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById("view-ranking-btn").addEventListener("click", viewRanking); // Adiciona o evento para ver ranking

// Função para reiniciar o jogo
function restartGame() {
    console.log("Reiniciando o jogo..."); // Log para verificar a chamada

    // Limpa os eventos de clique nos quadrados
    removeSquareListeners();

    // Reinicia os valores do estado
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.currentLives = 3;
    state.values.isGameOver = false;

    // Atualiza a interface do usuário
    console.log(`Vidas antes de reiniciar: ${state.values.currentLives}`); // Log para verificar o valor das vidas
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.lives.textContent = state.values.currentLives;

    // Esconde a tela de Game Over e mostra o container do jogo
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameContainer = document.getElementById("game-container");
    gameOverScreen.style.display = "none";
    gameContainer.style.display = "block";

    // Reinicia os quadrados
    state.view.squares.forEach(square => square.classList.remove("enemy"));

    // Reinicia o jogo
    init();
}

// Função para adicionar os eventos de clique aos quadrados
function addSquareListeners() {
    state.view.squares.forEach(square => {
        square.addEventListener("click", handleSquareClick);
    });
}

// Função para remover os eventos de clique dos quadrados
function removeSquareListeners() {
    state.view.squares.forEach(square => {
        square.removeEventListener("click", handleSquareClick);
    });
}

// Função para tratar o clique no quadrado
function handleSquareClick() {
    console.log(`Clicou no quadrado: ${this.id}`); // Log para verificar qual quadrado foi clicado

    if (this.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.currentLives = Math.min(state.values.currentLives + 1, 3); // Adiciona vida se possível
        state.view.lives.textContent = `${state.values.currentLives}x`;
        this.classList.remove("enemy");
        playSound("hit"); // Toca o som de acerto
    } else {
        state.values.currentLives--;
        state.view.lives.textContent = `${state.values.currentLives}x`;
        playSound("miss"); // Toca o som de erro
    }
}

// Função para escolher um quadrado aleatório
function randomSquare() {
    state.view.squares.forEach(square => {
        square.classList.remove("enemy");
    });

    const randomIndex = Math.floor(Math.random() * state.view.squares.length);
    const hitPosition = state.view.squares[randomIndex];
    hitPosition.classList.add("enemy");
    state.values.hitPosition = hitPosition.id;
}

// Função para ver ranking
function viewRanking() {
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    let rankingMessage = "Ranking:\n";
    rankings.sort((a, b) => b.score - a.score); // Ordena do maior para o menor
    rankings.forEach((entry, index) => {
        rankingMessage += `${index + 1}. ${entry.name}: ${entry.score}\n`;
    });
    alert(rankingMessage); // Exibe o ranking em um alerta (ou pode ser em uma nova página/modal)
}
