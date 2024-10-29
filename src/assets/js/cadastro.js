// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("nickname");
    
    // Verifica se o inputField existe
    if (inputField) {
        inputField.addEventListener("focus", () => {
            console.log("Campo focado");
        });
        inputField.addEventListener("input", (e) => {
            console.log("Valor digitado:", e.target.value);
        });
    }

    const cadastroBtn = document.getElementById("cadastro-btn");
    
    // Verifica se o cadastroBtn existe
    if (cadastroBtn) {
        cadastroBtn.addEventListener("click", () => {
            const nickname = inputField.value; // Usa inputField que já foi verificado
            if (nickname) {
                localStorage.setItem("nickname", nickname);
                window.location.href = "index.html"; // Redireciona para o jogo
            } else {
                alert("Por favor, insira um nickname.");
            }
        });
    }
});
