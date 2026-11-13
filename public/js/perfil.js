function mostrarPerfil() {
    var usuario = usuarioLogado();

    document.getElementById("input-nome").value = usuario.nome;
    document.getElementById("perfil-detalhes").textContent =
        usuario.email + (usuario.dtCadastro ? " · por aqui desde " + usuario.dtCadastro : "");
    document.getElementById("botao-remover-foto-perfil").hidden = !usuario.fotoPerfil;

    atualizarCabecalho();
}

function salvarPerfil(evento) {
    evento.preventDefault();

    var usuario = usuarioLogado();
    var nome = document.getElementById("input-nome").value.trim();

    enviarJson("/usuarios/" + usuario.id, "PUT", { nomeServer: nome })
        .then(function (resultado) {
            sessionStorage.NOME_USUARIO = resultado.nome;
            mostrarPerfil();
            mostrarMensagem("mensagem-formulario", "Perfil atualizado com sucesso!", "sucesso");
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });
}

function escolherFotoPerfil() {
    document.getElementById("input-foto-perfil").click();
}

function enviarFotoPerfil() {
    var usuario = usuarioLogado();
    var campo = document.getElementById("input-foto-perfil");

    if (campo.files.length == 0) {
        return;
    }

    var dados = new FormData();
    dados.append("foto", campo.files[0]);

    requisicao("/usuarios/" + usuario.id + "/foto", { method: "POST", body: dados })
        .then(function (resultado) {
            sessionStorage.FOTO_USUARIO = resultado.fotoPerfil;
            mostrarPerfil();
            mostrarMensagem("mensagem-formulario", "Foto de perfil atualizada!", "sucesso");
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });

    campo.value = "";
}

function removerFotoPerfil() {
    var usuario = usuarioLogado();

    if (!confirm("Remover a sua foto de perfil?")) {
        return;
    }

    enviarJson("/usuarios/" + usuario.id + "/foto", "DELETE")
        .then(function () {
            sessionStorage.FOTO_USUARIO = "";
            mostrarPerfil();
            mostrarMensagem("mensagem-formulario", "Foto de perfil removida.", "sucesso");
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });
}

document.addEventListener("DOMContentLoaded", function () {
    if (usuarioLogado()) {
        mostrarPerfil();
    }
});
