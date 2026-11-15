// 08/05/2026 (ano, mês - 1, dia)
var dataInicioAmor = new Date(2026, 4, 8);

function doisDigitos(n) {
    return String(n).padStart(2, "0");
}

function atualizarContador() {
    var s = Math.max(0, Math.floor((new Date() - dataInicioAmor) / 1000));

    document.getElementById("contador-dias").textContent = Math.floor(s / 86400);
    document.getElementById("contador-horas").textContent = doisDigitos(Math.floor(s / 3600) % 24);
    document.getElementById("contador-minutos").textContent = doisDigitos(Math.floor(s / 60) % 60);
    document.getElementById("contador-segundos").textContent = doisDigitos(s % 60);
}

document.addEventListener("DOMContentLoaded", function () {
    atualizarContador();
    setInterval(atualizarContador, 1000);

    carregarPosts(urlFeed(), 3, false);
});
