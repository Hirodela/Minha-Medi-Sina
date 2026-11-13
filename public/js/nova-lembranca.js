var idPostEmEdicao = Number(new URLSearchParams(window.location.search).get("id")) || 0;
var removerFotoAtual = false;

function escolherFoto() {
    document.getElementById("input-foto").click();
}

function mostrarPrevia(endereco) {
    var previa = document.getElementById("previa-foto");

    previa.innerHTML =
        '<img class="previa-upload-imagem" src="' + escaparHtml(endereco) + '" alt="Prévia da fotografia" />' +
        '<button type="button" class="botao botao-pequeno" onclick="removerFoto()">✕ Remover fotografia</button>';
    previa.hidden = false;

    document.getElementById("botao-escolher-foto").textContent = "Trocar fotografia";
}

function fotoEscolhida() {
    var campo = document.getElementById("input-foto");

    if (campo.files.length == 0) {
        return;
    }

    if (campo.files[0].size > 5 * 1024 * 1024) {
        campo.value = "";
        mostrarMensagem("mensagem-formulario", "A fotografia pode ter no máximo 5 MB!", "erro");
        return;
    }

    removerFotoAtual = false;
    mostrarMensagem("mensagem-formulario", "", "");
    mostrarPrevia(URL.createObjectURL(campo.files[0]));
}

function removerFoto() {
    var previa = document.getElementById("previa-foto");

    document.getElementById("input-foto").value = "";
    previa.innerHTML = "";
    previa.hidden = true;
    removerFotoAtual = true;

    document.getElementById("botao-escolher-foto").textContent = "Adicionar fotografia";
}

function salvarPost(evento) {
    evento.preventDefault();

    var usuario = usuarioLogado();
    var campoFoto = document.getElementById("input-foto");
    var botao = document.getElementById("botao-salvar");

    if (!usuario) {
        return;
    }

    var dados = new FormData();
    dados.append("idUsuarioServer", usuario.id);
    dados.append("tituloServer", document.getElementById("input-titulo").value.trim());
    dados.append("descricaoServer", document.getElementById("input-descricao").value.trim());
    dados.append("dataLembrancaServer", document.getElementById("input-data").value);
    dados.append("categoriaServer", document.getElementById("select-categoria").value);
    dados.append("removerFotoServer", removerFotoAtual);

    if (campoFoto.files.length > 0) {
        dados.append("foto", campoFoto.files[0]);
    }

    var url = idPostEmEdicao ? "/posts/" + idPostEmEdicao : "/posts";
    var metodo = idPostEmEdicao ? "PUT" : "POST";

    botao.disabled = true;

    requisicao(url, { method: metodo, body: dados })
        .then(function (resultado) {
            mostrarMensagem("mensagem-formulario", "Post salvo com sucesso!", "sucesso");

            setTimeout(function () {
                window.location = "lembranca.html?id=" + resultado.id;
            }, 800);
        })
        .catch(function (erro) {
            botao.disabled = false;
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });
}

function carregarPostParaEdicao() {
    var usuario = usuarioLogado();

    requisicao("/posts/" + idPostEmEdicao)
        .then(function (post) {
            if (post.idUsuario != usuario.id) {
                throw new Error("Você só pode editar os seus próprios posts!");
            }

            document.title = "Editar Post · Minha Medi Sina ♡";
            document.getElementById("titulo-pagina").textContent = "Editar Post";
            document.getElementById("botao-salvar").textContent = "Salvar alterações";

            document.getElementById("input-titulo").value = post.titulo;
            document.getElementById("input-descricao").value = post.descricao;
            document.getElementById("input-data").value = post.dataLembranca;
            document.getElementById("select-categoria").value = post.categoria;

            if (post.foto) {
                mostrarPrevia(post.foto);
            }
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
            document.getElementById("botao-salvar").disabled = true;
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (!usuarioLogado()) {
        return;
    }

    if (idPostEmEdicao) {
        carregarPostParaEdicao();
    } else {
        document.getElementById("input-data").value = dataDeHoje();
    }
});
