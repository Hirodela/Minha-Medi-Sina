function htmlFotoPost(post, classeFoto, classeSemFoto) {
    if (post.foto) {
        return '<img class="' + classeFoto + '" src="' + escaparHtml(post.foto) + '" alt="' + escaparHtml(post.titulo) + '" />';
    }

    var numero = (post.id % 6) + 1;
    return '<div class="foto-ilustrativa foto-ilustrativa-' + numero + " " + classeSemFoto + '" role="img" aria-label="Post sem fotografia"></div>';
}

function htmlInteracoes(post, mostrarLerMais) {
    var classeCurtido = post.curtiu ? " curtido" : "";
    var linkLerMais = mostrarLerMais ? '<a href="lembranca.html?id=' + post.id + '">Ler mais →</a>' : "";

    return (
        '<div class="barra-social">' +
            '<div class="botoes-sociais">' +
                '<button type="button" class="botao-curtir' + classeCurtido + '" id="botao-curtir-' + post.id + '" onclick="curtir(' + post.id + ')" title="Curtir">' +
                    '<span class="icone-curtir">❤️</span> <span id="total-curtidas-' + post.id + '">' + post.totalCurtidas + "</span>" +
                "</button>" +
                '<button type="button" class="botao-comentarios" onclick="abrirComentarios(' + post.id + ')" title="Ver comentários">' +
                    '💬 <span id="total-comentarios-' + post.id + '">' + post.totalComentarios + "</span>" +
                "</button>" +
            "</div>" +
            linkLerMais +
        "</div>" +
        '<div class="comentarios-gaveta" id="comentarios-' + post.id + '" hidden>' +
            '<div class="comentarios-lista" id="lista-comentarios-' + post.id + '"></div>' +
            '<form class="comentario-formulario" onsubmit="comentar(event, ' + post.id + ')">' +
                '<input type="text" id="input-comentario-' + post.id + '" placeholder="Escreva um comentário carinhoso..." maxlength="500" required />' +
                '<button type="submit">Enviar</button>' +
            "</form>" +
        "</div>"
    );
}

function htmlCardPost(post, comAcoes) {
    var descricao = post.descricao;

    if (descricao.length > 160) {
        descricao = descricao.substring(0, 160) + "…";
    }

    var acoes = "";

    if (comAcoes) {
        acoes =
            '<div class="post-acoes">' +
                '<a class="botao" href="nova-lembranca.html?id=' + post.id + '">✎ Editar</a>' +
                '<button type="button" class="botao" onclick="excluirPost(' + post.id + ')">✕ Excluir</button>' +
            "</div>";
    }

    return (
        '<article class="card post-card" id="post-' + post.id + '">' +
            htmlFotoPost(post, "post-foto", "") +
            '<div class="card-corpo">' +
                '<div class="card-detalhes">' +
                    '<span class="etiqueta">' + escaparHtml(post.categoria) + "</span>" +
                    "<span>" + formatarData(post.dataLembranca) + "</span>" +
                "</div>" +
                '<h3><a href="lembranca.html?id=' + post.id + '">' + escaparHtml(post.titulo) + "</a></h3>" +
                "<p>" + escaparHtml(descricao) + "</p>" +
                '<p class="texto-suave post-autor">Por ' + escaparHtml(post.autor) + "</p>" +
                htmlInteracoes(post, true) +
                acoes +
            "</div>" +
        "</article>"
    );
}

function htmlEstadoVazio(titulo, texto, comBotao) {
    var botao = comBotao ? '<a class="botao botao-principal" href="nova-lembranca.html">+ Criar um post</a>' : "";

    return (
        '<div class="caixa estado-vazio estado-vazio-largo">' +
            "<h3>" + titulo + "</h3>" +
            "<p>" + escaparHtml(texto) + "</p>" +
            botao +
        "</div>"
    );
}

function carregarPosts(url, limite, comAcoes) {
    var lista = document.getElementById("lista-posts");

    return requisicao(url)
        .then(function (posts) {
            if (limite) {
                posts = posts.slice(0, limite);
            }

            if (posts.length == 0) {
                lista.innerHTML = htmlEstadoVazio("♡", "Ainda não há posts por aqui. Que tal publicar o primeiro?", true);
                return posts;
            }

            var html = "";
            for (var i = 0; i < posts.length; i++) {
                html += htmlCardPost(posts[i], comAcoes);
            }
            lista.innerHTML = html;

            return posts;
        })
        .catch(function (erro) {
            console.log(erro.message);
            return [];
        });
}

function urlFeed() {
    var usuario = usuarioLogado();
    return usuario ? "/posts?idUsuario=" + usuario.id : "/posts";
}

