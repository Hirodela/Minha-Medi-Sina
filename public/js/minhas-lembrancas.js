function carregarMeusPosts() {
    var usuario = usuarioLogado();

    if (!usuario) {
        return;
    }

    carregarPosts("/posts/usuario/" + usuario.id, 0, true)
        .then(function (posts) {
            var texto = posts.length == 1 ? "1 post publicado" : posts.length + " posts publicados";
            document.getElementById("total-posts").textContent = texto;
        });
}

function excluirPost(idPost) {
    var usuario = usuarioLogado();

    if (!usuario || !confirm("Tem certeza de que deseja excluir este post? As curtidas e os comentários dele também serão apagados.")) {
        return;
    }

    enviarJson("/posts/" + idPost, "DELETE", { idUsuarioServer: usuario.id })
        .then(carregarMeusPosts)
        .catch(function (erro) {
            alert(erro.message);
        });
}

document.addEventListener("DOMContentLoaded", carregarMeusPosts);
