// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    // listeners para debug
    const inputField = document.getElementById("nickname");
    if (inputField) { // Verifica se o inputField existe
        inputField.addEventListener("focus", () => {
            console.log("Campo focado");
        });
        inputField.addEventListener("input", (e) => {
            console.log("Valor digitado:", e.target.value);
        });
    }

    // Código existente do botão
    const cadastroBtn = document.getElementById("cadastro-btn");
    if (cadastroBtn) { // Verifica se o cadastroBtn existe
        cadastroBtn.addEventListener("click", () => {
            const nickname = inputField.value; // Usa inputField que já foi verificado
            if (nickname) {
                localStorage.setItem("nickname", nickname);
                window.location.href = "index.html";
            } else {
                alert("Por favor, insira um nickname.");
            }
        });
    }
});