function curtir(idPost) {
    var usuario = exigirLogin("Entre na sua conta para curtir ♡");

    if (!usuario) {
        return;
    }

    enviarJson("/posts/" + idPost + "/curtir", "POST", { idUsuarioServer: usuario.id })
        .then(function (resultado) {
            var botao = document.getElementById("botao-curtir-" + idPost);

            document.getElementById("total-curtidas-" + idPost).textContent = resultado.totalCurtidas;

            if (resultado.curtiu) {
                botao.classList.add("curtido");
            } else {
                botao.classList.remove("curtido");
            }
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function carregarComentarios(idPost) {
    var lista = document.getElementById("lista-comentarios-" + idPost);
    var usuario = usuarioLogado();

    return requisicao("/posts/" + idPost + "/comentarios")
        .then(function (comentarios) {
            document.getElementById("total-comentarios-" + idPost).textContent = comentarios.length;

            if (comentarios.length == 0) {
                lista.innerHTML = '<p class="texto-suave">Nenhum comentário ainda. Seja a primeira pessoa a comentar ♡</p>';
                return;
            }

            var html = "";

            for (var i = 0; i < comentarios.length; i++) {
                var comentario = comentarios[i];
                var botaoExcluir = "";

                if (usuario && usuario.id == comentario.idUsuario) {
                    botaoExcluir = '<button type="button" class="comentario-excluir" onclick="excluirComentario(' + comentario.id + ", " + idPost + ')" title="Excluir comentário">&times;</button>';
                }

                html +=
                    '<div class="comentario">' +
                        '<div class="comentario-cabecalho">' +
                            '<span class="comentario-autor">' + escaparHtml(comentario.autor) + "</span>" +
                            "<span>" +
                                '<span class="comentario-data">' + comentario.dataComentario + "</span>" +
                                botaoExcluir +
                            "</span>" +
                        "</div>" +
                        escaparHtml(comentario.texto) +
                    "</div>";
            }

            lista.innerHTML = html;
            lista.scrollTop = lista.scrollHeight;
        })
        .catch(function (erro) {
            lista.innerHTML = '<p class="texto-suave">' + escaparHtml(erro.message) + "</p>";
        });
}

function abrirComentarios(idPost) {
    var gaveta = document.getElementById("comentarios-" + idPost);

    gaveta.hidden = !gaveta.hidden;

    if (!gaveta.hidden) {
        carregarComentarios(idPost);
    }
}

function comentar(evento, idPost) {
    evento.preventDefault();

    var usuario = exigirLogin("Entre na sua conta para comentar ♡");

    if (!usuario) {
        return;
    }

    var campo = document.getElementById("input-comentario-" + idPost);
    var texto = campo.value.trim();

    if (texto == "") {
        return;
    }

    enviarJson("/posts/" + idPost + "/comentarios", "POST", {
        idUsuarioServer: usuario.id,
        textoServer: texto
    })
        .then(function () {
            campo.value = "";
            return carregarComentarios(idPost);
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function excluirComentario(idComentario, idPost) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Excluir este comentário?")) {
        return;
    }

    enviarJson("/posts/comentarios/" + idComentario, "DELETE", { idUsuarioServer: usuario.id })
        .then(function () {
            return carregarComentarios(idPost);
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

function abrirFoto(endereco, legenda) {
    var visualizador = document.getElementById("foto-ampliada");

    if (!visualizador) {
        return;
    }

    document.getElementById("foto-ampliada-imagem").src = endereco;
    document.getElementById("foto-ampliada-imagem").alt = legenda;
    document.getElementById("foto-ampliada-legenda").textContent = legenda;
    visualizador.classList.add("aberto");
}

function fecharFoto() {
    document.getElementById("foto-ampliada").classList.remove("aberto");
}

document.addEventListener("click", function (evento) {
    var alvo = evento.target;

    if (alvo.tagName == "IMG" && (alvo.classList.contains("post-foto") || alvo.classList.contains("detalhe-foto"))) {
        abrirFoto(alvo.src, alvo.alt);
    }
});

document.addEventListener("keydown", function (evento) {
    if (evento.key == "Escape" && document.getElementById("foto-ampliada")) {
        fecharFoto();
    }
});

document.addEventListener("error", function (evento) {
    var alvo = evento.target;

    if (alvo.tagName == "IMG" && (alvo.classList.contains("post-foto") || alvo.classList.contains("detalhe-foto"))) {
        var quadro = document.createElement("div");

        quadro.className = "foto-ilustrativa foto-ilustrativa-3";
        if (alvo.classList.contains("detalhe-foto")) {
            quadro.className += " detalhe-sem-foto";
        }

        alvo.replaceWith(quadro);
    }
}, true);
