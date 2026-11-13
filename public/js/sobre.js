var cartaAtual = null;

function mostrarCarta(config) {
    cartaAtual = config;

    var paragrafos = config.sobreTexto.split(/\n+/);
    var html = "";

    for (var i = 0; i < paragrafos.length; i++) {
        if (paragrafos[i].trim() != "") {
            html += "<p>" + escaparHtml(paragrafos[i]) + "</p>";
        }
    }

    document.getElementById("carta-titulo").textContent = config.sobreTitulo;
    document.getElementById("carta-paragrafos").innerHTML = html;
    document.getElementById("carta-assinatura").textContent = config.sobreAssinatura;
}

function carregarCarta() {
    requisicao("/posts/config/casal")
        .then(mostrarCarta)
        .catch(function (erro) {
            console.log(erro.message);
        });
}

function editarCarta() {
    if (!cartaAtual) {
        alert("Não foi possível carregar a declaração. Tente recarregar a página.");
        return;
    }

    document.getElementById("input-carta-titulo").value = cartaAtual.sobreTitulo;
    document.getElementById("input-carta-texto").value = cartaAtual.sobreTexto;
    document.getElementById("input-carta-assinatura").value = cartaAtual.sobreAssinatura;

    document.getElementById("carta-visualizacao").hidden = true;
    document.getElementById("formulario-carta").hidden = false;
}

function fecharEdicaoCarta() {
    document.getElementById("formulario-carta").hidden = true;
    document.getElementById("carta-visualizacao").hidden = false;
}

function salvarCarta(evento) {
    evento.preventDefault();

    var usuario = exigirLogin();

    if (!usuario) {
        return;
    }

    enviarJson("/posts/config/sobre-ela", "PUT", {
        idUsuarioServer: usuario.id,
        tituloServer: document.getElementById("input-carta-titulo").value.trim(),
        textoServer: document.getElementById("input-carta-texto").value.trim(),
        assinaturaServer: document.getElementById("input-carta-assinatura").value.trim()
    })
        .then(function (config) {
            mostrarCarta(config);
            fecharEdicaoCarta();
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function carregarQualidades() {
    var logado = usuarioLogado() != null;

    return requisicao("/posts/qualidades")
        .then(function (qualidades) {
            var html = "";

            for (var i = 0; i < qualidades.length; i++) {
                var qualidade = qualidades[i];

                html +=
                    '<div class="qualidade-card">' +
                        '<div class="qualidade-icone">' + escaparHtml(qualidade.icone) + "</div>" +
                        "<h3>" + escaparHtml(qualidade.titulo) + "</h3>" +
                        '<p class="texto-suave margem-topo-8">' + escaparHtml(qualidade.descricao) + "</p>" +
                        (logado ? '<button type="button" class="botao-excluir-capitulo margem-topo-12" onclick="removerQualidade(' + qualidade.id + ')">✕ Remover</button>' : "") +
                    "</div>";
            }

            document.getElementById("qualidades-personalizadas").innerHTML = html;
        })
        .catch(function (erro) {
            console.log(erro.message);
        });
}

function adicionarQualidade(evento) {
    evento.preventDefault();

    var usuario = exigirLogin();

    if (!usuario) {
        return;
    }

    enviarJson("/posts/qualidades", "POST", {
        idUsuarioServer: usuario.id,
        iconeServer: document.getElementById("select-qualidade-icone").value,
        tituloServer: document.getElementById("input-qualidade-titulo").value.trim(),
        descricaoServer: document.getElementById("input-qualidade-descricao").value.trim()
    })
        .then(function () {
            document.getElementById("formulario-qualidade").reset();
            mostrarMensagem("mensagem-qualidade", "Card adicionado com carinho!", "sucesso");
            return carregarQualidades();
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-qualidade", erro.message, "erro");
        });
}

function removerQualidade(idQualidade) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Remover este card?")) {
        return;
    }

    enviarJson("/posts/qualidades/" + idQualidade, "DELETE", { idUsuarioServer: usuario.id })
        .then(carregarQualidades)
        .catch(function (erro) {
            alert(erro.message);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (usuarioLogado()) {
        document.getElementById("botao-editar-carta").hidden = false;
        document.getElementById("secao-formulario-qualidade").hidden = false;
    }

    carregarCarta();
    carregarQualidades();
});
