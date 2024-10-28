const cadastroBtn = document.getElementById("cadastro-btn");

cadastroBtn.addEventListener("click", () => {
    const nickname = document.getElementById("nickname").value;
    if (nickname) {
        localStorage.setItem("nickname", nickname); // Armazena o nickname no localStorage
        window.location.href = "index.html"; // Redireciona para a página do jogo
    } else {
        alert("Por favor, insira um nickname.");
    }
});
