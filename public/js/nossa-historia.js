function carregarCapitulos() {
    var logado = usuarioLogado() != null;

    return requisicao("/posts/capitulos")
        .then(function (capitulos) {
            var html = "";

            for (var i = 0; i < capitulos.length; i++) {
                var capitulo = capitulos[i];
                var botaoExcluir = logado
                    ? '<button type="button" class="botao-excluir-capitulo" onclick="excluirCapitulo(' + capitulo.id + ')">✕ Excluir</button>'
                    : "";

                html +=
                    '<article class="linha-do-tempo-item">' +
                        '<div class="linha-do-tempo-cabecalho">' +
                            '<span class="etiqueta">' + escaparHtml(capitulo.etiqueta) + "</span>" +
                            botaoExcluir +
                        "</div>" +
                        "<h3>" + escaparHtml(capitulo.titulo) + "</h3>" +
                        "<p>" + escaparHtml(capitulo.descricao) + "</p>" +
                    "</article>";
            }

            document.getElementById("capitulos-personalizados").innerHTML = html;
        })
        .catch(function (erro) {
            console.log(erro.message);
        });
}

function adicionarCapitulo(evento) {
    evento.preventDefault();

    var usuario = exigirLogin();

    if (!usuario) {
        return;
    }

    enviarJson("/posts/capitulos", "POST", {
        idUsuarioServer: usuario.id,
        etiquetaServer: document.getElementById("input-historia-etiqueta").value.trim(),
        tituloServer: document.getElementById("input-historia-titulo").value.trim(),
        descricaoServer: document.getElementById("input-historia-descricao").value.trim()
    })
        .then(function () {
            document.getElementById("formulario-historia").reset();
            mostrarMensagem("mensagem-historia", "Capítulo adicionado à nossa história!", "sucesso");
            return carregarCapitulos();
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-historia", erro.message, "erro");
        });
}

function excluirCapitulo(idCapitulo) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Excluir este capítulo da linha do tempo?")) {
        return;
    }

    enviarJson("/posts/capitulos/" + idCapitulo, "DELETE", { idUsuarioServer: usuario.id })
        .then(carregarCapitulos)
        .catch(function (erro) {
            alert(erro.message);
        });
}

function soltarCoracoes() {
    var coracoes = ["💖", "💕", "♥", "💗", "✨"];

    for (var i = 0; i < 14; i++) {
        var particula = document.createElement("span");

        particula.className = "coracao-particula";
        particula.textContent = coracoes[i % coracoes.length];
        particula.style.left = Math.random() * 100 + "vw";
        particula.style.animationDelay = Math.random() * 0.6 + "s";

        document.body.appendChild(particula);
        setTimeout(particula.remove.bind(particula), 3200);
    }
}

function carregarSonhos() {
    var logado = usuarioLogado() != null;

    return requisicao("/posts/sonhos")
        .then(function (sonhos) {
            var html = "";
            var realizados = 0;

            for (var i = 0; i < sonhos.length; i++) {
                var sonho = sonhos[i];

                if (sonho.realizado) {
                    realizados++;
                }

                html +=
                    '<div class="sonho-card' + (sonho.realizado ? " realizado" : "") + '">' +
                        '<label class="sonho-marcador">' +
                            '<input type="checkbox" onchange="alternarSonho(' + sonho.id + ', this)"' + (sonho.realizado ? " checked" : "") + " />" +
                            '<span class="sonho-texto">' + escaparHtml(sonho.titulo) + "</span>" +
                        "</label>" +
                        '<span class="sonho-situacao">' + (sonho.realizado ? "Realizado ♡" : "Em breve") + "</span>" +
                        (logado ? '<button type="button" class="comentario-excluir" onclick="removerSonho(' + sonho.id + ')" title="Remover sonho">&times;</button>' : "") +
                    "</div>";
            }

            if (sonhos.length == 0) {
                html = '<p class="texto-suave">Nenhum sonho cadastrado ainda. Adicione o primeiro ♡</p>';
            }

            var percentual = sonhos.length > 0 ? (realizados / sonhos.length) * 100 : 0;

            document.getElementById("lista-sonhos").innerHTML = html;
            document.getElementById("texto-progresso-sonhos").textContent = realizados + " de " + sonhos.length + " realizados";
            document.getElementById("barra-progresso-sonhos").style.width = percentual + "%";
        })
        .catch(function (erro) {
            console.log(erro.message);
        });
}

