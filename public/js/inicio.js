var dataInicioAmor = null;

function atualizarContador() {
    if (!dataInicioAmor) {
        return;
    }

    var segundosTotais = Math.floor((new Date() - dataInicioAmor) / 1000);

    if (segundosTotais < 0) {
        segundosTotais = 0;
    }

    var dias = Math.floor(segundosTotais / 86400);
    var horas = Math.floor((segundosTotais % 86400) / 3600);
    var minutos = Math.floor((segundosTotais % 3600) / 60);
    var segundos = segundosTotais % 60;

    document.getElementById("contador-dias").textContent = dias;
    document.getElementById("contador-horas").textContent = String(horas).padStart(2, "0");
    document.getElementById("contador-minutos").textContent = String(minutos).padStart(2, "0");
    document.getElementById("contador-segundos").textContent = String(segundos).padStart(2, "0");
}

function definirDataInicio(dataIso) {
    dataInicioAmor = new Date(dataIso + "T00:00:00");
    atualizarContador();
}

function carregarContador() {
    requisicao("/posts/config/casal")
        .then(function (config) {
            definirDataInicio(config.dataInicioAmor);
        })
        .catch(function (erro) {
            console.log(erro.message);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    carregarContador();
    setInterval(atualizarContador, 1000);

    carregarPosts(urlFeed(), 3, false);
});
