var audioMusica = new Audio();
var musicaDisponivel = false;

function atualizarPlayer(titulo, status) {
    if (titulo != null) {
        document.getElementById("player-titulo-texto").textContent = titulo;
    }
    document.getElementById("player-status-texto").textContent = status;
}

function definirMusica(endereco, nome) {
    musicaDisponivel = true;
    audioMusica.src = endereco;
    audioMusica.loop = true;
    atualizarPlayer("🎶 " + (nome || "Nossa Música ♡"), "Clique para tocar ♡");
}

function carregarMusica() {
    requisicao("/posts/config/casal")
        .then(function (config) {
            if (config.musicaUrl) {
                definirMusica(config.musicaUrl, config.musicaNome);
            }
        })
        .catch(function () {
            atualizarPlayer(null, "Não foi possível carregar a música");
        });
}

function tocarOuPausar() {
    if (!musicaDisponivel) {
        atualizarPlayer(null, "Clique em 🎵 para escolher um .mp3");
        return;
    }

    if (audioMusica.paused) {
        audioMusica.play().catch(function () {
            atualizarPlayer(null, "Não foi possível tocar a música");
        });
    } else {
        audioMusica.pause();
    }
}

function escolherMusica() {
    if (exigirLogin("Entre na sua conta para escolher a nossa música ♡")) {
        document.getElementById("input-arquivo-musica").click();
    }
}

function enviarMusica() {
    var campo = document.getElementById("input-arquivo-musica");
    var usuario = usuarioLogado();

    if (campo.files.length == 0 || !usuario) {
        return;
    }

    var dados = new FormData();
    dados.append("idUsuarioServer", usuario.id);
    dados.append("musica", campo.files[0]);

    audioMusica.pause();
    atualizarPlayer(null, "Enviando a música...");

    requisicao("/posts/config/musica", { method: "POST", body: dados })
        .then(function (resultado) {
            definirMusica(resultado.musicaUrl, resultado.musicaNome);
            tocarOuPausar();
        })
        .catch(function (erro) {
            atualizarPlayer(null, erro.message);
        });

    campo.value = "";
}

audioMusica.addEventListener("play", function () {
    document.getElementById("player-musica").classList.add("tocando");
    document.getElementById("botao-tocar-musica").textContent = "⏸";
    atualizarPlayer(null, "Tocando agora ♡");
});

audioMusica.addEventListener("pause", function () {
    document.getElementById("player-musica").classList.remove("tocando");
    document.getElementById("botao-tocar-musica").textContent = "▶";
    atualizarPlayer(null, "Pausada");
});

audioMusica.addEventListener("error", function () {
    musicaDisponivel = false;
    atualizarPlayer("🎶 Nossa Música ♡", "Arquivo não encontrado: clique em 🎵");
});

document.addEventListener("DOMContentLoaded", carregarMusica);