function adicionarSonho(evento) {
    evento.preventDefault();

    var usuario = exigirLogin();
    var campo = document.getElementById("input-sonho-titulo");

    if (!usuario) {
        return;
    }

    enviarJson("/posts/sonhos", "POST", {
        idUsuarioServer: usuario.id,
        tituloServer: campo.value.trim()
    })
        .then(function () {
            campo.value = "";
            return carregarSonhos();
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function alternarSonho(idSonho, caixa) {
    var usuario = usuarioLogado();

    if (!usuario) {
        caixa.checked = !caixa.checked;
        exigirLogin("Entre na sua conta para marcar um sonho ♡");
        return;
    }

    var realizou = caixa.checked;

    enviarJson("/posts/sonhos/" + idSonho + "/alternar", "PUT", { idUsuarioServer: usuario.id })
        .then(function () {
            if (realizou) {
                soltarCoracoes();
            }
            return carregarSonhos();
        })
        .catch(function (erro) {
            alert(erro.message);
            carregarSonhos();
        });
}

function removerSonho(idSonho) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Remover este sonho da lista?")) {
        return;
    }

    enviarJson("/posts/sonhos/" + idSonho, "DELETE", { idUsuarioServer: usuario.id })
        .then(carregarSonhos)
        .catch(function (erro) {
            alert(erro.message);
        });
}

function carregarLugares() {
    var logado = usuarioLogado() != null;

    return requisicao("/posts/lugares")
        .then(function (lugares) {
            var html = "";

            for (var i = 0; i < lugares.length; i++) {
                var lugar = lugares[i];

                html +=
                    '<div class="lugar-card' + (lugar.visitado ? " visitado" : "") + '">' +
                        "<div>" +
                            '<div class="lugar-card-topo">' +
                                '<span class="etiqueta">' + escaparHtml(lugar.tipo) + "</span>" +
                                (logado ? '<button type="button" class="comentario-excluir" onclick="removerLugar(' + lugar.id + ')" title="Remover lugar">&times;</button>' : "") +
                            "</div>" +
                            "<h3>" + escaparHtml(lugar.nome) + "</h3>" +
                            "<p>" + escaparHtml(lugar.nota) + "</p>" +
                        "</div>" +
                        '<div class="lugar-card-rodape">' +
                            '<span class="texto-suave">' + (lugar.visitado ? "Já fomos juntos ♡" : "Ainda vamos conhecer") + "</span>" +
                            '<button type="button" class="lugar-botao-situacao" onclick="alternarLugar(' + lugar.id + ')">' +
                                (lugar.visitado ? "✓ Visitado" : "Marcar como visitado") +
                            "</button>" +
                        "</div>" +
                    "</div>";
            }

            if (lugares.length == 0) {
                html = '<p class="texto-suave">Nenhum lugar cadastrado ainda. Adicione o primeiro ♡</p>';
            }

            document.getElementById("lista-lugares").innerHTML = html;
        })
        .catch(function (erro) {
            console.log(erro.message);
        });
}

function adicionarLugar(evento) {
    evento.preventDefault();

    var usuario = exigirLogin();

    if (!usuario) {
        return;
    }

    enviarJson("/posts/lugares", "POST", {
        idUsuarioServer: usuario.id,
        nomeServer: document.getElementById("input-lugar-nome").value.trim(),
        tipoServer: document.getElementById("select-lugar-tipo").value,
        notaServer: document.getElementById("input-lugar-nota").value.trim()
    })
        .then(function () {
            document.getElementById("formulario-lugar").reset();
            return carregarLugares();
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function alternarLugar(idLugar) {
    var usuario = exigirLogin("Entre na sua conta para marcar um lugar ♡");

    if (!usuario) {
        return;
    }

    enviarJson("/posts/lugares/" + idLugar + "/alternar", "PUT", { idUsuarioServer: usuario.id })
        .then(carregarLugares)
        .catch(function (erro) {
            alert(erro.message);
        });
}

function removerLugar(idLugar) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Remover este lugar da lista?")) {
        return;
    }

    enviarJson("/posts/lugares/" + idLugar, "DELETE", { idUsuarioServer: usuario.id })
        .then(carregarLugares)
        .catch(function (erro) {
            alert(erro.message);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (usuarioLogado()) {
        document.getElementById("secao-formulario-historia").hidden = false;
        document.getElementById("formulario-sonho").hidden = false;
        document.getElementById("secao-formulario-lugar").hidden = false;
    }

    carregarCapitulos();
    carregarSonhos();

    carregarLugares().then(function () {
        if (window.location.hash == "#secao-lugares") {
            document.getElementById("secao-lugares").scrollIntoView();
        }
    });
});
