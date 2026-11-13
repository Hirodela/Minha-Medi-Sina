function mostrarPostNaoEncontrado(mensagem) {
    document.getElementById("artigo").innerHTML =
        '<div class="caixa estado-vazio">' +
            "<h3>♡</h3>" +
            "<p>" + escaparHtml(mensagem) + "</p>" +
            '<a class="botao botao-principal" href="publicacoes.html">Voltar ao feed</a>' +
        "</div>";
}

function mostrarPost(post) {
    var usuario = usuarioLogado();
    var paragrafos = post.descricao.split(/\n+/);
    var htmlDescricao = "";

    for (var i = 0; i < paragrafos.length; i++) {
        if (paragrafos[i].trim() != "") {
            htmlDescricao += '<p class="artigo-paragrafo">' + escaparHtml(paragrafos[i]) + "</p>";
        }
    }

    var acoes = '<a class="botao" href="publicacoes.html">← Voltar ao feed</a>';

    if (usuario && usuario.id == post.idUsuario) {
        acoes += '<a class="botao" href="nova-lembranca.html?id=' + post.id + '">✎ Editar post</a>';
    }

    document.title = post.titulo + " · Minha Medi Sina ♡";

    document.getElementById("artigo").innerHTML =
        '<div class="card-detalhes-artigo">' +
            '<span class="etiqueta">' + escaparHtml(post.categoria) + "</span>" +
            '<span class="texto-suave">' + formatarData(post.dataLembranca) + "</span>" +
        "</div>" +
        "<h1>" + escaparHtml(post.titulo) + "</h1>" +
        '<p class="texto-suave post-autor">Publicado por ' + escaparHtml(post.autor) + "</p>" +
        htmlFotoPost(post, "detalhe-foto", "detalhe-sem-foto") +
        htmlDescricao +
        '<div class="caixa artigo-interacoes">' +
            htmlInteracoes(post, false) +
        "</div>" +
        '<div class="linha-botoes margem-topo-24">' + acoes + "</div>";

    abrirComentarios(post.id);
}

document.addEventListener("DOMContentLoaded", function () {
    var parametros = new URLSearchParams(window.location.search);
    var idPost = Number(parametros.get("id"));
    var usuario = usuarioLogado();

    if (!idPost) {
        mostrarPostNaoEncontrado("Post não encontrado.");
        return;
    }

    requisicao("/posts/" + idPost + (usuario ? "?idUsuario=" + usuario.id : ""))
        .then(mostrarPost)
        .catch(function (erro) {
            mostrarPostNaoEncontrado(erro.message);
        });
});
