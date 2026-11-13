function publicarRapido(evento) {
    evento.preventDefault();

    var usuario = exigirLogin("Entre na sua conta para publicar ♡");

    if (!usuario) {
        return;
    }

    var dados = new FormData();
    dados.append("idUsuarioServer", usuario.id);
    dados.append("tituloServer", document.getElementById("input-rapido-titulo").value.trim());
    dados.append("descricaoServer", document.getElementById("input-rapido-descricao").value.trim());
    dados.append("dataLembrancaServer", document.getElementById("input-rapido-data").value);
    dados.append("categoriaServer", document.getElementById("select-rapido-categoria").value);

    requisicao("/posts", { method: "POST", body: dados })
        .then(function () {
            document.getElementById("formulario-publicacao-rapida").reset();
            document.getElementById("input-rapido-data").value = dataDeHoje();
            return carregarPosts(urlFeed(), 0, false);
        })
        .catch(function (erro) {
            alert(erro.message);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (usuarioLogado()) {
        document.getElementById("secao-publicacao-rapida").hidden = false;
        document.getElementById("input-rapido-data").value = dataDeHoje();
    }

    carregarPosts(urlFeed(), 0, false);
});
